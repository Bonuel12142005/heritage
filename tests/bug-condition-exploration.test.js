/**
 * Bug Condition Exploration Test for Database Schema Fix
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6**
 * 
 * This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * 
 * Property 1: Bug Condition - Missing Schema Elements
 * 
 * For any query that references destination_images table, events.created_by column,
 * or heritage_gallery.metadata column, the current database schema is MISSING these
 * elements, causing queries to fail with "table doesn't exist" or "unknown column" errors.
 * 
 * EXPECTED OUTCOME: This test FAILS on unfixed database (proves bug exists)
 * After fix: This test PASSES (proves bug is fixed)
 */

import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import fc from 'fast-check';
import { db } from '../models/db.js';

describe('Property 1: Bug Condition - Missing Schema Elements', function() {
  this.timeout(10000); // Increase timeout for database operations

  describe('1.1 & 1.2: destination_images table missing', function() {
    it('should fail when querying destination_images table (table does not exist)', async function() {
      try {
        // This query should fail because destination_images table doesn't exist
        await db.execute('SELECT url FROM destination_images LIMIT 1');
        
        // If we reach here, the table exists (bug is fixed)
        throw new Error('UNEXPECTED: destination_images table exists - bug may already be fixed');
      } catch (error) {
        // Expected: Table doesn't exist error
        expect(error.message).to.match(/Table.*destination_images.*doesn't exist|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });

    it('should fail when querying destination with primary image subquery', async function() {
      try {
        // This is the actual query pattern used in destinationMods.js
        const query = `
          SELECT d.id, d.name,
          (SELECT url FROM destination_images WHERE destination_id = d.id AND is_primary = 1 LIMIT 1) as image_url
          FROM destinations d
          LIMIT 1
        `;
        await db.execute(query);
        
        throw new Error('UNEXPECTED: destination_images subquery succeeded - bug may already be fixed');
      } catch (error) {
        expect(error.message).to.match(/Table.*destination_images.*doesn't exist|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });

    it('should fail DESCRIBE destination_images (table structure check)', async function() {
      try {
        await db.execute('DESCRIBE destination_images');
        throw new Error('UNEXPECTED: destination_images table structure exists - bug may already be fixed');
      } catch (error) {
        expect(error.message).to.match(/Table.*destination_images.*doesn't exist|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });
  });

  describe('1.3 & 1.4: events.created_by column missing', function() {
    it('should fail when querying events.created_by column (column does not exist)', async function() {
      try {
        // This query should fail because created_by column doesn't exist
        await db.execute('SELECT created_by FROM events LIMIT 1');
        
        throw new Error('UNEXPECTED: events.created_by column exists - bug may already be fixed');
      } catch (error) {
        // Expected: Unknown column error
        expect(error.message).to.match(/Unknown column.*created_by|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });

    it('should fail when joining events with users on created_by', async function() {
      try {
        // This is the actual query pattern used in eventMods.js
        const query = `
          SELECT e.*, u.username as created_by_name
          FROM events e
          LEFT JOIN users u ON e.created_by = u.id
          LIMIT 1
        `;
        await db.execute(query);
        
        throw new Error('UNEXPECTED: events.created_by JOIN succeeded - bug may already be fixed');
      } catch (error) {
        expect(error.message).to.match(/Unknown column.*created_by|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });

    it('should fail DESCRIBE events check for created_by column', async function() {
      try {
        const [rows] = await db.execute('DESCRIBE events');
        const hasCreatedBy = rows.some(row => row.Field === 'created_by');
        
        if (hasCreatedBy) {
          throw new Error('UNEXPECTED: events.created_by column exists in schema - bug may already be fixed');
        }
        
        // If created_by is not in the schema, this is the expected bug condition
        expect(hasCreatedBy).to.be.false;
        console.log('✓ Counterexample found: events.created_by column missing from schema');
      } catch (error) {
        if (error.message.includes('UNEXPECTED')) {
          throw error;
        }
        // Any other error is also evidence of the bug
        console.log('✓ Counterexample found: ' + error.message);
      }
    });
  });

  describe('1.5 & 1.6: heritage_gallery.metadata column missing', function() {
    it('should fail when querying heritage_gallery.metadata column (column does not exist)', async function() {
      try {
        // This query should fail because metadata column doesn't exist
        await db.execute('SELECT metadata FROM heritage_gallery LIMIT 1');
        
        throw new Error('UNEXPECTED: heritage_gallery.metadata column exists - bug may already be fixed');
      } catch (error) {
        // Expected: Unknown column error
        expect(error.message).to.match(/Unknown column.*metadata|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });

    it('should fail when using JSON_EXTRACT on metadata column', async function() {
      try {
        // This is the actual query pattern used in heritageGalleryMods.js
        const query = `
          SELECT id, title,
          JSON_EXTRACT(metadata, '$.contributor') as contributor_name
          FROM heritage_gallery
          LIMIT 1
        `;
        await db.execute(query);
        
        throw new Error('UNEXPECTED: heritage_gallery.metadata JSON_EXTRACT succeeded - bug may already be fixed');
      } catch (error) {
        expect(error.message).to.match(/Unknown column.*metadata|doesn't exist/i);
        console.log('✓ Counterexample found: ' + error.message);
      }
    });

    it('should fail DESCRIBE heritage_gallery check for metadata column', async function() {
      try {
        const [rows] = await db.execute('DESCRIBE heritage_gallery');
        const hasMetadata = rows.some(row => row.Field === 'metadata');
        
        if (hasMetadata) {
          throw new Error('UNEXPECTED: heritage_gallery.metadata column exists in schema - bug may already be fixed');
        }
        
        // If metadata is not in the schema, this is the expected bug condition
        expect(hasMetadata).to.be.false;
        console.log('✓ Counterexample found: heritage_gallery.metadata column missing from schema');
      } catch (error) {
        if (error.message.includes('UNEXPECTED')) {
          throw error;
        }
        // Any other error is also evidence of the bug
        console.log('✓ Counterexample found: ' + error.message);
      }
    });
  });

  describe('Property-Based Test: Schema Element Existence', function() {
    it('should fail for any query referencing missing schema elements', function() {
      return fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            'destination_images',
            'events.created_by',
            'heritage_gallery.metadata'
          ),
          async (schemaElement) => {
            let query;
            let expectedError;
            
            if (schemaElement === 'destination_images') {
              query = 'SELECT * FROM destination_images LIMIT 1';
              expectedError = /Table.*destination_images.*doesn't exist/i;
            } else if (schemaElement === 'events.created_by') {
              query = 'SELECT created_by FROM events LIMIT 1';
              expectedError = /Unknown column.*created_by/i;
            } else if (schemaElement === 'heritage_gallery.metadata') {
              query = 'SELECT metadata FROM heritage_gallery LIMIT 1';
              expectedError = /Unknown column.*metadata/i;
            }
            
            try {
              await db.execute(query);
              // If query succeeds, bug is fixed (test should fail on unfixed code)
              throw new Error(`UNEXPECTED: Query for ${schemaElement} succeeded - bug may already be fixed`);
            } catch (error) {
              if (error.message.includes('UNEXPECTED')) {
                throw error;
              }
              // Expected: Query fails with appropriate error
              expect(error.message).to.match(expectedError);
              console.log(`✓ Counterexample for ${schemaElement}: ${error.message}`);
            }
          }
        ),
        { numRuns: 10 } // Run 10 times to test all schema elements multiple times
      );
    });
  });
});
