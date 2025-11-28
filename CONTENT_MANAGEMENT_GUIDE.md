# Homepage Content Management Guide

## Overview
The Admin Dashboard now includes a powerful CRUD (Create, Read, Update, Delete) system for managing homepage content dynamically without touching code.

## Features

### Manageable Sections
1. **Hero** - Main banner section
2. **Intro** - Introduction text
3. **Feature** - Feature cards (Why Choose Us)
4. **Service** - Service offerings
5. **Contact** - Contact information

## How to Use

### Accessing Content Management
1. Login as Admin
2. Navigate to "Homepage Content" in the sidebar
3. View all existing content in a table format

### Adding New Content
1. Click "Add Content" button
2. Fill in the form:
   - **Section**: Choose from dropdown (hero, intro, feature, service, contact)
   - **Title**: Main heading
   - **Description**: Detailed text
   - **Icon**: Emoji or text icon (e.g., 🚗, ✓)
   - **Order**: Number for sorting (lower numbers appear first)
   - **Active**: Check to make it visible on homepage
3. Click "Save"

### Editing Content
1. Click "Edit" button on any content row
2. Modify the fields
3. Click "Save"

### Deleting Content
1. Click "Delete" button on any content row
2. Confirm deletion

### Managing Order
- Use the "Order" field to control the sequence
- Lower numbers appear first
- Example: Order 1, 2, 3 will display in that sequence

## Content Sections Explained

### Features Section
- Displays as cards with icons
- Best for highlighting key benefits
- Recommended: 6-9 features
- Example: "24/7 Availability", "Verified Drivers"

### Services Section
- Displays as service cards
- Best for describing offerings
- Recommended: 4-6 services
- Example: "Hourly Drivers", "Airport Transfers"

### Contact Section
- Can be used for additional contact methods
- Supports metadata for phone, email, etc.

## Tips
- Keep titles short and impactful
- Use emojis for visual appeal
- Test changes by viewing the homepage
- Inactive content won't show on homepage but remains in database
- Use order numbers with gaps (10, 20, 30) for easier reordering later

## Default Content
If no content exists in the database, the homepage will display default hardcoded content. Run the seed script to populate initial content:

```bash
cd server
node seedContent.js
```

## API Endpoints

### Public (No Auth Required)
- `GET /api/content` - Get all active content
- `GET /api/content/feature` - Get all features
- `GET /api/content/service` - Get all services

### Admin Only
- `GET /api/admin/content` - Get all content (including inactive)
- `POST /api/admin/content` - Create new content
- `PUT /api/admin/content/:id` - Update content
- `DELETE /api/admin/content/:id` - Delete content

## Database Schema

```javascript
{
  section: String,      // 'hero', 'intro', 'feature', 'service', 'contact'
  title: String,        // Main heading
  description: String,  // Detailed text
  icon: String,         // Emoji or icon text
  order: Number,        // Sort order
  isActive: Boolean,    // Visibility toggle
  metadata: Map         // Additional key-value pairs
}
```

## Future Enhancements
- Image upload support
- Rich text editor for descriptions
- Preview before publishing
- Version history
- Bulk import/export
