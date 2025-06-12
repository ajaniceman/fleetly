const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');

// Helper function for camelCase conversion (same as in serviceRoutes.js)
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      newObj[camelKey] = obj[key];
    }
  }
  return newObj;
};

// GET all dates for a specific vehicle (protected)
router.get('/vehicle/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  try {
    // Ensure the user owns the vehicle before fetching its dates
    const [vehicleCheck] = await pool.query(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicleId, req.user.id]
    );

    if (vehicleCheck.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized.' });
    }

    const [dates] = await pool.query('SELECT * FROM vehicle_dates WHERE vehicle_id = ? ORDER BY due_date ASC', [vehicleId]);
    res.json(toCamelCase(dates)); // Convert to camelCase for frontend
  } catch (error) {
    console.error(`Error fetching dates for vehicle ${vehicleId}:`, error);
    res.status(500).json({ message: "Error fetching dates", error: error.message });
  }
});

// POST a new date record (protected)
router.post('/', async (req, res) => {
  const { vehicle_id, date_type, due_date, notes } = req.body;

  try {
    // Basic validation
    if (!vehicle_id || !date_type || !due_date) {
      return res.status(400).json({ message: 'Missing required date fields.' });
    }

    // Ensure the user owns the vehicle before adding a date to it
    const [vehicleCheck] = await pool.query(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicle_id, req.user.id]
    );

    if (vehicleCheck.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to add date to this vehicle.' });
    }

    const [result] = await pool.query(
      `INSERT INTO vehicle_dates (vehicle_id, date_type, due_date, notes)
       VALUES (?, ?, ?, ?)`,
      [vehicle_id, date_type, due_date, notes]
    );

    const [newDate] = await pool.query('SELECT * FROM vehicle_dates WHERE id = ?', [result.insertId]);
    res.status(201).json(toCamelCase(newDate[0])); // Convert to camelCase for frontend
  } catch (error) {
    console.error("Error adding date:", error);
    res.status(500).json({ message: "Error adding date", error: error.message });
  }
});

// PUT (EDIT) an existing date record (protected)
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Date ID
  const { date_type, due_date, notes } = req.body;

  try {
    // First, ensure the user owns this date record and the vehicle it belongs to
    const [dateCheck] = await pool.query(
      `SELECT vd.id, vd.vehicle_id, v.user_id
       FROM vehicle_dates vd JOIN vehicles v ON vd.vehicle_id = v.id
       WHERE vd.id = ? AND v.user_id = ?`,
      [id, req.user.id]
    );

    if (dateCheck.length === 0) {
      return res.status(404).json({ message: 'Date record not found or unauthorized.' });
    }

    const [result] = await pool.query(
      `UPDATE vehicle_dates SET
         date_type = ?,
         due_date = ?,
         notes = ?
       WHERE id = ?`,
      [date_type, due_date, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Date record not found or no changes made.' });
    }

    const [updatedDate] = await pool.query('SELECT * FROM vehicle_dates WHERE id = ?', [id]);
    res.json(toCamelCase(updatedDate[0])); // Convert to camelCase for frontend
  } catch (error) {
    console.error(`Error updating date ${id}:`, error);
    res.status(500).json({ message: "Error updating date", error: error.message });
  }
});

// DELETE a date record (protected)
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Date ID

  try {
    // Ensure the user owns this date record before deleting
    const [dateCheck] = await pool.query(
      `SELECT vd.id
       FROM vehicle_dates vd JOIN vehicles v ON vd.vehicle_id = v.id
       WHERE vd.id = ? AND v.user_id = ?`,
      [id, req.user.id]
    );

    if (dateCheck.length === 0) {
      return res.status(404).json({ message: 'Date record not found or unauthorized.' });
    }

    const [result] = await pool.query('DELETE FROM vehicle_dates WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Date record not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting date ${id}:`, error);
    res.status(500).json({ message: "Error deleting date", error: error.message });
  }
});

module.exports = router;
