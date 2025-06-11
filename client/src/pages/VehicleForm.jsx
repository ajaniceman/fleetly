import React, { useState } from 'react';
import './VehicleForm.css';

const types = ['Car','Truck','Excavator','Roller','Bus','Van','Trailer'];

export default function VehicleForm({ onSubmit, onCancel, initial = {} }) {
  const [form, setForm] = useState({
    maker: initial.maker || '',
    model: initial.model || '',
    engine: initial.engine || '',
    type: initial.type || '',
    registration_date: initial.registration_date || '',
  });

  return (
    <form className="vehicle-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      {/* input fields for maker, model, engine */}
      <div className="input-group">
        <label>Type</label>
        <select name="type" value={form.type} onChange={e => setForm({...form, type:e.target.value})} required>
          <option value="">Select type</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="actions-form">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
