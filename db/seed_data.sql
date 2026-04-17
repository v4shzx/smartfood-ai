-- Seed data for School Cafeteria (Comedor Escolar)

-- Clean existing data to avoid duplicate key errors (FK order respected)
TRUNCATE payments, subscriptions, menu_items, students, meal_plans, users CASCADE;

-- 1. Insert Users (Parents)
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
('u1', 'Alejandro Balderas', 'alex@parent.com', 'hash123', 'parent'),
('u2', 'Maria Garcia', 'maria@parent.com', 'hash123', 'parent'),
('u3', 'Lucia Rodriguez', 'lucia@admin.com', 'hash123', 'admin'),
('u4', 'Roberto Hernandez', 'roberto@parent.com', 'hash123', 'parent'),
('u5', 'Admin User', 'admin@school.ai', 'hash123', 'admin');

-- 2. Insert Meal Plans
INSERT INTO meal_plans (id, name, description, price_mxn, days_per_week) VALUES
('p1', 'Plan Mensual Total', 'Almuerzo completo de lunes a viernes', 1200.00, 5),
('p2', 'Plan Semanal Flexible', '3 días a la semana a elegir', 450.00, 3),
('p3', 'Plan Dieta Especial', 'Menú personalizado para alergias/restricciones', 1400.00, 5);

-- 3. Insert Students
INSERT INTO students (id, parent_id, first_name, last_name, grade, allergies, dietary_restrictions) VALUES
('s1', 'u1', 'Sofia', 'Balderas', '2do Primaria', 'Nueces', NULL),
('s2', 'u1', 'Mateo', 'Balderas', 'Kinder 3', NULL, 'Sin Lactosa'),
('s3', 'u2', 'Diego', 'Garcia', '4to Primaria', NULL, NULL),
('s4', 'u4', 'Elena', 'Hernandez', '1ro Secundaria', 'Pescado', 'Vegetariano'),
('s5', 'u2', 'Valentina', 'Garcia', '1ro Primaria', NULL, NULL);

-- 4. Insert Subscriptions
INSERT INTO subscriptions (id, student_id, plan_id, start_date, end_date, status) VALUES
('sub1', 's1', 'p1', '2026-04-01', '2026-04-30', 'active'),
('sub2', 's2', 'p3', '2026-04-01', '2026-04-30', 'active'),
('sub3', 's3', 'p1', '2026-04-01', '2026-04-30', 'active'),
('sub4', 's4', 'p3', '2026-04-01', '2026-04-30', 'active'),
('sub5', 's5', 'p2', '2026-04-01', '2026-04-30', 'active');

-- 5. Insert Menus (Weekly Example)
INSERT INTO menu_items (id, day_of_week, dish_name, description, calories, is_vegetarian) VALUES
('m1', 'Monday', 'Pasta Boloñesa', 'Pasta con salsa de carne y queso parmesano', 450, FALSE),
('m2', 'Tuesday', 'Pollo al Horno', 'Pechuga de pollo con puré de papa y brócoli', 380, FALSE),
('m3', 'Wednesday', 'Tacos de Guiso', 'Tacos de canasta variados con frijoles', 520, FALSE),
('m4', 'Thursday', 'Ensalada Cesar con Pollo', 'Lechuga, crotones, aderezo y tiras de pollo', 320, FALSE),
('m5', 'Friday', 'Pizza de Vegetales', 'Pizza casera con pimientos, cebolla y champiñones', 400, TRUE);

-- 6. Insert Payments
INSERT INTO payments (id, subscription_id, amount, payment_method) VALUES
('pay1', 'sub1', 1200.00, 'card'),
('pay2', 'sub2', 1400.00, 'transfer'),
('pay3', 'sub3', 1200.00, 'card'),
('pay4', 'sub4', 1400.00, 'cash'),
('pay5', 'sub5', 450.00, 'card');
