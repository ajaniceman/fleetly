const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/dbPool');
const crypto = require('crypto'); // For generating secure tokens
const { sendVerificationEmail } = require('../utils/emailSender'); // Import email sender

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert user into database, with is_verified = FALSE
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, is_verified) VALUES (?, ?, ?, FALSE)', // Using 'password_hash'
      [name, email, hashedPassword]
    );
    const userId = result.insertId;

    // 4. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

    // 5. Save verification token in the database
    // THIS IS THE FIX: Ensure 'expiresAt' is used here, not 'verificationAt'
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, verificationToken, expiresAt] // Corrected variable name from verificationAt to expiresAt
    );

    // 6. Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
    await sendVerificationEmail(email, name, verificationUrl);

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.message.includes('Failed to send verification email')) {
      return res.status(500).json({ message: 'Registration successful, but failed to send verification email. Please contact support.' });
    }
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const user = users[0];

    // 2. Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email address to log in.' });
    }

    // 3. Compare passwords using 'password_hash' from the database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. Generate JWT
    const payload = {
      user: {
        id: user.id, // Ensure user.id is correctly passed from the database query
        name: user.name,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );

  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// NEW ROUTE: Verify Email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Verification token is missing.' });
    }

    // 1. Find the token in the database
    const [tokens] = await pool.query(
      'SELECT * FROM email_verification_tokens WHERE token = ?',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    const verificationRecord = tokens[0];

    // 2. Check if token has expired
    if (new Date() > new Date(verificationRecord.expires_at)) {
      // Optional: Delete expired token immediately
      await pool.query('DELETE FROM email_verification_tokens WHERE id = ?', [verificationRecord.id]);
      return res.status(400).json({ message: 'Verification token has expired.' });
    }

    // 3. Mark user as verified
    await pool.query(
      'UPDATE users SET is_verified = TRUE WHERE id = ?',
      [verificationRecord.user_id]
    );

    // 4. Delete the used token
    await pool.query('DELETE FROM email_verification_tokens WHERE id = ?', [verificationRecord.id]);

    res.status(200).json({ message: 'Email verified successfully!' });

  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Server error during email verification.', error: error.message });
  }
});

module.exports = router;
