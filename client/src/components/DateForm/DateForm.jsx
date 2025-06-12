import React, { useState, useEffect } from 'react';
import './DateForm.css';

// Define common date types for the dropdown
const commonDateTypes = [
  'Registration',
  'Fire Extinguisher Expiry',
  'Tachograph Calibration',
  'Annual Inspection',
  'Insurance Renewal',
  'Roadworthiness Test',
  'Safety Check',
  'License Renewal',
  'Other', // For custom entries
];

export default function DateForm({ onSubmit, onCancel, initial = {} }) {
  // Initialize form state with initial values (for editing) or empty strings (for adding)
  const [form, setForm] = useState({
    date_type: initial?.dateType || '', // Access camelCase for initial data
    due_date: initial?.dueDate ? initial.dueDate.split('T')[0] : '', // Access camelCase for initial data
    notes: initial?.notes || '',
  });

  // Effect to update form if initial values change (e.g., when switching from add to edit mode)
  useEffect(() => {
    setForm({
      date_type: initial?.dateType || '',
      due_date: initial?.dueDate ? initial.dueDate.split('T')[0] : '',
      notes: initial?.notes || '',
    });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for submission.
    // Keys here should match the snake_case expected by your backend INSERT/UPDATE queries.
    const formDataToSubmit = {
      // vehicle_id is added by VehicleDatesPage component before calling onSubmit
      date_type: form.date_type,
      due_date: form.due_date,
      notes: form.notes,
    };

    onSubmit(formDataToSubmit);
  };

  return (
    <form className="date-form" onSubmit={handleSubmit}>
      <h3>{initial?.id ? 'Edit Date Record' : 'Add New Date Record'}</h3>
      <div className="date-form-grid">
        <div>
          <label htmlFor="date_type">Date Type</label>
          <select
            id="date_type"
            name="date_type"
            value={form.date_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Date Type</option>
            {commonDateTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="due_date">Due Date</label>
          <input
            id="due_date"
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="full-width">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="e.g., Annual roadworthiness test."
          ></textarea>
        </div>
      </div>

      <div className="actions-form">
        <button type="submit" className="save-btn">
          {initial?.id ? 'Update Date' : 'Add Date'}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
