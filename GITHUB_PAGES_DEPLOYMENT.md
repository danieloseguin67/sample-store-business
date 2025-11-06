# GitHub Pages Deployment Guide for Angular Applications

This guide documents the steps and fixes needed to deploy an Angular application to GitHub Pages with a custom domain.

## Overview

This deployment setup uses:
- **GitHub Actions** for automated CI/CD
- **Hash-based routing** for compatibility with GitHub Pages
- **Custom domain** support with CNAME configuration
- **Relative asset paths** for proper resource loading

---

## 1. GitHub Actions Workflow Setup

Create `.github/workflows/deploy.yml` with the following configuration:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Angular app
        run: npm run build -- --configuration production --base-href=/

      - name: Create CNAME file
        run: |
          mkdir -p ./dist/[PROJECT-NAME]/browser
          echo "your-custom-domain.com" > ./dist/[PROJECT-NAME]/browser/CNAME

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist/[PROJECT-NAME]/browser

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Important Notes:
- Replace `[PROJECT-NAME]` with your Angular project name from `angular.json`
- Replace `your-custom-domain.com` with your actual custom domain
- The `--base-href=/` works for custom domains
- For GitHub Pages default URL (`username.github.io/repo-name/`), use `--base-href=/repo-name/`

---

## 2. Enable Hash-Based Routing

Update `src/app/app.config.ts` to use hash location strategy:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient()
  ]
};
```

**Why?** Hash-based routing (`#/`) ensures all routes work on GitHub Pages without server-side configuration. URLs will look like: `example.com/#/about`

---

## 3. Fix Asset Loading Paths

If your app loads assets (e.g., translations, images) dynamically via HTTP, use **relative paths** instead of absolute paths.

### Before (Absolute Path - Won't Work):
```typescript
this.http.get<Translations>(`/assets/i18n/${lang}.json`)
```

### After (Relative Path - Works):
```typescript
this.http.get<Translations>(`assets/i18n/${lang}.json`)
```

**Why?** Relative paths automatically work with any `base-href` configuration, whether using custom domains or GitHub Pages default URLs.

---

## 4. GitHub Repository Settings

### Enable GitHub Pages:
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment" → **Source**, select **GitHub Actions**

### Configure Custom Domain (Optional):
1. In the same **Pages** settings
2. Under "Custom domain", enter your domain: `your-custom-domain.com`
3. Check **Enforce HTTPS** once DNS propagates

---

## 5. DNS Configuration for Custom Domain

Configure your DNS records at your domain provider:

### For Root Domain (example.com):
```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

### For Subdomain (subdomain.example.com):
```
Type: CNAME
Name: subdomain
Value: yourusername.github.io
```

**DNS Propagation:** May take 24-48 hours to fully propagate.

---

## 6. Common Issues and Fixes

### Issue: "Not Found" Error During Deployment (404 from deploy-pages action)
**Error Message:**
```
Error: Creating Pages deployment failed
Error: HttpError: Not Found
Error: Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

**Cause:** GitHub Pages is not enabled in repository settings
**Fix:** 
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment" → **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
4. Save the settings
5. Re-run the failed workflow from the Actions tab

**IMPORTANT:** You MUST enable GitHub Pages with "GitHub Actions" as the source BEFORE the first deployment will work.

### Issue: 404 Error or "File not found"
**Cause:** Incorrect output path in workflow
**Fix:** Verify the output path matches your `angular.json` configuration
- Check `outputPath` in `angular.json`
- Update workflow's `path: ./dist/[PROJECT-NAME]/browser` accordingly

### Issue: White/Blank Page with No Errors
**Possible Causes:**
1. **Browser/CDN Cache (Most Common)**
   - Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
   - Try incognito/private mode
   - Clear browser cache completely
   - Wait 5-10 minutes for GitHub Pages CDN to update
   - Try a different browser to rule out local cache issues

2. **Wrong base-href**
   - Custom domain: Use `--base-href=/`
   - GitHub Pages URL: Use `--base-href=/repo-name/`
   
3. **Missing Hash Router**
   - Ensure `withHashLocation()` is added to router configuration

4. **Check Browser Console (F12)**
   - Open Developer Tools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab - verify main.js, polyfills.js are loading (status 200, not 404)
   - If files show 404, check the build output path in workflow

### Issue: Assets Not Loading (404 for JSON, images, etc.)
**Cause:** Using absolute paths for assets
**Fix:** Change all asset paths from `/assets/...` to `assets/...` (relative paths)

