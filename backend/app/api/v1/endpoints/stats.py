from typing import Any, Dict, List, Optional, Union
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.models.product import Product
from app.models.sales import Sale
from datetime import datetime, timedelta

try:
    import pandas as pd
except ImportError:  # pragma: no cover - optional runtime dependency
    pd = None

router = APIRouter()

FORECAST_HOURS = list(range(8, 23))
DEFAULT_HOURLY_REVENUE = {
    8: 50.0,
    9: 60.0,
    10: 70.0,
    11: 90.0,
    12: 150.0,
    13: 150.0,
    14: 150.0,
    15: 150.0,
    16: 90.0,
    17: 80.0,
    18: 70.0,
    19: 60.0,
    20: 55.0,
    21: 50.0,
    22: 50.0,
}


def _build_baseline_prediction(hourly_totals: Dict[int, float]) -> List[Dict[str, Union[float, str]]]:
    list_pred = []
    for hour in FORECAST_HOURS:
        revenue = hourly_totals.get(hour, 0.0)
        ventas = revenue if revenue > 0 else DEFAULT_HOURLY_REVENUE[hour]
        list_pred.append({"hour": f"{hour}:00", "ventas": round(float(ventas), 2)})
    return list_pred


def _fallback_hourly_weights(hourly_average: Dict[int, float]) -> Dict[int, float]:
    weighted = {
        hour: (hourly_average.get(hour, 0.0) if hourly_average.get(hour, 0.0) > 0 else DEFAULT_HOURLY_REVENUE[hour])
        for hour in FORECAST_HOURS
    }
    total = sum(weighted.values())
    if total <= 0:
        even_weight = 1 / len(FORECAST_HOURS)
        return {hour: even_weight for hour in FORECAST_HOURS}
    return {hour: value / total for hour, value in weighted.items()}


def _forecast_next_day_total(daily_sales: List[Dict[str, Union[float, datetime]]]) -> Optional[float]:
    if pd is None or len(daily_sales) < 14:
        return None

    try:
        from prophet import Prophet
    except ImportError:  # pragma: no cover - optional runtime dependency
        return None

    df = pd.DataFrame(daily_sales)
    if df.empty:
        return None

    # Normalize datetimes safely for both naive and tz-aware inputs.
    df["ds"] = pd.to_datetime(df["ds"], utc=True, errors="coerce").dt.tz_convert(None)
    df["y"] = pd.to_numeric(df["y"], errors="coerce").fillna(0.0)
    df = df.dropna(subset=["ds"])

    if df.empty or df["y"].sum() <= 0:
        return None

    try:
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=False,
            changepoint_prior_scale=0.05,
            seasonality_prior_scale=10.0,
        )
        model.fit(df)
        future = model.make_future_dataframe(periods=1, freq="D")
        forecast = model.predict(future)
        next_day_value = float(forecast["yhat"].iloc[-1])
        return max(round(next_day_value, 2), 0.0)
    except Exception:
        # Never break the endpoint; caller will use heuristic fallback.
        return None


def _safe_mape(actual_values: List[float], predicted_values: List[float]) -> Optional[float]:
    if not actual_values or len(actual_values) != len(predicted_values):
        return None
    pairs = [(a, p) for a, p in zip(actual_values, predicted_values) if a > 0]
    if not pairs:
        return None
    ape = [abs((a - p) / a) * 100 for a, p in pairs]
    return round(sum(ape) / len(ape), 2)


def _forecast_prophet_with_meta(
    daily_sales: List[Dict[str, Union[float, datetime]]]
) -> Optional[Dict[str, Union[str, float, int, None]]]:
    if pd is None or len(daily_sales) < 14:
        return None

    try:
        from prophet import Prophet
    except ImportError:  # pragma: no cover - optional runtime dependency
        return None

    df = pd.DataFrame(daily_sales)
    if df.empty:
        return None

    df["ds"] = pd.to_datetime(df["ds"], utc=True, errors="coerce").dt.tz_convert(None)
    df["y"] = pd.to_numeric(df["y"], errors="coerce").fillna(0.0)
    df = df.dropna(subset=["ds"])
    if df.empty or df["y"].sum() <= 0:
        return None

    try:
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=False,
            changepoint_prior_scale=0.05,
            seasonality_prior_scale=10.0,
        )
        model.fit(df)

        history_forecast = model.predict(df[["ds"]])
        mape = _safe_mape(df["y"].tolist(), history_forecast["yhat"].tolist())

        future = model.make_future_dataframe(periods=1, freq="D")
        future_forecast = model.predict(future).iloc[-1]

        yhat = max(round(float(future_forecast["yhat"]), 2), 0.0)
        yhat_lower = max(round(float(future_forecast["yhat_lower"]), 2), 0.0)
        yhat_upper = max(round(float(future_forecast["yhat_upper"]), 2), 0.0)

        return {
            "model_used": "prophet",
            "daily_total_yhat": yhat,
            "daily_total_yhat_lower": yhat_lower,
            "daily_total_yhat_upper": yhat_upper,
            "mape": mape,
            "history_points": int(len(df)),
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }
    except Exception:
        return None


