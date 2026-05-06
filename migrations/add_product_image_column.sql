-- Add image_url column to artisan_products table
ALTER TABLE artisan_products 
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER external_link;

-- Add image_url column to workshops table  
ALTER TABLE workshops 
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER status;
