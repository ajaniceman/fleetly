const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');

// Helper function to convert snake_case object keys to camelCase
// and ensure numeric values from DB are parsed as numbers
const toCamelCaseAndParseNumbers = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  // If it's an array, map over each item
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCaseAndParseNumbers(item));
  }
  // If it's an object, convert its keys and parse specific numeric values
  const newObj = {};
  // List of fields that should be numbers/decimals based on your DB schema
  const numericFields = [
    'cost', 'odometer_reading', 'engine_hours',
    'next_service_odometer', 'next_service_hours'
  ];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      let value = obj[key];

      // Explicitly parse known numeric fields if they come as strings
      // Check if the key (original snake_case) is in our numeric fields list
      if (numericFields.includes(key) && typeof value === 'string' && !isNaN(parseFloat(value))) {
        value = parseFloat(value);
      }
      // If a numeric field is null in the database, it might still come as null, which is fine.
      // If it comes as 0, keep it as 0 unless a specific 'null if 0' rule is needed.

      newObj[camelKey] = value;
    }
  }
  return newObj;
};

// GET all services for a specific vehicle (protected)
router.get('/vehicle/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const [vehicleCheck] = await pool.query(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicleId, req.user.id]
    );

    if (vehicleCheck.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized.' });
    }

    const [services] = await pool.query('SELECT * FROM services WHERE vehicle_id = ? ORDER BY service_date DESC, created_at DESC', [vehicleId]);
    // Apply the conversion and parsing helper
    res.json(toCamelCaseAndParseNumbers(services));
  } catch (error) {
    console.error(`Error fetching services for vehicle ${vehicleId}:`, error);
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
});

// POST a new service record (protected)
router.post('/', async (req, res) => {
  const {
    vehicle_id, service_date, service_type, description, cost,
    odometer_reading, engine_hours, next_service_odometer, next_service_hours
  } = req.body;

  try {
    if (!vehicle_id || !service_date || !service_type) {
      return res.status(400).json({ message: 'Missing required service fields.' });
    }

    const [vehicleCheck] = await pool.query(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicle_id, req.user.id]
    );

    if (vehicleCheck.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to add service to this vehicle.' });
    }

    const [result] = await pool.query(
      `INSERT INTO services (vehicle_id, service_date, service_type, description, cost,
                             odometer_reading, engine_hours, next_service_odometer, next_service_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle_id, service_date, service_type, description, cost,
        odometer_reading, engine_hours, next_service_odometer, next_service_hours
      ]
    );

    const [newServiceRows] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    if (newServiceRows.length > 0) {
      // Apply the conversion and parsing helper to the single returned object
      res.status(201).json(toCamelCaseAndParseNumbers(newServiceRows[0]));
    } else {
      res.status(500).json({ message: "Failed to retrieve newly added service." });
    }
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ message: "Error adding service", error: error.message });
  }
});

// PUT (EDIT) an existing service record (protected)
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Service ID
  const {
    service_date, service_type, description, cost,
    odometer_reading, engine_hours, next_service_odometer, next_service_hours
  } = req.body;

  try {
    const [serviceCheck] = await pool.query(
      `SELECT s.id, s.vehicle_id, v.user_id
       FROM services s JOIN vehicles v ON s.vehicle_id = v.id
       WHERE s.id = ? AND v.user_id = ?`,
      [id, req.user.id]
    );

    if (serviceCheck.length === 0) {
      return res.status(404).json({ message: 'Service record not found or unauthorized.' });
    }

    const [result] = await pool.query(
      `UPDATE services SET
         service_date = ?,
         service_type = ?,
         description = ?,
         cost = ?,
         odometer_reading = ?,
         engine_hours = ?,
         next_service_odometer = ?,
         next_service_hours = ?
       WHERE id = ?`,
      [
        service_date, service_type, description, cost,
        odometer_reading, engine_hours, next_service_odometer, next_service_hours,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service record not found or no changes made.' });
    }

    const [updatedServiceRows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    // Apply the conversion and parsing helper to the single returned object
    res.json(toCamelCaseAndParseNumbers(updatedServiceRows[0]));
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
});

// DELETE a service record (protected)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [serviceCheck] = await pool.query(
      `SELECT s.id
       FROM services s JOIN vehicles v ON s.vehicle_id = v.id
       WHERE s.id = ? AND v.user_id = ?`,
      [id, req.user.id]
    );

    if (serviceCheck.length === 0) {
      return res.status(404).json({ message: 'Service record not found or unauthorized.' });
    }

    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service record not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
});

module.exports = router;
