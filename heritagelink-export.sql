-- HeritageLink Database Export
-- Exported on 2026-05-05T14:25:42.908Z

SET FOREIGN_KEY_CHECKS=0;

-- Table: artisan_products
DROP TABLE IF EXISTS `artisan_products`;
CREATE TABLE `artisan_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artisan_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT '0.00',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `price_range` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table artisan_products
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (1, 2, 'Traditional Mangyan Basket', 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.', '850.00', 'Handicrafts', 15, 'active', NULL, NULL, '2026-05-05 09:20:57');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (2, 2, 'Baybayin Script Artwork', 'Beautiful artwork featuring the ancient Filipino Baybayin script.', '1200.00', 'Art', 8, 'active', NULL, NULL, '2026-05-05 09:20:57');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (3, 2, 'Woven Textile Bag', 'Colorful bag made from traditional woven textiles with modern design.', '650.00', 'Fashion', 20, 'active', NULL, NULL, '2026-05-05 09:20:57');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (4, 2, 'Bamboo Wind Chimes', 'Handcrafted wind chimes made from local bamboo with soothing sounds.', '450.00', 'Home Decor', 12, 'active', NULL, NULL, '2026-05-05 09:20:57');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (5, 2, 'Traditional Jewelry Set', 'Authentic Mangyan jewelry set made with natural materials and beads.', '980.00', 'Jewelry', 6, 'active', NULL, NULL, '2026-05-05 09:20:57');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (6, 2, 'Traditional Mangyan Basket', 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.', '850.00', 'Handicrafts', 15, 'active', NULL, NULL, '2026-05-05 09:21:38');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (7, 2, 'Baybayin Script Artwork', 'Beautiful artwork featuring the ancient Filipino Baybayin script.', '1200.00', 'Art', 8, 'active', NULL, NULL, '2026-05-05 09:21:38');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (8, 2, 'Woven Textile Bag', 'Colorful bag made from traditional woven textiles with modern design.', '650.00', 'Fashion', 20, 'active', NULL, NULL, '2026-05-05 09:21:38');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (9, 2, 'Bamboo Wind Chimes', 'Handcrafted wind chimes made from local bamboo with soothing sounds.', '450.00', 'Home Decor', 12, 'active', NULL, NULL, '2026-05-05 09:21:38');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (10, 2, 'Traditional Jewelry Set', 'Authentic Mangyan jewelry set made with natural materials and beads.', '980.00', 'Jewelry', 6, 'active', NULL, NULL, '2026-05-05 09:21:38');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (11, 2, 'Traditional Mangyan Basket', 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.', '850.00', 'Handicrafts', 15, 'active', NULL, NULL, '2026-05-05 09:29:33');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (12, 2, 'Baybayin Script Artwork', 'Beautiful artwork featuring the ancient Filipino Baybayin script.', '1200.00', 'Art', 8, 'active', NULL, NULL, '2026-05-05 09:29:33');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (13, 2, 'Woven Textile Bag', 'Colorful bag made from traditional woven textiles with modern design.', '650.00', 'Fashion', 20, 'active', NULL, NULL, '2026-05-05 09:29:33');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (14, 2, 'Bamboo Wind Chimes', 'Handcrafted wind chimes made from local bamboo with soothing sounds.', '450.00', 'Home Decor', 12, 'active', NULL, NULL, '2026-05-05 09:29:33');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (15, 2, 'Traditional Jewelry Set', 'Authentic Mangyan jewelry set made with natural materials and beads.', '980.00', 'Jewelry', 6, 'active', NULL, NULL, '2026-05-05 09:29:33');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (16, 2, 'Traditional Mangyan Basket', 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.', '850.00', 'Handicrafts', 15, 'active', NULL, NULL, '2026-05-05 09:30:19');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (17, 2, 'Baybayin Script Artwork', 'Beautiful artwork featuring the ancient Filipino Baybayin script.', '1200.00', 'Art', 8, 'active', NULL, NULL, '2026-05-05 09:30:19');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (18, 2, 'Woven Textile Bag', 'Colorful bag made from traditional woven textiles with modern design.', '650.00', 'Fashion', 20, 'active', NULL, NULL, '2026-05-05 09:30:19');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (19, 2, 'Bamboo Wind Chimes', 'Handcrafted wind chimes made from local bamboo with soothing sounds.', '450.00', 'Home Decor', 12, 'active', NULL, NULL, '2026-05-05 09:30:19');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (20, 2, 'Traditional Jewelry Set', 'Authentic Mangyan jewelry set made with natural materials and beads.', '980.00', 'Jewelry', 6, 'active', NULL, NULL, '2026-05-05 09:30:19');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (21, 2, 'Traditional Mangyan Basket', 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.', '850.00', 'Handicrafts', 15, 'active', NULL, NULL, '2026-05-05 09:31:06');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (22, 2, 'Baybayin Script Artwork', 'Beautiful artwork featuring the ancient Filipino Baybayin script.', '1200.00', 'Art', 8, 'active', NULL, NULL, '2026-05-05 09:31:06');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (23, 2, 'Woven Textile Bag', 'Colorful bag made from traditional woven textiles with modern design.', '650.00', 'Fashion', 20, 'active', NULL, NULL, '2026-05-05 09:31:06');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (24, 2, 'Bamboo Wind Chimes', 'Handcrafted wind chimes made from local bamboo with soothing sounds.', '450.00', 'Home Decor', 12, 'active', NULL, NULL, '2026-05-05 09:31:06');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (25, 2, 'Traditional Jewelry Set', 'Authentic Mangyan jewelry set made with natural materials and beads.', '980.00', 'Jewelry', 6, 'active', NULL, NULL, '2026-05-05 09:31:06');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (26, 2, 'Traditional Mangyan Basket', 'Handwoven basket made from indigenous materials using traditional Mangyan techniques.', '850.00', 'Handicrafts', 15, 'active', NULL, NULL, '2026-05-05 09:31:47');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (27, 2, 'Baybayin Script Artwork', 'Beautiful artwork featuring the ancient Filipino Baybayin script.', '1200.00', 'Art', 8, 'active', NULL, NULL, '2026-05-05 09:31:47');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (28, 2, 'Woven Textile Bag', 'Colorful bag made from traditional woven textiles with modern design.', '650.00', 'Fashion', 20, 'active', NULL, NULL, '2026-05-05 09:31:47');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (29, 2, 'Bamboo Wind Chimes', 'Handcrafted wind chimes made from local bamboo with soothing sounds.', '450.00', 'Home Decor', 12, 'active', NULL, NULL, '2026-05-05 09:31:47');
INSERT INTO `artisan_products` (`id`, `artisan_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `status`, `price_range`, `external_link`, `created_at`) VALUES (30, 2, 'Traditional Jewelry Set', 'Authentic Mangyan jewelry set made with natural materials and beads.', '980.00', 'Jewelry', 6, 'active', NULL, NULL, '2026-05-05 09:31:47');

