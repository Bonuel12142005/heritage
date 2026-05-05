# Implementation Plan

- [-] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Missing Schema Elements
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the missing schema elements
  - **Scoped PBT Approach**: Test concrete failing cases - queries that reference destination_images table, events.created_by column, and heritage_gallery.metadata column
  - Test that `SELECT url FROM destination_images LIMIT 1` fails with "Table doesn't exist" error
  - Test that `SELECT created_by FROM events LIMIT 1` fails with "Unknown column" error
  - Test that `SELECT metadata FROM heritage_gallery LIMIT 1` fails with "Unknown column" error
  - Test that `/api/destinations` endpoint returns 500 error due to missing table
  - Run test on UNFIXED database schema
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (specific SQL error messages)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [~] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Data and Schema Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED database for existing schema elements
  - Capture row counts for destinations, events, and heritage_gallery tables
  - Capture checksums or sample data from existing columns (name, description, title, etc.)
  - Write property-based tests that verify existing columns return identical data
  - Test that queries on existing destination columns (name, description, site_type, address) work correctly
  - Test that queries on existing event columns (title, description, event_date, event_time, location) work correctly
  - Test that queries on existing heritage_gallery columns (title, description, category, file_url) work correctly
  - Test that other tables (users, products, workshops) are completely unaffected
  - Run tests on UNFIXED database
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed database
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Create database migrations to fix schema issues

  - [~] 3.1 Create destination_images table migration
    - Create file `migrations/006_create_destination_images.sql`
    - Add CREATE TABLE statement with columns: id, destination_id, url, caption, is_primary, display_order, uploaded_by, created_at
    - Add foreign key constraint: destination_id references destinations(id) ON DELETE CASCADE
    - Add foreign key constraint: uploaded_by references users(id) ON DELETE SET NULL
    - Add indexes on destination_id and is_primary for query performance
    - _Bug_Condition: isBugCondition(query) where query.references('destination_images')_
    - _Expected_Behavior: Queries referencing destination_images table execute successfully_
    - _Preservation: Existing destinations table data and columns remain unchanged_
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1_

  - [~] 3.2 Create events.created_by column migration
    - Create file `migrations/007_add_events_created_by.sql`
    - Add ALTER TABLE statement to add created_by column (INT, NULL)
    - Add foreign key constraint: created_by references users(id) ON DELETE SET NULL
    - Add index on created_by for JOIN performance
    - _Bug_Condition: isBugCondition(query) where query.references('events.created_by')_
    - _Expected_Behavior: JOIN queries on events.created_by execute successfully_
    - _Preservation: Existing events table data and columns remain unchanged_
    - _Requirements: 1.3, 1.4, 2.3, 2.4, 3.2_

  - [~] 3.3 Create heritage_gallery.metadata column migration
    - Create file `migrations/008_add_heritage_metadata.sql`
    - Add ALTER TABLE statement to add metadata column (JSON, NULL)
    - Optionally migrate existing data from individual columns to JSON format
    - Add comment documenting JSON structure (contributor, source, tags, etc.)
    - _Bug_Condition: isBugCondition(query) where query.references('heritage_gallery.metadata')_
    - _Expected_Behavior: JSON_EXTRACT queries on metadata column execute successfully_
    - _Preservation: Existing heritage_gallery table data and columns remain unchanged_
    - _Requirements: 1.5, 1.6, 2.5, 2.6, 3.3_

  - [~] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Schema Elements Exist
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify `DESCRIBE destination_images` returns table structure
    - Verify `DESCRIBE events` shows created_by column
    - Verify `DESCRIBE heritage_gallery` shows metadata column
    - Verify queries that previously failed now execute successfully
    - Verify `/api/destinations` endpoint returns 200 status
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [~] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Data Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify row counts match before/after migration
    - Verify existing column data is identical before/after migration
    - Verify queries on existing columns return same results
    - Verify other tables are completely unaffected
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after migrations (no regressions)

- [~] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
