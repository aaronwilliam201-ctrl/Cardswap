# Cardswap - Gift Card Exchange

## Overview
Cardswap is a gift card exchange platform that allows users to submit gift cards for trade or sale. The application includes:
- Public-facing form for gift card submissions
- Image upload capability (up to 5MB)
- Admin dashboard with basic authentication
- Email notifications for new submissions
- Privacy policy page

## Project Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Storage**: JSON file-based storage (`data/submissions.json`)
- **File Uploads**: Multer (images stored in `uploads/`)
- **Email**: Nodemailer for submission notifications
- **Authentication**: Basic Auth for admin area

### Key Components
- `server.js` - Main Express server
- `index.html` - Public submission form
- `privacy.html` - Privacy policy page
- `styles.css` - Styling
- `data/` - Submission storage
- `uploads/` - Uploaded card images

### Environment Variables
The application uses the following environment variables:
- `PORT` - Server port (default: 5000)
- `ADMIN_USER` - Admin username (default: admin)
- `ADMIN_PASS` - Admin password (default: change-this-password)
- `EMAIL_USER` - SMTP email user for notifications
- `EMAIL_PASS` - SMTP password
- `NOTIFY_EMAIL` - Email address to receive notifications
- `Email_User` - Gmail SMTP user (contact form)
- `Email_Pass` - Gmail SMTP password (contact form)
- `Receiver_Email` - Email to receive contact form messages

### Routes
- `GET /` - Homepage with submission form
- `POST /submit` - Process gift card submissions
- `GET /admin` - Admin dashboard (requires auth)
- `GET /admin/export` - Download submissions as JSON
- `GET /privacy.html` - Privacy policy
- `POST /send-email` - Contact form email endpoint
- Static files served from root directory
- `/uploads/*` - Uploaded images

## Recent Changes
- **2025-10-25**: Imported to Replit environment
  - Updated server to listen on 0.0.0.0:5000 for Replit compatibility
  - Installed dependencies
  - Configured for Replit deployment

## User Preferences
None documented yet.

## Development Notes
- This is a demo application using file-based storage
- For production, migrate to a real database (PostgreSQL, MySQL) and object storage (S3)
- Ensure HTTPS is enabled in production
- Follow privacy laws (GDPR, CCPA) when handling user data
- Validate gift card codes server-side before accepting trades

## Security Considerations
- Admin area protected with basic authentication
- File upload size limited to 5MB
- Filenames sanitized to prevent directory traversal
- HTML output escaped to prevent XSS
- Consent required for submissions
