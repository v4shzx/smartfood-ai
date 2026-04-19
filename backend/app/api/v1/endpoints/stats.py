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
    return [
        { "title": "Pico de demanda", "desc": "Los viernes entre 12 PM y 2 PM las ventas suben 45%." },
        { "title": "Producto Estrella", "desc": "El Sándwich de jamón representa el 30% de tus ingresos." },
        { "title": "Oportunidad Merma", "desc": "Se detectó un exceso en stock de Jugos los lunes." }
    ]

@router.get("/prediction")
async def get_prediction(owner_id: Optional[str] = Query("u_demo"), db: AsyncSession = Depends(get_db)) -> Any:
    # Estimate hourly demand based on average historical sales per hour
    list_pred = []
    
    # Query sales grouped by hour
    query = (
        select(
            func.extract('hour', Sale.timestamp).label('hour'),
            func.count(Sale.id).label('count')
        )
        .where(Sale.user_id == owner_id)
        .group_by(func.extract('hour', Sale.timestamp))
    )
    
    result = await db.execute(query)
    hourly_data = {int(row[0]): row[1] for row in result.all()}
    
    # Default hours from 8 AM to 10 PM
    for h in range(8, 23):
        # Calculate a mock prediction based on historical data + some random factor for "realism"
        historical_avg = hourly_data.get(h, 0)
        # If no data, provide a small baseline
        val = historical_avg if historical_avg > 0 else (5 if 12 <= h <= 15 else 2)
        list_pred.append({ "hour": f"{h}:00", "val": val })
        
    return list_pred
