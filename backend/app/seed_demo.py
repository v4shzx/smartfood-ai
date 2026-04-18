import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal as SessionLocal, engine, Base
from app.models.cafeteria import SchoolUser, Student, MealPlan, MenuItem
from app.models.sales import Sale, Waste
from app.models.product import Product

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
            # 1. Demo Users (Admin and Staff)
            users_data = [
                ("u_demo", "comedordm@gmail.com", "Comedor DM", "admin", "profesional"),
                ("u_staff1", "pedro@smartfood.ai", "Pedro Gómez", "cajero", "basico"),
                ("u_staff2", "rodrigo@smartfood.ai", "Chef Rodrigo", "cocina", "basico"),
                ("u_staff3", "maria@smartfood.ai", "Maria Luna", "gerente", "basico"),
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

            for pid, name, cat, price in items_data:
                p = Product(id=pid, name=name, category=cat, price=price, available=True)
                session.add(p)

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
            
            await session.commit() # Persistent commit
            print("Initial users, products and plans committed.")
        else:
            print(f"Users already exist ({user_count}), skipping initial seed.")

        # 5. Simulate one week of sales and waste (Always run to ensure current data)
        print("Simulating sales and waste for the last 7 days...")
        # Get products for sales simulation (check both DB and session)
        product_res = await session.execute(select(Product))
        products = product_res.scalars().all()
        
        if not products:
            # Try to get from session if not committed yet
            products = [obj for obj in session.new if isinstance(obj, Product)]
        
        if products:
            today = datetime.now()
            for i in range(7):
                current_date = (today - timedelta(days=i))
                # Generate 5-15 sales per day
                for _ in range(random.randint(5, 15)):
                    p = random.choice(products)
                    qty = random.randint(1, 3)
                    sale = Sale(
                        id=f"sale_{i}_{random.randint(0, 100000)}",
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
                        id=f"waste_{i}_{random.randint(0, 100000)}",
                        product_id=p.id,
                        quantity=qty,
                        reason=random.choice(["Expired", "Damaged", "Unsold"]),
                        timestamp=current_date
                    )
                    session.add(waste)
        else:
            print("No products found to simulate sales.")

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

