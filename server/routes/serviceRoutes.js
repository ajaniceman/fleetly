const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');

router.post('/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  const { service_type, service_date, changed_oil_filter, changed_air_filter,
          changed_cabin_filter, description, cost } = req.body;

  const [row] = await pool.query(
    `INSERT INTO services (vehicle_id, service_type, service_date, changed_oil_filter,
       changed_air_filter, changed_cabin_filter, description, cost)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [vehicleId, service_type, service_date, changed_oil_filter, changed_air_filter,
     changed_cabin_filter, description, cost]
  );

  const [newRow] = await pool.query('SELECT * FROM services WHERE id = ?', [row.insertId]);
  res.status(201).json(newRow[0]);
});

// GET service history for a vehicle:
// router.get('/:vehicleId', ...)
// DELETE service: router.delete('/:id', ...)

module.exports = router;
