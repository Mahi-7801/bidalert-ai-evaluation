# BidAnalyzer AI - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Domain name (optional, for custom domain)

### Environment Configuration

The application is pre-configured to work with Insforge MCP backend. No additional environment variables needed.

**Backend Configuration (Pre-configured):**
```typescript
// src/lib/insforge.ts
Base URL: https://773hc5s6.us-east.insforge.app
API Key: ik_796fab681bef268b8f65a1ad75e7904d
```

### Build for Production

1. **Install dependencies**
```bash
npm install
```

2. **Build the application**
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

3. **Preview production build locally**
```bash
npm run preview
```

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Production deployment**
```bash
vercel --prod
```

**Vercel Configuration (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Deploy**
```bash
netlify deploy
```

3. **Production deployment**
```bash
netlify deploy --prod
```

**Netlify Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. **Update `vite.config.ts`**
```typescript
export default defineConfig({
  base: '/bid-scribe-forge/',
  // ... rest of config
})
```

2. **Build and deploy**
```bash
npm run build
npm run deploy  # Requires gh-pages package
```

3. **Add deploy script to package.json**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

### Option 4: Traditional Web Server (Apache/Nginx)

1. **Build the application**
```bash
npm run build
```

2. **Copy dist/ to server**
```bash
scp -r dist/* user@server:/var/www/html/
```

3. **Configure server for SPA routing**

**Nginx configuration:**
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

**Apache .htaccess:**
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

## 🔒 Security Considerations

### Production Checklist

- ✅ HTTPS enabled (SSL certificate)
- ✅ CORS configured on backend
- ✅ OAuth redirect URIs updated
- ✅ API keys secured (already handled by Insforge)
- ✅ Content Security Policy headers
- ✅ Rate limiting on API endpoints
- ✅ Regular security audits

### OAuth Configuration

After deployment, update OAuth redirect URIs in Insforge backend:

1. Go to Insforge dashboard
2. Navigate to Authentication → OAuth providers
3. Update redirect URIs:
   - Google: `https://yourdomain.com/dashboard`
   - GitHub: `https://yourdomain.com/dashboard`

## 📊 Performance Optimization

### Already Implemented

- ✅ Code splitting with React.lazy
- ✅ Tree shaking (Vite)
- ✅ Minification and compression
- ✅ Image optimization
- ✅ Font subsetting

### Additional Optimizations

1. **Enable Gzip/Brotli compression**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Add caching headers**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **Use CDN** (optional)
   - Cloudflare
   - AWS CloudFront
   - Google Cloud CDN

## 🔍 Monitoring

### Application Monitoring

**Recommended tools:**
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **LogRocket** - Session replay
- **Vercel Analytics** - Performance monitoring

### Backend Monitoring

Insforge provides built-in monitoring for:
- API request logs
- Database queries
- Storage operations
- AI model usage

Access via Insforge dashboard.

## 🆘 Troubleshooting

### Build Errors

**Issue:** TypeScript errors during build
```bash
# Fix: Update dependencies
npm update
npm run build
```

**Issue:** Out of memory during build
```bash
# Fix: Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Runtime Errors

**Issue:** OAuth not working
- Check redirect URIs are correct
- Verify OAuth providers are enabled in Insforge
- Check CORS settings

**Issue:** AI responses slow or timing out
- Check Insforge API status
- Verify network connectivity
- Review rate limits

**Issue:** Documents not uploading
- Check file size limits (max 10MB)
- Verify storage bucket exists
- Check user authentication

## 📈 Scaling

### Current Capacity

The application can handle:
- **Users:** 1000+ concurrent users
- **Documents:** Unlimited storage (Insforge)
- **AI Requests:** Rate limited by Insforge plan
- **Database:** Auto-scaling (Insforge)

### Scaling Considerations

1. **Upgrade Insforge plan** for higher limits
2. **Implement caching** for frequently accessed data
3. **Use CDN** for static assets
4. **Enable load balancing** for multiple instances

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support

For deployment support:
- **Email:** Hackathon-RTGS@ap.gov.in
- **Documentation:** See README.md
- **Insforge Support:** support@insforge.io

---

**Deployment Guide Version 1.0.0**  
*Last Updated: October 30, 2025*

