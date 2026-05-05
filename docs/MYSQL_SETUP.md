# MySQL Setup Guide for HeritageLink

## Windows Installation

### Step 1: Install MySQL

1. **Download MySQL Installer**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download "mysql-installer-community" (Windows MSI Installer)
   - Choose the larger file (~400MB) for offline installation

2. **Run the Installer**
   - Choose "Developer Default" or "Server only"
   - Click "Execute" to install

3. **Configure MySQL Server**
   - Type: Development Computer
   - Port: 3306 (default)
   - Root Password: Set a password (or leave empty for development)
   - Create a Windows Service: Yes
   - Start at System Startup: Yes

4. **Complete Installation**
   - Click "Execute" to apply configuration
   - Click "Finish"

### Step 2: Verify Installation

Open PowerShell or Command Prompt:

```bash
mysql --version
```

You should see something like: `mysql  Ver 8.0.x`

### Step 3: Configure Environment Variables (if needed)

If `mysql` command is not recognized:

1. Open System Properties → Environment Variables
2. Edit "Path" variable
3. Add MySQL bin directory: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
4. Restart your terminal

## Alternative: Using XAMPP

If you prefer an all-in-one solution:

1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Start MySQL from XAMPP Control Panel
4. MySQL will run on port 3306

## Database Configuration

### Step 1: Create .env file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Step 2: Update Database Credentials

Edit `.env` file:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=heritagelink
DB_PORT=3306
```

### Step 3: Run Migrations

```bash
npm run migrate
```

This will:
- Create the `heritagelink` database if it doesn't exist
- Create all tables from migration files
- Track which migrations have been executed

## Manual Database Creation (Optional)

If you prefer to create the database manually:

```bash
mysql -u root -p
```

Then in MySQL prompt:

```sql
CREATE DATABASE heritagelink;
USE heritagelink;
exit;
```

Then run migrations:

```bash
npm run migrate
```

## Running the Application

After migrations are complete:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

- Check your password in `.env` file
- Try resetting MySQL root password

### Error: "Can't connect to MySQL server"

- Ensure MySQL service is running
- Check if port 3306 is available
- Verify DB_HOST and DB_PORT in `.env`

### Error: "Database 'heritagelink' doesn't exist"

- Run `npm run migrate` - it will create the database automatically

### Migration Tracking

Migrations are tracked in the `migrations` table. To see executed migrations:

```sql
SELECT * FROM migrations;
```

To reset migrations (⚠️ WARNING: This will drop all tables):

```sql
DROP DATABASE heritagelink;
CREATE DATABASE heritagelink;
```

Then run `npm run migrate` again.

## Test Accounts

After migration, these accounts will be created:

- **Admin**: admin@heritagelink.com / admin123
- **Artisan**: artisan@heritagelink.com / artisan123
- **User**: user@heritagelink.com / user123
