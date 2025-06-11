import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/vehicles', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(res => res.json())
      .then(setVehicles);
  }, []);

  const handleAdd = async (data) => {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const vehicle = await res.json();
      setVehicles([vehicle, ...vehicles]);
      setShowForm(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {showForm ? (
        <VehicleForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      ) : (
        <button onClick={() => setShowForm(true)} className="add-btn">+ Add Vehicle</button>
      )}

      <div className="vehicle-table">
        {/* Table header same as before */}
        {vehicles.length === 0 ? (
          <div>No vehicles. Add one!</div>
        ) : vehicles.map(v => (
          <div key={v.id} className="table-row">
            <div>{v.maker}</div><div>{v.model}</div><div>{v.engine}</div>
            <div>{new Date(v.registration_date).toLocaleDateString()}</div>
            <div>{v.type}</div>
            <div className="actions">
              <select onChange={(e) => { /* handle edit/service/delete */ e.target.value = ''; }}>
                <option>Actions</option>
                <option value="edit">Edit</option>
                <option value="service">Service</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
