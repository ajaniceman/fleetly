import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './VehicleForm.css';

const types = ['Car', 'Truck', 'Excavator', 'Roller', 'Van', 'Bus'];

export default function VehicleForm({ onSubmit, onCancel, initial = {}, formTitle }) { // Added formTitle prop
  const { t } = useTranslation(); // Initialize useTranslation

  // Determine if registration date should be required based on initial type or form type
  const isRegistrationRequired = (type) => ['Car', 'Truck', 'Van', 'Bus'].includes(type);

  // Initialize form state with initial values (for editing) or empty strings (for adding)
  // Use optional chaining (?.) to safely access properties of 'initial'
  const [form, setForm] = useState({
    type: initial?.type || '',
    make: initial?.make || '',
    model: initial?.model || '',
    year: initial?.year || '',
    licensePlate: initial?.licensePlate || '',
    vin: initial?.vin || '',
    engine: initial?.engine || '',
    registration_date: initial?.registration_date ? initial.registration_date.split('T')[0] : ''
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

    // If registration is not required for the current type, ensure it's not sent as empty string if left blank
    const dataToSubmit = { ...form };
    if (!isRegistrationRequired(form.type) && !dataToSubmit.registration_date) {
        dataToSubmit.registration_date = null; // Send null or undefined to the backend
    }

    onSubmit({
      ...dataToSubmit, // Use the potentially modified dataToSubmit
      // Convert year to a number, as it's an INT in SQL
      year: parseInt(form.year, 10),
    });
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <h3>{formTitle}</h3> {/* Display the title passed from Dashboard */}
      <div className="vehicle-form-grid">
        <div>
          <label htmlFor="type">{t('vehicle_form_label_type')}</label>
          <select id="type" name="type" required value={form.type} onChange={handleChange}>
            <option value="">{t('vehicle_form_option_select_type')}</option>
            {types.map(type => (
              <option key={type} value={type}>{t(`vehicle_type_${type.toLowerCase()}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="make">{t('vehicle_form_label_make')}</label>
          <input id="make" name="make" value={form.make} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="model">{t('vehicle_form_label_model')}</label>
          <input id="model" name="model" value={form.model} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="year">{t('vehicle_form_label_year')}</label>
          <input id="year" type="number" name="year" value={form.year} onChange={handleChange} required min="1900" max={new Date().getFullYear() + 1} />
        </div>
        <div>
          <label htmlFor="licensePlate">{t('vehicle_form_label_license_plate')}</label>
          <input id="licensePlate" name="licensePlate" value={form.licensePlate} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="vin">{t('vehicle_form_label_vin')}</label>
          <input id="vin" name="vin" value={form.vin} onChange={handleChange} maxLength="17" />
        </div>
        <div>
          <label htmlFor="engine">{t('vehicle_form_label_engine')}</label>
          <input id="engine" name="engine" value={form.engine} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="registration_date">{t('vehicle_form_label_registration_date')}</label>
          <input
            id="registration_date"
            type="date"
            name="registration_date"
            value={form.registration_date}
            onChange={handleChange}
            required={isRegistrationRequired(form.type)}
          />
        </div>
      </div>
      <div className="actions-form">
        <button type="submit" className="save-btn">{initial?.id ? t('vehicle_form_update_btn') : t('vehicle_form_save_btn')}</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>{t('vehicle_form_cancel_btn')}</button>
      </div>
    </form>
  );
}
