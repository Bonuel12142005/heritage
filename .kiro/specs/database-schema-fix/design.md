# Database Schema Fix Design

## Overview

The HeritageLink application has three critical database schema issues causing API failures. The code references tables and columns that don't exist in the database schema, resulting in SQL errors. This bugfix will create three database migrations to add the missing schema elements:

1. Create the `destination_images` table to store multiple images per destination
2. Add the `created_by` column to the `events` table to track event creators
3. Add the `metadata` JSON column to the `heritage_gallery` table to store structured metadata

The fix approach is to create SQL migration files that will be executed by the existing migration system. These migrations will add the missing schema elements without modifying existing data or breaking current functionality.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when queries reference non-existent tables or columns
- **Property (P)**: The desired behavior - queries should execute successfully against existing schema elements
- **Preservation**: Existing data and functionality that must remain unchanged by the migrations
- **destination_images**: A new table to store multiple images for each destination with primary image flag
- **events.created_by**: A new foreign key column linking events to the user who created them
- **heritage_gallery.metadata**: A new JSON column storing structured metadata (contributor, source, tags, etc.)
- **Migration System**: The application's database migration mechanism that executes SQL files in the migrations folder

## Bug Details

### Bug Condition

The bug manifests when API endpoints execute queries that reference database schema elements that don't exist. The application code assumes these tables and columns exist, but the database schema is incomplete.

**Formal Specification:**
```
FUNCTION isBugCondition(query)
  INPUT: query of type SQLQuery
  OUTPUT: boolean
  
  RETURN (query.references('destination_images') AND NOT tableExists('destination_images'))
         OR (query.references('events.created_by') AND NOT columnExists('events', 'created_by'))
         OR (query.references('heritage_gallery.metadata') AND NOT columnExists('heritage_gallery', 'metadata'))
END FUNCTION
```

### Examples

- **Destination Images Query**: `SELECT (SELECT url FROM destination_images WHERE destination_id = d.id AND is_primary = 1 LIMIT 1) as image_url FROM destinations d` crashes with "Table 'heritagelink.destination_images' doesn't exist"

- **Event Creator Query**: `SELECT e.*, u.username as created_by_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?` crashes with "Unknown column 'e.created_by' in 'on clause'"

- **Heritage Metadata Query**: `SELECT JSON_EXTRACT(h.metadata, '$.contributor') as contributor_name FROM heritage_gallery h` crashes with "Unknown column 'h.metadata' in 'field list'"

- **Edge Case - Multiple Images**: When a destination has multiple images, the system should be able to store them all and identify which is primary (expected behavior after fix)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All existing data in destinations, events, and heritage_gallery tables must remain intact
- Existing columns and their data types must not be modified
- Queries that don't reference the new schema elements must continue to work exactly as before
- The migration system's execution mechanism must remain unchanged
- Other tables and their relationships must not be affected

**Scope:**
All queries that do NOT reference destination_images table, events.created_by column, or heritage_gallery.metadata column should be completely unaffected by this fix. This includes:
- Queries on existing destination columns (name, description, site_type, etc.)
- Queries on existing event columns (title, description, event_date, etc.)
- Queries on existing heritage_gallery columns (title, description, category, file_url, etc.)
- All other tables in the database (users, products, workshops, etc.)

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Missing destination_images Table**: The table was never created in any migration file. The code in `destinationMods.js` assumes it exists for storing multiple images per destination with a primary image flag.

2. **Missing events.created_by Column**: The events table exists but lacks the `created_by` foreign key column. The code in `eventMods.js` performs JOINs with the users table assuming this column exists.

3. **Missing heritage_gallery.metadata Column**: The `heritage_gallery.sql` migration created the table with individual columns (contributor_name, source, tags, etc.) but the code in `heritageGalleryMods.js` expects a JSON `metadata` column instead. This is a schema mismatch between the migration and the model code.

