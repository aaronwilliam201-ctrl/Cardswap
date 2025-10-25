
// Cardswap — Node/Express server (demo)
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const multer = require('multer');
const nodemailer = require('nodemailer');
const sanitize = require('sanitize-filename');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PUBLIC = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const SUB_FILE = path.join(DATA_DIR, 'submissions.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(SUB_FILE)) fs.writeFileSync(SUB_FILE, '[]', 'utf8');

app.use(express.static(PUBLIC));

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const name = sanitize(Date.now() + '-' + file.originalname);
    cb(null, name);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// POST /submit - receives trade requests (requires consent)
app.post('/submit', upload.single('cardImage'), (req, res) => {
console.log('Received submission:');
console.log('Body:', req.body);
if (req.file) {
  console.log('Uploaded file info:', req.file);
} else {
  console.log('No file uploaded.');
}
  const { name, contact, brand, value, code, consent } = req.body;
  if (!consent || consent !== 'yes') {
    return res.status(400).send('Consent is required.');
  }
  if (!name || !contact || !brand || !value) {
    return res.status(400).send('Please fill all required fields.');
  }

  const submission = {
    id: Date.now().toString(36),
    name: String(name),
    contact: String(contact),
    brand: String(brand),
    value: String(value),
    code: code ? String(code) : '',
    image: req.file ? req.file.filename : '',
    timestamp: new Date().toISOString()
  };

  const submissions = JSON.parse(fs.readFileSync(SUB_FILE, 'utf8'));
  submissions.push(submission);
  fs.writeFileSync(SUB_FILE, JSON.stringify(submissions, null, 2), 'utf8');

  // Send notification email if configured
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  if (notifyEmail && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || undefined,
      host: process.env.EMAIL_HOST || undefined,
      port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined,
      secure: process.env.EMAIL_SECURE === 'true' ? true : false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: smtpUser,
      to: notifyEmail,
      subject: `New Cardswap submission from ${submission.name}`,
      text: `Name: ${submission.name}\nContact: ${submission.contact}\nBrand: ${submission.brand}\nValue: ${submission.value}\nCode: ${submission.code || '(none)'}\nImage: ${submission.image || '(none)'}\nTime: ${submission.timestamp}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('Email error:', err);
      else console.log('Email sent:', info.response || info);
    });
  }

  res.send('<h3>Thanks — your submission was received. We will contact you.</h3><p><a href="/">Back</a></p>');
});

// Admin basic auth via env vars
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'change-this-password';
const users = {}; users[adminUser] = adminPass;
app.use('/admin', basicAuth({ users: users, challenge: true, realm: 'Cardswap Admin' }));

app.get('/admin', (req, res) => {
  const submissions = JSON.parse(fs.readFileSync(SUB_FILE, 'utf8'));
  let html = '<!doctype html><html><head><meta charset="utf-8"><title>Cardswap Admin</title></head><body style="font-family:Arial, sans-serif;max-width:900px;margin:20px auto;padding:0 16px">';
  html += '<h1>Cardswap - Submissions</h1><p><a href="/">Public site</a></p><table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse"><tr><th>ID</th><th>Name</th><th>Contact</th><th>Brand</th><th>Value</th><th>Code</th><th>Image</th><th>Time</th></tr>';
  submissions.slice().reverse().forEach(s => {
    html += `<tr><td>${escapeHtml(s.id)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.contact)}</td><td>${escapeHtml(s.brand)}</td><td>${escapeHtml(s.value)}</td><td>${escapeHtml(s.code || '')}</td><td>${s.image ? '<a href="/uploads/'+escapeHtml(s.image)+'" target="_blank">View</a>' : ''}</td><td>${escapeHtml(s.timestamp)}</td></tr>`;
  });
  html += '</table><p><a href="/admin/export">Download JSON</a></p></body></html>';
  res.send(html);
});

app.get('/admin/export', (req, res) => {
  res.download(SUB_FILE, 'submissions.json');
});

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOAD_DIR));

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
} // ✅ Added missing closing curly brace here

// Default homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// ---------- EMAIL SENDING ROUTE ----------
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Pass
    }
  });

  const mailOptions = {
    from: process.env.Email_User,
    to: process.env.Receiver_Email,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cardswap server running on port ${PORT}`));