### Issue: Translation Files Not Found
**Cause:** HTTP service using absolute path with wrong base-href
**Fix:** Update to relative paths (see section 3 above)

### Issue: Directory Not Found During CNAME Creation
**Cause:** Build output directory doesn't exist or wrong path
**Fix:** Add `mkdir -p` before creating CNAME file in workflow:
```yaml
- name: Create CNAME file
  run: |
    mkdir -p ./dist/[PROJECT-NAME]/browser
    echo "your-domain.com" > ./dist/[PROJECT-NAME]/browser/CNAME
```

### Issue: Site Works Locally But Not on GitHub Pages
**Possible Causes:**
1. **GitHub Pages not enabled** - Enable in Settings → Pages → Source: GitHub Actions
2. **Wrong base-href** - Verify it matches your deployment URL type
3. **Cache Issue** - Wait 10 minutes, then hard refresh browser
4. **Missing hash routing** - Ensure `withHashLocation()` is in app.config.ts
5. **Workflow error** - Check Actions tab for failed builds

### Issue: Custom Domain Shows "404 There isn't a GitHub Pages site here"
**Cause:** DNS not configured or not yet propagated
**Fix:**
1. Verify DNS records are correct at your domain provider
2. Wait 24-48 hours for DNS propagation
3. Check DNS with: `nslookup your-domain.com` or use https://dnschecker.org
4. Ensure CNAME file exists in deployed build
5. Verify custom domain is set in GitHub Pages settings

---

## 7. Testing Locally

Before deploying, test your build locally to catch issues early:

```bash
# Build with production configuration
npm run build -- --configuration production --base-href=/

# Serve the build (using npx http-server)
npx http-server dist/[PROJECT-NAME]/browser -p 8080

# Or using Python
cd dist/[PROJECT-NAME]/browser
python -m http.server 8080
```

Then visit: `http://localhost:8080/#/`

**What to Test:**
- [ ] Home page loads correctly
- [ ] All navigation links work
- [ ] Routes show correct content (e.g., /#/services, /#/contact)
- [ ] No 404 errors in browser console (F12 → Console)
- [ ] All assets load (images, JSON files, etc.)
- [ ] Translations work (if applicable)

If local testing works but deployment doesn't, it's likely a cache or GitHub Pages configuration issue.

---

## 8. Deployment Checklist

### Before First Deployment:
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Update project name in workflow paths (check `angular.json`)
- [ ] Set correct `base-href` for your deployment type
- [ ] Add custom domain to CNAME file (if applicable)
- [ ] Enable hash-based routing in `app.config.ts`
- [ ] Convert all asset paths to relative paths (if using HTTP for assets)
- [ ] Test build locally before pushing

### First Deployment:
- [ ] **CRITICAL:** Enable GitHub Pages in repository settings → Set Source to "GitHub Actions"
- [ ] Commit and push changes to trigger workflow
- [ ] Monitor workflow in Actions tab for any errors
- [ ] Wait 5-10 minutes for deployment and CDN propagation

### After First Deployment:
- [ ] Clear browser cache (Ctrl + Shift + R)
- [ ] Test site in incognito/private mode
- [ ] Verify all routes work (test navigation)
- [ ] Configure DNS records (if using custom domain)
- [ ] Add custom domain in GitHub Pages settings (if applicable)
- [ ] Enable HTTPS once DNS propagates

---

## 9. Maintenance and Updates

### Triggering a New Deployment
- Any push to the `main` branch automatically triggers deployment
- Manual trigger: Go to **Actions** → Select workflow → **Run workflow**

### Checking Deployment Status
- Go to **Actions** tab in your repository
- View the latest workflow run
- Check build and deploy steps for errors

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Monitoring
- Check GitHub Actions for build failures
- Monitor domain SSL certificate status
- Verify DNS propagation periodically

---

## 10. Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Custom Domain Configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## Summary

This deployment setup provides:
- ✅ Automated CI/CD with GitHub Actions
- ✅ Custom domain support
- ✅ Hash-based routing for SPA compatibility
- ✅ Proper asset loading with relative paths
- ✅ Production-optimized builds
- ✅ HTTPS support

The key differences when applying to other repositories:
1. Update project name in all paths
2. Adjust custom domain in CNAME file
3. Verify `angular.json` output path matches workflow
4. Ensure all asset paths are relative, not absolute
