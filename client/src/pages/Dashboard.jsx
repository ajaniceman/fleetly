import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Your Vehicles</h1>
      <Link to="/vehicles/add" className="add-btn">+ Add Vehicle</Link>
      
      <div className="vehicle-table">
        <div className="table-header">
          <div>Maker</div>
          <div>Model</div>
          <div>Engine</div>
          <div>Registration</div>
          <div>Actions</div>
        </div>
        
        {vehicles.length > 0 ? (
          vehicles.map(vehicle => (
            <Link to={`/vehicles/${vehicle.id}`} key={vehicle.id} className="table-row">
              <div>{vehicle.maker}</div>
              <div>{vehicle.model}</div>
              <div>{vehicle.engine}</div>
              <div>{new Date(vehicle.registration_date).toLocaleDateString()}</div>
              <div className="actions">
                <button className="view-btn">View Details</button>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-vehicles">
            No vehicles found. Add your first vehicle!
          </div>
        )}
      </div>
    </div>
  );
}