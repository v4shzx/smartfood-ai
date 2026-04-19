-- Base Seed Data for SmartFood AI

-- 1. Users (Admins/Owners)
INSERT INTO users (id, full_name, email, password_hash, role, subscription_tier) VALUES
('u_demo', 'Comedor DM', 'comedordm@gmail.com', '123456', 'admin', 'profesional'),
('u_demo_basico', 'Demo Básico', 'demo_basico@smartfood.ai', '123456', 'admin', 'basico')
ON CONFLICT (id) DO NOTHING;

-- 2. Staff (Workers linked to u_demo)
INSERT INTO staff (id, owner_id, full_name, role, email) VALUES
('s_w1', 'u_demo', 'Pedro Gómez', 'Cajero', 'pedro@smartfood.ai'),
('s_w2', 'u_demo', 'Chef Rodrigo', 'Cocina', 'rodrigo@smartfood.ai'),
('s_w3', 'u_demo', 'Maria Luna', 'Gerente', 'maria@smartfood.ai')
ON CONFLICT (id) DO NOTHING;

-- 3. Products

INSERT INTO products (id, name, category, price, on_hand, min_stock, available) VALUES
('p1', 'Sándwich de jamón y queso', 'Comida', 35.00, 25, 5, TRUE),
('p2', 'Jugo natural de naranja', 'Bebidas', 25.00, 40, 5, TRUE),
('p3', 'Galletas de avena', 'Snacks', 15.00, 50, 10, TRUE),
('p4', 'Yogur con granola', 'Desayuno', 30.00, 15, 5, TRUE),
('p5', 'Palomitas de maíz', 'Snacks', 12.00, 30, 10, TRUE),
('p6', 'Barra de cereal casera', 'Snacks', 18.00, 20, 5, TRUE),
('p7', 'Fruta picada (manzana)', 'Frutas', 10.00, 10, 5, TRUE),
('p8', 'Mini pizza de pan pita', 'Comida', 40.00, 12, 5, TRUE),
('p9', 'Batido de fresa con leche', 'Bebidas', 28.00, 8, 5, TRUE),
('p10', 'Muffin de plátano', 'Postres', 22.00, 5, 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Meal Plans
INSERT INTO meal_plans (id, name, description, price_mxn, days_per_week) VALUES
('plan_basico', 'Básico', 'Acceso a herramientas esenciales', 0.00, 5),
('plan_profesional', 'Profesional', 'Gestión completa de sucursal', 299.00, 5),
('plan_empresarial', 'Empresarial', 'Control multi-sucursal Avanzado', 899.00, 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Suppliers
INSERT INTO suppliers (id, name, contact, phone, email, lead_days, rating) VALUES
('s1', 'Cárnicos Express', 'Juan Pérez', '555-0123', 'ventas@carnicosexp.com', 1, 4.80),
('s2', 'Tortillería La Abuela', 'Doña María', '555-9876', 'pedidos@laabuela.mx', 0, 5.00),
('s3', 'Salsas & Más', 'Luis García', '555-5555', 'lgarcia@salsasymas.com', 3, 4.20)
ON CONFLICT (id) DO NOTHING;

-- 6. Menu Items
INSERT INTO menu_items (id, day_of_week, dish_name, description, calories, is_vegetarian) VALUES
('m1', 'Lunes', 'Tacos de Pollo', 'Tacos de pollo con guarnición de arroz y frijoles.', 450, FALSE),
('m2', 'Martes', 'Pasta Alfredo', 'Pasta cremosa con pollo y pan de ajo.', 600, FALSE),
('m3', 'Miércoles', 'Ensalada César', 'Lechuga fresca, croutones, queso parmesano y aderezo.', 350, TRUE),
('m4', 'Jueves', 'Hamburguesa Mixta', 'Hamburguesa de res y cerdo con papas fritas.', 750, FALSE),
('m5', 'Viernes', 'Filete de Pescado', 'Filete de pescado al limón con verduras al vapor.', 400, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 7. Payment Methods
INSERT INTO payment_methods (id, user_id, brand, last4, exp_month, exp_year, is_primary) VALUES
('pm_1', 'u_demo', 'Visa', '4242', 12, 2026, TRUE),
('pm_2', 'u_demo', 'Mastercard', '8888', 10, 2025, FALSE)
ON CONFLICT (id) DO NOTHING;
