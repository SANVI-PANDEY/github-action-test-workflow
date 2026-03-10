-- Dummy Orders Table Data
-- This simulates UAT database export

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY,
    user_id INT,
    order_number VARCHAR(20),
    total_amount DECIMAL(10, 2),
    status VARCHAR(20),
    created_at TIMESTAMP
);

INSERT INTO orders (id, user_id, order_number, total_amount, status, created_at) VALUES
(1, 1, 'ORD-2024-001', 129.99, 'completed', '2024-02-01 10:15:00'),
(2, 2, 'ORD-2024-002', 249.50, 'completed', '2024-02-02 11:30:00'),
(3, 3, 'ORD-2024-003', 79.99, 'pending', '2024-02-03 14:25:00'),
(4, 1, 'ORD-2024-004', 399.00, 'completed', '2024-02-04 09:45:00'),
(5, 4, 'ORD-2024-005', 159.99, 'shipped', '2024-02-05 16:20:00'),
(6, 5, 'ORD-2024-006', 89.50, 'completed', '2024-02-06 13:10:00'),
(7, 2, 'ORD-2024-007', 299.99, 'processing', '2024-02-07 15:35:00'),
(8, 6, 'ORD-2024-008', 199.00, 'completed', '2024-02-08 10:50:00'),
(9, 7, 'ORD-2024-009', 449.99, 'shipped', '2024-02-09 12:25:00'),
(10, 3, 'ORD-2024-010', 119.99, 'pending', '2024-02-10 14:40:00'),
(11, 8, 'ORD-2024-011', 179.50, 'completed', '2024-02-11 11:15:00'),
(12, 9, 'ORD-2024-012', 329.99, 'completed', '2024-02-12 16:30:00'),
(13, 4, 'ORD-2024-013', 99.99, 'cancelled', '2024-02-13 09:20:00'),
(14, 10, 'ORD-2024-014', 259.00, 'shipped', '2024-02-14 13:45:00'),
(15, 5, 'ORD-2024-015', 189.99, 'completed', '2024-02-15 15:10:00');

-- Total: 15 orders
