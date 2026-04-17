-- Seeding Data for School Cafeteria
-- Updated: 2026-04-17 (Demo alignment)

-- 1. Insert Demo User (Comedor DM)
INSERT INTO school_users (id, full_name, email, password_hash, role, subscription_tier)
VALUES ('u_demo', 'Comedor DM', 'comedordm@gmail.com', '123456', 'admin', 'profesional')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Products (Inventory from demo.md)
INSERT INTO products (id, name, category, price, available) VALUES
('p1', 'Sándwich de jamón y queso', 'Comida', 35.00, TRUE),
('p2', 'Jugo natural de naranja', 'Bebidas', 25.00, TRUE),
('p3', 'Galletas de avena', 'Snacks', 15.00, TRUE),
('p4', 'Yogur con granola', 'Desayuno', 30.00, TRUE),
('p5', 'Palomitas de maíz', 'Snacks', 12.00, TRUE),
('p6', 'Barra de cereal casera', 'Snacks', 18.00, TRUE),
('p7', 'Fruta picada (manzana)', 'Frutas', 10.00, TRUE),
('p8', 'Mini pizza de pan pita', 'Comida', 40.00, TRUE),
('p9', 'Batido de fresa con leche', 'Bebidas', 28.00, TRUE),
('p10', 'Muffin de plátano', 'Postres', 22.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Default Meal Plans
INSERT INTO meal_plans (id, name, description, price_mxn, days_per_week, is_active) VALUES
('plan_basico', 'Básico', 'Acceso a herramientas esenciales', 0.00, 5, TRUE),
('plan_profesional', 'Profesional', 'Gestión completa de sucursal', 299.00, 5, TRUE),
('plan_empresarial', 'Empresarial', 'Control multi-sucursal Avanzado', 899.00, 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Sample sales for the last week (Simulation)
INSERT INTO sales (id, user_id, product_id, quantity, total_price, timestamp, payment_method)
VALUES 
('s1', 'u_demo', 'p1', 2, 70.00, NOW() - INTERVAL '1 day', 'Cash'),
('s2', 'u_demo', 'p2', 1, 25.00, NOW() - INTERVAL '1 day', 'Card'),
('s3', 'u_demo', 'p8', 1, 40.00, NOW() - INTERVAL '2 days', 'Cash'),
('s4', 'u_demo', 'p10', 3, 66.00, NOW() - INTERVAL '3 days', 'Card'),
('s5', 'u_demo', 'p1', 5, 175.00, NOW() - INTERVAL '4 days', 'Cash');

-- 5. Sample waste records
INSERT INTO waste (id, product_id, quantity, reason, timestamp)
VALUES 
('w1', 'p1', 2, 'Expired', NOW() - INTERVAL '1 day'),
('w2', 'p7', 3, 'Damaged', NOW() - INTERVAL '2 days');

-- Seed for Payment Methods
INSERT INTO payment_methods (id, user_id, brand, last4, exp_month, exp_year, is_primary) VALUES
('pm_1', 'u_demo', 'Visa', '4242', 12, 2025, TRUE),
('pm_2', 'u_demo', 'Mastercard', '8888', 8, 2024, FALSE)
ON CONFLICT (id) DO NOTHING;
