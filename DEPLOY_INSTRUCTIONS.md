# 🚀 Quick Deployment Guide

Your website has been built successfully! Here are the easiest ways to deploy it:

## ✅ Build Status
- ✅ Production build completed successfully
- ✅ Files are in the `dist/` directory
- ✅ Ready for deployment

---

## 🎯 Option 1: Vercel (Recommended - Easiest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

**OR use the web interface:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your Git repository
5. Vercel will auto-detect Vite and deploy automatically!

---

## 🎯 Option 2: Netlify (Very Easy)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Deploy
```bash
netlify deploy
```

### Step 4: Deploy to Production
```bash
netlify deploy --prod
```

**OR use the web interface:**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop your `dist/` folder
4. Done! Your site is live!

---

## 🎯 Option 3: GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Add deploy script to package.json
The script is already in package.json:
```json
"deploy": "gh-pages -d dist"
```

### Step 3: Deploy
```bash
npm run deploy
```

**Note:** Update `vite.config.ts` base path if using a subdirectory:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

---

## 🎯 Option 4: Manual Deployment (Any Web Server)

### Step 1: Build (Already done!)
```bash
npm run build
```

### Step 2: Upload `dist/` folder
Upload all files from the `dist/` directory to your web server:
- Via FTP/SFTP
- Via SSH (scp)
- Via cPanel File Manager
- Via any hosting control panel

### Step 3: Configure Server

**For Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**For Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔧 Configuration Files Created

I've created these deployment configuration files for you:

1. **`vercel.json`** - Vercel deployment config
2. **`netlify.toml`** - Netlify deployment config
3. **`.github/workflows/deploy.yml`** - GitHub Actions CI/CD

---

## 🌐 After Deployment

### Important: Update OAuth Redirect URIs

After deploying, update your Insforge backend OAuth settings:

1. Go to your Insforge dashboard
2. Navigate to **Authentication → OAuth Providers**
3. Update redirect URIs to your production URL:
   - Google: `https://yourdomain.com/dashboard`
   - GitHub: `https://yourdomain.com/dashboard`

### Update Backend URL (if needed)

If your Insforge backend URL changes, update it in:
- `src/lib/insforge.ts` → `INSFORGE_BASE_URL`

---

## 📊 Recommended Platforms

| Platform | Free Tier | Ease | Best For |
|----------|-----------|------|----------|
| **Vercel** | ✅ Yes | ⭐⭐⭐⭐⭐ | Best overall |
| **Netlify** | ✅ Yes | ⭐⭐⭐⭐⭐ | Easy drag-drop |
| **GitHub Pages** | ✅ Yes | ⭐⭐⭐⭐ | Free, simple |
| **Cloudflare Pages** | ✅ Yes | ⭐⭐⭐⭐ | Fast CDN |

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **GitHub Pages:** https://pages.github.com

---

## ✨ Quick Start (Recommended)

**Just want to deploy quickly? Use Vercel:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

That's it! Your site will be live in under 2 minutes! 🎉

---

**Your production build is ready in the `dist/` folder!**

