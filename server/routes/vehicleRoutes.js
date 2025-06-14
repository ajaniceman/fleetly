const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');

// Helper function to convert snake_case object keys to camelCase
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  // If it's an array, map over each item
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  // If it's an object, convert its keys
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      newObj[camelKey] = obj[key]; // Do not recursively convert nested objects for simplicity here, assuming flat structure
    }
  }
  return newObj;
};

// GET all vehicles for the authenticated user
router.get('/', async (req, res) => {
  // Defensive check for user ID (though middleware should handle this)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required: User ID missing." });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE user_id = ?', [req.user.id]);
    // Convert keys from snake_case to camelCase before sending to frontend
    res.json(toCamelCase(rows));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
});

// POST a new vehicle
router.post('/', async (req, res) => {
  // Crucial defensive check: Ensure user ID is available from the authenticated request
  if (!req.user || !req.user.id) {
    console.error("Error: User ID is null or undefined in request after authentication middleware.");
    return res.status(401).json({ message: "Authentication required: User ID missing." });
  }

  const { make, model, year, licensePlate, vin, engine, registration_date, type } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO vehicles (user_id, type, make, model, year, license_plate, vin, engine, registration_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, // Use the user ID from the authenticated request
        type,
        make,
        model,
        year,
        licensePlate, // This matches 'license_plate' in DB
        vin,
        engine,
        registration_date
      ]
    );

    const [newVehicleRows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);
    if (newVehicleRows.length > 0) {
      // Convert the newly inserted vehicle's keys to camelCase
      res.status(201).json(toCamelCase(newVehicleRows[0]));
    } else {
      res.status(500).json({ message: "Failed to retrieve newly added vehicle." });
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ message: "Error adding vehicle", error: error.message });
  }
});

// GET vehicle by ID
router.get('/:id', async (req, res) => {
  // Defensive check for user ID
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required: User ID missing." });
  }

  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized.' });
    }
    // Convert keys from snake_case to camelCase
    res.json(toCamelCase(rows[0]));
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    res.status(500).json({ message: "Error fetching vehicle", error: error.message });
  }
});

// PUT (EDIT) a vehicle by ID
router.put('/:id', async (req, res) => {
  // Defensive check for user ID
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required: User ID missing." });
  }

  const { id } = req.params;
  const { type, make, model, year, licensePlate, vin, engine, registration_date } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE vehicles SET
         type = ?, make = ?, model = ?, year = ?, license_plate = ?, vin = ?, engine = ?, registration_date = ?
       WHERE id = ? AND user_id = ?`,
      [type, make, model, year, licensePlate, vin, engine, registration_date, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized to update.' });
    }
    const [updatedRow] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    res.json(toCamelCase(updatedRow[0]));
  }
   catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Error updating vehicle", error: error.message });
  }
});

// DELETE a vehicle by ID
router.delete('/:id', async (req, res) => {
  // Defensive check for user ID
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required: User ID missing." });
  }

  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM vehicles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized to delete.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
});

module.exports = router;
