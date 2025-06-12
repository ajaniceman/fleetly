import React, { useState, useEffect } from 'react';
import './VehicleForm.css';

const types = ['Car', 'Truck', 'Excavator', 'Roller', 'Van', 'Bus'];

export default function VehicleForm({ onSubmit, onCancel, initial = {} }) {
  // Initialize form state with initial values (for editing) or empty strings (for adding)
  // Use optional chaining (?.) to safely access properties of 'initial'
  const [form, setForm] = useState({
    type: initial?.type || '',
    make: initial?.make || '', // Changed from 'maker' to 'make' to match SQL
    model: initial?.model || '',
    year: initial?.year || '', // New field
    licensePlate: initial?.licensePlate || '', // New field, matches SQL 'license_plate'
    vin: initial?.vin || '', // New field
    engine: initial?.engine || '',
    registration_date: initial?.registration_date ? initial.registration_date.split('T')[0] : '' // Format date for input type="date"
  });

  // Effect to update form if initial values change (e.g., when switching from add to edit mode)
  // Also using optional chaining here
  useEffect(() => {
    setForm({
      type: initial?.type || '',
      make: initial?.make || '',
      model: initial?.model || '',
      year: initial?.year || '',
      licensePlate: initial?.licensePlate || '',
      vin: initial?.vin || '',
      engine: initial?.engine || '',
      registration_date: initial?.registration_date ? initial.registration_date.split('T')[0] : ''
    });
  }, [initial]);

  // Handle input changes, updating the corresponding state field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSubmit prop with the current form data
    // Ensure 'make' is used instead of 'maker' for consistency with backend
    onSubmit({
      ...form,
      // Convert year to a number, as it's an INT in SQL
      year: parseInt(form.year, 10),
    });
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <div className="vehicle-form-grid">
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" name="type" required value={form.type} onChange={handleChange}>
            <option value="">Select Type</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="make">Make</label>
          <input id="make" name="make" value={form.make} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="model">Model</label>
          <input id="model" name="model" value={form.model} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="year">Year</label>
          {/* Input type "number" for year, min/max can be added for validation */}
          <input id="year" type="number" name="year" value={form.year} onChange={handleChange} required min="1900" max={new Date().getFullYear() + 1} />
        </div>
        <div>
          <label htmlFor="licensePlate">License Plate (Optional)</label>
          <input id="licensePlate" name="licensePlate" value={form.licensePlate} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="vin">VIN (Optional)</label>
          <input id="vin" name="vin" value={form.vin} onChange={handleChange} maxLength="17" /> {/* VINs are typically 17 characters */}
        </div>
        <div>
          <label htmlFor="engine">Engine (Optional)</label>
          <input id="engine" name="engine" value={form.engine} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="registration_date">Registration Date</label>
          <input id="registration_date" type="date" name="registration_date" value={form.registration_date} onChange={handleChange} required />
        </div>
      </div>
      <div className="actions-form">
        <button type="submit" className="save-btn">Save Vehicle</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
