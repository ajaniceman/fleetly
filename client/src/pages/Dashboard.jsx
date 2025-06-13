import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null); // New state to hold the vehicle being edited
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

  // Combined function to handle both adding and editing (saving) a vehicle
  const handleSave = async (formData) => {
    let res;
    let url;
    let method;

    if (editingVehicle) {
      // If editingVehicle is set, it's an UPDATE (PUT) operation
      url = `/api/vehicles/${editingVehicle.id}`;
      method = 'PUT';
    } else {
      // Otherwise, it's a new ADD (POST) operation
      url = '/api/vehicles';
      method = 'POST';
    }

    try {
      res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const savedVehicle = await res.json();
        setVehicles(prevVehicles => {
          if (editingVehicle) {
            // Update the existing vehicle in the list
            return prevVehicles.map(v => v.id === savedVehicle.id ? savedVehicle : v);
          } else {
            // Add new vehicle to the top of the list
            return [savedVehicle, ...prevVehicles];
          }
        });
        setShowForm(false); // Hide the form
        setEditingVehicle(null); // Clear the editing state
        alert(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
      } else {
        // Handle API errors, e.g., show a message to the user
        const errorData = await res.json();
        alert(`Failed to ${editingVehicle ? 'update' : 'add'} vehicle: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${editingVehicle ? 'updating' : 'adding'} vehicle:`, error);
      alert(`An unexpected error occurred while ${editingVehicle ? 'updating' : 'adding'} the vehicle.`);
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
        setEditingVehicle(vehicle); // Set the vehicle to be edited
        setShowForm(true); // Show the form
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

      {/* Conditionally render VehicleForm or Add Vehicle button */}
      {showForm ? (
        <VehicleForm
          onSubmit={handleSave} // Form submits to the new handleSave function
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null); // Clear editing state on cancel
          }}
          initial={editingVehicle} // Pass the editingVehicle for pre-population
        />
      ) : (
        <button onClick={() => {
          setEditingVehicle(null); // Ensure no vehicle is being edited when adding
          setShowForm(true); // Show the form for adding
        }} className="add-btn">+ Add Vehicle</button>
      )}

      <div className="vehicle-table">
        <div className="table-header">
          {/* Removed ID column header */}
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
            {/* Removed ID display */}
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
