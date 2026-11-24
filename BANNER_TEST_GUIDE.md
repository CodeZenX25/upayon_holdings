# Banner Section - Testing Guide

## ✅ Implementation Complete

All components have been built, tested for TypeScript errors, and production build verified.

## Quick Start Testing

### 1. Access Admin Banner Management
```
1. Go to http://localhost:3000/admin/login
2. Login with your admin credentials
3. Click "Banners" in the left sidebar
4. Click "Add Banner" to create your first banner
```

### 2. Create a Test Banner
```
- Title: "Welcome to Upayon Holdings"
- Subtitle: "Discover premium real estate opportunities"
- Upload an image or video (Max 5MB)
- Button Text: "Explore Projects"
- Button URL: "/projects"
- Background Color: Keep default (#000000)
- Text Color: Keep default (#ffffff)
- Click "Save All"
```

### 3. Display on Public Site
Add the banner to your homepage or any public page:

```tsx
// app/(public)/page.tsx or any public route
import { BannerSection } from "@/components/sections/banner-section";

export default function HomePage() {
  return (
    <>
      <BannerSection />
      {/* Rest of your page */}
    </>
  );
}
```

## Feature Testing Checklist

### Admin Panel Features
- [ ] **Add Banner**: Click "Add Banner" and form appears
- [ ] **Edit Banner**: Click edit icon to modify banner
- [ ] **Upload Image**: Drag & drop or click to upload image
  - [ ] Accepts JPG, PNG, WEBP formats
  - [ ] Shows upload progress
  - [ ] Displays preview thumbnail
- [ ] **Upload Video**: 
  - [ ] Accepts MP4, WebM formats
  - [ ] Shows video preview with Film icon
  - [ ] Automatically detects video format
- [ ] **Color Picker**: 
  - [ ] Click color squares to open color picker
  - [ ] Text color updates in real-time
  - [ ] Background color updates in real-time
- [ ] **Active/Inactive Toggle**: 
  - [ ] Check/uncheck to toggle banner visibility
  - [ ] Inactive banners don't show on public site
- [ ] **Reorder Banners**: 
  - [ ] Up/Down arrows move banners
  - [ ] Order affects display on public site
- [ ] **Delete Banner**: 
  - [ ] Clicking trash icon removes from list
  - [ ] Cloudinary asset is cleaned up
- [ ] **Save All**: 
  - [ ] Click "Save All" button
  - [ ] Should see success toast
  - [ ] Database is updated

### Public Display Features
- [ ] **Image Display**: Image renders with correct aspect ratio
- [ ] **Video Display**: 
  - [ ] Video plays automatically
  - [ ] Video loops continuously
  - [ ] Audio is muted
- [ ] **Text Display**: 
  - [ ] Title appears with correct styling
  - [ ] Subtitle appears if provided
  - [ ] Text color matches configured color
- [ ] **CTA Button**: 
  - [ ] Button appears if configured
  - [ ] Button text is correct
  - [ ] Clicking button navigates to URL
- [ ] **Responsive Design**: 
  - [ ] Mobile (h-96): Banner height is proportional
  - [ ] Desktop (h-screen): Banner fills viewport
  - [ ] Text remains readable on all sizes
- [ ] **Overlay**: 
  - [ ] 40% black overlay makes text readable
  - [ ] Overlay works with both images and videos

### Cloudinary Integration
- [ ] **Image Upload**: 
  - [ ] Image converted to WebP automatically
  - [ ] Image stored in upayon/banners/ folder
  - [ ] Cloudinary URL returned successfully
- [ ] **Video Upload**: 
  - [ ] Video stored in upayon/banners/ folder
  - [ ] Video URL returned successfully
- [ ] **Asset Cleanup**: 
  - [ ] Deleting banner removes from Cloudinary
  - [ ] Public URLs return 404 after deletion

### Edge Cases
- [ ] **No Active Banners**: Public site shows nothing (no errors)
- [ ] **Multiple Banners**: Only first active banner displays
- [ ] **Missing Image**: Component handles gracefully
- [ ] **Large Files**: 5MB limit enforced with error message
- [ ] **Invalid Format**: Only supported formats accepted

## API Testing

### Test with curl (after login)

```bash
# Get all banners (requires auth cookie)
curl -b "access_token=YOUR_TOKEN" \
  http://localhost:3000/api/admin/banners

# Create banner (requires auth)
curl -X POST \
  -H "Content-Type: application/json" \
  -b "access_token=YOUR_TOKEN" \
  -d '{
    "title": "Test Banner",
    "image": "https://res.cloudinary.com/.../image.webp",
    "mediaType": "image",
    "isActive": true,
    "order": 0
  }' \
  http://localhost:3000/api/admin/banners

# Get single banner
curl -b "access_token=YOUR_TOKEN" \
  http://localhost:3000/api/admin/banners/[ID]

# Update banner
curl -X PUT \
  -H "Content-Type: application/json" \
  -b "access_token=YOUR_TOKEN" \
  -d '{"title": "Updated Title"}' \
  http://localhost:3000/api/admin/banners/[ID]

# Delete banner
curl -X DELETE \
  -b "access_token=YOUR_TOKEN" \
  http://localhost:3000/api/admin/banners/[ID]
```

## Error Handling Tests

### File Size Limit
1. Try uploading a file > 5MB
2. Should see error: "File exceeds the 5MB limit"

### Invalid File Type
1. Try uploading a .gif or .pdf
2. Should see error: "Unsupported file type"

### Missing Required Fields
1. Try creating banner without title
2. Should see validation error

### Delete Nonexistent Banner
1. Try DELETE on invalid ID
2. Should see 404 error

## Performance Testing

### Load Time
1. Add `<BannerSection />` to homepage
2. Check page load time (should be < 2s with ISR cache)
3. Verify images are WebP (smaller file size)

### Database Queries
1. Each banner fetch sorts by order (efficient)
2. Displays first active banner only (single query)
3. 60s ISR cache reduces DB hits

## Troubleshooting

### Banner not appearing on public site?
- [ ] Banner is marked as `isActive: true`
- [ ] Added `<BannerSection />` to page
- [ ] No TypeScript errors in console

### Image not uploading?
- [ ] Check file size (max 5MB)
- [ ] Check file format (JPG, PNG, WEBP)
- [ ] Check Cloudinary credentials in .env
- [ ] Check browser console for errors

### Video not playing?
- [ ] Check format (MP4 or WebM)
- [ ] Try uploading test video from Cloudinary
- [ ] Check browser console for CORS errors

### Changes not saved?
- [ ] Check "Save All" button response
- [ ] Look for error toast notifications
- [ ] Check browser network tab in DevTools

## Notes
- All times are in UTC
- Timestamps automatically added by MongoDB
- Color picker uses hex format (#RRGGBB)
- Videos must be MP4 or WebM for auto-detection
