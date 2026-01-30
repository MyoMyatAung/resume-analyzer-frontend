# SEO Assets Checklist

This document outlines the required assets for complete SEO and PWA support.

## Required Images

### Open Graph / Social Media Image
**File:** `public/og-image.jpg`  
**Dimensions:** 1200 x 630 pixels  
**Format:** JPG or PNG  
**Purpose:** Displayed when sharing on Facebook, LinkedIn, Twitter, etc.

**Design recommendations:**
- Include your logo prominently
- Add a clear headline: "AI-Powered Resume Analysis"
- Use brand colors and professional styling
- Keep text minimal but impactful
- Ensure it looks good at smaller preview sizes

### Favicon Set
Generate these from your logo.svg using a favicon generator like [realfavicongenerator.net](https://realfavicongenerator.net):

| File | Size | Format |
|------|------|--------|
| `public/icons/favicon-16x16.png` | 16x16 | PNG |
| `public/icons/favicon-32x32.png` | 32x32 | PNG |
| `public/icons/apple-touch-icon.png` | 180x180 | PNG |
| `public/icons/icon-72x72.png` | 72x72 | PNG |
| `public/icons/icon-96x96.png` | 96x96 | PNG |
| `public/icons/icon-128x128.png` | 128x128 | PNG |
| `public/icons/icon-144x144.png` | 144x144 | PNG |
| `public/icons/icon-152x152.png` | 152x152 | PNG |
| `public/icons/icon-192x192.png` | 192x192 | PNG |
| `public/icons/icon-384x384.png` | 384x384 | PNG |
| `public/icons/icon-512x512.png` | 512x512 | PNG |

### PWA Screenshots (Optional)
For better PWA install experience:

| File | Size | Purpose |
|------|------|---------|
| `public/screenshots/desktop.png` | 1280x720 | Desktop preview |
| `public/screenshots/mobile.png` | 750x1334 | Mobile preview |

## Quick Generation Commands

### Using ImageMagick (if installed)
```bash
# Generate favicon sizes from logo.svg
convert -background none -density 300 src/assets/logo.svg -resize 16x16 public/icons/favicon-16x16.png
convert -background none -density 300 src/assets/logo.svg -resize 32x32 public/icons/favicon-32x32.png
convert -background none -density 300 src/assets/logo.svg -resize 180x180 public/icons/apple-touch-icon.png
convert -background none -density 300 src/assets/logo.svg -resize 192x192 public/icons/icon-192x192.png
convert -background none -density 300 src/assets/logo.svg -resize 512x512 public/icons/icon-512x512.png
# ... repeat for other sizes
```

### Online Tools
1. **Favicon Generator:** https://realfavicongenerator.net
2. **OG Image Generator:** https://og-image.xyz or Canva
3. **PWA Asset Generator:** https://www.pwabuilder.com/imageGenerator

## Verification Tools

After adding assets, verify your SEO using:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema Markup Validator](https://validator.schema.org/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

## Notes

- All images should be optimized for web (compressed)
- Consider using WebP format with JPG/PNG fallback for modern browsers
- Test social sharing on actual platforms after deployment
