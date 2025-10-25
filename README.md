
# Cardswap — Gift Card Exchange (Demo)

Thank you — this package contains a ready-to-run website for **Cardswap** (green & white theme)
that allows guests to submit gift cards for trade/sale, including optional image uploads, and an
admin area where you can view submissions. All submissions require explicit consent.

## Included
- public/ (frontend files: index.html, styles.css, privacy.html)
- server.js (Node/Express server handling submissions, uploads, admin view, email notifications)
- package.json (dependencies)
- data/ (submissions will be stored here)
- uploads/ (uploaded images will be stored here)

## Quick start (local)
1. Install Node.js (v16+ recommended) and npm.
2. Unzip the package and `cd` into the folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set environment variables (recommended):
   ```bash
   export ADMIN_USER=admin
   export ADMIN_PASS=change-this-password
   export EMAIL_USER=your-smtp-user@example.com
   export EMAIL_PASS=your-smtp-password
   export NOTIFY_EMAIL=aaronwilliam201@gmail.com
   ```
   On Windows (PowerShell):
   ```powershell
   $env:ADMIN_USER='admin'; $env:ADMIN_PASS='change-this-password'; $env:EMAIL_USER='...'; $env:EMAIL_PASS='...'; $env:NOTIFY_EMAIL='aaronwilliam201@gmail.com'
   ```
   NOTE: For Gmail SMTP you may need an App Password or enable "less secure apps" (not recommended).
5. Start the server:
   ```bash
   npm start
   ```
6. Visit the site at `http://localhost:3000` and the admin at `http://localhost:3000/admin`.
   Default admin credentials (if not set): admin / change-this-password

## Hosting
- You can host on any Node-capable provider (DigitalOcean droplet, Render, Railway, Heroku, VPS).
- Make sure to set the environment variables on the host and enable HTTPS (TLS).
- Use a process manager like `pm2` for production:
  ```bash
  npm install -g pm2
  pm2 start server.js --name cardswap
  ```

## Security & Legal Notes (read carefully)
- This demo stores submissions in `data/submissions.json` and uploaded images in `uploads/`.
- For production, use a real database (Postgres, MySQL, or managed DB) and object storage (S3).
- Never store more data than necessary; follow privacy laws (GDPR, CCPA, etc.).
- Use strong admin credentials, HTTPS, and rotate SMTP credentials regularly.
- Validate and verify gift card codes server-side before accepting trades in production.
- This project is a template/demo. You are responsible for legal/compliance requirements before operating.
