# HeritageLink Admin Account

## Default Admin Credentials

### Admin Account
- **Email**: `admin@heritagelink.com`
- **Password**: `admin123`
- **Username**: `admin`
- **Role**: Administrator
- **Status**: Active

## Other Test Accounts

### Artisan Account
- **Email**: `artisan@heritagelink.com`
- **Password**: `artisan123`
- **Role**: Artisan

### Regular User Account
- **Email**: `user@heritagelink.com`
- **Password**: `user123`
- **Role**: User

## How to Login

1. Navigate to: `http://localhost:3000/login`
2. Enter the admin email: `admin@heritagelink.com`
3. Enter the password: `admin123`
4. Click "Login"

## Admin Access

Once logged in as admin, you'll have access to:
- Admin Dashboard (`/admin`)
- User Management
- Content Moderation
- Destination Management
- Event Management
- Heritage Gallery Management
- Artisan & Product Management
- Workshop Management
- Feedback & Review Management
- System Settings

## Security Notes

⚠️ **IMPORTANT**: These are default development credentials. 

**For Production:**
1. Change the admin password immediately after first login
2. Use strong, unique passwords
3. Enable two-factor authentication if available
4. Regularly rotate passwords
5. Never commit real credentials to version control

## Password Reset

If you need to reset the admin password:
1. Run the migration: `node migrations/ensure_users_exist.js`
2. This will reset the password to `admin123`

## Database Location

The admin user is stored in the `users` table with:
- `role = 'admin'`
- Password is hashed using bcrypt

## Migration Files

Admin user is created/ensured by:
- `scripts/create-tables.sql` (SQL version)
- `migrations/ensure_users_exist.js` (JavaScript version)
