-- Heritage Gallery and Multimedia Archive Table
-- Stores cultural assets: photos, videos, oral histories, and historical documents

CREATE TABLE IF NOT EXISTS heritage_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('traditional_crafts', 'festivals', 'oral_history', 'historical_photos', 
                  'traditional_music', 'dance', 'cuisine', 'architecture', 
                  'clothing', 'rituals', 'documents', 'other') DEFAULT 'other',
    media_type ENUM('photo', 'video', 'audio', 'document') NOT NULL,
    media_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    contributor_name VARCHAR(255),
    source VARCHAR(255) COMMENT 'Original source or collection name',
    historical_date VARCHAR(100) COMMENT 'Approximate date or era (e.g., "1950s", "Pre-colonial")',
    location VARCHAR(255) COMMENT 'Location where item was captured or originated',
    tags VARCHAR(500) COMMENT 'Comma-separated tags for search',
    transcript TEXT COMMENT 'Transcript for audio/video oral histories',
    duration VARCHAR(20) COMMENT 'Duration for audio/video (e.g., "5:30")',
    file_size VARCHAR(50) COMMENT 'File size for reference',
    view_count INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived', 'deleted') DEFAULT 'published',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_media_type (media_type),
    INDEX idx_status (status),
    FULLTEXT INDEX idx_search (title, description, tags)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample heritage items
INSERT INTO heritage_gallery (title, description, category, media_type, media_url, thumbnail_url, contributor_name, source, historical_date, location, tags, status) VALUES
('Traditional Mangyan Weaving', 'A demonstration of the ancient Mangyan weaving technique passed down through generations. This intricate craft produces beautiful textiles with symbolic patterns.', 'traditional_crafts', 'photo', '/uploads/heritage/mangyan-weaving.jpg', '/uploads/heritage/thumbs/mangyan-weaving.jpg', 'Maria Santos', 'Gloria Cultural Center', '1980s', 'Gloria, Oriental Mindoro', 'mangyan,weaving,textile,traditional,craft', 'published'),
('Moriones Festival 1975', 'Historical photograph of the Moriones Festival celebration in Gloria. Participants wear colorful Roman soldier costumes during Holy Week.', 'festivals', 'photo', '/uploads/heritage/moriones-1975.jpg', '/uploads/heritage/thumbs/moriones-1975.jpg', 'Jose Reyes Archive', 'Municipal Archives', '1975', 'Gloria Town Plaza', 'moriones,festival,holy week,tradition,costume', 'published'),
('Elder Juan''s Story of Gloria', 'Oral history recording of Elder Juan Dela Cruz sharing stories about Gloria during the Japanese occupation and the town''s recovery.', 'oral_history', 'audio', '/uploads/heritage/elder-juan-story.mp3', '/uploads/heritage/thumbs/oral-history-default.jpg', 'Elder Juan Dela Cruz', 'Oral History Project 2020', '2020', 'Barangay Agsalin', 'oral history,world war 2,japanese occupation,elder,memory', 'published'),
('Traditional Fishing Methods', 'Video documentation of traditional fishing methods still practiced by local fishermen in Gloria''s coastal barangays.', 'traditional_crafts', 'video', '/uploads/heritage/traditional-fishing.mp4', '/uploads/heritage/thumbs/traditional-fishing.jpg', 'Cultural Documentation Team', 'HeritageLink Project', '2023', 'Coastal Gloria', 'fishing,traditional,livelihood,sea,coastal', 'published'),
('Gloria Municipal Charter 1950', 'Scanned copy of the original municipal charter establishing Gloria as an independent municipality.', 'documents', 'document', '/uploads/heritage/gloria-charter-1950.pdf', '/uploads/heritage/thumbs/document-default.jpg', 'Municipal Archives', 'Official Records', '1950', 'Gloria Municipal Hall', 'charter,document,history,official,municipality', 'published'),
('Pandanggo sa Ilaw Performance', 'Traditional Pandanggo sa Ilaw dance performed during the town fiesta, featuring dancers balancing oil lamps.', 'dance', 'video', '/uploads/heritage/pandanggo-sa-ilaw.mp4', '/uploads/heritage/thumbs/pandanggo.jpg', 'Gloria Cultural Troupe', 'Fiesta 2019', '2019', 'Gloria Town Plaza', 'dance,pandanggo,traditional,fiesta,performance', 'published'),
('Ancestral House of the Mendoza Family', 'One of the oldest surviving ancestral houses in Gloria, built in the Spanish colonial period with traditional Filipino-Spanish architecture.', 'architecture', 'photo', '/uploads/heritage/mendoza-house.jpg', '/uploads/heritage/thumbs/mendoza-house.jpg', 'Heritage Survey Team', 'Architectural Heritage Survey', '1890s (built)', 'Poblacion, Gloria', 'architecture,ancestral house,spanish colonial,heritage,building', 'published'),
('Traditional Suman Recipe', 'Documentation of the traditional suman-making process, a rice cake delicacy wrapped in banana leaves.', 'cuisine', 'photo', '/uploads/heritage/suman-making.jpg', '/uploads/heritage/thumbs/suman-making.jpg', 'Lola Rosario', 'Culinary Heritage Project', '2022', 'Barangay Buong Lupa', 'suman,food,cuisine,traditional,recipe,rice cake', 'published');
