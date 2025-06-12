import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetch('/api/vehicles', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        return res.json();
      })
      .then(data => setVehicles(data))
      .catch(error => {
        console.error("Error fetching vehicles:", error);
        // Optionally, display an error message to the user
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data) => {
    try {
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
      } else {
        // Handle API errors, e.g., show a message to the user
        const errorData = await res.json();
        alert(`Failed to add vehicle: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("An unexpected error occurred while adding the vehicle.");
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          alert("Vehicle deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete vehicle: ${errorData.message || res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("An unexpected error occurred while deleting the vehicle.");
      }
    }
  };

  const handleAction = (action, vehicle) => {
    switch (action) {
      case 'services':
        navigate(`/vehicles/${vehicle.id}/services`);
        break;
      case 'dates':
        navigate(`/vehicles/${vehicle.id}/dates`);
        break;
      case 'edit':
        // This will likely involve opening the VehicleForm in edit mode,
        // or navigating to a dedicated edit page.
        // For now, let's just log and you can implement the form pre-population.
        navigate(`/vehicles/${vehicle.id}/edit`);
        break;
      case 'delete':
        handleDelete(vehicle.id);
        break;
      default:
        console.log(`Action: ${action} on ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`);
    }
  };

  if (loading) return <div className="loading">Loading vehicles...</div>;

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
          <div>ID</div>
          <div>Type</div>
          <div>Make</div>
          <div>Model</div>
          <div>Year</div>
          <div>License Plate</div>
          <div>VIN</div>
          <div>Actions</div>
        </div>

        {vehicles.length === 0 ? (
          <div className="no-vehicles">No vehicles added yet! Click "Add Vehicle" to get started!</div>
        ) : vehicles.map((v, i) => (
          <div key={v.id} className={`table-row animated-row`}>
            <div>{v.id}</div>
            <div>{v.type}</div>
            <div>{v.make}</div>
            <div>{v.model}</div>
            <div>{v.year}</div>
            <div>{v.licensePlate || 'N/A'}</div>
            <div>{v.vin || 'N/A'}</div>
            <div className="actions">
              <select onChange={e => handleAction(e.target.value, v)} defaultValue="">
                <option value="" disabled>Select Action</option>
                <option value="services">Services</option>
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