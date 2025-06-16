// client/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import './Dashboard.css'; // Assuming you have Dashboard.css

export default function Dashboard() {
  const { user, fetchWithAuth } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [error, setError] = useState('');

  // Fetch vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetchWithAuth('/api/vehicles');
        if (!res.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError(err.message || "Failed to load vehicles.");
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Only fetch if user is authenticated
      fetchVehicles();
    } else {
      setLoading(false);
      navigate('/login'); // Redirect to login if no user
    }
  }, [user, navigate, fetchWithAuth]);

  const handleSaveVehicle = async (formData) => {
    let res;
    let url;
    let method;

    if (editingVehicle) {
      url = `/api/vehicles/${editingVehicle.id}`;
      method = 'PUT';
    } else {
      url = '/api/vehicles';
      method = 'POST';
    }

    try {
      res = await fetchWithAuth(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const savedVehicle = await res.json();
        setVehicles(prevVehicles => {
          if (editingVehicle) {
            return prevVehicles.map(v => v.id === savedVehicle.id ? savedVehicle : v);
          } else {
            return [savedVehicle, ...prevVehicles];
          }
        });
        setShowVehicleForm(false);
        setEditingVehicle(null);
        alert(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
      } else {
        const errorData = await res.json();
        setError(errorData.message || res.statusText);
        alert(`Failed to ${editingVehicle ? 'update' : 'add'} vehicle: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(`Error ${editingVehicle ? 'updating' : 'adding'} vehicle:`, err);
      setError(`An unexpected error occurred while ${editingVehicle ? 'updating' : 'adding'} the vehicle.`);
      alert(`An unexpected error occurred while ${editingVehicle ? 'updating' : 'adding'} the vehicle.`);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle and all its associated services and dates?")) {
      try {
        const res = await fetchWithAuth(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleId));
          alert("Vehicle deleted successfully!");
        } else {
          const errorData = await res.json();
          setError(errorData.message || res.statusText);
          alert(`Failed to delete vehicle: ${errorData.message || res.statusText}`);
        }
      } catch (err) {
        console.error("Error deleting vehicle:", err);
        setError("An unexpected error occurred while deleting the vehicle.");
        alert("An unexpected error occurred while deleting the vehicle.");
      }
    }
  };

  if (loading) return <div className="loading">Loading vehicles...</div>;
  if (error) return <div className="error-message">Error: {error}</div>; // Display error message

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        {/* REMOVED: Redundant Logout Button. The logout button is now handled by the global NavBar. */}
      </div>

      {showVehicleForm ? (
        <VehicleForm
          onSubmit={handleSaveVehicle}
          onCancel={() => {
            setShowVehicleForm(false);
            setEditingVehicle(null);
          }}
          initial={editingVehicle}
        />
      ) : (
        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowVehicleForm(true);
          }}
          className="add-vehicle-btn"
        >
          + Add New Vehicle
        </button>
      )}

      <div className="vehicle-table-container">
        <h2>Your Fleet</h2>
        {vehicles.length === 0 ? (
          <div className="no-vehicles-message">No vehicles added yet. Add your first vehicle to get started!</div>
        ) : (
          <div className="vehicle-table">
            <div className="table-header">
              <div>Type</div>
              <div>Make</div>
              <div>Model</div>
              <div>Year</div>
              <div>License Plate</div>
              <div>Actions</div>
            </div>
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="table-row">
                <div>{vehicle.type}</div>
                <div>{vehicle.make}</div>
                <div>{vehicle.model}</div>
                <div>{vehicle.year}</div>
                <div>{vehicle.licensePlate || 'N/A'}</div>
                <div className="actions">
                  <button onClick={() => {
                    setEditingVehicle(vehicle);
                    setShowVehicleForm(true);
                  }} className="edit-btn">Edit</button>
                  <Link to={`/vehicles/${vehicle.id}/services`} className="services-btn">Services</Link>
                  <Link to={`/vehicles/${vehicle.id}/dates`} className="dates-btn">Dates</Link>
                  <button onClick={() => handleDeleteVehicle(vehicle.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
