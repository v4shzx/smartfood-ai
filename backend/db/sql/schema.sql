-- Schema for School Cafeteria (Comedor Escolar)
-- Updated: 2026-04-17 (Subscription Tiers, Products, Sales, Waste)

-- 1. Users table (Parents and Staff)
CREATE TABLE IF NOT EXISTS school_users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'parent', -- 'parent', 'admin', 'staff'
    subscription_tier VARCHAR(20) DEFAULT 'basico', -- 'basico', 'profesional', 'empresarial'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY,
    parent_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    grade VARCHAR(20),
    allergies TEXT,
    dietary_restrictions TEXT,
    FOREIGN KEY (parent_id) REFERENCES school_users(id) ON DELETE CASCADE
);

-- 3. Meal Plans (Subscription tiers)
CREATE TABLE IF NOT EXISTS meal_plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., 'Plan Mensual Completo', 'Plan Semanal'
    description TEXT,
    price_mxn DECIMAL(10, 2) NOT NULL,
    days_per_week INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Subscriptions (Link between students and plans)
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) UNIQUE NOT NULL, -- One plan per student
    plan_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    auto_renew BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES meal_plans(id)
);

-- 5. Menus (Weekly dishes)
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(36) PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL, -- 'Monday' to 'Friday'
    dish_name VARCHAR(100) NOT NULL,
    description TEXT,
    calories INTEGER,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    date_served DATE -- Specific date if needed
);

-- 6. Products Table (Inventory)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    image_url TEXT
);

-- 7. Sales History (Simulation support)
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    FOREIGN KEY (user_id) REFERENCES school_users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 8. Waste / Merma tracking
CREATE TABLE IF NOT EXISTS waste (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 9. Subscription Payments (History)
CREATE TABLE IF NOT EXISTS payment_methods (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES school_users(id),
    brand VARCHAR(20) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    exp_month INTEGER NOT NULL,
    exp_year INTEGER NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    subscription_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50), -- 'card', 'transfer', 'cash'
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);
