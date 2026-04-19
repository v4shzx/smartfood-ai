from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.models.product import Product
from app.models.sales import Sale
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
async def get_dashboard_stats(
    owner_id: Optional[str] = Query("u_demo", description="Owner ID to filter stats"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    # 1. Today Revenue & Yesterday Revenue
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    
    query_today = select(func.sum(Sale.total_price)).where(func.date(Sale.timestamp) == today, Sale.user_id == owner_id)
    result_today = await db.execute(query_today)
    today_revenue = result_today.scalar() or 0.0

    query_yesterday = select(func.sum(Sale.total_price)).where(func.date(Sale.timestamp) == yesterday, Sale.user_id == owner_id)
    result_yesterday = await db.execute(query_yesterday)
    yesterday_revenue = result_yesterday.scalar() or 0.0

    # 2. Week Revenue
    week_ago = datetime.now() - timedelta(days=7)
    query_week = select(func.sum(Sale.total_price)).where(Sale.timestamp >= week_ago, Sale.user_id == owner_id)
    result_week = await db.execute(query_week)
    week_revenue = result_week.scalar() or 0.0

    # 3. Top Product
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

    # 4. Total Orders Today and Absolute Total
    query_orders_today = select(func.count(Sale.id)).where(func.date(Sale.timestamp) == today, Sale.user_id == owner_id)
    result_orders_today = await db.execute(query_orders_today)
    total_orders_today = result_orders_today.scalar() or 0

    query_orders_total = select(func.count(Sale.id)).where(Sale.user_id == owner_id)
    result_orders_total = await db.execute(query_orders_total)
    total_orders_abs = result_orders_total.scalar() or 0

    # 5. Critical Inventory
    query_crit = select(Product).where(Product.on_hand <= Product.min_stock, Product.owner_id == owner_id)
    result_crit = await db.execute(query_crit)
    crit_items = result_crit.scalars().all()
    
    crit_info = {
        "items": len(crit_items),
        "sku": crit_items[0].name if crit_items else "N/A",
        "remaining": crit_items[0].on_hand if crit_items else 0
    }
    return {
        "todayRevenue": today_revenue,
        "yesterdayRevenue": yesterday_revenue,
        "weekRevenue": week_revenue,
        "topProduct": top_product,
        "topProductQty": top_product_qty,
        "totalOrdersToday": total_orders_today,
        "totalOrdersAbs": total_orders_abs,
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
    # Estimate hourly revenue based on average historical sales per hour
    list_pred = []
    
    # Query total sales revenue grouped by hour
    query = (
        select(
            func.extract('hour', Sale.timestamp).label('hour'),
            func.sum(Sale.total_price).label('revenue')
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract('hour', Sale.timestamp))
    )
    
    result = await db.execute(query)
    hourly_data = {int(row[0]): float(row[1]) for row in result.all()}
    
    # Default hours from 8 AM to 10 PM
    for h in range(8, 23):
        historical_avg_revenue = hourly_data.get(h, 0.0)
        # Provide a baseline revenue if no data exists
        ventas = historical_avg_revenue if historical_avg_revenue > 0 else (150.0 if 12 <= h <= 15 else 50.0)
        list_pred.append({ "hour": f"{h}:00", "ventas": round(ventas, 2) })
        
    return list_pred
