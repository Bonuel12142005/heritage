-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sender_id INT,
    type ENUM('message', 'order', 'review', 'event', 'system', 'workshop', 'product', 'general') DEFAULT 'general',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample notifications
INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at) VALUES
(1, 'system', 'Welcome to HeritageLink!', 'Thank you for joining our platform. Explore local artisans and cultural heritage.', '/showcase', 0, NOW()),
(1, 'message', 'New message from Juan Artisan', 'Hi! I saw your interest in traditional weaving...', '/admin/messages', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 'order', 'New order received', 'You have a new order for Mangyan Woven Blanket.', '/admin/orders', 0, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 'event', 'Upcoming Event: Moriones Festival', 'Don''t miss the annual Moriones Festival next week!', '/events', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'review', 'New review on Gloria Heritage Museum', 'A visitor left a 5-star review on your destination.', '/admin/moderate', 0, DATE_SUB(NOW(), INTERVAL 3 HOUR));
