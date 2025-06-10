// server/authRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('./dbPool'); // assume you export your MySQL pool

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  // Simple check and store in `users` table
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if(rows.length) return res.json({ message: 'Email exists' });

  await pool.query(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, password, name]
  );
  res.json({ message: 'Registered!' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query(
    'SELECT id, name FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  if (!rows.length) return res.json({ message: 'Wrong credentials' });
  res.json({ message: `Welcome, ${rows[0].name}!` });
});

module.exports = router;
