# 🚀 Deploy Your Local Database to Production

Follow these 2 simple steps to copy your local phpMyAdmin database to Aiven production:

---

## ✅ STEP 1: Export Your Local Database

Run this command in your terminal:

```bash
node export-local-db.js
```

**What it does:**
- Connects to your LOCAL MySQL database (phpMyAdmin)
- Exports ALL tables and data
- Creates a file: `heritagelink-export.sql`

**Expected output:**
```
📤 Exporting local database...
✅ Connected to local MySQL database
📋 Found 15 tables:
   Exporting users...
   Exporting destinations...
   Exporting artisan_products...
   ... (all your tables)
✅ Database exported successfully!
📁 File saved: heritagelink-export.sql
```

---

## ✅ STEP 2: Import to Aiven Production

Run this command:

```bash
node import-to-aiven.js
```

**What it does:**
- Reads the `heritagelink-export.sql` file
- Connects to your Aiven MySQL production database
- Imports ALL your data

**Expected output:**
```
📥 Importing database to Aiven MySQL...
✅ Connected to Aiven MySQL
⏳ Importing data (this may take a minute)...
✅ Database imported successfully!
🎉 Your production database now has all your local data!
```

---

## 🎉 DONE!

Your production site now has:
- ✅ All your destinations
- ✅ All your events
- ✅ All your artisan products
- ✅ All your heritage items
- ✅ All your workshops
- ✅ All your users
- ✅ Everything from your local database!

Visit: **https://heritagelink.onrender.com**

---

## ⚠️ Troubleshooting

**If export fails:**
1. Make sure your local MySQL is running (XAMPP/WAMP)
2. Check your `.env` file has correct local database credentials
3. Make sure database name is `heritagelink`

**If import fails:**
1. Make sure you ran export first
2. Check that `heritagelink-export.sql` file exists
3. Wait a few seconds and try again (Aiven might be busy)

---

## 🔄 Update Production Data Later

Anytime you add new data locally and want to update production:

1. Run `node export-local-db.js` again
2. Run `node import-to-aiven.js` again

That's it! Your production will be updated with latest data.
