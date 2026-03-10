-- Dummy Products Table Data
-- This simulates UAT database export

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT,
    is_active BOOLEAN
);

INSERT INTO products (id, product_name, category, price, stock_quantity, is_active) VALUES
(1, 'Laptop Pro 15"', 'Electronics', 1299.99, 45, TRUE),
(2, 'Wireless Mouse', 'Electronics', 29.99, 150, TRUE),
(3, 'Mechanical Keyboard', 'Electronics', 89.99, 78, TRUE),
(4, 'USB-C Hub', 'Accessories', 49.99, 120, TRUE),
(5, 'Office Chair', 'Furniture', 299.99, 25, TRUE),
(6, 'Standing Desk', 'Furniture', 599.99, 15, TRUE),
(7, 'Monitor 27"', 'Electronics', 349.99, 60, TRUE),
(8, 'Webcam HD', 'Electronics', 79.99, 95, TRUE),
(9, 'Headphones Wireless', 'Electronics', 149.99, 88, TRUE),
(10, 'Desk Lamp LED', 'Accessories', 39.99, 110, TRUE),
(11, 'Cable Management Kit', 'Accessories', 19.99, 200, TRUE),
(12, 'Laptop Stand', 'Accessories', 44.99, 85, TRUE),
(13, 'External SSD 1TB', 'Electronics', 129.99, 50, TRUE),
(14, 'Portable Charger', 'Electronics', 39.99, 140, TRUE),
(15, 'Notebook Set', 'Stationery', 14.99, 180, TRUE),
(16, 'Pen Pack (10pcs)', 'Stationery', 9.99, 250, TRUE),
(17, 'Whiteboard', 'Office Supplies', 79.99, 30, TRUE),
(18, 'Filing Cabinet', 'Furniture', 189.99, 12, TRUE),
(19, 'Desk Organizer', 'Accessories', 24.99, 95, TRUE),
(20, 'Power Strip', 'Electronics', 34.99, 130, TRUE);

-- Total: 20 products
