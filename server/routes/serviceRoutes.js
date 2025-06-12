const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool'); // Assuming this path is correct

// GET all services for a specific vehicle (protected)
// This route will be called from VehicleServicesPage
router.get('/vehicle/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  try {
    // Ensure the user owns the vehicle before fetching its services
    const [vehicleCheck] = await pool.query(
      'SELECT id FROM vehicles WHERE id = ? AND user_id = ?',
      [vehicleId, req.user.id]
    );

    if (vehicleCheck.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or unauthorized.' });
    }

    const [services] = await pool.query('SELECT * FROM services WHERE vehicle_id = ? ORDER BY service_date DESC, created_at DESC', [vehicleId]);
    res.json(services);
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
    // Basic validation
    if (!vehicle_id || !service_date || !service_type) {
      return res.status(400).json({ message: 'Missing required service fields.' });
    }

    // Ensure the user owns the vehicle before adding a service to it
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

    const [newService] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json(newService[0]);
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
    // First, ensure the user owns this service record and the vehicle it belongs to
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
       WHERE id = ?`, // No need for user_id in WHERE here, already checked above
      [
        service_date, service_type, description, cost,
        odometer_reading, engine_hours, next_service_odometer, next_service_hours,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service record not found or no changes made.' });
    }

    const [updatedService] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    res.json(updatedService[0]);
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
});

// DELETE a service record (protected)
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Service ID

  try {
    // Ensure the user owns this service record before deleting
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
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
});

module.exports = router;
