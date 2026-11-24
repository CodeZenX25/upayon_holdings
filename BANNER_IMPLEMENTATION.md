# Banner Section Implementation

## Overview
Dynamic banner management system with Cloudinary integration for images and videos.

## Files Created

### 1. Data Model
- `models/banner.ts` - Mongoose schema for banners with image/video support, colors, and CTA buttons

### 2. Validation
- `lib/validations/banner.ts` - Zod schema for banner input validation

### 3. API Routes
- `app/api/admin/banners/route.ts` - GET (fetch all), POST (create), PUT (bulk update)
- `app/api/admin/banners/[id]/route.ts` - GET (single), PUT (update), DELETE (single with Cloudinary cleanup)

### 4. Admin Components
- `components/admin/banners/banners-view.tsx` - Full admin UI for banner management
- `app/admin/(panel)/banners/page.tsx` - Admin page wrapper

### 5. Public Component
- `components/sections/banner-section.tsx` - Server component that displays active banners

### 6. Navigation
- Updated `components/admin/admin-shell.tsx` - Added "Banners" menu item with Film icon

### 7. Configuration
- Updated `lib/cloudinary.ts` - Added "banners" folder type
- Updated `app/api/upload/route.ts` - Added "banners" to valid folders
- Updated `components/admin/image-uploader.tsx` - Added "banners" folder support
- Updated `models/index.ts` - Exported BannerModel

## Features

### Admin Panel
✅ Create unlimited banners
✅ Edit banner properties:
  - Title (required)
  - Subtitle (optional)
  - Image or Video upload
  - Media type selector (image/video)
  - CTA button text and URL
  - Background color (with color picker)
  - Text color (with color picker)
  - Active/Inactive toggle
✅ Reorder banners (up/down controls)
✅ Delete banners
✅ Bulk save all banners
✅ Live preview while editing
✅ Automatic media type detection

### Public Display
✅ Server-side rendering (ISR with 60s revalidation)
✅ Responsive design (h-96 on mobile, h-screen on desktop)
✅ Support for image and video backgrounds
✅ Auto-looping video with muted audio
✅ Overlay for better text readability
✅ Displays only active banners
✅ Respects banner order
✅ CTA button (optional)

### Cloudinary Integration
✅ Automatic WebP conversion for images
✅ Support for MP4 and WebM videos
✅ 5MB file size limit
✅ Automatic cleanup on banner deletion
✅ Organized folder structure: `upayon/banners/`

## Usage

### In Admin Panel
1. Navigate to Admin → Banners
2. Click "Add Banner"
3. Fill in banner details
4. Click upload zone to add image/video
5. Reorder as needed
6. Click "Save All"

### In Public Site
To display the banner section at the top of your homepage:

```tsx
import { BannerSection } from "@/components/sections/banner-section";

export default function HomePage() {
  return (
    <>
      <BannerSection />
      {/* Rest of your page content */}
    </>
  );
}
```

## Database
Stored in MongoDB as `Banner` collection with fields:
- title (string, required)
- subtitle (string, optional)
- image (string, required) - Cloudinary URL
- videoUrl (string, optional)
- mediaType ("image" | "video")
- buttonText (string, optional)
- buttonUrl (string, optional)
- isActive (boolean)
- order (number)
- backgroundColor (string)
- textColor (string)
- timestamps (createdAt, updatedAt)

## API Endpoints

### GET /api/admin/banners
Fetch all banners (requires authentication)

### POST /api/admin/banners
Create a new banner (requires auth + content:write permission)

### PUT /api/admin/banners
Bulk update banners (requires auth + content:write permission)

### GET /api/admin/banners/[id]
Fetch single banner

### PUT /api/admin/banners/[id]
Update single banner

### DELETE /api/admin/banners/[id]
Delete banner and clean up Cloudinary assets

## Testing

### Admin Panel
1. Login to admin panel
2. Click "Banners" in sidebar
3. Create a test banner with image
4. Test video upload
5. Test color changes
6. Test reordering
7. Verify save functionality

### Public Site
1. Add `<BannerSection />` to homepage
2. Verify banner displays with correct styling
3. Test responsive design on mobile
4. Click CTA button (if added)
5. Test video autoplay and looping

### Edge Cases Tested
✅ No banners (component returns null)
✅ Multiple banners (displays first active)
✅ Empty titles
✅ Large file uploads (5MB limit enforced)
✅ Video format detection
✅ Cloudinary URL cleanup

## Notes
- Banners are sorted by `order` field on display
- Only active banners are shown publicly
- Component uses ISR (Incremental Static Regeneration) with 60s cache
- Supports external image URLs (not just Cloudinary)
- Video must be MP4 or WebM for auto-detection
- Color values stored as hex strings (#000000 format)
