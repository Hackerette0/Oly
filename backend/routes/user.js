// backend/routes/user.js
console.log("✅ user.js is now loading correctly!");

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const { analyzeSkin } = require('../utils/aiHelper'); // If this file is missing, comment out the call below
const { protect } = require('../middleware/auth');

router.use((req, res, next) => {
  console.log('──────────────────────────────');
  console.log('METHOD       :', req.method);
  console.log('originalUrl  :', req.originalUrl);
  console.log('baseUrl      :', req.baseUrl);
  console.log('path         :', req.path);
  console.log('url          :', req.url);
  console.log('──────────────────────────────');
  next();
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG allowed'));
    }
  },
});

// Log every request to this router
router.use((req, res, next) => {
  console.log(`[USER ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

// GET all diary entries
router.get('/skin-diary', protect, async (req, res) => {
  console.log('[GET skin-diary] Handler reached - user ID:', req.user?._id);

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No user attached' });
    }

    const user = await User.findById(req.user._id).select('skinDiary');
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    console.log('[GET skin-diary] Found user, entries count:', user.skinDiary?.length || 0);
    res.json(user.skinDiary || []);
  } catch (err) {
    console.error('[GET skin-diary] Crash:');
    console.error(err.stack || err);
    res.status(500).json({ error: 'Server error fetching diary' });
  }
});


// Quick test route (no login needed)
router.get('/test', (req, res) => {
  res.json({ message: "User router is working perfectly!" });
});

router.post('/skin-diary', protect, upload.single('photo'), async (req, res) => {
  console.log('[POST skin-diary] Handler reached - user ID:', req.user?._id);
  console.log('[POST skin-diary] File received:', req.file ? req.file.originalname : 'NO FILE');

  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let scores = { hydration: null, acneSeverity: null };
    try {
      scores = await analyzeSkin(req.file.path);
    } catch (aiErr) {
      console.error('[AI] Failed:', aiErr.message);
    }

    const newEntry = {
      date: new Date(),
      photoUrl: `/uploads/${req.file.filename}`,
      scores
    };

    user.skinDiary.push(newEntry);
    await user.save();

    console.log('[POST skin-diary] Saved entry successfully');
    res.json({ success: true, entry: newEntry });
  } catch (err) {
    console.error('[POST skin-diary] Error:');
    console.error(err.stack || err);
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Failed to save diary entry' });
  }
});

module.exports = router;