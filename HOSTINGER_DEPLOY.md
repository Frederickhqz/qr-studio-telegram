# Hostinger Deployment Guide

## Issue: Black Screen

The Vite build outputs to `dist/` folder. Hostinger needs the files in `public_html/` root.

## Solution 1: Move dist to root (Recommended)

In Hostinger file manager:
1. Go to `public_html/`
2. Delete/move old files
3. Upload contents of `dist/` folder (not the folder itself)

Structure should be:
```
public_html/
├── index.html
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
└── manifest.json
```

## Solution 2: Use .htaccess redirect

Create `public_html/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /dist/$1 [L]
```

## Solution 3: Update Hostinger build settings

In Hostinger Git deployment settings, set:
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

## Debug Steps

1. Open browser dev tools (F12 → Console)
2. Check for 404 errors
3. Check if `index.html` loads (Network tab)
4. Verify assets path (should be `./assets/` or `/assets/`)

## Common Errors

| Error | Fix |
|-------|-----|
| `Failed to load module` | Assets in wrong folder |
| `404 on /assets/` | Base path wrong in vite.config.ts |
| `Blank white screen` | React crash, check console |
| `Black screen` | CSS loaded but JS failed |

## Quick Fix Script

If you have SSH access:
```bash
cd ~/domains/telegram.qrgen.studio/public_html
rm -rf *
cp -r ~/.builds/source/repository/dist/* .
```

## Verify Build Locally

```bash
npm run build
npm run preview
```

Then check `dist/` folder has:
- index.html
- assets/ folder with .js and .css files
