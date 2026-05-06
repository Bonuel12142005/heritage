# Fix Product Images Not Showing

## Problem
After uploading product images, they show as blue placeholders instead of the actual images.

## Root Cause
The `artisan_products` and `workshops` tables don't have an `image_url` column to store the image paths. The images were being uploaded to the server but not saved in the database.

## Solution Applied

### 1. Added Database Columns ✅
Created migration to add `image_url` column to both tables:
- `artisan_products.image_url` - stores product image paths
- `workshops.image_url` - stores workshop image paths

### 2. Updated Save Routes ✅
Modified the product and workshop save routes to:
- Store uploaded image paths in the database
- Only update images when new ones are uploaded (preserves existing images on edit)

### 3. Updated View Templates ✅
Fixed the display templates to:
- Use `image_url` column instead of non-existent columns
- Add error handling for missing images
- Show placeholder icon if image fails to load

## How to Apply the Fix

### Step 1: Run the Migration

**On your local machine (if using local MySQL):**
```bash
node run-image-migration.js
```

**On Render (production with Aiven):**

You have two options:

**Option A: Run migration script on Render**
1. Push the code to GitHub
2. Render will deploy automatically
3. Go to Render Dashboard → Your Service → Shell
4. Run: `node run-image-migration.js`

**Option B: Run migration from your local machine to Aiven**
1. Temporarily update your `.env` file:
   ```
   DB_HOST=mysql-2a6b1cea-heritage-6610.d.aivencloud.com
   DB_PORT=17649
   DB_USER=avnadmin
   DB_PASSWORD=your-aiven-password-here
   DB_NAME=heritagelink
   ```
2. Run: `node run-image-migration.js`
3. Revert your `.env` file back to localhost settings

### Step 2: Restart Your Server

**Local:**
```bash
npm start
```

**Render:**
- Will restart automatically after deployment

### Step 3: Test Image Upload

1. Go to Artisan Dashboard → Products → Add Product
2. Fill in product details
3. Upload an image
4. Click "Update Product"
5. You should see success popup
6. Go back to Products page
7. **The image should now display!**

## What Changed

### Before:
```javascript
// Image uploaded but NOT saved to database
INSERT INTO artisan_products (name, description, ...) VALUES (?, ?, ...)
// No image_url column!
```

### After:
```javascript
// Image uploaded AND saved to database
INSERT INTO artisan_products (name, description, ..., image_url) VALUES (?, ?, ..., 'uploads/products/image-123.jpg')
// Image path stored in database ✅
```

### Template Before:
```html
<% if (product.product_image) { %>
    <!-- This column doesn't exist! -->
    <img src="/<%= product.product_image %>">
<% } %>
```

### Template After:
```html
<% if (product.image_url) { %>
    <!-- Uses correct column with error handling -->
    <img src="/<%= product.image_url %>" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas fa-box-open\'></i>';">
<% } %>
```

## Important Notes

### Existing Products
Products uploaded BEFORE this fix won't have images because:
1. The images were uploaded to the server
2. But the paths weren't saved in the database
3. On Render, those files are deleted on restart anyway (ephemeral storage)

**Solution:** Re-upload images for existing products by editing them.

### Render File Storage
Remember that files uploaded on Render are **ephemeral** (deleted on restart). For production, you should:
1. Set up Cloudinary or AWS S3
2. Update the multer configuration to upload to cloud storage
3. Store cloud URLs in the database

See `DEPLOYMENT_CHECKLIST.md` for cloud storage setup instructions.

## Verification

After applying the fix, verify it works:

### 1. Check Database Columns
Run this query in phpMyAdmin or MySQL client:
```sql
SHOW COLUMNS FROM artisan_products;
SHOW COLUMNS FROM workshops;
```

You should see `image_url` column in both tables.

### 2. Upload Test Product
1. Create a new product with an image
2. Check the database:
   ```sql
   SELECT id, name, image_url FROM artisan_products ORDER BY id DESC LIMIT 1;
   ```
3. You should see the image path like: `uploads/products/images-1234567890-123456789.jpg`

### 3. View Products Page
1. Go to `/artisan/products`
2. The product image should display
3. If it shows a placeholder, check browser console for errors

## Troubleshooting

### Issue: Migration fails with "Column already exists"
**Solution:** The columns are already added. Skip to Step 2.

### Issue: Images still not showing after migration
**Possible causes:**
1. Server not restarted after migration
2. Old products don't have image_url (need to re-upload)
3. Image file doesn't exist on server (Render ephemeral storage)

**Solution:**
- Restart server
- Upload a NEW product with image
- Check if the new product shows the image

### Issue: "Unknown column 'image_url'"
**Cause:** Migration didn't run successfully
**Solution:** Run the migration script again and check for errors

### Issue: Image path in database but not showing
**Possible causes:**
1. File doesn't exist at that path
2. Path is incorrect (missing leading slash)
3. File permissions issue

**Solution:**
- Check if file exists: `ls -la public/uploads/products/`
- Check the image URL in browser: `https://your-site.com/uploads/products/filename.jpg`
- Check server logs for 404 errors

## Files Modified

1. `server.js` - Updated product and workshop save routes
2. `views/artisan-products.xian` - Fixed image display
3. `views/artisan-workshops.xian` - Fixed image display
4. `migrations/add_product_image_column.sql` - SQL migration
5. `run-image-migration.js` - Migration script

## Next Steps

After images are working:
1. ✅ Test uploading products with images
2. ✅ Test uploading workshops with images
3. ✅ Test editing products (should preserve existing images)
4. ⚠️ Set up Cloudinary for production (see DEPLOYMENT_CHECKLIST.md)
5. ⚠️ Migrate existing product images to cloud storage

## Need Help?

If images still aren't showing:
1. Share the output from running `node run-image-migration.js`
2. Share a screenshot of the products page
3. Share the browser console errors (F12 → Console tab)
4. Share the database query result: `SELECT id, name, image_url FROM artisan_products LIMIT 5;`
