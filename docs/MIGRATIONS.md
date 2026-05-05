# Database Migrations Guide

## Overview

HeritageLink uses a custom migration system to manage database schema changes. Migrations are tracked to ensure they only run once.

## Migration System Features

- ✅ Automatic database creation
- ✅ Migration tracking (prevents duplicate execution)
- ✅ Supports both SQL and JavaScript migrations
- ✅ Executes migrations in alphabetical order
- ✅ Graceful error handling

## Running Migrations

### Quick Start

```bash
npm run migrate
```

This will:
1. Create the `heritagelink` database if it doesn't exist
2. Create a `migrations` table to track executed migrations
3. Execute all pending migrations in order
4. Skip migrations that have already been executed

### On Application Start

Migrations run automatically when you start the application:

```bash
npm start
```

The app will run migrations before starting the server.

## Migration Files

Migrations are located in the `migrations/` directory.

### Naming Convention

Files are executed in alphabetical order, so use prefixes:

- `001_initial_schema.sql`
- `002_add_users_table.sql`
- `010_workshop_registrations.sql`

### SQL Migrations

Example: `migrations/001_create_users.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'artisan', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### JavaScript Migrations

Example: `migrations/002_seed_data.js`

```javascript
export async function up(sequelize) {
    await sequelize.query(`
        INSERT INTO users (email, name, password, role)
        VALUES ('admin@example.com', 'Admin', 'hashed_password', 'admin')
    `);
}

// Optional: rollback function
export async function down(sequelize) {
    await sequelize.query(`
        DELETE FROM users WHERE email = 'admin@example.com'
    `);
}
```

## Creating New Migrations

### Step 1: Create Migration File

Create a new file in `migrations/` directory:

```bash
# SQL migration
touch migrations/015_add_column_to_users.sql

# JavaScript migration
touch migrations/016_update_data.js
```

### Step 2: Write Migration

**SQL Example:**

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

**JavaScript Example:**

```javascript
export async function up(sequelize) {
    await sequelize.query(`
        ALTER TABLE users ADD COLUMN phone VARCHAR(20)
    `);
}
```

### Step 3: Run Migration

```bash
npm run migrate
```

## Migration Tracking

Executed migrations are tracked in the `migrations` table:

```sql
SELECT * FROM migrations;
```

Output:
```
+----+---------------------------+---------------------+
| id | name                      | executed_at         |
+----+---------------------------+---------------------+
|  1 | 001_initial_schema.sql    | 2024-01-15 10:30:00 |
|  2 | 002_seed_data.js          | 2024-01-15 10:30:01 |
+----+---------------------------+---------------------+
```

## Existing Migrations

Current migrations in the project:

1. `004_user_features.sql` - User features and profiles
2. `005_fix_destination_status.sql` - Destination status fixes
3. `010_workshop_registrations.sql` - Workshop registration system
4. `add_portfolio_description.js` - Portfolio descriptions
5. `add_profile_photo.js` - Profile photo support
6. `add_profile_photo_column.js` - Profile photo column
7. `create_messages_table.sql` - Messaging system
8. `create_orders_table.sql` - Order management
9. `create_portfolio_table.js` - Portfolio tables
10. `ensure_users_exist.js` - User seeding
11. `feedback_system.sql` - Feedback system
12. `fix_all_tables.sql` - Table fixes
13. `fix_product_foreign_key.js` - Foreign key fixes
14. `hash_passwords.js` - Password hashing
15. `heritage_gallery.sql` - Heritage gallery
16. `map_places.sql` - Map places
17. `notifications.sql` - Notification system
18. `update_workshops_table.js` - Workshop updates
19. `workshops.sql` - Workshop tables

## Troubleshooting

### Migration Already Executed

If you need to re-run a migration:

```sql
DELETE FROM migrations WHERE name = 'your_migration_file.sql';
```

Then run `npm run migrate` again.

### Reset All Migrations

⚠️ **WARNING**: This will delete all data!

```sql
DROP DATABASE heritagelink;
CREATE DATABASE heritagelink;
```

Then run `npm run migrate`.

### Migration Failed

Check the error message and fix the migration file. The migration system will skip successfully executed migrations and retry failed ones.

### Checking Migration Status

```bash
# Run migrations with verbose output
node scripts/migrate.js
```

## Best Practices

1. **Always use `IF NOT EXISTS`** in CREATE statements
2. **Test migrations** on a development database first
3. **Use transactions** for complex migrations
4. **Keep migrations small** and focused
5. **Never modify** executed migration files
6. **Create new migrations** for schema changes
7. **Use descriptive names** for migration files
8. **Add comments** to explain complex changes

## Advanced Usage

### Running Specific Migration

Edit `scripts/run-migrations.js` to add a filter:

```javascript
const files = fs.readdirSync(migrationsDir)
    .filter(f => f === 'your_specific_migration.sql')
    .sort();
```

### Dry Run

To see what migrations would run without executing:

```javascript
// In run-migrations.js, comment out the execution lines
// await executeSqlMigration(filePath, file);
console.log(`Would execute: ${file}`);
```

## Migration System Architecture

```
scripts/
├── run-migrations.js    # Core migration runner
└── migrate.js           # CLI entry point

migrations/              # Migration files
├── *.sql               # SQL migrations
└── *.js                # JavaScript migrations

migrate.js              # Called on app start
```

## Support

For issues or questions:
1. Check the error message in console
2. Review `docs/MYSQL_SETUP.md` for database setup
3. Verify `.env` configuration
4. Check MySQL service is running
