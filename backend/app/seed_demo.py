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
from app.models.payment import PaymentMethod
from app.models.category import Category

async def seed():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        # Check if users exist
        from sqlalchemy import func, select
        u_count_res = await session.execute(select(func.count(SchoolUser.id)))
        user_count = u_count_res.scalar() or 0
        
        if user_count == 0:
            print(f"Seeding initial users...")
            # 1. Demo Users (Admins/Owners)
            users_data = [
                ("u_demo", "comedordm@gmail.com", "Comedor DM", "admin", "empresarial", datetime(2026, 1, 15, 10, 0)),
                ("u_demo_basico", "demo_basico@smartfood.ai", "Demo Básico", "admin", "basico", datetime(2026, 3, 2, 14, 30)), 
                ("u_master", "master@smartfood.ai", "Master Account", "admin", "administrador", datetime(2025, 12, 20, 9, 15)), 
            ]
            
            for uid, email, name, role, tier, created_at in users_data:
                # Assign password based on user ID for security demonstration
                pw_hash = "master" if uid == "u_master" else "123456" 
                
                u = SchoolUser(
                    id=uid,
                    email=email,
                    full_name=name,
                    password_hash=pw_hash,
                    role=role,
                    subscription_tier=tier,
                    created_at=created_at
                )
                session.add(u)
            
            await session.commit()
            print("Users committed.")
        else:
            print(f"Users already exist: {user_count}")
            # Optional: list them
            users_res = await session.execute(select(SchoolUser.id, SchoolUser.email))
            for u in users_res.all():
                print(f"  - {u.id}: {u.email}")
        
        # 1.5 Categories (Only for u_demo)
        cat_count_res = await session.execute(select(func.count(Category.id)))
        cat_count = cat_count_res.scalar() or 0
        if cat_count == 0:
            print("Seeding categories...")
            categories_data = ["Comida", "Bebidas", "Snacks", "Desayuno", "Frutas", "Postres"]
            for i, cat_name in enumerate(categories_data):
                session.add(Category(id=f"cat_{i}", owner_id="u_demo", name=cat_name))
            await session.commit()

        # 2. Staff (Only for u_demo)
        staff_count_res = await session.execute(select(func.count(Staff.id)))
        if staff_count_res.scalar() == 0:
            print("Seeding staff...")
            staff_data = [
                ("s_w1", "u_demo", "Pedro Gómez", "Cajero", "pedro@smartfood.ai"),
                ("s_w2", "u_demo", "Chef Rodrigo", "Cocina", "rodrigo@smartfood.ai"),
                ("s_w3", "u_demo", "Maria Luna", "Gerente", "maria@smartfood.ai"),
            ]
            for sid, oid, name, role, email in staff_data:
                session.add(Staff(id=sid, owner_id=oid, full_name=name, role=role, email=email))
            await session.commit()

        # 3. Inventory Items (Only for u_demo)
        prod_count_res = await session.execute(select(func.count(Product.id)))
        if prod_count_res.scalar() == 0:
            print("Seeding products...")
            items_demo = [
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

            for pid, name, cat, price in items_demo:
                stock = 10 if pid == "p1" else random.randint(20, 50)
                session.add(Product(id=pid, owner_id="u_demo", name=name, category=cat, price=price, available=True, on_hand=stock))
            await session.commit()

        # 4. Default Meal Plans
        plan_count_res = await session.execute(select(func.count(MealPlan.id)))
        if plan_count_res.scalar() == 0:
            print("Seeding meal plans...")
            plans = [
                MealPlan(id="plan_basico_1", owner_id="u_demo", name="Básico", price_mxn=0, days_per_week=5),
                MealPlan(id="plan_prof_1", owner_id="u_demo", name="Profesional", price_mxn=299, days_per_week=5),
                MealPlan(id="plan_basico_2", owner_id="u_demo_basico", name="Básico", price_mxn=0, days_per_week=5),
            ]
            for plan in plans:
                session.add(plan)
            await session.commit()
            
        # 5. Suppliers (Only for u_demo)
        sup_count_res = await session.execute(select(func.count(Supplier.id)))
        if sup_count_res.scalar() == 0:
            print("Seeding suppliers...")
            suppliers_data = [
                ("s1", "u_demo", "Cárnicos Express", "Juan Pérez", "555-0123", "ventas@carnicosexp.com", 1, 4.8),
                ("s2", "u_demo", "Tortillería La Abuela", "Doña María", "555-9876", "pedidos@laabuela.mx", 0, 5.0),
            ]
            for sid, oid, name, contact, phone, email, lead, rating in suppliers_data:
                session.add(Supplier(id=sid, owner_id=oid, name=name, contact=contact, phone=phone, email=email, lead_days=lead, rating=rating))
            await session.commit()

        # 6. Payment Methods (Only for u_demo)
        pm_count_res = await session.execute(select(func.count(PaymentMethod.id)))
        if pm_count_res.scalar() == 0:
            print("Seeding payment methods...")
            session.add(PaymentMethod(id="pm_1", user_id="u_demo", brand="Visa", last4="4242", exp_month=12, exp_year=2026, is_primary=True))
            session.add(PaymentMethod(id="pm_2", user_id="u_demo", brand="Mastercard", last4="8888", exp_month=10, exp_year=2025, is_primary=False))
            await session.commit()


        # 5. Simulate sales (Only for u_demo)
        print("Simulating sales for u_demo...")
        product_res = await session.execute(select(Product).where(Product.owner_id == "u_demo"))
        products = product_res.scalars().all()
        if products:
            # Seed from 30 days ago until today to ensure dashboard has data
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            curr = start_date
            while curr <= end_date:
                for _ in range(random.randint(8, 20)):
                    p = random.choice(products)
                    qty = random.randint(1, 4)
                    session.add(Sale(
                        id=f"sale_u_demo_{curr.strftime('%Y%m%d')}_{random.randint(0, 100000)}",
                        user_id="u_demo", product_id=p.id, quantity=qty, total_price=p.price * qty,
                        timestamp=curr + timedelta(hours=random.randint(8, 18)),
                        payment_method=random.choice(["Cash", "Card"])
                    ))
                curr += timedelta(days=1)
        
        # 6. Menu Items (Only for u_demo)
        menu_res = await session.execute(select(MenuItem).where(MenuItem.owner_id == "u_demo"))
        if not menu_res.scalars().first():
            menu_data = [
                ("m1", "u_demo", "Lunes", "Tacos de Pollo", "Tacos de pollo con arroz.", 450, False),
                ("m2", "u_demo", "Martes", "Pasta Alfredo", "Pasta cremosa.", 600, False),
            ]
            for mid, oid, day, name, desc, cal, veg in menu_data:
                session.add(MenuItem(id=mid, owner_id=oid, day_of_week=day, dish_name=name, description=desc, calories=cal, is_vegetarian=veg))

        await session.commit()
        print("Demo data seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