4. **Migration Execution Gap**: The migrations may not have been run, or the schema evolved differently than the code expected. The application code was updated to use these schema elements, but the corresponding migrations were never created or executed.

## Correctness Properties

Property 1: Bug Condition - Schema Elements Exist

_For any_ query that references destination_images table, events.created_by column, or heritage_gallery.metadata column, the fixed database schema SHALL contain these elements, allowing the query to execute without "table doesn't exist" or "unknown column" errors.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

Property 2: Preservation - Existing Data Unchanged

_For any_ existing row in destinations, events, or heritage_gallery tables, the migration SHALL preserve all existing column values exactly as they were before the migration, ensuring no data loss or corruption occurs.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct, we need to create three SQL migration files:

**File 1**: `migrations/006_create_destination_images.sql`

**Purpose**: Create the destination_images table to store multiple images per destination

**Specific Changes**:
1. **Create destination_images table** with columns:
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `destination_id` (INT, NOT NULL, foreign key to destinations.id)
   - `url` (VARCHAR(500), NOT NULL, stores image file path)
   - `caption` (VARCHAR(255), optional description)
   - `is_primary` (BOOLEAN, DEFAULT FALSE, marks the main image)
   - `display_order` (INT, DEFAULT 0, for ordering images)
   - `uploaded_by` (INT, foreign key to users.id)
   - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
   
2. **Add indexes** for performance:
   - Index on `destination_id` for fast lookups
   - Index on `is_primary` for primary image queries
   
3. **Add foreign key constraints**:
   - `destination_id` references `destinations(id)` with ON DELETE CASCADE
   - `uploaded_by` references `users(id)` with ON DELETE SET NULL

**File 2**: `migrations/007_add_events_created_by.sql`

**Purpose**: Add created_by column to events table to track event creators

**Specific Changes**:
1. **Add created_by column** to events table:
   - Type: INT
   - Nullable: YES (to support existing rows)
   - Position: After existing columns
   
2. **Add foreign key constraint**:
   - `created_by` references `users(id)` with ON DELETE SET NULL
   
3. **Add index** on created_by for JOIN performance

4. **Set default values** for existing rows (optional):
   - Could set to admin user ID or leave as NULL

**File 3**: `migrations/008_add_heritage_metadata.sql`

**Purpose**: Add metadata JSON column to heritage_gallery table and migrate existing data

**Specific Changes**:
1. **Add metadata column** to heritage_gallery table:
   - Type: JSON
   - Nullable: YES
   - Default: NULL
   
2. **Migrate existing data** from individual columns to JSON:
   - Extract contributor_name, source, historical_date, location, tags, duration, transcript, view_count
   - Build JSON object for each row
   - Update metadata column with JSON data
   
3. **Optionally drop old columns** (or keep for backward compatibility):
   - Consider keeping old columns temporarily for safety
   - Can be removed in a future migration after verification

4. **Add JSON index** for metadata queries (MySQL 5.7+):
   - Virtual column index on frequently queried JSON paths

### Migration Execution Order

The migrations should be numbered sequentially (006, 007, 008) to ensure they run in the correct order. The existing migration system should automatically detect and execute these new files.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, verify the bug exists on the current schema by running queries that should fail, then apply the migrations and verify the same queries succeed while preserving existing data.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm the schema elements are missing and queries fail as expected.

**Test Plan**: Execute SQL queries directly against the database that reference the missing schema elements. These queries should fail with specific error messages. This confirms our root cause analysis.

**Test Cases**:
1. **Destination Images Query Test**: Execute `SELECT url FROM destination_images LIMIT 1` (will fail with "Table doesn't exist")
2. **Events Created By Query Test**: Execute `SELECT created_by FROM events LIMIT 1` (will fail with "Unknown column")
3. **Heritage Metadata Query Test**: Execute `SELECT metadata FROM heritage_gallery LIMIT 1` (will fail with "Unknown column")
4. **API Endpoint Test**: Call `/api/destinations` endpoint (will fail with 500 error due to missing table)

