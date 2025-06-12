import React, { useState, useEffect } from 'react';
import './ServiceForm.css';

// Define common service types
const commonServiceTypes = [
  'Oil Change',
  'Filter Change (Oil, Air, Fuel)',
  'Tire Rotation',
  'Brake Inspection/Replacement',
  'Fluid Check/Top-up (Coolant, Brake, Power Steering)',
  'Suspension Repair',
  'Electrical System Check',
  'Custom Repair/Part Change', // For user-defined entries
];

export default function ServiceForm({ onSubmit, onCancel, vehicleType, initial = {} }) {
  // Initialize form state with initial values (for editing) or empty strings (for adding)
  // Ensure all initial properties are accessed using camelCase, as data from backend is transformed
  const [form, setForm] = useState({
    service_date: initial?.serviceDate ? initial.serviceDate.split('T')[0] : '', // Using serviceDate (camelCase)
    service_type: initial?.serviceType || '', // Using serviceType (camelCase)
    description: initial?.description || '',
    cost: initial?.cost || '',
    odometer_reading: initial?.odometerReading || '', // Using odometerReading (camelCase)
    engine_hours: initial?.engineHours || '', // Using engineHours (camelCase)
    next_service_odometer: initial?.nextServiceOdometer || '', // Using nextServiceOdometer (camelCase)
    next_service_hours: initial?.nextServiceHours || '', // Using nextServiceHours (camelCase)
  });

  // Effect to update form if initial values change (e.g., when switching from add to edit mode)
  // This is crucial for form re-population
  useEffect(() => {
    setForm({
      service_date: initial?.serviceDate ? initial.serviceDate.split('T')[0] : '',
      service_type: initial?.serviceType || '',
      description: initial?.description || '',
      cost: initial?.cost || '',
      odometer_reading: initial?.odometerReading || '',
      engine_hours: initial?.engineHours || '',
      next_service_odometer: initial?.nextServiceOdometer || '',
      next_service_hours: initial?.nextServiceHours || '',
    });
  }, [initial]); // Dependency array: re-run this effect when 'initial' prop changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for submission.
    // Keys here should match the snake_case expected by your backend INSERT/UPDATE queries.
    const formDataToSubmit = {
      // vehicle_id is added by VehicleServicesPage component before calling onSubmit
      service_date: form.service_date,
      service_type: form.service_type,
      description: form.description,
      cost: parseFloat(form.cost) || 0, // Convert to number
      odometer_reading: parseInt(form.odometer_reading, 10) || null, // Convert to number or null
      engine_hours: parseFloat(form.engine_hours) || null, // Convert to number or null
      next_service_odometer: parseInt(form.next_service_odometer, 10) || null,
      next_service_hours: parseFloat(form.next_service_hours) || null,
    };

    onSubmit(formDataToSubmit);
  };

  // Determine which type of tracking input to show
  const showOdometer = ['Car', 'Truck', 'Van', 'Bus'].includes(vehicleType);
  const showEngineHours = ['Excavator', 'Roller'].includes(vehicleType);

  return (
    <form className="service-form" onSubmit={handleSubmit}>
      <h3>{initial?.id ? 'Edit Service Record' : 'Add New Service Record'}</h3>
      <div className="service-form-grid">
        <div>
          <label htmlFor="service_date">Service Date</label>
          <input
            id="service_date"
            type="date"
            name="service_date"
            value={form.service_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="service_type">Service Type</label>
          <select
            id="service_type"
            name="service_type"
            value={form.service_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Service Type</option>
            {commonServiceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cost">Cost ($)</label>
          <input
            id="cost"
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            step="0.01" // Allow decimal values for currency
            min="0"
          />
        </div>

        {/* Conditional inputs based on vehicle type */}
        {showOdometer && (
          <>
            <div>
              <label htmlFor="odometer_reading">Odometer Reading (KM)</label>
              <input
                id="odometer_reading"
                type="number"
                name="odometer_reading"
                value={form.odometer_reading}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="next_service_odometer">Next Service Odometer (KM)</label>
              <input
                id="next_service_odometer"
                type="number"
                name="next_service_odometer"
                value={form.next_service_odometer}
                onChange={handleChange}
                min="0"
              />
            </div>
          </>
        )}

        {showEngineHours && (
          <>
            <div>
              <label htmlFor="engine_hours">Engine Hours</label>
              <input
                id="engine_hours"
                type="number"
                name="engine_hours"
                value={form.engine_hours}
                onChange={handleChange}
                step="0.1" // Allow decimal values for hours
                min="0"
              />
            </div>
            <div>
              <label htmlFor="next_service_hours">Next Service Hours</label>
              <input
                id="next_service_hours"
                type="number"
                name="next_service_hours"
                value={form.next_service_hours}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
          </>
        )}

        <div className="full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="e.g., Replaced engine oil, oil filter, air filter; adjusted tire pressure."
          ></textarea>
        </div>
      </div>

      <div className="actions-form">
        <button type="submit" className="save-btn">
          {initial?.id ? 'Update Service' : 'Add Service'}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
