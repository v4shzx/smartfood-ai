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

-- 3. Products (Linked to u_demo)
INSERT INTO products (id, owner_id, name, category, price, on_hand, min_stock, available) VALUES
('p1', 'u_demo', 'Sándwich de jamón y queso', 'Comida', 35.00, 25, 5, TRUE),
('p2', 'u_demo', 'Jugo natural de naranja', 'Bebidas', 25.00, 40, 5, TRUE),
('p3', 'u_demo', 'Galletas de avena', 'Snacks', 15.00, 50, 10, TRUE),
('p4', 'u_demo', 'Yogur con granola', 'Desayuno', 30.00, 15, 5, TRUE),
('p5', 'u_demo', 'Palomitas de maíz', 'Snacks', 12.00, 30, 10, TRUE),
('p6', 'u_demo', 'Barra de cereal casera', 'Snacks', 18.00, 20, 5, TRUE),
('p7', 'u_demo', 'Fruta picada (manzana)', 'Frutas', 10.00, 10, 5, TRUE),
('p8', 'u_demo', 'Mini pizza de pan pita', 'Comida', 40.00, 12, 5, TRUE),
('p9', 'u_demo', 'Batido de fresa con leche', 'Bebidas', 28.00, 8, 5, TRUE),
('p10', 'u_demo', 'Muffin de plátano', 'Postres', 22.00, 5, 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Meal Plans (Linked to u_demo)
INSERT INTO meal_plans (id, owner_id, name, description, price_mxn, days_per_week) VALUES
('plan_basico', 'u_demo', 'Básico', 'Acceso a herramientas esenciales', 0.00, 5),
('plan_profesional', 'u_demo', 'Profesional', 'Gestión completa de sucursal', 299.00, 5),
('plan_empresarial', 'u_demo', 'Empresarial', 'Control multi-sucursal Avanzado', 899.00, 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Suppliers (Linked to u_demo)
INSERT INTO suppliers (id, owner_id, name, contact, phone, email, lead_days, rating) VALUES
('s1', 'u_demo', 'Cárnicos Express', 'Juan Pérez', '555-0123', 'ventas@carnicosexp.com', 1, 4.80),
('s2', 'u_demo', 'Tortillería La Abuela', 'Doña María', '555-9876', 'pedidos@laabuela.mx', 0, 5.00),
('s3', 'u_demo', 'Salsas & Más', 'Luis García', '555-5555', 'lgarcia@salsasymas.com', 3, 4.20)
ON CONFLICT (id) DO NOTHING;

-- 6. Menu Items (Linked to u_demo)
INSERT INTO menu_items (id, owner_id, day_of_week, dish_name, description, calories, is_vegetarian) VALUES
('m1', 'u_demo', 'Lunes', 'Tacos de Pollo', 'Tacos de pollo con guarnición de arroz y frijoles.', 450, FALSE),
('m2', 'u_demo', 'Martes', 'Pasta Alfredo', 'Pasta cremosa con pollo y pan de ajo.', 600, FALSE),
('m3', 'u_demo', 'Miércoles', 'Ensalada César', 'Lechuga fresca, croutones, queso parmesano y aderezo.', 350, TRUE),
('m4', 'u_demo', 'Jueves', 'Hamburguesa Mixta', 'Hamburguesa de res y cerdo con papas fritas.', 750, FALSE),
('m5', 'u_demo', 'Viernes', 'Filete de Pescado', 'Filete de pescado al limón con verduras al vapor.', 400, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 7. Payment Methods
INSERT INTO payment_methods (id, user_id, brand, last4, exp_month, exp_year, is_primary) VALUES
('pm_1', 'u_demo', 'Visa', '4242', 12, 2026, TRUE),
('pm_2', 'u_demo', 'Mastercard', '8888', 10, 2025, FALSE)
ON CONFLICT (id) DO NOTHING;
