# Deployment Guide

This guide covers building and deploying the Flip Clock App for production environments.

## Build Process

### Production Build

The application uses Vite as the build tool, which provides optimized production builds with:

- Code minification and compression
- Asset optimization and bundling
- Tree shaking for smaller bundle sizes
- Modern ES modules with fallbacks

```bash
# Build for production
npm run build
```

This command:

1. Compiles React components and JavaScript modules
2. Processes and optimizes CSS files
3. Optimizes and copies static assets
4. Generates optimized HTML with proper asset references
5. Outputs everything to the `dist/` directory

### Build Output

The build process creates a `dist/` directory with the following structure:

```
dist/
├── index.html          # Main HTML file with optimized asset references
├── assets/
│   ├── index-[hash].js # Bundled and minified JavaScript
│   ├── index-[hash].css # Bundled and minified CSS
│   └── [other-assets]  # Optimized images, fonts, etc.
└── vite.svg           # Static assets from public/
```

### Build Configuration

The build is configured in `vite.config.js`:

- **React Plugin**: Enables React Fast Refresh and JSX processing
- **ES Modules**: Modern module system for better performance
- **Asset Optimization**: Automatic optimization of images and other assets
- **Code Splitting**: Automatic code splitting for better loading performance

## Deployment Options

### Static Hosting Services

The Flip Clock App is a client-side React application that can be deployed to any static hosting service.

#### Netlify

1. **Automatic Deployment** (Recommended):

   ```bash
   # Connect your repository to Netlify
   # Build command: npm run build
   # Publish directory: dist
   ```

2. **Manual Deployment**:

   ```bash
   npm run build
   # Upload dist/ folder to Netlify
   ```

3. **Netlify Configuration** (`netlify.toml`):

   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Vercel

1. **Automatic Deployment**:

   ```bash
   # Connect repository to Vercel
   # Framework: Vite
   # Build command: npm run build
   # Output directory: dist
   ```

2. **Vercel Configuration** (`vercel.json`):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

#### GitHub Pages

1. **Setup GitHub Actions** (`.github/workflows/deploy.yml`):

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: "18"
             cache: "npm"
         - run: npm ci
         - run: npm run build
         - uses: actions/deploy-pages@v1
           with:
             artifact_name: github-pages
             path: dist
   ```

2. **Configure Repository**:
   - Enable GitHub Pages in repository settings
   - Set source to "GitHub Actions"

#### Firebase Hosting

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:

   ```bash
   firebase init hosting
   # Public directory: dist
   # Single-page app: Yes
   # Automatic builds: Optional
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

### Traditional Web Servers

#### Apache

1. **Upload Files**:

   ```bash
   # Upload dist/ contents to web root
   scp -r dist/* user@server:/var/www/html/
   ```

2. **Apache Configuration** (`.htaccess`):
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

#### Nginx

1. **Server Configuration**:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/flip-clock-app;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

## Environment Configuration

### Environment Variables

The application supports environment variables for configuration:

```bash
# .env.production
VITE_APP_TITLE="Flip Clock App"
VITE_API_URL="https://api.example.com"
```

**Note**: Only variables prefixed with `VITE_` are exposed to the client-side code.

### Build-time Configuration

Modify `vite.config.js` for build-specific settings:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/flip-clock/", // For subdirectory deployment
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Set to true for debugging
  },
});
```

### Custom Domain Setup

1. **Add CNAME file** (for GitHub Pages):

   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Configure DNS**:
   - Add CNAME record pointing to hosting service
   - Wait for DNS propagation (up to 24 hours)

## Performance Optimization

### Build Optimizations

1. **Bundle Analysis**:

   ```bash
   npm install --save-dev rollup-plugin-visualizer
   # Add to vite.config.js plugins array
   npm run build
   # Open dist/stats.html to analyze bundle
   ```

2. **Asset Optimization**:
   - Images are automatically optimized by Vite
   - Use WebP format for better compression
   - Implement lazy loading for large assets

### Caching Strategy

1. **Static Assets**: Long-term caching with hash-based filenames
2. **HTML**: Short-term caching to ensure updates are received
3. **Service Worker**: Consider adding for offline functionality

## Troubleshooting

### Common Build Issues

#### "Module not found" Errors

**Problem**: Import paths not resolving correctly

```bash
Error: Cannot resolve module './Component'
```

**Solution**:

1. Check file extensions in imports
2. Verify case sensitivity in file names
3. Ensure barrel exports (`index.js`) are correct

#### Memory Issues During Build

**Problem**: Build fails with out-of-memory errors

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution**:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Asset Loading Issues

**Problem**: Assets not loading in production

```bash
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

**Solution**:

1. Check `base` configuration in `vite.config.js`
2. Verify asset paths are relative
3. Ensure assets are in `public/` directory for static files

### Deployment Issues

#### 404 Errors on Page Refresh

**Problem**: Direct URL access returns 404
**Cause**: Server doesn't handle client-side routing
**Solution**: Configure server redirects (see hosting-specific sections above)

#### HTTPS Mixed Content Warnings

**Problem**: HTTP resources loaded on HTTPS site
**Solution**:

1. Ensure all external resources use HTTPS
2. Use protocol-relative URLs: `//example.com/resource`
3. Configure Content Security Policy headers

#### Slow Loading Performance

**Problem**: Application loads slowly
**Solutions**:

1. Enable gzip compression on server
2. Implement CDN for static assets
3. Optimize images and reduce bundle size
4. Enable browser caching headers

### Environment-Specific Issues

#### Development vs Production Differences

**Problem**: App works in development but not production
**Common Causes**:

1. Environment variables not set correctly
2. Different Node.js versions
3. Missing production dependencies
4. Case sensitivity issues (Linux vs Windows)

**Debug Steps**:

1. Test production build locally: `npm run preview`
2. Check browser console for errors
3. Verify environment variables
4. Compare dependency versions

#### Build Performance Issues

**Problem**: Slow build times
**Solutions**:

1. Use `npm ci` instead of `npm install` in CI/CD
2. Cache `node_modules` in CI/CD pipelines
3. Use faster build machines
4. Consider build parallelization

## Monitoring and Maintenance

### Health Checks

1. **Automated Testing**: Set up CI/CD to run tests before deployment
2. **Uptime Monitoring**: Use services like Pingdom or UptimeRobot
3. **Performance Monitoring**: Implement analytics and performance tracking

### Update Process

1. **Staging Environment**: Test changes before production
2. **Rollback Plan**: Keep previous build available for quick rollback
3. **Gradual Rollout**: Consider blue-green or canary deployments

### Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Content Security Policy**: Implement CSP headers
3. **Dependency Updates**: Regularly update dependencies for security patches
4. **Asset Integrity**: Use Subresource Integrity (SRI) for external resources
