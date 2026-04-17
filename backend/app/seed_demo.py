import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal as SessionLocal, engine, Base
from app.models.cafeteria import SchoolUser, Student, MealPlan, Sale, Waste, MenuItem
from app.models.product import Product

async def seed():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        # Check if demo user already exists
        from sqlalchemy.future import select
        res = await session.execute(select(SchoolUser).where(SchoolUser.id == "u_demo"))
        if res.scalars().first():
            print("Demo data already seeded or partially present. Adding Menu Items if missing.")
        else:
            # 1. Demo User
            demo_user = SchoolUser(
                id="u_demo",
                email="comedordm@gmail.com",
                full_name="Comedor DM",
                password_hash="123456",
                role="admin",
                subscription_tier="profesional"
            )
            session.add(demo_user)

            # 2. Inventory Items
            items_data = [
                ("p1", "Sándwich de jamón y queso", "Comida", 35.0),
                ("p2", "Jugo natural de naranja", "Bebidas", 25.0),
                ("p3", "Galletas de avena", "Snacks", 15.0),
                ("p4", "Yogur con granola", "Desayuno", 30.0),
                ("p5", "Palomitas de maíz", "Snacks", 12.0),
                ("p6", "Barra de cereal casera", "Snacks", 18.0),
                ("p7", "Fruta picada (manzana)", "Frutas", 10.0),
                ("p8", "Mini pizza de pan pita", "Comida", 40.0),
                ("p9", "Batido de fresa con leche", "Bebidas", 28.0),
                ("p10", "Muffin de plátano", "Postres", 22.0),
            ]

            products = []
            for pid, name, cat, price in items_data:
                p = Product(id=pid, name=name, category=cat, price=price, available=True)
                session.add(p)
                products.append(p)

            # 3. Add a student for the demo user
            student = Student(id="s_demo", first_name="Juan", last_name="Perez", grade="5to Primaria", parent_id="u_demo")
            session.add(student)

            # 4. Default Meal Plans
            plans = [
                MealPlan(id="plan_basico", name="Básico", price_mxn=0, days_per_week=5),
                MealPlan(id="plan_profesional", name="Profesional", price_mxn=299, days_per_week=5),
                MealPlan(id="plan_empresarial", name="Empresarial", price_mxn=899, days_per_week=5),
            ]
            for plan in plans:
                session.add(plan)

            # 5. Simulate one week of sales and waste
            today = datetime.now()
            for i in range(7):
                current_date = (today - timedelta(days=i)).date()
                # Generate 5-15 sales per day
                for _ in range(random.randint(5, 15)):
                    p = random.choice(products)
                    qty = random.randint(1, 3)
                    sale = Sale(
                        id=f"sale_{i}_{random.randint(0, 1000)}",
                        user_id="u_demo",
                        product_id=p.id,
                        quantity=qty,
                        total_price=p.price * qty,
                        timestamp=current_date,
                        payment_method=random.choice(["Cash", "Card"])
                    )
                    session.add(sale)
                
                # Generate 1-3 waste records per day
                for _ in range(random.randint(1, 3)):
                    p = random.choice(products)
                    qty = random.randint(1, 2)
                    waste = Waste(
                        id=f"waste_{i}_{random.randint(0, 1000)}",
                        product_id=p.id,
                        quantity=qty,
                        reason=random.choice(["Expired", "Damaged", "Unsold"]),
                        timestamp=current_date
                    )
                    session.add(waste)

        # 6. Seed Weekly Menu Items
        menu_res = await session.execute(select(MenuItem))
        if not menu_res.scalars().first():
            menu_data = [
                ("m1", "Lunes", "Tacos de Pollo", "Tacos de pollo con guarnición de arroz y frijoles.", 450, False),
                ("m2", "Martes", "Pasta Alfredo", "Pasta cremosa con pollo y pan de ajo.", 600, False),
                ("m3", "Miércoles", "Ensalada César", "Lechuga fresca, croutones, queso parmesano y aderezo.", 350, True),
                ("m4", "Jueves", "Hamburguesa Mixta", "Hamburguesa de res y cerdo con papas fritas.", 750, False),
                ("m5", "Viernes", "Filete de Pescado", "Filete de pescado al limón con verduras al vapor.", 400, False),
            ]
            for mid, day, name, desc, cal, veg in menu_data:
                m = MenuItem(id=mid, day_of_week=day, dish_name=name, description=desc, calories=cal, is_vegetarian=veg)
                session.add(m)
            print("Menu items seeded!")

        await session.commit()
        print("Demo data and one-week simulation seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())

