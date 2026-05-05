-- Fix destination status column to support more values
-- This migration updates the status column to allow 'active', 'inactive', and 'deleted'

-- Check if destinations table exists and modify status column
ALTER TABLE destinations 
MODIFY COLUMN status ENUM('active', 'inactive', 'deleted') DEFAULT 'active';

-- Update any existing NULL status values to 'active'
UPDATE destinations SET status = 'active' WHERE status IS NULL;
