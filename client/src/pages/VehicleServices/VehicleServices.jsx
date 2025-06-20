import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceForm from '../../components/ServiceForm/ServiceForm';
import './VehicleServices.css';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Helper function to generate a translation key from the service type string
const getServiceTypeTranslationKey = (typeString) => {
  if (!typeString) return '';
  // Convert to lowercase, replace non-alphanumeric with underscores, and add prefix
  // Example: "Oil Change" -> "service_type_oil_change"
  // Example: "Fluid Check (Coolant, Brake, Power Steering)" -> "service_type_fluid_check_top_up_coolant_brake_power_steering"
  return `service_type_${typeString.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
};


export default function VehicleServices() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { t } = useTranslation(); // Initialize translation hook

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchVehicleAndServices = useCallback(async () => {
    try {
      // Fetch vehicle details using fetchWithAuth
      const vehicleRes = await fetchWithAuth(`/api/vehicles/${vehicleId}`);
      if (!vehicleRes.ok) {
        if (vehicleRes.status === 404) {
          throw new Error('Vehicle not found.');
        }
        throw new Error('Failed to fetch vehicle details');
      }
      const vehicleData = await vehicleRes.json();
      setVehicle(vehicleData);

      // Fetch services for this vehicle using fetchWithAuth
      const servicesRes = await fetchWithAuth(`/api/services/vehicle/${vehicleId}`);
      if (!servicesRes.ok) {
        throw new Error('Failed to fetch services');
      }
      const servicesData = await servicesRes.json();
      setServices(servicesData);

    } catch (error) {
      console.error("Error loading vehicle services:", error);
      // Only alert if the error isn't a session expiration handled by fetchWithAuth
      if (!error.message.includes("Session expired")) {
        alert(t('error_loading_services', { message: error.message })); // Translated alert
        navigate('/dashboard'); // Go back to dashboard on other errors
      }
    } finally {
      setLoading(false);
    }
  }, [vehicleId, navigate, fetchWithAuth, t]); // Add t to dependency array

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleAndServices();
    }
  }, [fetchVehicleAndServices, vehicleId]);

  const handleSaveService = async (formData) => {
    let res;
    let url;
    let method;

    formData.vehicle_id = vehicleId;

    if (editingService) {
      url = `/api/services/${editingService.id}`;
      method = 'PUT';
    } else {
      url = `/api/services`;
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
        // Re-fetch all services to ensure table is fully updated
        await fetchVehicleAndServices();
        setShowServiceForm(false);
        setEditingService(null);
        alert(t(`service_${editingService ? 'updated' : 'added'}_success`)); // Translated alert
      } else {
        const errorData = await res.json();
        alert(t(`failed_to_${editingService ? 'update' : 'add'}_service`, { message: errorData.message || res.statusText })); // Translated alert
      }
    } catch (error) {
      console.error(`Error ${editingService ? 'updating' : 'adding'} service:`, error);
      if (!error.message.includes("Session expired")) {
        alert(t(`unexpected_${editingService ? 'update' : 'add'}_error_service`)); // Translated alert
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm(t('confirm_delete_service'))) { // Translated confirmation
      try {
        const res = await fetchWithAuth(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
          alert(t('service_deleted_success')); // Translated alert
        } else {
          const errorData = await res.json();
          alert(t('failed_to_delete_service', { message: errorData.message || res.statusText })); // Translated alert
        }
      } catch (error) {
        console.error("Error deleting service record:", error);
        if (!error.message.includes("Session expired")) {
          alert(t('unexpected_delete_error_service')); // Translated alert
        }
      }
    }
  };

  if (loading) return <div className="loading">{t('loading_vehicle_services')}</div>;
  if (!vehicle) return <div className="error-message">{t('vehicle_not_found_error')}</div>;

  return (
    <div className="vehicle-services-page">
      <div className="services-header">
        <h1>{t('services_for_vehicle', { make: vehicle.make, model: vehicle.model })}</h1> {/* Translated title */}
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          {t('back_to_dashboard_btn')} {/* Translated */}
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
        }} className="add-service-btn">{t('add_new_service_btn')}</button> /* Translated */
      )}

      <div className="services-table-container">
        <h2>{t('service_history_title')}</h2> {/* Translated title */}
        {services.length === 0 ? (
          <div className="no-services-message">{t('no_service_records_found')}</div> /* Translated message */
        ) : (
          <div className="services-table">
            <div className="table-header">
              <div>{t('service_table_date')}</div> {/* Translated */}
              <div>{t('service_table_type')}</div> {/* Translated */}
              <div>{t('service_table_description')}</div> {/* Translated */}
              <div>{t('service_table_cost')}</div> {/* Translated */}
              {/* Conditional columns for Odometer/Engine Hours based on vehicle type */}
              {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && <div>{t('service_table_odometer')}</div>} {/* Translated */}
              {['Excavator', 'Roller'].includes(vehicle.type) && <div>{t('service_table_engine_hours')}</div>} {/* Translated */}
              <div>{t('service_table_actions')}</div> {/* Translated */}
            </div>
            {services.map(s => (
              <div key={s.id} className="table-row">
                <div>
                  {s.serviceDate && !isNaN(new Date(s.serviceDate))
                    ? new Date(s.serviceDate).toLocaleDateString()
                    : t('n_a_placeholder')} {/* Translated N/A */}
                </div>
                <div>{t(getServiceTypeTranslationKey(s.serviceType))}</div> {/* This is the key change! */}
                <div>{s.description || t('n_a_placeholder')}</div> {/* Translated N/A */}
                <div>
                  ${s.cost !== null && s.cost !== undefined && !isNaN(s.cost)
                    ? s.cost.toFixed(2)
                    : '0.00'}
                </div>
                {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && (
                  <div>{s.odometerReading || t('n_a_placeholder')}</div> /* Translated N/A */
                )}
                {['Excavator', 'Roller'].includes(vehicle.type) && (
                  <div>{s.engineHours || t('n_a_placeholder')}</div> /* Translated N/A */
                )}
                <div className="actions">
                  <button onClick={() => {
                    setEditingService(s);
                    setShowServiceForm(true);
                  }} className="edit-service-btn">{t('edit_action')}</button> {/* Translated */}
                  <button onClick={() => handleDeleteService(s.id)} className="delete-service-btn">{t('delete_action')}</button> {/* Translated */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