-- Table: artisans
DROP TABLE IF EXISTS `artisans`;
CREATE TABLE `artisans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `specialty` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `story` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: destination_images
DROP TABLE IF EXISTS `destination_images`;
CREATE TABLE `destination_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination_id` int NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table destination_images
INSERT INTO `destination_images` (`id`, `destination_id`, `url`, `caption`, `is_primary`, `created_at`) VALUES (1, 11, '/uploads/destinations/dest-1773817990761-277631623.png', NULL, 1, '2026-03-18 07:13:10');

-- Table: destinations
DROP TABLE IF EXISTS `destinations`;
CREATE TABLE `destinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `site_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entrance_fee` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `average_rating` decimal(3,2) DEFAULT NULL,
  `status` enum('active','inactive','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `historical_background` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Cultural',
  `opening_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visitor_guidelines` text COLLATE utf8mb4_unicode_ci,
  `created_by` int DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`featured`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table destinations
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (1, 'Mount Halcon', 'One of the highest peaks in the Philippines, offering breathtaking views and challenging hiking trails through pristine forests.', 'natural', 'Gloria, Oriental Mindoro', 'Gloria', '0.00', NULL, NULL, 1, '4.80', 'deleted', '2026-03-17 08:03:19', '2026-04-01 12:58:33', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (2, 'Tamaraw Falls', 'A stunning waterfall surrounded by lush vegetation, perfect for swimming and nature photography.', 'natural', 'Gloria, Oriental Mindoro', 'Gloria', '0.00', NULL, NULL, 1, '4.70', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (3, 'Gloria Beach', 'Beautiful white sand beach with crystal clear waters, ideal for swimming, diving, and water sports.', 'beach', 'Gloria, Oriental Mindoro', 'Gloria', '0.00', NULL, NULL, 0, '4.60', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (4, 'Heritage Museum', 'Museum showcasing the rich cultural heritage and history of Gloria and Oriental Mindoro.', 'museum', 'Gloria Town Center', 'Gloria', '50.00', NULL, NULL, 0, '4.50', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (5, 'Local Market', 'Traditional market where you can find local crafts, produce, and authentic Gloria products.', 'cultural', 'Gloria Market District', 'Gloria', '0.00', NULL, NULL, 0, '4.30', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (6, 'Mount Halcon', 'One of the highest peaks in the Philippines, offering breathtaking views and challenging hiking trails through pristine forests.', 'natural', 'Gloria, Oriental Mindoro', 'Gloria', '0.00', NULL, NULL, 1, '4.80', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (7, 'Tamaraw Falls', 'A stunning waterfall surrounded by lush vegetation, perfect for swimming and nature photography.', 'natural', 'Gloria, Oriental Mindoro', 'Gloria', '0.00', NULL, NULL, 1, '4.70', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (8, 'Gloria Beach', 'Beautiful white sand beach with crystal clear waters, ideal for swimming, diving, and water sports.', 'beach', 'Gloria, Oriental Mindoro', 'Gloria', '0.00', NULL, NULL, 0, '4.60', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (9, 'Heritage Museum', 'Museum showcasing the rich cultural heritage and history of Gloria and Oriental Mindoro.', 'museum', 'Gloria Town Center', 'Gloria', '50.00', NULL, NULL, 0, '4.50', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (10, 'Local Market', 'Traditional market where you can find local crafts, produce, and authentic Gloria products.', 'cultural', 'Gloria Market District', 'Gloria', '0.00', NULL, NULL, 0, '4.30', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, 'Cultural', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (11, 'john doe', 'fdfsdfsfdsf', 'Park', NULL, 'Paraiso, Little Tondo, Pinamalayan, Gloria, Oriental Mindoro', '0.00', NULL, NULL, 0, NULL, 'active', '2026-03-18 07:13:10', '2026-03-18 07:13:10', NULL, 'Park', NULL, '09987654321', NULL, 1, '13.03131089', '121.48115158');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (12, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:17:55', '2026-05-05 09:17:55', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (13, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:17:55', '2026-05-05 09:17:55', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (14, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:17:55', '2026-05-05 09:17:55', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (15, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:17:55', '2026-05-05 09:17:55', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (16, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:17:55', '2026-05-05 09:17:55', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (17, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:18:54', '2026-05-05 09:18:54', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (18, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:18:54', '2026-05-05 09:18:54', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (19, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:18:54', '2026-05-05 09:18:54', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (20, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:18:54', '2026-05-05 09:18:54', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (21, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:18:54', '2026-05-05 09:18:54', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (22, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:16', '2026-05-05 09:20:16', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (23, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:16', '2026-05-05 09:20:16', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (24, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:16', '2026-05-05 09:20:16', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (25, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:16', '2026-05-05 09:20:16', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (26, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:16', '2026-05-05 09:20:16', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (27, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:57', '2026-05-05 09:20:57', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (28, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:57', '2026-05-05 09:20:57', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (29, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:57', '2026-05-05 09:20:57', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (30, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:57', '2026-05-05 09:20:57', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (31, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:20:57', '2026-05-05 09:20:57', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (32, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (33, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (34, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (35, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (36, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (37, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (38, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (39, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (40, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (41, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (42, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (43, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (44, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (45, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (46, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (47, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (48, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (49, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (50, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (51, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (52, 'Mangyan Heritage Center', 'Learn about the indigenous Mangyan culture and their traditional way of life.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, 'Cultural Heritage', NULL, NULL, NULL, NULL, '12.97840000', '121.47370000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (53, 'Mount Halcon', 'The highest peak in Oriental Mindoro, perfect for hiking and nature lovers.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '12.95000000', '121.40000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (54, 'Tamaraw Falls', 'A beautiful waterfall surrounded by lush tropical vegetation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, 'Natural Wonder', NULL, NULL, NULL, NULL, '13.50000000', '120.95000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (55, 'White Beach', 'Pristine white sand beach perfect for swimming and relaxation.', NULL, NULL, 'Puerto Galera, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, 'Beach', NULL, NULL, NULL, NULL, '13.52000000', '120.96000000');
INSERT INTO `destinations` (`id`, `name`, `description`, `site_type`, `address`, `location`, `entrance_fee`, `image_url`, `photo`, `featured`, `average_rating`, `status`, `created_at`, `updated_at`, `historical_background`, `category`, `opening_hours`, `contact_info`, `visitor_guidelines`, `created_by`, `latitude`, `longitude`) VALUES (56, 'Tribal Village Experience', 'Visit authentic Mangyan villages and experience their traditional lifestyle.', NULL, NULL, 'Gloria, Oriental Mindoro', NULL, NULL, NULL, 0, NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, 'Cultural Experience', NULL, NULL, NULL, NULL, '12.96000000', '121.46000000');

-- Table: event_images
DROP TABLE IF EXISTS `event_images`;
CREATE TABLE `event_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caption` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event` (`event_id`),
  CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: event_rsvps
DROP TABLE IF EXISTS `event_rsvps`;
CREATE TABLE `event_rsvps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guests` int DEFAULT '1',
  `status` enum('confirmed','pending','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event` (`event_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `event_rsvps_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: events
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_date` date DEFAULT NULL,
  `event_time` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','cancelled','completed','upcoming') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `contact_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_price` decimal(10,2) DEFAULT '0.00',
  `max_attendees` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_date` (`event_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table events
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (1, 'Gloria Heritage Festival', 'Annual celebration of Gloria heritage and culture', '2026-04-14 16:00:00', '09:00 AM', 'Gloria Town Center', NULL, 'Gloria Tourism Board', 'active', '2026-03-17 08:41:57', '2026-03-17 08:41:57', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (2, 'Artisan Craft Workshop', 'Learn traditional crafts from local artisans', '2026-03-24 16:00:00', '02:00 PM', 'Community Hall', NULL, 'Local Artisans Association', 'active', '2026-03-17 08:41:57', '2026-03-17 08:41:57', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (3, 'Beach Cleanup Drive', 'Community effort to keep our beaches clean', '2026-03-19 16:00:00', '08:00 AM', 'White Beach Gloria', NULL, 'Environmental Group', 'active', '2026-03-17 08:41:57', '2026-03-17 08:41:57', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (4, 'Food Festival', 'Taste traditional and modern Gloria cuisine', '2026-03-31 16:00:00', '11:00 AM', 'Market Square', NULL, 'Gloria Food Association', 'active', '2026-03-17 08:41:57', '2026-03-17 08:41:57', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (5, 'Cultural Dance Performance', 'Traditional dance performances by local groups', '2026-03-27 16:00:00', '06:00 PM', 'Gloria Amphitheater', NULL, 'Cultural Center', 'active', '2026-03-17 08:41:57', '2026-03-17 08:41:57', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (6, 'qwerty', 'ssfdghgfdgfg', '2026-03-17 16:00:00', '14:55', 'Papandayan, Gloria, Oriental Mindoro', NULL, 'adasdsadsaddsads', 'active', '2026-03-18 06:55:27', '2026-03-18 06:55:27', 1, NULL, '123.00', 100, 1, '/uploads/events/event-1773816927304-487773108.png', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (7, 'Mangyan Cultural Festival', 'Annual celebration of Mangyan culture with traditional dances, music, and crafts.', '2024-12-14 16:00:00', '09:00:00', 'Gloria Town Plaza', 'Cultural Festival', NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (8, 'Traditional Weaving Workshop', 'Learn the art of traditional Mangyan weaving from master artisans.', '2024-11-19 16:00:00', '14:00:00', 'Mangyan Heritage Center', 'Workshop', NULL, 'active', '2026-05-05 09:21:38', '2026-05-05 09:21:38', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (9, 'Mangyan Cultural Festival', 'Annual celebration of Mangyan culture with traditional dances, music, and crafts.', '2024-12-14 16:00:00', '09:00:00', 'Gloria Town Plaza', 'Cultural Festival', NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (10, 'Traditional Weaving Workshop', 'Learn the art of traditional Mangyan weaving from master artisans.', '2024-11-19 16:00:00', '14:00:00', 'Mangyan Heritage Center', 'Workshop', NULL, 'active', '2026-05-05 09:29:33', '2026-05-05 09:29:33', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (11, 'Mangyan Cultural Festival', 'Annual celebration of Mangyan culture with traditional dances, music, and crafts.', '2024-12-14 16:00:00', '09:00:00', 'Gloria Town Plaza', 'Cultural Festival', NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (12, 'Traditional Weaving Workshop', 'Learn the art of traditional Mangyan weaving from master artisans.', '2024-11-19 16:00:00', '14:00:00', 'Mangyan Heritage Center', 'Workshop', NULL, 'active', '2026-05-05 09:30:19', '2026-05-05 09:30:19', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (13, 'Mangyan Cultural Festival', 'Annual celebration of Mangyan culture with traditional dances, music, and crafts.', '2024-12-14 16:00:00', '09:00:00', 'Gloria Town Plaza', 'Cultural Festival', NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (14, 'Traditional Weaving Workshop', 'Learn the art of traditional Mangyan weaving from master artisans.', '2024-11-19 16:00:00', '14:00:00', 'Mangyan Heritage Center', 'Workshop', NULL, 'active', '2026-05-05 09:31:06', '2026-05-05 09:31:06', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (15, 'Mangyan Cultural Festival', 'Annual celebration of Mangyan culture with traditional dances, music, and crafts.', '2024-12-14 16:00:00', '09:00:00', 'Gloria Town Plaza', 'Cultural Festival', NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `event_time`, `location`, `category`, `organizer`, `status`, `created_at`, `updated_at`, `created_by`, `contact_info`, `ticket_price`, `max_attendees`, `is_active`, `image_url`, `start_time`, `end_time`, `event_type`, `featured_image`, `latitude`, `longitude`) VALUES (16, 'Traditional Weaving Workshop', 'Learn the art of traditional Mangyan weaving from master artisans.', '2024-11-19 16:00:00', '14:00:00', 'Mangyan Heritage Center', 'Workshop', NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47', NULL, NULL, '0.00', 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Table: favorites
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `destination_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_favorites_user` (`user_id`),
  KEY `idx_favorites_destination` (`destination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: feedback
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `is_anonymous` tinyint(1) DEFAULT '0',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_response` text COLLATE utf8mb4_unicode_ci,
  `responded_by` int DEFAULT NULL,
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: heritage_gallery
DROP TABLE IF EXISTS `heritage_gallery`;
CREATE TABLE `heritage_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `historical_date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contributor_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transcript` longtext COLLATE utf8mb4_unicode_ci,
  `tags` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metadata` text COLLATE utf8mb4_unicode_ci,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_media_type` (`media_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table heritage_gallery
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (1, 'Traditional Weaving', 'Local artisans demonstrating traditional weaving techniques passed down through generations.', 'traditional_crafts', 'photo', NULL, NULL, '2024', 'Gloria', 'Local Community', NULL, NULL, 'weaving,craft,tradition', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (2, 'Fiesta Celebration', 'Annual fiesta celebration featuring traditional dances, music, and cultural performances.', 'festivals', 'video', NULL, NULL, '2024', 'Gloria Town Center', 'Tourism Office', NULL, NULL, 'festival,celebration,culture', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (3, 'Oral History Interview', 'Interview with elder community members sharing stories and traditions of Gloria.', 'oral_history', 'audio', NULL, NULL, '2024', 'Gloria', 'Heritage Project', NULL, NULL, 'history,oral,tradition', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (4, 'Historical Architecture', 'Photos of historic buildings and structures in Gloria showing colonial and traditional design.', 'architecture', 'photo', NULL, NULL, '1950s-Present', 'Gloria', 'Local Historian', NULL, NULL, 'architecture,history,building', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (5, 'Traditional Cuisine', 'Documentation of traditional Gloria dishes and cooking methods.', 'cuisine', 'photo', NULL, NULL, '2024', 'Gloria', 'Culinary Expert', NULL, NULL, 'food,cuisine,tradition', 'active', '2026-03-17 08:03:19', '2026-03-17 08:03:19', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (6, 'Traditional Mangyan Weaving', 'A demonstration of the ancient Mangyan weaving technique passed down through generations. This intricate craft produces beautiful textiles with symbolic patterns.', 'traditional_crafts', 'photo', '/uploads/heritage/mangyan-weaving.jpg', '/uploads/heritage/thumbs/mangyan-weaving.jpg', '1980s', 'Gloria, Oriental Mindoro', 'Maria Santos', 'Gloria Cultural Center', NULL, 'mangyan,weaving,textile,traditional,craft', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (7, 'Moriones Festival 1975', 'Historical photograph of the Moriones Festival celebration in Gloria. Participants wear colorful Roman soldier costumes during Holy Week.', 'festivals', 'photo', '/uploads/heritage/moriones-1975.jpg', '/uploads/heritage/thumbs/moriones-1975.jpg', '1975', 'Gloria Town Plaza', 'Jose Reyes Archive', 'Municipal Archives', NULL, 'moriones,festival,holy week,tradition,costume', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (8, 'Elder Juan''s Story of Gloria', 'Oral history recording of Elder Juan Dela Cruz sharing stories about Gloria during the Japanese occupation and the town''s recovery.', 'oral_history', 'audio', '/uploads/heritage/elder-juan-story.mp3', '/uploads/heritage/thumbs/oral-history-default.jpg', '2020', 'Barangay Agsalin', 'Elder Juan Dela Cruz', 'Oral History Project 2020', NULL, 'oral history,world war 2,japanese occupation,elder,memory', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (9, 'Traditional Fishing Methods', 'Video documentation of traditional fishing methods still practiced by local fishermen in Gloria''s coastal barangays.', 'traditional_crafts', 'video', '/uploads/heritage/traditional-fishing.mp4', '/uploads/heritage/thumbs/traditional-fishing.jpg', '2023', 'Coastal Gloria', 'Cultural Documentation Team', 'HeritageLink Project', NULL, 'fishing,traditional,livelihood,sea,coastal', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (10, 'Gloria Municipal Charter 1950', 'Scanned copy of the original municipal charter establishing Gloria as an independent municipality.', 'documents', 'document', '/uploads/heritage/gloria-charter-1950.pdf', '/uploads/heritage/thumbs/document-default.jpg', '1950', 'Gloria Municipal Hall', 'Municipal Archives', 'Official Records', NULL, 'charter,document,history,official,municipality', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (11, 'Pandanggo sa Ilaw Performance', 'Traditional Pandanggo sa Ilaw dance performed during the town fiesta, featuring dancers balancing oil lamps.', 'dance', 'video', '/uploads/heritage/pandanggo-sa-ilaw.mp4', '/uploads/heritage/thumbs/pandanggo.jpg', '2019', 'Gloria Town Plaza', 'Gloria Cultural Troupe', 'Fiesta 2019', NULL, 'dance,pandanggo,traditional,fiesta,performance', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (12, 'Ancestral House of the Mendoza Family', 'One of the oldest surviving ancestral houses in Gloria, built in the Spanish colonial period with traditional Filipino-Spanish architecture.', 'architecture', 'photo', '/uploads/heritage/mendoza-house.jpg', '/uploads/heritage/thumbs/mendoza-house.jpg', '1890s (built)', 'Poblacion, Gloria', 'Heritage Survey Team', 'Architectural Heritage Survey', NULL, 'architecture,ancestral house,spanish colonial,heritage,building', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (13, 'Traditional Suman Recipe', 'Documentation of the traditional suman-making process, a rice cake delicacy wrapped in banana leaves.', 'cuisine', 'photo', '/uploads/heritage/suman-making.jpg', '/uploads/heritage/thumbs/suman-making.jpg', '2022', 'Barangay Buong Lupa', 'Lola Rosario', 'Culinary Heritage Project', NULL, 'suman,food,cuisine,traditional,recipe,rice cake', 'published', '2026-03-17 08:05:00', '2026-03-17 08:05:00', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (14, 'Traditional Weaving', 'Local artisans demonstrating traditional weaving techniques passed down through generations.', 'traditional_crafts', 'photo', NULL, NULL, '2024', 'Gloria', 'Local Community', NULL, NULL, 'weaving,craft,tradition', 'inactive', '2026-03-17 08:06:49', '2026-04-01 12:49:39', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (15, 'Fiesta Celebration', 'Annual fiesta celebration featuring traditional dances, music, and cultural performances.', 'festivals', 'video', NULL, NULL, '2024', 'Gloria Town Center', 'Tourism Office', NULL, NULL, 'festival,celebration,culture', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (16, 'Oral History Interview', 'Interview with elder community members sharing stories and traditions of Gloria.', 'oral_history', 'audio', NULL, NULL, '2024', 'Gloria', 'Heritage Project', NULL, NULL, 'history,oral,tradition', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (17, 'Historical Architecture', 'Photos of historic buildings and structures in Gloria showing colonial and traditional design.', 'architecture', 'photo', NULL, NULL, '1950s-Present', 'Gloria', 'Local Historian', NULL, NULL, 'architecture,history,building', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (18, 'Traditional Cuisine', 'Documentation of traditional Gloria dishes and cooking methods.', 'cuisine', 'photo', NULL, NULL, '2024', 'Gloria', 'Culinary Expert', NULL, NULL, 'food,cuisine,tradition', 'active', '2026-03-17 08:06:49', '2026-03-17 08:06:49', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (19, 'sdsdssddasd', 'sdsadasdsadsads', 'rituals', 'image', NULL, '/uploads/heritage/media_file-1773817936384-441864545.png', NULL, NULL, NULL, NULL, NULL, NULL, 'inactive', '2026-03-18 07:12:16', '2026-04-01 12:49:36', '{"contributor":"ssaddsad","source":"sdsads","historical_date":"sffdsfdsfd","location":"labasan","tags":"dsadsadsa","duration":"","transcript":"","view_count":0}', '/uploads/heritage/media_file-1773817936384-441864545.png', 1);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (20, 'Traditional Mangyan Weaving', 'A demonstration of the ancient Mangyan weaving technique passed down through generations. This intricate craft produces beautiful textiles with symbolic patterns.', 'traditional_crafts', 'photo', '/uploads/heritage/mangyan-weaving.jpg', '/uploads/heritage/thumbs/mangyan-weaving.jpg', '1980s', 'Gloria, Oriental Mindoro', 'Maria Santos', 'Gloria Cultural Center', NULL, 'mangyan,weaving,textile,traditional,craft', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (21, 'Moriones Festival 1975', 'Historical photograph of the Moriones Festival celebration in Gloria. Participants wear colorful Roman soldier costumes during Holy Week.', 'festivals', 'photo', '/uploads/heritage/moriones-1975.jpg', '/uploads/heritage/thumbs/moriones-1975.jpg', '1975', 'Gloria Town Plaza', 'Jose Reyes Archive', 'Municipal Archives', NULL, 'moriones,festival,holy week,tradition,costume', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (22, 'Elder Juan''s Story of Gloria', 'Oral history recording of Elder Juan Dela Cruz sharing stories about Gloria during the Japanese occupation and the town''s recovery.', 'oral_history', 'audio', '/uploads/heritage/elder-juan-story.mp3', '/uploads/heritage/thumbs/oral-history-default.jpg', '2020', 'Barangay Agsalin', 'Elder Juan Dela Cruz', 'Oral History Project 2020', NULL, 'oral history,world war 2,japanese occupation,elder,memory', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (23, 'Traditional Fishing Methods', 'Video documentation of traditional fishing methods still practiced by local fishermen in Gloria''s coastal barangays.', 'traditional_crafts', 'video', '/uploads/heritage/traditional-fishing.mp4', '/uploads/heritage/thumbs/traditional-fishing.jpg', '2023', 'Coastal Gloria', 'Cultural Documentation Team', 'HeritageLink Project', NULL, 'fishing,traditional,livelihood,sea,coastal', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (24, 'Gloria Municipal Charter 1950', 'Scanned copy of the original municipal charter establishing Gloria as an independent municipality.', 'documents', 'document', '/uploads/heritage/gloria-charter-1950.pdf', '/uploads/heritage/thumbs/document-default.jpg', '1950', 'Gloria Municipal Hall', 'Municipal Archives', 'Official Records', NULL, 'charter,document,history,official,municipality', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (25, 'Pandanggo sa Ilaw Performance', 'Traditional Pandanggo sa Ilaw dance performed during the town fiesta, featuring dancers balancing oil lamps.', 'dance', 'video', '/uploads/heritage/pandanggo-sa-ilaw.mp4', '/uploads/heritage/thumbs/pandanggo.jpg', '2019', 'Gloria Town Plaza', 'Gloria Cultural Troupe', 'Fiesta 2019', NULL, 'dance,pandanggo,traditional,fiesta,performance', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (26, 'Ancestral House of the Mendoza Family', 'One of the oldest surviving ancestral houses in Gloria, built in the Spanish colonial period with traditional Filipino-Spanish architecture.', 'architecture', 'photo', '/uploads/heritage/mendoza-house.jpg', '/uploads/heritage/thumbs/mendoza-house.jpg', '1890s (built)', 'Poblacion, Gloria', 'Heritage Survey Team', 'Architectural Heritage Survey', NULL, 'architecture,ancestral house,spanish colonial,heritage,building', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);
INSERT INTO `heritage_gallery` (`id`, `title`, `description`, `category`, `media_type`, `media_url`, `thumbnail_url`, `historical_date`, `location`, `contributor_name`, `source`, `transcript`, `tags`, `status`, `created_at`, `updated_at`, `metadata`, `file_url`, `uploaded_by`) VALUES (27, 'Traditional Suman Recipe', 'Documentation of the traditional suman-making process, a rice cake delicacy wrapped in banana leaves.', 'cuisine', 'photo', '/uploads/heritage/suman-making.jpg', '/uploads/heritage/thumbs/suman-making.jpg', '2022', 'Barangay Buong Lupa', 'Lola Rosario', 'Culinary Heritage Project', NULL, 'suman,food,cuisine,traditional,recipe,rice cake', 'published', '2026-03-30 03:46:41', '2026-03-30 03:46:41', NULL, NULL, NULL);

-- Table: heritage_items
DROP TABLE IF EXISTS `heritage_items`;
CREATE TABLE `heritage_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `historical_period` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contributor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table heritage_items
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (1, 'Traditional Mangyan Weaving', 'Ancient weaving techniques passed down through generations of Mangyan artisans.', 'traditional_crafts', 'Pre-colonial', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:06', '2026-05-05 09:31:06');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (2, 'Baybayin Script Collection', 'Historical documents featuring the ancient Filipino Baybayin writing system.', 'historical_documents', '16th Century', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:06', '2026-05-05 09:31:06');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (3, 'Mangyan Folk Songs', 'Traditional songs and chants of the Mangyan people.', 'oral_traditions', 'Traditional', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:06', '2026-05-05 09:31:06');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (4, 'Festival Dance Performance', 'Video recording of traditional Mangyan cultural dance.', 'performing_arts', 'Contemporary', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:06', '2026-05-05 09:31:06');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (5, 'Ancient Pottery Artifacts', 'Pre-colonial pottery discovered in archaeological sites.', 'artifacts', 'Pre-colonial', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:06', '2026-05-05 09:31:06');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (6, 'Traditional Mangyan Weaving', 'Ancient weaving techniques passed down through generations of Mangyan artisans.', 'traditional_crafts', 'Pre-colonial', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:47', '2026-05-05 09:31:47');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (7, 'Baybayin Script Collection', 'Historical documents featuring the ancient Filipino Baybayin writing system.', 'historical_documents', '16th Century', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:47', '2026-05-05 09:31:47');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (8, 'Mangyan Folk Songs', 'Traditional songs and chants of the Mangyan people.', 'oral_traditions', 'Traditional', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:47', '2026-05-05 09:31:47');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (9, 'Festival Dance Performance', 'Video recording of traditional Mangyan cultural dance.', 'performing_arts', 'Contemporary', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:47', '2026-05-05 09:31:47');
INSERT INTO `heritage_items` (`id`, `title`, `description`, `category`, `historical_period`, `media_type`, `media_url`, `thumbnail_url`, `contributor`, `tags`, `status`, `created_by`, `created_at`, `updated_at`) VALUES (10, 'Ancient Pottery Artifacts', 'Pre-colonial pottery discovered in archaeological sites.', 'artifacts', 'Pre-colonial', NULL, NULL, NULL, NULL, NULL, 'active', NULL, '2026-05-05 09:31:47', '2026-05-05 09:31:47');

-- Table: map_places
DROP TABLE IF EXISTS `map_places`;
CREATE TABLE `map_places` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` enum('attraction','restaurant','hotel','shop','service') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Specific type like museum, seafood, resort, etc.',
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opening_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entrance_fee` decimal(10,2) DEFAULT '0.00',
  `price_range` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '0.0',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amenities` json DEFAULT NULL COMMENT 'Array of amenities like parking, wifi, etc.',
  `status` enum('active','inactive','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_location` (`latitude`,`longitude`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table map_places
INSERT INTO `map_places` (`id`, `name`, `description`, `category`, `type`, `latitude`, `longitude`, `address`, `contact`, `opening_hours`, `entrance_fee`, `price_range`, `rating`, `image_url`, `amenities`, `status`, `created_at`, `updated_at`) VALUES (1, 'Gloria Heritage Museum', 'A museum showcasing the rich cultural heritage of Gloria', 'attraction', NULL, '12.98330000', '121.46670000', 'Gloria Town Center', NULL, NULL, '0.00', NULL, '4.5', NULL, NULL, 'deleted', '2026-03-17 08:06:49', '2026-04-01 12:56:28');
INSERT INTO `map_places` (`id`, `name`, `description`, `category`, `type`, `latitude`, `longitude`, `address`, `contact`, `opening_hours`, `entrance_fee`, `price_range`, `rating`, `image_url`, `amenities`, `status`, `created_at`, `updated_at`) VALUES (2, 'Mangyan Village', 'Experience the indigenous Mangyan culture', 'attraction', NULL, '12.97500000', '121.45000000', 'Barangay Malamig', NULL, NULL, '0.00', NULL, '4.8', NULL, NULL, 'deleted', '2026-03-17 08:06:49', '2026-04-01 12:56:21');
INSERT INTO `map_places` (`id`, `name`, `description`, `category`, `type`, `latitude`, `longitude`, `address`, `contact`, `opening_hours`, `entrance_fee`, `price_range`, `rating`, `image_url`, `amenities`, `status`, `created_at`, `updated_at`) VALUES (3, 'Tamaraw Falls', 'Beautiful waterfalls perfect for swimming', '', NULL, '12.96000000', '121.48000000', 'Puerto Galera Road', NULL, NULL, '0.00', NULL, '4.7', NULL, NULL, 'deleted', '2026-03-17 08:06:49', '2026-04-01 12:56:18');
INSERT INTO `map_places` (`id`, `name`, `description`, `category`, `type`, `latitude`, `longitude`, `address`, `contact`, `opening_hours`, `entrance_fee`, `price_range`, `rating`, `image_url`, `amenities`, `status`, `created_at`, `updated_at`) VALUES (4, 'White Beach Gloria', 'Pristine white sand beach', '', NULL, '12.99000000', '121.49000000', 'Coastal Area', NULL, NULL, '0.00', NULL, '4.6', NULL, NULL, 'deleted', '2026-03-17 08:06:49', '2026-04-01 12:56:25');
INSERT INTO `map_places` (`id`, `name`, `description`, `category`, `type`, `latitude`, `longitude`, `address`, `contact`, `opening_hours`, `entrance_fee`, `price_range`, `rating`, `image_url`, `amenities`, `status`, `created_at`, `updated_at`) VALUES (5, 'Local Eatery', 'Traditional Filipino cuisine', 'restaurant', NULL, '12.98300000', '121.46600000', 'Town Proper', NULL, NULL, '0.00', NULL, '4.3', NULL, NULL, 'deleted', '2026-03-17 08:06:49', '2026-04-01 12:56:34');
INSERT INTO `map_places` (`id`, `name`, `description`, `category`, `type`, `latitude`, `longitude`, `address`, `contact`, `opening_hours`, `entrance_fee`, `price_range`, `rating`, `image_url`, `amenities`, `status`, `created_at`, `updated_at`) VALUES (6, 'john doe', 'sdadgddsgffds', 'attraction', 'dsadsadsad', '12.99280100', '121.46707600', 'Quinabigan, Oriental Mindoro, Mimaropa, Philippines, Gloria, Oriental Mindoro', '0954334567', '26666', '12.00', '2314232', '0.0', NULL, '', 'deleted', '2026-03-18 07:14:14', '2026-04-01 12:56:31');

-- Table: messages
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table messages
INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `subject`, `message`, `is_read`, `created_at`) VALUES (1, 3, 2, 'Inquiry about: john doe', 'fsdsadsadsad', 0, '2026-03-18 07:56:29');
INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `subject`, `message`, `is_read`, `created_at`) VALUES (2, 2, 3, 'Reply from Artisan', 'hahha', 0, '2026-05-05 11:00:12');

-- Table: migrations
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `executed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table migrations
INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES (1, '004_user_features.sql', '2026-03-30 03:46:41');
INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES (2, '005_fix_destination_status.sql', '2026-03-30 03:46:41');
INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES (3, 'fix_all_tables.sql', '2026-03-30 03:46:41');
INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES (4, 'heritage_gallery.sql', '2026-03-30 03:46:41');
INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES (5, 'map_places.sql', '2026-03-30 03:46:41');
INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES (6, 'workshops.sql', '2026-03-30 03:46:41');

-- Table: notifications
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_status` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_read` (`read_status`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_items
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `status` varchar(50) DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_id` int DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `total_price` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table orders
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `notes`, `created_at`, `updated_at`, `product_id`, `user_name`, `user_email`, `quantity`, `total_price`) VALUES (1, NULL, '0.00', 'processing', NULL, '2026-03-18 08:06:10', '2026-03-18 08:06:10', 1, 'Test Customer', 'test@example.com', 2, '100.00');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `notes`, `created_at`, `updated_at`, `product_id`, `user_name`, `user_email`, `quantity`, `total_price`) VALUES (2, NULL, '0.00', 'pending', NULL, '2026-03-18 08:08:54', '2026-03-18 08:08:54', 1, 'Maria User', 'user@heritagelink.com', 1, '123.00');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `notes`, `created_at`, `updated_at`, `product_id`, `user_name`, `user_email`, `quantity`, `total_price`) VALUES (3, 3, '0.00', 'pending', NULL, '2026-03-18 08:14:04', '2026-03-18 08:14:04', 1, 'Maria User', 'user@heritagelink.com', 1, '50.00');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `notes`, `created_at`, `updated_at`, `product_id`, `user_name`, `user_email`, `quantity`, `total_price`) VALUES (4, 3, '0.00', 'pending', NULL, '2026-03-18 08:24:50', '2026-03-18 08:24:50', 1, 'Maria User', 'user@heritagelink.com', 1, '123.00');

-- Table: portfolio
DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE `portfolio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artisan_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT '0.00',
  `artisan_id` int DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `product_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table products
INSERT INTO `products` (`id`, `name`, `description`, `price`, `artisan_id`, `status`, `product_image`, `category`, `created_at`, `updated_at`) VALUES (1, 'john doe', 'qerryrteewesfweew', '123.00', 1, 'available', 'uploads/products/images-1773819975526-454636481.png', 'sadsdsc', '2026-03-18 07:46:15', '2026-03-18 08:23:19');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `artisan_id`, `status`, `product_image`, `category`, `created_at`, `updated_at`) VALUES (2, 'leomar figurine', 'hehe', '50.00', 2, 'available', 'uploads/products/images-1777978807742-978591834.png', 'wood carving', '2026-05-05 11:00:07', '2026-05-05 11:00:07');

-- Table: products_backup_1773819869828
DROP TABLE IF EXISTS `products_backup_1773819869828`;
CREATE TABLE `products_backup_1773819869828` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artisan_id` int NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_artisan` (`artisan_id`),
  CONSTRAINT `products_backup_1773819869828_ibfk_1` FOREIGN KEY (`artisan_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reviews
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `destination_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products_backup_1773819869828` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tourism_services
DROP TABLE IF EXISTS `tourism_services`;
CREATE TABLE `tourism_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `contact_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `operating_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accreditation_status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tourist_routes
DROP TABLE IF EXISTS `tourist_routes`;
CREATE TABLE `tourist_routes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` enum('easy','moderate','challenging') COLLATE utf8mb4_unicode_ci DEFAULT 'easy',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waypoints` json DEFAULT NULL COMMENT 'Array of {place_id, order, note}',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table tourist_routes
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (1, 'Cultural Heritage Trail', 'Explore the rich cultural heritage of Gloria through museums, ancestral houses, and the Mangyan village.', '4-5 hours', '8 km', 'easy', 'cultural', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-17 08:05:00');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (2, 'Beach & Nature Adventure', 'A day of sun, sand, and natural wonders. Visit waterfalls and beaches.', '6-7 hours', '15 km', 'moderate', 'nature', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-17 08:05:00');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (3, 'Food & Market Tour', 'Taste the flavors of Gloria! Visit local markets and restaurants.', '3-4 hours', '3 km', 'easy', 'food', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-17 08:05:00');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (4, 'Cultural Heritage Trail', 'Explore the rich cultural heritage of Gloria through museums, ancestral houses, and the Mangyan village.', '4-5 hours', '8 km', 'easy', 'cultural', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-17 08:06:49');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (5, 'Beach & Nature Adventure', 'A day of sun, sand, and natural wonders. Visit waterfalls and beaches.', '6-7 hours', '15 km', 'moderate', 'nature', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-17 08:06:49');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (6, 'Food & Market Tour', 'Taste the flavors of Gloria! Visit local markets and restaurants.', '3-4 hours', '3 km', 'easy', 'food', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-17 08:06:49');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (7, 'Cultural Heritage Trail', 'Explore the rich cultural heritage of Gloria through museums, ancestral houses, and the Mangyan village.', '4-5 hours', '8 km', 'easy', 'cultural', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-30 03:46:41');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (8, 'Beach & Nature Adventure', 'A day of sun, sand, and natural wonders. Visit waterfalls and beaches.', '6-7 hours', '15 km', 'moderate', 'nature', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-30 03:46:41');
INSERT INTO `tourist_routes` (`id`, `name`, `description`, `duration`, `distance`, `difficulty`, `category`, `waypoints`, `image_url`, `status`, `created_at`) VALUES (9, 'Food & Market Tour', 'Taste the flavors of Gloria! Visit local markets and restaurants.', '3-4 hours', '3 km', 'easy', 'food', '[object Object],[object Object],[object Object],[object Object]', NULL, 'active', '2026-03-30 03:46:41');

-- Table: user_gallery
DROP TABLE IF EXISTS `user_gallery`;
CREATE TABLE `user_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','artisan','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `status` enum('active','inactive','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `profile_photo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table users
INSERT INTO `users` (`id`, `username`, `name`, `email`, `password`, `role`, `status`, `phone`, `address`, `business_name`, `specialization`, `bio`, `profile_photo`, `created_at`, `updated_at`) VALUES (1, 'administrator', 'Administrator', 'admin@heritagelink.com', '$2a$10$2M7IELo27VzjZwiEA4o80ObMq5psmGV0297O.c8XnZFIYDDBTyx5K', 'admin', 'active', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 08:10:53', '2026-03-18 06:41:16');
INSERT INTO `users` (`id`, `username`, `name`, `email`, `password`, `role`, `status`, `phone`, `address`, `business_name`, `specialization`, `bio`, `profile_photo`, `created_at`, `updated_at`) VALUES (2, 'juan_artisan', 'Juan Artisan', 'artisan@heritagelink.com', '$2a$10$3GQeLEd9sXzg2LX2I5oCfeucIpoyh4I6P2jYH1U/7GNv6AtEWo0Ry', 'artisan', 'active', NULL, NULL, NULL, 'Weaving & Basketry', 'Traditional craftsman specializing in handwoven products from Gloria, Oriental Mindoro', NULL, '2026-03-17 08:10:53', '2026-03-17 08:10:53');
INSERT INTO `users` (`id`, `username`, `name`, `email`, `password`, `role`, `status`, `phone`, `address`, `business_name`, `specialization`, `bio`, `profile_photo`, `created_at`, `updated_at`) VALUES (3, 'maria_user', 'Maria User', 'user@heritagelink.com', '$2a$10$19fftCLe9e9u7IV/kPSB3u4NYBNzszfHC.C66DUGr/8t06mTJnrgW', 'user', 'active', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 08:10:53', '2026-03-17 08:10:53');
INSERT INTO `users` (`id`, `username`, `name`, `email`, `password`, `role`, `status`, `phone`, `address`, `business_name`, `specialization`, `bio`, `profile_photo`, `created_at`, `updated_at`) VALUES (4, 'lester_coronel', 'Lester Coronel', 'Vhanter134@gmail.com', '$2a$10$4OrMgP8QvqfZCZswPrH2de4.QoH3q88tlSuUOzZLx01kRQRT8ra22', 'user', 'active', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-30 03:49:16', '2026-03-30 03:49:16');

-- Table: workshop_registrations
DROP TABLE IF EXISTS `workshop_registrations`;
CREATE TABLE `workshop_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `workshop_id` int NOT NULL,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: workshops
DROP TABLE IF EXISTS `workshops`;
CREATE TABLE `workshops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artisan_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `workshop_date` date DEFAULT NULL,
  `workshop_time` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_participants` int DEFAULT '10',
  `current_participants` int DEFAULT '0',
  `fee` decimal(10,2) DEFAULT '0.00',
  `price` decimal(10,2) DEFAULT '0.00',
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','cancelled','completed','upcoming','ongoing') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_artisan` (`artisan_id`),
  KEY `idx_date` (`workshop_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table workshops
INSERT INTO `workshops` (`id`, `artisan_id`, `title`, `description`, `workshop_date`, `workshop_time`, `time`, `date`, `location`, `max_participants`, `current_participants`, `fee`, `price`, `duration`, `status`, `created_at`, `updated_at`) VALUES (1, 2, 'Traditional Basket Weaving', 'Learn the ancient art of Mangyan basket weaving using indigenous materials.', '2024-12-19 16:00:00', '09:00:00', NULL, NULL, NULL, 10, 0, '0.00', '1500.00', NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47');
INSERT INTO `workshops` (`id`, `artisan_id`, `title`, `description`, `workshop_date`, `workshop_time`, `time`, `date`, `location`, `max_participants`, `current_participants`, `fee`, `price`, `duration`, `status`, `created_at`, `updated_at`) VALUES (2, 2, 'Baybayin Script Writing', 'Discover the beauty of ancient Filipino script and create your own artwork.', '2024-12-21 16:00:00', '14:00:00', NULL, NULL, NULL, 10, 0, '0.00', '1200.00', NULL, 'active', '2026-05-05 09:31:47', '2026-05-05 09:31:47');

SET FOREIGN_KEY_CHECKS=1;
