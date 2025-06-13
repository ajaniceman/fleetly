import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [allDates, setAllDates] = useState([]); // State to hold all date records for summary stats
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login if not authenticated
          return;
        }

        // Fetch vehicles
        const vehiclesRes = await fetch('/api/vehicles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!vehiclesRes.ok) throw new Error('Failed to fetch vehicles');
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);

        // Fetch all dates for the user's vehicles (for dashboard summary)
        const datesRes = await fetch('/api/dates/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!datesRes.ok) throw new Error('Failed to fetch dates');
        const datesData = await datesRes.json();
        setAllDates(datesData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert(`Error loading dashboard data: ${error.message}`);
        // Consider more robust error handling for user, e.g., show an error message on screen
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Added navigate to dependency array

  // Calculate dashboard statistics (memoized or calculated on demand for simplicity)
  const totalVehiclesCount = vehicles.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999); // Normalize to end of day

  const expiredDatesCount = allDates.filter(date => {
    // Ensure date.dueDate is valid before creating a Date object
    if (!date.dueDate || isNaN(new Date(date.dueDate))) return false;
    const dueDate = new Date(date.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  const upcomingDatesCount = allDates.filter(date => {
    // Ensure date.dueDate is valid
    if (!date.dueDate || isNaN(new Date(date.dueDate))) return false;
    const dueDate = new Date(date.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    // Date is upcoming if it's today or in the future, up to 30 days from now
    return dueDate >= today && dueDate <= thirtyDaysFromNow;
  }).length;


  // Filter vehicles based on search term for the table
  const filteredVehicles = vehicles.filter(v =>
    v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.licensePlate && v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())) || // Check for existence
    (v.vin && v.vin.toLowerCase().includes(searchTerm.toLowerCase())) // Check for existence
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
        setShowForm(false);
        setEditingVehicle(null);
        alert(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
        // Crucially, re-fetch all dates after a vehicle save/update
        // This ensures dashboard stats are up-to-date if vehicle affects dates
        const datesRes = await fetch('/api/dates/user', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
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
          // After deleting a vehicle, also filter out its associated dates
          setAllDates(prevDates => prevDates.filter(d => d.vehicleId !== vehicleId));
          // (If you had a similar "all services" state, you'd update that too)
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
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {/* Dashboard Stats Overview */}
      <div className="dashboard-stats-grid">
        <div className="stat-card total-vehicles">
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{totalVehiclesCount}</div>
          <div className="stat-label">Total Vehicles</div>
        </div>
        <div className="stat-card expired-dates">
          <div className="stat-icon">⚠️</div> {/* Changed icon to a warning sign */}
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
        ) : filteredVehicles.map((v) => ( // Removed 'i' as it's not used
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
