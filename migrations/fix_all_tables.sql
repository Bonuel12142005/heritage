-- Fix All Missing Tables Migration
-- Run this to create all missing tables and fix column issues

-- 1. Workshops Table
CREATE TABLE IF NOT EXISTS workshops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artisan_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    workshop_date DATE,
    workshop_time VARCHAR(100),
    time VARCHAR(100),
    date DATE,
    location VARCHAR(255),
    max_participants INT DEFAULT 10,
    current_participants INT DEFAULT 0,
    fee DECIMAL(10, 2) DEFAULT 0,
    price DECIMAL(10, 2) DEFAULT 0,
    duration VARCHAR(50),
    status ENUM('active', 'cancelled', 'completed', 'upcoming', 'ongoing') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artisan (artisan_id),
    INDEX idx_date (workshop_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Map Places Table
CREATE TABLE IF NOT EXISTS map_places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('attraction', 'restaurant', 'hotel', 'shop', 'service', 'heritage', 'nature') NOT NULL DEFAULT 'attraction',
    type VARCHAR(100),
    latitude DECIMAL(10, 8) NOT NULL DEFAULT 0,
    longitude DECIMAL(11, 8) NOT NULL DEFAULT 0,
    address VARCHAR(500),
    contact VARCHAR(100),
    opening_hours VARCHAR(255),
    entrance_fee DECIMAL(10, 2) DEFAULT 0,
    price_range VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0,
    image_url VARCHAR(500),
    amenities JSON,
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tourist Routes Table
CREATE TABLE IF NOT EXISTS tourist_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    distance VARCHAR(50),
    difficulty ENUM('easy', 'moderate', 'challenging') DEFAULT 'easy',
    category VARCHAR(100),
    waypoints JSON,
    image_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Event RSVPs Table (with user_id column)
CREATE TABLE IF NOT EXISTS event_rsvps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    guests INT DEFAULT 1,
    status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event (event_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- If event_rsvps exists but missing user_id, add it
-- Run this separately if needed:
-- ALTER TABLE event_rsvps ADD COLUMN user_id INT AFTER event_id;
-- ALTER TABLE event_rsvps ADD INDEX idx_user (user_id);

-- Insert sample map places
INSERT IGNORE INTO map_places (id, name, description, category, latitude, longitude, address, rating, status) VALUES
(1, 'Gloria Heritage Museum', 'A museum showcasing the rich cultural heritage of Gloria', 'attraction', 12.9833, 121.4667, 'Gloria Town Center', 4.5, 'active'),
(2, 'Mangyan Village', 'Experience the indigenous Mangyan culture', 'attraction', 12.9750, 121.4500, 'Barangay Malamig', 4.8, 'active'),
(3, 'Tamaraw Falls', 'Beautiful waterfalls perfect for swimming', 'nature', 12.9600, 121.4800, 'Puerto Galera Road', 4.7, 'active'),
(4, 'White Beach Gloria', 'Pristine white sand beach', 'nature', 12.9900, 121.4900, 'Coastal Area', 4.6, 'active'),
(5, 'Local Eatery', 'Traditional Filipino cuisine', 'restaurant', 12.9830, 121.4660, 'Town Proper', 4.3, 'active');

-- Insert sample tourist routes
INSERT IGNORE INTO tourist_routes (id, name, description, duration, difficulty, category) VALUES
(1, 'Cultural Heritage Trail', 'Explore the rich cultural heritage of Gloria', '4-5 hours', 'easy', 'cultural'),
(2, 'Beach & Nature Adventure', 'A day of sun, sand, and natural wonders', '6-7 hours', 'moderate', 'nature'),
(3, 'Food & Market Tour', 'Taste the flavors of Gloria', '3-4 hours', 'easy', 'food');
