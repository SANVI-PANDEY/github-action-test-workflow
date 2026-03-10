-- Dummy Users Table Data
-- This simulates UAT database export

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP
);

INSERT INTO users (id, username, email, created_at) VALUES
(1, 'john_doe', 'john@example.com', '2024-01-15 10:30:00'),
(2, 'jane_smith', 'jane@example.com', '2024-01-16 11:45:00'),
(3, 'bob_wilson', 'bob@example.com', '2024-01-17 09:20:00'),
(4, 'alice_brown', 'alice@example.com', '2024-01-18 14:15:00'),
(5, 'charlie_davis', 'charlie@example.com', '2024-01-19 16:30:00'),
(6, 'emma_garcia', 'emma@example.com', '2024-01-20 08:45:00'),
(7, 'david_miller', 'david@example.com', '2024-01-21 13:10:00'),
(8, 'sophia_martinez', 'sophia@example.com', '2024-01-22 15:25:00'),
(9, 'michael_anderson', 'michael@example.com', '2024-01-23 10:50:00'),
(10, 'olivia_taylor', 'olivia@example.com', '2024-01-24 12:35:00');

-- Total: 10 users
