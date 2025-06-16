import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/ServiceForm/ServiceForm';
import './VehicleServices.css'; // The CSS file will still be named this
import { useAuth } from '../../hooks/useAuth'; // Import useAuth to use fetchWithAuth

export default function VehicleServices() {
  const { vehicleId } = useParams(); // Changed 'id' to 'vehicleId' to match route parameter
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth(); // Destructure fetchWithAuth
  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchVehicleAndServices = async () => {
      try {
        // Fetch vehicle details using fetchWithAuth
        const vehicleRes = await fetchWithAuth(`/api/vehicles/${vehicleId}`); // Use vehicleId
        if (!vehicleRes.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        // Fetch services for this vehicle using fetchWithAuth
        const servicesRes = await fetchWithAuth(`/api/services/vehicle/${vehicleId}`); // Use vehicleId
        if (!servicesRes.ok) {
          throw new Error('Failed to fetch services');
        }
        const servicesData = await servicesRes.json();
        setServices(servicesData);

      } catch (error) {
        console.error("Error loading vehicle services:", error);
        // Only alert if the error isn't a session expiration handled by fetchWithAuth
        if (!error.message.includes("Session expired")) {
          alert(`Error loading services: ${error.message}`);
          navigate('/dashboard'); // Go back to dashboard on other errors
        }
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) { // Check if vehicleId exists before fetching
      fetchVehicleAndServices();
    }
  }, [vehicleId, navigate, fetchWithAuth]); // Add fetchWithAuth to dependency array

  const handleSaveService = async (formData) => {
    let res;
    let url;
    let method;

    formData.vehicle_id = vehicleId; // Use vehicleId here

    if (editingService) {
      url = `/api/services/${editingService.id}`;
      method = 'PUT';
    } else {
      url = `/api/services`;
      method = 'POST';
    }

    try {
      res = await fetchWithAuth(url, { // Use fetchWithAuth
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Authorization header is handled by fetchWithAuth now
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const savedService = await res.json();
        setServices(prevServices => {
          if (editingService) {
            // Update the existing service
            return prevServices.map(s => s.id === savedService.id ? savedService : s);
          } else {
            // Add new service to the beginning of the list
            return [savedService, ...prevServices];
          }
        });
        setShowServiceForm(false);
        setEditingService(null);
        // Using alert from context, not window.alert
        // You might want to replace this with a custom modal if you have one
        alert(`Service ${editingService ? 'updated' : 'added'} successfully!`);
      } else {
        const errorData = await res.json();
        alert(`Failed to ${editingService ? 'update' : 'add'} service: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${editingService ? 'updating' : 'adding'} service:`, error);
      // Only alert if the error isn't a session expiration handled by fetchWithAuth
      if (!error.message.includes("Session expired")) {
        alert(`An unexpected error occurred while ${editingService ? 'updating' : 'adding'} the service.`);
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    // Replace window.confirm with a custom modal if you have one
    if (window.confirm("Are you sure you want to delete this service record?")) {
      try {
        const res = await fetchWithAuth(`/api/services/${serviceId}`, { // Use fetchWithAuth
          method: 'DELETE',
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
        // Only alert if the error isn't a session expiration handled by fetchWithAuth
        if (!error.message.includes("Session expired")) {
          alert("An unexpected error occurred while deleting the service record.");
        }
      }
    }
  };

  if (loading) return <div className="loading">Loading vehicle services...</div>;
  if (!vehicle) return <div className="error-message">Vehicle not found or an error occurred.</div>;

  return (
    <div className="vehicle-services-page">
      <div className="services-header">
        <h1>Services for {vehicle.make} {vehicle.model}</h1>
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          Back to Dashboard
        </button>
      </div>

      {showServiceForm ? (
        <ServiceForm
          vehicleType={vehicle.type}
          onSubmit={handleSaveService}
          onCancel={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
          initial={editingService}
        />
      ) : (
        <button onClick={() => {
          setEditingService(null);
          setShowServiceForm(true);
        }} className="add-service-btn">+ Add New Service</button>
      )}

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
              {/* Conditional columns for Odometer/Engine Hours based on vehicle type */}
              {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && <div>Odometer (KM)</div>}
              {['Excavator', 'Roller'].includes(vehicle.type) && <div>Engine Hours</div>}
              <div>Actions</div>
            </div>
            {services.map(s => (
              <div key={s.id} className="table-row">
                <div>
                  {s.serviceDate && !isNaN(new Date(s.serviceDate))
                    ? new Date(s.serviceDate).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div>{s.serviceType || 'N/A'}</div>
                <div>{s.description || 'N/A'}</div>
                <div>
                  ${s.cost !== null && s.cost !== undefined && !isNaN(s.cost)
                    ? s.cost.toFixed(2)
                    : '0.00'}
                </div>
                {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && (
                  <div>{s.odometerReading || 'N/A'}</div>
                )}
                {['Excavator', 'Roller'].includes(vehicle.type) && (
                  <div>{s.engineHours || 'N/A'}</div>
                )}
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
