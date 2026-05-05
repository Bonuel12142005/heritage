# 🧶 Yarn Commands for HeritageLink Backend

## 📋 Available Yarn Commands

### Development Commands
```bash
# Install dependencies
yarn install
# or simply
yarn

# Start development server (with auto-restart)
yarn dev

# Start production server
yarn start

# Run database migrations
yarn migrate
```

### Deployment Commands
```bash
# Build for production (installs dependencies)
yarn build

# Start production server
yarn start
```

## 🚀 Render.com Deployment Configuration

### Build Command Options:
Choose ONE of these for Render deployment:

**Option 1: Yarn (Recommended)**
```
Build Command: yarn install
Start Command: yarn start
```

**Option 2: NPM (Alternative)**
```
Build Command: npm install
Start Command: npm start
```

**Option 3: Auto-detect**
```
Build Command: yarn
Start Command: yarn start
```

## 📦 Package Manager Detection

Your backend supports both npm and yarn:
- ✅ **package.json** - npm/yarn configuration
- ✅ **yarn.lock** - yarn lockfile (will be generated)
- ✅ **.yarnrc.yml** - yarn configuration

## 🔧 Local Development

### Using Yarn:
```bash
# Navigate to backend folder
cd backend

# Install dependencies
yarn

# Start development server
yarn dev
```

### Using NPM:
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Environment Variables

For both npm and yarn, set these in Render:
```
NODE_ENV=production
DATABASE_URL=your-aiven-postgresql-url
SESSION_SECRET=your-secret-key
PORT=3000
```

## 🚀 Render Deployment Steps

1. **Go to Render.com**
2. **Create Web Service** from your GitHub repository
3. **Configure**:
   - **Name**: heritagelink-api
   - **Build Command**: `yarn` or `yarn install`
   - **Start Command**: `yarn start`
   - **Plan**: Free
4. **Add Environment Variables** (database connection)
5. **Deploy!**

## 📊 Performance Comparison

| Package Manager | Install Speed | Disk Usage | Lockfile |
|----------------|---------------|------------|----------|
| **Yarn** | ⚡ Faster | 💾 Smaller | yarn.lock |
| **NPM** | 🐌 Slower | 💾 Larger | package-lock.json |

**Recommendation**: Use **Yarn** for better performance!

## 🔍 Troubleshooting

### If Yarn is not installed:
```bash
# Install Yarn globally
npm install -g yarn

# Verify installation
yarn --version
```

### If deployment fails:
1. Try using `npm install` instead of `yarn`
2. Check environment variables are set
3. Verify database connection string

## ✅ Ready for Deployment!

Your backend is configured to work with both npm and yarn. Choose yarn for better performance! 🧶✨