# Bugfix Requirements Document

## Introduction

The HeritageLink application is experiencing database schema errors that cause API failures across multiple endpoints. The application uses MySQL with Sequelize ORM, and while migration files exist, the schema is incomplete. Three critical issues have been identified:

1. Missing `destination_images` table causing failures in the `/api/destinations` endpoint
2. Missing `created_by` column in the `events` table causing JOIN failures in the `/api/events` endpoint  
3. Missing `metadata` column in the `heritage_gallery` table causing SELECT failures in heritage queries

These errors prevent core functionality from working and must be resolved to restore application stability.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the `/api/destinations` endpoint queries for destination images THEN the system crashes with error "Table 'heritagelink.destination_images' doesn't exist"

1.2 WHEN the destination model's `findAll()` method executes a SELECT query with `(SELECT url FROM destination_images WHERE destination_id = d.id AND is_primary = 1 LIMIT 1)` THEN the system fails because the `destination_images` table does not exist in the database

1.3 WHEN the `/api/events` endpoint queries events with creator information THEN the system crashes with error "Unknown column 'e.created_by' in 'on clause'"

1.4 WHEN the event model's `findAll()` or `findById()` methods execute a JOIN query with `LEFT JOIN users u ON e.created_by = u.id` THEN the system fails because the `created_by` column does not exist in the `events` table

1.5 WHEN heritage gallery queries attempt to extract metadata fields THEN the system crashes with error "Unknown column 'h.metadata' in 'field list'"

1.6 WHEN the HeritageGallery model's `findAll()` or `findById()` methods execute SELECT queries with `JSON_EXTRACT(h.metadata, '$.contributor')` THEN the system fails because the `metadata` column does not exist in the `heritage_gallery` table

### Expected Behavior (Correct)

2.1 WHEN the `/api/destinations` endpoint queries for destination images THEN the system SHALL successfully execute the query and return destination data with image URLs

2.2 WHEN the destination model's `findAll()` method executes a SELECT query referencing `destination_images` table THEN the system SHALL find the table and retrieve the primary image URL for each destination

2.3 WHEN the `/api/events` endpoint queries events with creator information THEN the system SHALL successfully execute the JOIN query and return events with creator usernames

2.4 WHEN the event model's `findAll()` or `findById()` methods execute a JOIN on `e.created_by = u.id` THEN the system SHALL find the `created_by` column and successfully join with the users table

2.5 WHEN heritage gallery queries attempt to extract metadata fields THEN the system SHALL successfully execute JSON_EXTRACT operations and return heritage items with metadata

2.6 WHEN the HeritageGallery model's `findAll()` or `findById()` methods execute SELECT queries with JSON_EXTRACT on the `metadata` column THEN the system SHALL find the column and successfully extract JSON fields like contributor, source, tags, etc.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN queries access existing columns in the `destinations` table (name, description, site_type, address, etc.) THEN the system SHALL CONTINUE TO return correct data

3.2 WHEN queries access existing columns in the `events` table (title, description, event_date, event_time, location, etc.) THEN the system SHALL CONTINUE TO return correct data

3.3 WHEN queries access existing columns in the `heritage_gallery` table (title, description, category, media_type, file_url, etc.) THEN the system SHALL CONTINUE TO return correct data

3.4 WHEN the application creates new destinations, events, or heritage items THEN the system SHALL CONTINUE TO insert records successfully

3.5 WHEN the application updates or soft-deletes existing records THEN the system SHALL CONTINUE TO perform these operations correctly

3.6 WHEN other tables and endpoints not affected by these schema issues are accessed THEN the system SHALL CONTINUE TO function normally
