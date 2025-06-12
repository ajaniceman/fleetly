import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicles', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setVehicles(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data) => {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const newV = await res.json();
      setVehicles([newV, ...vehicles]);
      setShowForm(false);
    }
  };

  const handleAction = (action, v) => {
    // Stub for actions: edit, service, delete
    alert(`${action} on ${v.maker} ${v.model}`);
  };

  if (loading) return <div className="loading">Loading...</div>;

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
        <div className="table-header">
          <div>Type</div><div>Maker</div><div>Model</div><div>Engine</div><div>Reg. Date</div><div>Actions</div>
        </div>

        {vehicles.length === 0 ? (
          <div className="no-vehicles">No vehicles added yet!</div>
        ) : vehicles.map((v, i) => (
          <div key={v.id} className={`table-row animated-row`}>
            <div>{v.type}</div>
            <div>{v.maker}</div>
            <div>{v.model}</div>
            <div>{v.engine}</div>
            <div>{new Date(v.registration_date).toLocaleDateString()}</div>
            <div className="actions">
              <select onChange={e => handleAction(e.target.value, v)}>
                <option value="">Actions</option>
                <option value="service">Services</option>
                <option value="dates">Dates</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
