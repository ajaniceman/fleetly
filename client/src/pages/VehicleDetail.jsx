import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VehicleDetail.css';

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div className="vehicle-detail">
      <h1>{vehicle.maker} {vehicle.model}</h1>
      
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Engine</h3>
          <p>{vehicle.engine}</p>
        </div>
        
        <div className="detail-card">
          <h3>Registration Date</h3>
          <p>{new Date(vehicle.registration_date).toLocaleDateString()}</p>
        </div>
        
        <div className="detail-card">
          <h3>Last Service</h3>
          <p>{vehicle.last_service_date 
              ? new Date(vehicle.last_service_date).toLocaleDateString() 
              : 'Not recorded'}</p>
        </div>
      </div>
      
      <div className="service-history">
        <h2>Service History</h2>
        <p>{vehicle.service_history || 'No service history available'}</p>
      </div>
    </div>
  );
}