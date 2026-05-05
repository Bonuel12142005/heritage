-- Workshops Table for Artisan Workshops
CREATE TABLE IF NOT EXISTS workshops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artisan_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    workshop_date DATE,
    workshop_time VARCHAR(100),
    location VARCHAR(255),
    max_participants INT DEFAULT 10,
    fee DECIMAL(10, 2) DEFAULT 0,
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_artisan (artisan_id),
    INDEX idx_date (workshop_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
