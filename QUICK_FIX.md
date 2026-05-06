# Quick Fix for Missing Price and Image

## Problem
- Price shows ₱0.00 even though you entered 149.98
- Image doesn't show even though you uploaded it

## Root Causes
1. **Price Issue:** The form sends `price` but the save route was only saving `price_range`
2. **Image Issue:** The database doesn't have `image_url` column yet (migration not run)

## Quick Fix Steps

### Step 1: Run the Migration (Add image_url column)

**Stop your server first** (Ctrl+C in terminal)

Then run:
```bash
node run-image-migration.js
```

You should see:
```
✅ Connected to database!
➕ Adding image_url column to artisan_products...
✅ Column added to artisan_products!
➕ Adding image_url column to workshops...
✅ Column added to workshops!
✅ Migration completed successfully!
```

### Step 2: Restart Your Server

```bash
npm start
```

### Step 3: Update the Product Again

1. Go to the product edit page (the one showing 149.98)
2. Make sure the price is still 149.98
3. Upload the image again
4. Click "Update Product"
5. Go back to Products page
6. **Both price and image should now show!** 🎉

## What Was Fixed

### Price Field
**Before:**
- Form sends: `price: 149.98`
- Server saves: Only `price_range` (ignores `price`)
- Display shows: `product.price` = 0.00 (default value)

**After:**
- Form sends: `price: 149.98`
- Server saves: BOTH `price` AND `price_range`
- Display shows: `product.price` = 149.98 ✅

### Image Field
**Before:**
- Image uploads to server
- Database has no `image_url` column
- Display can't find image path

**After:**
- Image uploads to server
- Database has `image_url` column
- Image path saved to database
- Display shows image ✅

## Verification

After updating the product, check the database:

```sql
SELECT id, name, price, price_range, image_url FROM artisan_products WHERE id = 32;
```

You should see:
- `price`: 149.98
- `image_url`: uploads/products/images-1234567890-123456789.jpg

## If It Still Doesn't Work

### Price Still Shows 0.00
**Check:**
1. Did you restart the server after the code changes?
2. Did you re-submit the form after restarting?
3. Check browser console for errors (F12 → Console)

**Debug:**
```bash
# Check what's in the database
mysql -u root -p heritagelink
SELECT id, name, price, price_range FROM artisan_products WHERE id = 32;
```

### Image Still Doesn't Show
**Check:**
1. Did the migration run successfully?
2. Did you upload a NEW image after the migration?
3. Check if the file exists:
   ```bash
   ls -la public/uploads/products/
   ```

**Debug:**
```bash
# Check if image_url column exists
mysql -u root -p heritagelink
SHOW COLUMNS FROM artisan_products LIKE 'image_url';
```

## Important Notes

1. **Existing products** need to be re-edited to save the price and image correctly
2. **The migration only needs to run once** - it checks if columns exist first
3. **On Render**, files are deleted on restart (need Cloudinary for production)

## Next Steps

After this works:
1. ✅ Update all existing products with correct prices
2. ✅ Re-upload images for existing products
3. ⚠️ Run the same migration on Render/Aiven database
4. ⚠️ Set up Cloudinary for persistent image storage
