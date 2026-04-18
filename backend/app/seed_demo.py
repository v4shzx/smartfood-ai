import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal as SessionLocal, engine, Base
from app.models.cafeteria import SchoolUser, MealPlan, MenuItem
from app.models.sales import Sale, Waste
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.staff import Staff

async def seed():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        # Check if users and products exist
        from sqlalchemy import func, select
        u_count_res = await session.execute(select(func.count(SchoolUser.id)))
        user_count = u_count_res.scalar() or 0
        
        p_count_res = await session.execute(select(func.count(Product.id)))
        product_count = p_count_res.scalar() or 0
        
        if user_count == 0 or product_count == 0:
            print(f"Seeding initial users ({user_count}) and products ({product_count})...")
            # 1. Demo Users (Admins/Owners)
            users_data = [
                ("u_demo", "comedordm@gmail.com", "Comedor DM", "admin", "profesional"),
                ("u_demo_basico", "demo_basico@smartfood.ai", "Demo Básico", "admin", "basico"),
            ]
            
            for uid, email, name, role, tier in users_data:
                u = SchoolUser(
                    id=uid,
                    email=email,
                    full_name=name,
                    password_hash="123456",
                    role=role,
                    subscription_tier=tier
                )
                session.add(u)

            # 2. Staff (Workers linked to owners)
            staff_data = [
                ("s_w1", "u_demo", "Pedro Gómez", "Cajero", "pedro@smartfood.ai"),
                ("s_w2", "u_demo", "Chef Rodrigo", "Cocina", "rodrigo@smartfood.ai"),
                ("s_w3", "u_demo", "Maria Luna", "Gerente", "maria@smartfood.ai"),
                ("s_w4", "u_demo_basico", "Auxiliar Básico", "Ayudante", "aux@smartfood.ai"),
            ]
            for sid, oid, name, role, email in staff_data:
                session.add(Staff(id=sid, owner_id=oid, full_name=name, role=role, email=email))

            # 3. Inventory Items (Different for each owner)
            # For u_demo (Professional)
            items_demo = [
                ("p1", "Sándwich de jamón y queso", "Comida", 35.0),
                ("p2", "Jugo natural de naranja", "Bebidas", 25.0),
                ("p3", "Galletas de avena", "Snacks", 15.0),
            ]
            # For u_demo_basico (Basic)
            items_basico = [
                ("pb1", "Taco de Pollo", "Tacos", 18.0),
                ("pb2", "Agua de Horchata", "Bebidas", 20.0),
            ]

            for pid, name, cat, price in items_demo:
                session.add(Product(id=pid, owner_id="u_demo", name=name, category=cat, price=price, available=True, on_hand=random.randint(10, 50)))
            
            for pid, name, cat, price in items_basico:
                session.add(Product(id=pid, owner_id="u_demo_basico", name=name, category=cat, price=price, available=True, on_hand=random.randint(10, 50)))

            # 4. Default Meal Plans
            plans = [
                MealPlan(id="plan_basico_1", owner_id="u_demo", name="Básico", price_mxn=0, days_per_week=5),
                MealPlan(id="plan_prof_1", owner_id="u_demo", name="Profesional", price_mxn=299, days_per_week=5),
                MealPlan(id="plan_basico_2", owner_id="u_demo_basico", name="Básico", price_mxn=0, days_per_week=5),
            ]
            for plan in plans:
                session.add(plan)
            
            # 5. Suppliers
            suppliers_data = [
                ("s1", "u_demo", "Cárnicos Express", "Juan Pérez", "555-0123", "ventas@carnicosexp.com", 1, 4.8),
                ("s2", "u_demo", "Tortillería La Abuela", "Doña María", "555-9876", "pedidos@laabuela.mx", 0, 5.0),
                ("s3", "u_demo_basico", "Salsas & Más", "Luis García", "555-5555", "lgarcia@salsasymas.com", 3, 4.2),
            ]
            for sid, oid, name, contact, phone, email, lead, rating in suppliers_data:
                session.add(Supplier(id=sid, owner_id=oid, name=name, contact=contact, phone=phone, email=email, lead_days=lead, rating=rating))

            await session.commit()
            print("Initial users, products and plans committed.")
        else:
            print(f"Users already exist ({user_count}), skipping initial seed.")

        # 5. Simulate sales and waste from 2026-04-01 to 2026-04-23
        print("Simulating sales and waste from 2026-04-01 to 2026-04-23...")
        
        owners = ["u_demo", "u_demo_basico"]
        for oid in owners:
            # Get products for this owner
            product_res = await session.execute(select(Product).where(Product.owner_id == oid))
            products = product_res.scalars().all()
            
            if products:
                start_date = datetime(2026, 4, 1)
                end_date = datetime(2026, 4, 23)
                current_date = start_date
                
                while current_date <= end_date:
                    for _ in range(random.randint(5, 15)):
                        p = random.choice(products)
                        qty = random.randint(1, 4)
                        sale = Sale(
                            id=f"sale_{oid}_{current_date.strftime('%Y%m%d')}_{random.randint(0, 100000)}",
                            user_id=oid,
                            product_id=p.id,
                            quantity=qty,
                            total_price=p.price * qty,
                            timestamp=current_date + timedelta(hours=random.randint(8, 18)),
                            payment_method=random.choice(["Cash", "Card"])
                        )
                        session.add(sale)
                    current_date += timedelta(days=1)
            else:
                print(f"No products found for owner {oid} to simulate sales.")

        # 6. Seed Weekly Menu Items
        menu_res = await session.execute(select(MenuItem))
        if not menu_res.scalars().first():
            menu_data = [
                ("m1", "u_demo", "Lunes", "Tacos de Pollo", "Tacos de pollo con guarnición de arroz y frijoles.", 450, False),
                ("m2", "u_demo", "Martes", "Pasta Alfredo", "Pasta cremosa con pollo y pan de ajo.", 600, False),
                ("mb1", "u_demo_basico", "Lunes", "Ensalada Básica", "Lechuga y tomate.", 200, True),
            ]
            for mid, oid, day, name, desc, cal, veg in menu_data:
                m = MenuItem(id=mid, owner_id=oid, day_of_week=day, dish_name=name, description=desc, calories=cal, is_vegetarian=veg)
                session.add(m)
            print("Menu items seeded!")

        await session.commit()
        print("Demo data and one-week simulation seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())

