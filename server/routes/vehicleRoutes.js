const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');
const authMiddleware = require('../middleware/authMiddleware');

// Add new vehicle
router.post('/', authMiddleware, async (req, res) => {
  const { maker, model, engine, registration_date, last_service_date, service_history } = req.body;
  
  try {
    const [result] = await pool.query(
      `INSERT INTO vehicles 
       (user_id, maker, model, engine, registration_date, last_service_date, service_history)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, maker, model, engine, registration_date, last_service_date, service_history]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all user's vehicles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [vehicles] = await pool.query(
      'SELECT id, maker, model, engine, registration_date FROM vehicles WHERE user_id = ?',
      [req.userId]
    );
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single vehicle details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [vehicle] = await pool.query(
      'SELECT * FROM vehicles WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    
    if (vehicle.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;