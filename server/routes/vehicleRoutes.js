const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool'); // Assuming this path is correct

// GET all vehicles for the authenticated user
router.get('/', async (req, res) => {
  try {
    // Selects all columns, including 'make', 'year', 'license_plate', 'vin'
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
});

// POST a new vehicle
router.post('/', async (req, res) => {
  // Destructure all fields from the request body.
  // Note: 'make' (from frontend) corresponds to 'make' in SQL,
  // 'licensePlate' (from frontend) corresponds to 'license_plate' in SQL.
  const { make, model, year, licensePlate, vin, engine, registration_date, type } = req.body;

  try {
    // SQL INSERT query updated to include all new fields and use 'make'
    const [result] = await pool.query(
      `INSERT INTO vehicles (user_id, type, make, model, year, license_plate, vin, engine, registration_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, // This is set by the authenticateToken middleware
        type,
        make, // Corrected from 'maker' to 'make'
        model,
        year,
        licensePlate, // Maps to 'license_plate' column
        vin,
        engine,
        registration_date
      ]
    );

    // After successful insertion, fetch the newly created vehicle by its ID
    const [newVehicleRows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);

    if (newVehicleRows.length > 0) {
      res.status(201).json(newVehicleRows[0]);
    } else {
      res.status(500).json({ message: "Failed to retrieve newly added vehicle." });
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    // Send a more informative error response
    res.status(500).json({ message: "Error adding vehicle", error: error.message });
  }
});

// GET vehicle by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure the user can only access their own vehicles
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    res.status(500).json({ message: "Error fetching vehicle", error: error.message });
  }
});

// PUT (EDIT) a vehicle by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // Destructure all fields that can be updated
  const { type, make, model, year, licensePlate, vin, engine, registration_date } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE vehicles SET
         type = ?,
         make = ?,  -- Corrected from 'maker' to 'make'
         model = ?,
         year = ?,
         license_plate = ?,
         vin = ?,
         engine = ?,
         registration_date = ?
       WHERE id = ? AND user_id = ?`,
      [type, make, model, year, licensePlate, vin, engine, registration_date, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      // If no rows were affected, the vehicle was not found or didn't belong to the user
      return res.status(404).json({ message: 'Vehicle not found or unauthorized to update.' });
    }
    // Fetch the updated row to send back
    const [updatedRow] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    res.json(updatedRow[0]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Error updating vehicle", error: error.message });
  }
});

// DELETE a vehicle by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure the user can only delete their own vehicles
    const [result] = await pool.query('DELETE FROM vehicles WHERE id = ? AND user_id = ?', [id, req.user.id]);

    if (result.affectedRows === 0) {
      // If no rows were affected, the vehicle was not found or didn't belong to the user
      return res.status(404).json({ message: 'Vehicle not found or unauthorized to delete.' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
});

module.exports = router;
