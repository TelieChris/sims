const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db'); // adjust if your path is different

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [existing] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = { id: results[0].id, username: results[0].username };
    res.json({ message: 'Login successful' });
  });
});

// CHECK AUTH
router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.json({ message: 'Logged out' });
});

// Check current session
router.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;
