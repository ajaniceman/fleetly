import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VehicleServices.css'; // We'll create this CSS file next
import ServiceForm from '../../components/ServiceForm/ServiceForm';

export default function VehicleServicesPage() {
  const { id } = useParams(); // Get the vehicle ID from the URL
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null); // To store the specific vehicle's details
  const [services, setServices] = useState([]); // To store services for this vehicle
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null); // To handle editing a service

  useEffect(() => {
    // Fetch vehicle details and its services when the component mounts or ID changes
    const fetchVehicleAndServices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login if no token
          return;
        }

        // Fetch vehicle details
        const vehicleRes = await fetch(`/api/vehicles/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!vehicleRes.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        // Fetch services for this vehicle
        const servicesRes = await fetch(`/api/services/vehicle/${id}`, { // New backend endpoint
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!servicesRes.ok) {
          throw new Error('Failed to fetch services');
        }
        const servicesData = await servicesRes.json();
        setServices(servicesData);

      } catch (error) {
        console.error("Error loading vehicle services:", error);
        alert(`Error loading services: ${error.message}`);
        navigate('/dashboard'); // Go back to dashboard on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleAndServices();
    }
  }, [id, navigate]); // Re-run if vehicle ID changes

  const handleSaveService = async (formData) => {
    let res;
    let url;
    let method;

    // Add vehicle_id to formData before sending
    formData.vehicle_id = id;

    if (editingService) {
      url = `/api/services/${editingService.id}`;
      method = 'PUT';
    } else {
      url = `/api/services`;
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
        const savedService = await res.json();
        setServices(prevServices => {
          if (editingService) {
            return prevServices.map(s => s.id === savedService.id ? savedService : s);
          } else {
            return [savedService, ...prevServices];
          }
        });
        setShowServiceForm(false);
        setEditingService(null);
        alert(`Service ${editingService ? 'updated' : 'added'} successfully!`);
      } else {
        const errorData = await res.json();
        alert(`Failed to ${editingService ? 'update' : 'add'} service: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${editingService ? 'updating' : 'adding'} service:`, error);
      alert(`An unexpected error occurred while ${editingService ? 'updating' : 'adding'} the service.`);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service record?")) {
      try {
        const res = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
          alert("Service record deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete service record: ${errorData.message || res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting service record:", error);
        alert("An unexpected error occurred while deleting the service record.");
      }
    }
  };


  if (loading) return <div className="loading">Loading vehicle services...</div>;
  if (!vehicle) return <div className="error-message">Vehicle not found or an error occurred.</div>;

  return (
    <div className="vehicle-services-page">
      <div className="services-header">
        <h1>Services for {vehicle.make} {vehicle.model} ({vehicle.licensePlate || 'N/A'})</h1>
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          Back to Dashboard
        </button>
      </div>

      {/* Service Form Section */}
      {showServiceForm ? (
        <ServiceForm
          vehicleType={vehicle.type} // Pass vehicle type to form for conditional inputs
          onSubmit={handleSaveService}
          onCancel={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
          initial={editingService}
        />
      ) : (
        <button onClick={() => {
          setEditingService(null); // Ensure not editing when adding
          setShowServiceForm(true);
        }} className="add-service-btn">+ Add New Service</button>
      )}

      {/* Services Table */}
      <div className="services-table-container">
        <h2>Service History</h2>
        {services.length === 0 ? (
          <div className="no-services-message">No service records found for this vehicle.</div>
        ) : (
          <div className="services-table">
            <div className="table-header">
              <div>Date</div>
              <div>Type</div>
              <div>Description</div>
              <div>Cost</div>
              {/* Conditionally show KM/Hours based on vehicle type */}
              {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && <div>Odometer (KM)</div>}
              {['Excavator', 'Roller'].includes(vehicle.type) && <div>Engine Hours</div>}
              <div>Actions</div>
            </div>
            {services.map(s => (
              <div key={s.id} className="table-row">
                <div>{new Date(s.service_date).toLocaleDateString()}</div>
                <div>{s.service_type}</div>
                <div>{s.description || 'N/A'}</div>
                <div>${s.cost ? s.cost.toFixed(2) : '0.00'}</div>
                {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && <div>{s.odometer_reading || 'N/A'}</div>}
                {['Excavator', 'Roller'].includes(vehicle.type) && <div>{s.engine_hours || 'N/A'}</div>}
                <div className="actions">
                  <button onClick={() => {
                    setEditingService(s);
                    setShowServiceForm(true);
                  }} className="edit-service-btn">Edit</button>
                  <button onClick={() => handleDeleteService(s.id)} className="delete-service-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