def _compute_hourly_prediction_from_total(forecast_total: float, hourly_average: Dict[int, float]) -> List[Dict[str, Union[float, str]]]:
    hourly_weights = _fallback_hourly_weights(hourly_average)
    prediction: List[Dict[str, Union[float, str]]] = []
    running_total = 0.0
    for index, hour in enumerate(FORECAST_HOURS):
        if index == len(FORECAST_HOURS) - 1:
            ventas = max(round(forecast_total - running_total, 2), 0.0)
        else:
            ventas = round(forecast_total * hourly_weights[hour], 2)
            running_total += ventas
        prediction.append({"hour": f"{hour}:00", "ventas": ventas})
    return prediction

@router.get("/")
async def get_dashboard_stats(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter stats"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    week_ago = datetime.now() - timedelta(days=7)

    aggregate_query = select(
        func.coalesce(
            func.sum(Sale.total_price).filter(func.date(Sale.timestamp) == today),
            0.0,
        ).label("today_revenue"),
        func.coalesce(
            func.sum(Sale.total_price).filter(func.date(Sale.timestamp) == yesterday),
            0.0,
        ).label("yesterday_revenue"),
        func.coalesce(
            func.sum(Sale.total_price).filter(Sale.timestamp >= week_ago),
            0.0,
        ).label("week_revenue"),
        func.count(Sale.id).filter(func.date(Sale.timestamp) == today).label("today_orders"),
        func.count(Sale.id).label("total_orders"),
    ).where(Sale.user_id == owner_id)
    aggregate_result = await db.execute(aggregate_query)
    aggregate_row = aggregate_result.one()

    query_top = (
        select(Product.name, func.sum(Sale.quantity).label("total_qty"))
        .join(Sale, Product.id == Sale.product_id)
        .where(Sale.user_id == owner_id)
        .group_by(Product.name)
        .order_by(desc("total_qty"))
        .limit(1)
    )
    result_top = await db.execute(query_top)
    top_prod_row = result_top.first()
    top_product = top_prod_row[0] if top_prod_row else "N/A"
    top_product_qty = top_prod_row[1] if top_prod_row else 0

    critical_count_query = select(func.count(Product.id)).where(
        Product.on_hand <= Product.min_stock,
        Product.owner_id == owner_id,
    )
    critical_item_query = (
        select(Product.name, Product.on_hand)
        .where(Product.on_hand <= Product.min_stock, Product.owner_id == owner_id)
        .order_by(Product.on_hand.asc(), Product.name.asc())
        .limit(1)
    )
    critical_count_result, critical_item_result = await db.execute(critical_count_query), await db.execute(critical_item_query)
    critical_item = critical_item_result.first()

    crit_info = {
        "items": critical_count_result.scalar() or 0,
        "sku": critical_item[0] if critical_item else "N/A",
        "remaining": critical_item[1] if critical_item else 0
    }
    return {
        "todayRevenue": aggregate_row.today_revenue,
        "yesterdayRevenue": aggregate_row.yesterday_revenue,
        "weekRevenue": aggregate_row.week_revenue,
        "topProduct": top_product,
        "topProductQty": top_product_qty,
        "totalOrdersToday": aggregate_row.today_orders,
        "totalOrdersAbs": aggregate_row.total_orders,
        "criticalInventory": crit_info
    }

@router.get("/sales-series")
async def get_sales_series(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID for series"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    today = datetime.now().date()
    series = []
    days_map = {0: "Lun", 1: "Mar", 2: "Mie", 3: "Jue", 4: "Vie", 5: "Sab", 6: "Dom"}
    
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        query = select(func.sum(Sale.total_price)).where(func.date(Sale.timestamp) == day, Sale.user_id == owner_id)
        result = await db.execute(query)
        total = result.scalar() or 0.0
        series.append({"label": days_map[day.weekday()], "value": total})
    
    return series

@router.get("/trends")
async def get_trends(owner_id: Optional[str] = Query("u_demo"), db: AsyncSession = Depends(get_db)) -> Any:
    # 1. Peak Hour (Based on most frequent sales)
    # Note: Using EXTRACT(HOUR FROM timestamp) which is standard in Postgres
    query_hour = (
        select(
            func.extract('hour', Sale.timestamp).label('hour'),
            func.count(Sale.id).label('count')
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract('hour', Sale.timestamp))
        .order_by(desc('count'))
        .limit(1)
    )
    res_hour = await db.execute(query_hour)
    row_hour = res_hour.first()
    trends = []
    
    # 1. Peak Demand
    if row_hour:
        trends.append({
            "key": "peak_demand",
            "params": {"hour": int(row_hour[0])},
            "category": "relevant"
        })
    else:
        trends.append({
            "key": "no_peak_data",
            "category": "relevant"
        })

    query_star = (
        select(
            Product.name,
            func.sum(Sale.total_price).label("revenue")
        )
        .join(Sale, Product.id == Sale.product_id)
        .where(Sale.user_id == owner_id)
        .group_by(Product.name)
        .order_by(desc("revenue"))
        .limit(1)
    )
    res_star = await db.execute(query_star)
    row_star = res_star.first()

    # 2. Star Product
    if row_star:
        trends.append({
            "key": "star_product",
            "params": {"product": row_star[0]},
            "category": "relevant"
        })
    else:
        trends.append({
            "key": "no_star_data",
            "category": "relevant"
        })

    query_low = select(func.count(Product.id)).where(
        Product.owner_id == owner_id,
        Product.on_hand <= Product.min_stock
    )
    res_low = await db.execute(query_low)
    count_low = res_low.scalar() or 0

    # 3. Inventory Status
    if count_low > 0:
        trends.append({
            "key": "low_stock",
            "params": {"count": count_low},
            "category": "relevant"
        })
    else:
        trends.append({
            "key": "stock_healthy",
            "category": "relevant"
        })

    query_day = (
        select(
            func.extract('dow', Sale.timestamp).label('day'),
            func.count(Sale.id).label('count')
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract('dow', Sale.timestamp))
        .order_by(desc('count'))
        .limit(1)
    )
    res_day = await db.execute(query_day)
    row_day = res_day.first()

    query_category = (
        select(
            Product.category,
            func.sum(Sale.quantity).label("total_qty")
        )
        .join(Sale, Product.id == Sale.product_id)
        .where(Sale.user_id == owner_id)
        .group_by(Product.category)
        .order_by(desc("total_qty"))
        .limit(1)
    )
    res_category = await db.execute(query_category)
    row_category = res_category.first()
    top_category = row_category[0] if row_category and row_category[0] else "General"

    # 4 & 5. Opportunities (Crossover and Adjust)
    # Using raw values for category and day to let frontend localize them
    peak_day_map = {0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday"}
    day_key = peak_day_map.get(int(row_day[0]), "weekend") if row_day else "peak_days"

    trends.append({
        "key": "crossover_promo",
        "params": {"category": top_category, "day": day_key},
        "category": "opportunity"
    })
    
    trends.append({
        "key": "inventory_adjust",
        "params": {"category": top_category, "day": day_key},
        "category": "opportunity"
    })

    # 6. Waste
    trends.append({
        "key": "waste_prevention",
        "params": {"category": top_category},
        "category": "waste"
    })

    return trends

@router.get("/prediction")
async def get_prediction(owner_id: Optional[str] = Query("u_demo"), db: AsyncSession = Depends(get_db)) -> Any:
    hourly_average_query = (
        select(
            func.extract("hour", Sale.timestamp).label("hour"),
            func.avg(Sale.total_price).label("avg_revenue"),
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract("hour", Sale.timestamp))
    )
    hourly_average_result = await db.execute(hourly_average_query)
    hourly_average = {int(row[0]): float(row[1]) for row in hourly_average_result.all()}

    daily_sales_query = (
        select(
            func.date(Sale.timestamp).label("sale_day"),
            func.sum(Sale.total_price).label("daily_total"),
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.date(Sale.timestamp))
        .order_by(func.date(Sale.timestamp))
    )
    daily_sales_result = await db.execute(daily_sales_query)
    daily_sales = [{"ds": row[0], "y": float(row[1] or 0.0)} for row in daily_sales_result.all()]

    forecast_total = _forecast_next_day_total(daily_sales)
    if forecast_total is None:
        return _build_baseline_prediction(hourly_average)

    prophet_prediction = _compute_hourly_prediction_from_total(forecast_total, hourly_average)

    # If Prophet returns a degenerate value, keep the older heuristic instead of a flatline.
    if sum(item["ventas"] for item in prophet_prediction) <= 0:
        return _build_baseline_prediction(hourly_average)

    return prophet_prediction


@router.get("/prediction/scenario")
async def get_prediction_scenario(
    owner_id: Optional[str] = Query("u_demo"),
    scenario: str = Query("baseline"),
    promo_lift_pct: float = Query(0.0, ge=0.0, le=100.0),
    rain_probability: float = Query(0.0, ge=0.0, le=1.0),
    temperature_c: float = Query(25.0, ge=-20.0, le=55.0),
    event_multiplier: float = Query(1.0, ge=1.0, le=3.0),
    target_date: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> Any:
    hourly_average_query = (
        select(
            func.extract("hour", Sale.timestamp).label("hour"),
            func.avg(Sale.total_price).label("avg_revenue"),
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract("hour", Sale.timestamp))
    )
    hourly_average_result = await db.execute(hourly_average_query)
    hourly_average = {int(row[0]): float(row[1]) for row in hourly_average_result.all()}

    daily_sales_query = (
        select(
            func.date(Sale.timestamp).label("sale_day"),
            func.sum(Sale.total_price).label("daily_total"),
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.date(Sale.timestamp))
        .order_by(func.date(Sale.timestamp))
    )
    daily_sales_result = await db.execute(daily_sales_query)
    daily_sales = [{"ds": row[0], "y": float(row[1] or 0.0)} for row in daily_sales_result.all()]

    base_total = _forecast_next_day_total(daily_sales)
    model_used = "prophet" if base_total is not None else "fallback"
    if base_total is None:
        baseline = _build_baseline_prediction(hourly_average)
        base_total = sum(float(item["ventas"]) for item in baseline)

    factor = 1.0
    scenario_key = (scenario or "baseline").strip().lower()
    assumptions: List[str] = []

    if scenario_key == "promo":
        factor *= 1 + (promo_lift_pct / 100.0)
        assumptions.append(f"promo_lift_pct={promo_lift_pct}")
    elif scenario_key == "rain":
        rain_factor = max(0.65, 1 - (0.35 * rain_probability))
        factor *= rain_factor
        assumptions.append(f"rain_probability={rain_probability}")
    elif scenario_key == "event":
        factor *= event_multiplier
        assumptions.append(f"event_multiplier={event_multiplier}")
    elif scenario_key == "heatwave":
        if temperature_c > 30:
            heat_boost = min((temperature_c - 30) * 0.02, 0.25)
            factor *= (1 + heat_boost)
        assumptions.append(f"temperature_c={temperature_c}")
    elif scenario_key == "monthend":
        day_of_month = datetime.utcnow().day
        if target_date:
            try:
                day_of_month = datetime.fromisoformat(target_date).day
            except ValueError:
                pass
        if day_of_month >= 28:
            factor *= 1.1
        assumptions.append(f"day_of_month={day_of_month}")
    else:
        scenario_key = "baseline"

    scenario_total = max(round(base_total * factor, 2), 0.0)
    prediction = _compute_hourly_prediction_from_total(scenario_total, hourly_average)
    if sum(float(item["ventas"]) for item in prediction) <= 0:
        prediction = _build_baseline_prediction(hourly_average)

    return {
        "prediction": prediction,
        "scenario_meta": {
            "scenario": scenario_key,
            "model_used": model_used,
            "baseline_total": round(base_total, 2),
            "applied_factor": round(factor, 4),
            "scenario_total": scenario_total,
            "assumptions": assumptions,
            "generated_at": datetime.utcnow().isoformat() + "Z",
        },
    }


@router.get("/prediction/meta")
async def get_prediction_meta(owner_id: Optional[str] = Query("u_demo"), db: AsyncSession = Depends(get_db)) -> Any:
    hourly_average_query = (
        select(
            func.extract("hour", Sale.timestamp).label("hour"),
            func.avg(Sale.total_price).label("avg_revenue"),
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract("hour", Sale.timestamp))
    )
    hourly_average_result = await db.execute(hourly_average_query)
    hourly_average = {int(row[0]): float(row[1]) for row in hourly_average_result.all()}

    daily_sales_query = (
        select(
            func.date(Sale.timestamp).label("sale_day"),
            func.sum(Sale.total_price).label("daily_total"),
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.date(Sale.timestamp))
        .order_by(func.date(Sale.timestamp))
    )
    daily_sales_result = await db.execute(daily_sales_query)
    daily_sales = [{"ds": row[0], "y": float(row[1] or 0.0)} for row in daily_sales_result.all()]

    prophet_meta = _forecast_prophet_with_meta(daily_sales)
    if prophet_meta is not None:
        return prophet_meta

    baseline_prediction = _build_baseline_prediction(hourly_average)
    daily_total = sum(float(item["ventas"]) for item in baseline_prediction)
    return {
        "model_used": "fallback",
        "daily_total_yhat": round(float(daily_total), 2),
        "daily_total_yhat_lower": None,
        "daily_total_yhat_upper": None,
        "mape": None,
        "history_points": len(daily_sales),
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }
