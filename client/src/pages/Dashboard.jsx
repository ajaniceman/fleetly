import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// REMOVED: import { useTheme } from '../contexts/ThemeContext'; // No longer needed directly in Dashboard for toggle button
import VehicleForm from '../components/VehicleForm/VehicleForm';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Keep existing CSS

export default function Dashboard() {
  const { user, logout, fetchWithAuth } = useAuth();
  // REMOVED: const { theme, toggleTheme } = useTheme(); // No longer needed here
  const [vehicles, setVehicles] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiclesRes = await fetchWithAuth('/api/vehicles');
        if (!vehiclesRes.ok) throw new Error('Failed to fetch vehicles');
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);

        const datesRes = await fetchWithAuth('/api/dates/user');
        if (!datesRes.ok) throw new Error('Failed to fetch dates');
        const datesData = await datesRes.json();
        setAllDates(datesData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (!error.message.includes("Session expired")) {
            alert(`Error loading dashboard data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);

  const totalVehiclesCount = vehicles.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  const expiredDatesCount = allDates.filter(date => {
    if (!date.dueDate || isNaN(new Date(date.dueDate))) return false;
    const dueDate = new Date(date.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  const upcomingDatesCount = allDates.filter(date => {
    if (!date.dueDate || isNaN(new Date(date.dueDate))) return false;
    const dueDate = new Date(date.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today && dueDate <= thirtyDaysFromNow;
  }).length;

  const filteredVehicles = vehicles.filter(v =>
    v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.licensePlate && v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.vin && v.vin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = async (formData) => {
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
        setShowForm(false);
        setEditingVehicle(null);
        alert(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
        const datesRes = await fetchWithAuth('/api/dates/user');
        if (datesRes.ok) {
          const datesData = await datesRes.json();
          setAllDates(datesData);
        }
      } else {
        const errorData = await res.json();
        alert(`Failed to ${editingVehicle ? 'update' : 'add'} vehicle: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${editingVehicle ? 'updating' : 'adding'} vehicle:`, error);
      if (!error.message.includes("Session expired")) {
        alert(`An unexpected error occurred while ${editingVehicle ? 'updating' : 'adding'} the vehicle.`);
      }
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const res = await fetchWithAuth(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          setAllDates(prevDates => prevDates.filter(d => d.vehicleId !== vehicleId));
          alert("Vehicle deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete vehicle: ${errorData.message || res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        if (!error.message.includes("Session expired")) {
            alert("An unexpected error occurred while deleting the vehicle.");
        }
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
        setEditingVehicle(vehicle);
        setShowForm(true);
        break;
      case 'delete':
        handleDelete(vehicle.id);
        break;
      default:
        console.log(`Action: ${action} on ${vehicle.make} ${vehicle.model} (ID: ${vehicle.id})`);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header-main">
        <div className="dashboard-greeting">
          <h1>Welcome, {user.name}!</h1>
          <p className="dashboard-subtitle">Here's an overview of your fleet.</p>
        </div>
        <div className="header-buttons"> {/* Container for logout button */}
          {/* REMOVED: Theme toggle button is now global and outside this component */}
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card total-vehicles">
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{totalVehiclesCount}</div>
          <div className="stat-label">Total Vehicles</div>
        </div>
        <div className="stat-card expired-dates">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{expiredDatesCount}</div>
          <div className="stat-label">Expired Dates</div>
        </div>
        <div className="stat-card upcoming-dates">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{upcomingDatesCount}</div>
          <div className="stat-label">Upcoming Dates (30 Days)</div>
        </div>
      </div>

      <div className="dashboard-actions-row">
        {showForm ? (
          <VehicleForm
            onSubmit={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingVehicle(null);
            }}
            initial={editingVehicle}
          />
        ) : (
          <button onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }} className="add-btn">+ Add New Vehicle</button>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">✖</button>
          )}
        </div>
      </div>

      <div className="vehicle-table-container">
        <div className="table-header">
          <div>Type</div>
          <div>Make</div>
          <div>Model</div>
          <div>Year</div>
          <div>License Plate</div>
          <div>VIN</div>
          <div>Actions</div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            {searchTerm ? `No vehicles found for "${searchTerm}"` : `No vehicles added yet! Click "Add New Vehicle" to get started!`}
          </div>
        ) : filteredVehicles.map((v) => (
          <div key={v.id} className={`table-row animated-row`}>
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
