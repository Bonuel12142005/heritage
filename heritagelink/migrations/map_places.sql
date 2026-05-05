-- Map Places Table for GIS-Based Map System
-- Stores attractions, restaurants, hotels, shops, and services

CREATE TABLE IF NOT EXISTS map_places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('attraction', 'restaurant', 'hotel', 'shop', 'service') NOT NULL,
    type VARCHAR(100) COMMENT 'Specific type like museum, seafood, resort, etc.',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500),
    contact VARCHAR(100),
    opening_hours VARCHAR(255),
    entrance_fee DECIMAL(10, 2) DEFAULT 0,
    price_range VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0,
    image_url VARCHAR(500),
    amenities JSON COMMENT 'Array of amenities like parking, wifi, etc.',
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tourist Routes Table
CREATE TABLE IF NOT EXISTS tourist_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    distance VARCHAR(50),
    difficulty ENUM('easy', 'moderate', 'challenging') DEFAULT 'easy',
    category VARCHAR(100),
    waypoints JSON COMMENT 'Array of {place_id, order, note}',
    image_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample routes
INSERT INTO tourist_routes (name, description, duration, distance, difficulty, category, waypoints) VALUES
('Cultural Heritage Trail', 'Explore the rich cultural heritage of Gloria through museums, ancestral houses, and the Mangyan village.', '4-5 hours', '8 km', 'easy', 'cultural', '[{"place_id": 9, "order": 1, "note": "Start at Tourism Office"}, {"place_id": 1, "order": 2, "note": "Visit Heritage Museum"}, {"place_id": 11, "order": 3, "note": "Shop for souvenirs"}, {"place_id": 2, "order": 4, "note": "Experience Mangyan culture"}]'),
('Beach & Nature Adventure', 'A day of sun, sand, and natural wonders. Visit waterfalls and beaches.', '6-7 hours', '15 km', 'moderate', 'nature', '[{"place_id": 9, "order": 1, "note": "Get directions"}, {"place_id": 3, "order": 2, "note": "Morning swim at waterfalls"}, {"place_id": 6, "order": 3, "note": "Lunch at Seaside Grill"}, {"place_id": 4, "order": 4, "note": "Afternoon at beach"}]'),
('Food & Market Tour', 'Taste the flavors of Gloria! Visit local markets and restaurants.', '3-4 hours', '3 km', 'easy', 'food', '[{"place_id": 12, "order": 1, "note": "Early morning market"}, {"place_id": 5, "order": 2, "note": "Breakfast"}, {"place_id": 11, "order": 3, "note": "Buy local delicacies"}, {"place_id": 6, "order": 4, "note": "Seafood lunch"}]');