**Expected Counterexamples**:
- SQL error: "Table 'heritagelink.destination_images' doesn't exist"
- SQL error: "Unknown column 'events.created_by' in 'field list'"
- SQL error: "Unknown column 'heritage_gallery.metadata' in 'field list'"
- Possible causes: migrations not created, migrations not executed, schema drift

### Fix Checking

**Goal**: Verify that after running the migrations, all queries that reference the new schema elements execute successfully.

**Pseudocode:**
```
FOR ALL query WHERE isBugCondition(query) DO
  result := executeQuery_afterMigration(query)
  ASSERT result.success = TRUE
  ASSERT result.error IS NULL
END FOR
```

**Test Plan**: After running the three migration files, execute the same queries that previously failed and verify they now succeed.

**Test Cases**:
1. **Destination Images Table Exists**: `DESCRIBE destination_images` should return table structure
2. **Events Created By Column Exists**: `DESCRIBE events` should show created_by column
3. **Heritage Metadata Column Exists**: `DESCRIBE heritage_gallery` should show metadata column
4. **Destination Images Query Works**: `SELECT url FROM destination_images LIMIT 1` should execute without error
5. **Events JOIN Query Works**: `SELECT e.*, u.username FROM events e LEFT JOIN users u ON e.created_by = u.id LIMIT 1` should execute
6. **Heritage JSON Query Works**: `SELECT JSON_EXTRACT(metadata, '$.contributor') FROM heritage_gallery LIMIT 1` should execute
7. **API Endpoints Work**: `/api/destinations`, `/api/events`, and heritage endpoints should return 200 status

### Preservation Checking

**Goal**: Verify that after running the migrations, all existing data remains unchanged and queries that don't reference new schema elements continue to work.

**Pseudocode:**
```
FOR ALL query WHERE NOT isBugCondition(query) DO
  result_before := executeQuery_beforeMigration(query)
  result_after := executeQuery_afterMigration(query)
  ASSERT result_before = result_after
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different query patterns
- It catches edge cases that manual tests might miss (NULL values, special characters, etc.)
- It provides strong guarantees that existing functionality is unchanged

**Test Plan**: Before running migrations, capture the current state of all data in destinations, events, and heritage_gallery tables. After migrations, verify the data is identical (except for new NULL columns).

**Test Cases**:
1. **Destination Data Preservation**: Count and checksum of all destination rows should match before/after
2. **Event Data Preservation**: Count and checksum of all event rows should match before/after
3. **Heritage Data Preservation**: Count and checksum of all heritage_gallery rows should match before/after
4. **Existing Column Queries**: Queries on existing columns should return identical results
5. **Foreign Key Relationships**: Existing relationships (destinations.created_by, events.created_by to users) should still work
6. **Other Tables Unaffected**: Tables like users, products, workshops should be completely unchanged

### Unit Tests

- Test that destination_images table has correct structure (columns, types, constraints)
- Test that events.created_by column has correct type and foreign key constraint
- Test that heritage_gallery.metadata column has correct JSON type
- Test that indexes are created correctly for performance
- Test that foreign key constraints work (cascade deletes, set null on user delete)
- Test edge cases: NULL values in new columns, empty JSON objects, missing primary images

### Property-Based Tests

- Generate random destination IDs and verify destination_images queries work
- Generate random event IDs and verify created_by JOIN queries work
- Generate random heritage IDs and verify JSON_EXTRACT queries work
- Test that inserting new rows with new columns works correctly
- Test that updating rows doesn't break new columns
- Test that deleting related rows (users, destinations) triggers correct cascade behavior

### Integration Tests

- Test full API flow: Create destination → Upload images → Query destination with images
- Test full API flow: Create event with created_by → Query event with creator name
- Test full API flow: Create heritage item with metadata → Query and extract JSON fields
- Test that existing API endpoints continue to work after migrations
- Test that admin interfaces can interact with new schema elements
- Test that the migration system correctly marks these migrations as executed

