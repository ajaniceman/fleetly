const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE user_id = ?', [req.user.id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { maker, model, engine, registration_date, type } = req.body;
  const [row] = await pool.query(
    `INSERT INTO vehicles (user_id, maker, model, engine, registration_date, type)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, maker, model, engine, registration_date, type]
  );
  const [newRow] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [row.insertId]);
  res.status(201).json(newRow[0]);
});

// Add routes for EDIT, DELETE, and GET by ID...

module.exports = router;
