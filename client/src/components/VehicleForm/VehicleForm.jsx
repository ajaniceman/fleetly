import React, { useState } from 'react';
import './VehicleForm.css';

const types = ['Car', 'Truck', 'Excavator', 'Roller', 'Van', 'Bus'];

export default function VehicleForm({ onSubmit, onCancel, initial = {} }) {
  const [form, setForm] = useState({
    type: initial.type || '',
    maker: initial.maker || '',
    model: initial.model || '',
    engine: initial.engine || '',
    registration_date: initial.registration_date || ''
  });

  return (
    <form className="vehicle-form" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <div className="vehicle-form-grid">
        <div>
          <label>Type</label>
          <select name="type" required value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="">Select</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label>Maker</label>
          <input name="maker" value={form.maker} onChange={e => setForm({...form, maker: e.target.value})} required />
        </div>
        <div>
          <label>Model</label>
          <input name="model" value={form.model} onChange={e => setForm({...form, model: e.target.value})} required />
        </div>
        <div>
          <label>Engine</label>
          <input name="engine" value={form.engine} onChange={e => setForm({...form, engine: e.target.value})} required />
        </div>
        <div>
          <label>Registration Date</label>
          <input type="date" name="registration_date" value={form.registration_date} onChange={e => setForm({...form, registration_date: e.target.value})} required />
        </div>
      </div>
      <div className="actions-form">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
