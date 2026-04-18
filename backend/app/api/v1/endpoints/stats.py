from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.models.product import Product
from app.models.sales import Sale
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)) -> Any:
    # 1. Today Revenue
    today = datetime.now().date()
    query_today = select(func.sum(Sale.total_price)).where(func.date(Sale.timestamp) == today)
    result_today = await db.execute(query_today)
    today_revenue = result_today.scalar() or 0.0

    # 2. Week Revenue
    week_ago = datetime.now() - timedelta(days=7)
    query_week = select(func.sum(Sale.total_price)).where(Sale.timestamp >= week_ago)
    result_week = await db.execute(query_week)
    week_revenue = result_week.scalar() or 0.0

    # 3. Top Product
    query_top = (
        select(Product.name, func.sum(Sale.quantity).label("total_qty"))
        .join(Sale, Product.id == Sale.product_id)
        .group_by(Product.name)
        .order_by(desc("total_qty"))
        .limit(1)
    )
    result_top = await db.execute(query_top)
    top_prod_row = result_top.first()
    top_product = top_prod_row[0] if top_prod_row else "N/A"

    # 4. Total Orders Today
    query_orders = select(func.count(Sale.id)).where(func.date(Sale.timestamp) == today)
    result_orders = await db.execute(query_orders)
    total_orders = result_orders.scalar() or 0

    # 5. Critical Inventory
    query_crit = select(Product).where(Product.on_hand <= Product.min_stock)
    result_crit = await db.execute(query_crit)
    crit_items = result_crit.scalars().all()
    
    crit_info = {
        "items": len(crit_items),
        "sku": crit_items[0].name if crit_items else "N/A",
        "remaining": crit_items[0].on_hand if crit_items else 0
    }
    return {
        "todayRevenue": today_revenue,
        "weekRevenue": week_revenue,
        "topProduct": top_product,
        "totalOrders": total_orders,
        "criticalInventory": crit_info
    }

@router.get("/sales-series")
async def get_sales_series(db: AsyncSession = Depends(get_db)) -> Any:
    # Fetch last 7 days of sales aggregated by day
    today = datetime.now().date()
    series = []
    days_map = {0: "Lun", 1: "Mar", 2: "Mie", 3: "Jue", 4: "Vie", 5: "Sab", 6: "Dom"}
    
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        query = select(func.sum(Sale.total_price)).where(func.date(Sale.timestamp) == day)
        result = await db.execute(query)
        total = result.scalar() or 0.0
        series.append({"label": days_map[day.weekday()], "value": total})
    
    return series

@router.get("/trends")
async def get_trends(db: AsyncSession = Depends(get_db)) -> Any:
    # Simulating trends logic based on real data would go here
    return [
        { "title": "Pico de demanda", "desc": "Los viernes entre 12 PM y 2 PM las ventas suben 45%." },
        { "title": "Producto Estrella", "desc": "El Sándwich de jamón representa el 30% de tus ingresos." },
        { "title": "Oportunidad Merma", "desc": "Se detectó un exceso en stock de Jugos los lunes." }
    ]

@router.get("/prediction")
async def get_prediction(db: AsyncSession = Depends(get_db)) -> Any:
    # Simulated prediction data
    list_pred = []
    for h in range(10, 25):
        val = int((datetime.now().hour + h) % 15 * 5 + 10)
        list_pred.append({ "hour": f"{h}:00", "val": val })
    return list_pred
