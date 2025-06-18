import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ServiceForm from '../../components/ServiceForm/ServiceForm';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './VehicleServices.css'; // Make sure this CSS file exists

// Helper to generate a translation key from the service type string
const getServiceTypeTranslationKey = (typeString) => {
  if (!typeString) return '';
  return `service_type_${typeString.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
};

export default function VehicleServices() {
  const { id: vehicleId } = useParams(); // Get vehicle ID from URL
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { t } = useTranslation(); // Initialize useTranslation

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchVehicleAndServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch vehicle details
      const vehicleRes = await fetchWithAuth(`/api/vehicles/${vehicleId}`);
      if (!vehicleRes.ok) {
        if (vehicleRes.status === 404) {
          throw new Error('Vehicle not found.');
        }
        throw new Error(`Failed to fetch vehicle: ${vehicleRes.statusText}`);
      }
      const vehicleData = await vehicleRes.json();
      setVehicle(vehicleData);

      // Fetch services for this vehicle
      const servicesRes = await fetchWithAuth(`/api/services/vehicle/${vehicleId}`);
      if (!servicesRes.ok) {
        throw new Error(`Failed to fetch services: ${servicesRes.statusText}`);
      }
      const servicesData = await servicesRes.json();
      setServices(servicesData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      // If session expired, useAuth's fetchWithAuth would have handled logout and alert
      // So, here we only alert for other errors.
      if (!err.message.includes("Session expired")) {
        alert(t('error_fetching_data', { message: err.message })); // Translate error message
      }
    } finally {
      setLoading(false);
    }
  }, [vehicleId, fetchWithAuth, t]); // Add t to dependencies

  useEffect(() => {
    fetchVehicleAndServices();
  }, [fetchVehicleAndServices]);

  const handleSaveService = async (formData) => {
    let res;
    let url;
    let method;

    if (editingService) {
      url = `/api/services/${editingService.id}`;
      method = 'PUT';
    } else {
      url = `/api/services`;
      method = 'POST';
      formData.vehicle_id = vehicleId; // Add vehicle_id for new service records
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
        // Re-fetch all services to ensure consistency and correct sorting/filtering
        await fetchVehicleAndServices();
        setShowForm(false);
        setEditingService(null);
        alert(t(`service_${editingService ? 'updated' : 'added'}_success`)); // Translate success alert
      } else {
        const errorData = await res.json();
        alert(t(`failed_to_${editingService ? 'update' : 'add'}_service`, { message: errorData.message || res.statusText })); // Translate failure alert
      }
    } catch (err) {
      console.error(`Error ${editingService ? 'updating' : 'adding'} service:`, err);
      if (!err.message.includes("Session expired")) {
        alert(t(`unexpected_${editingService ? 'update' : 'add'}_error_service`)); // Translate unexpected error alert
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm(t('confirm_delete_service'))) { // Translate confirmation dialog
      try {
        const res = await fetchWithAuth(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setServices(services.filter(s => s.id !== serviceId));
          alert(t('service_deleted_success')); // Translate success alert
        } else {
          const errorData = await res.json();
          alert(t('failed_to_delete_service', { message: errorData.message || res.statusText })); // Translate failure alert
        }
      } catch (err) {
        console.error("Error deleting service:", err);
        if (!err.message.includes("Session expired")) {
          alert(t('unexpected_delete_error_service')); // Translate unexpected error alert
        }
      }
    }
  };

  if (loading) return <div className="loading">{t('loading_services')}</div>; // Translate loading message
  if (error) return <div className="error-message">{t('error_displaying_services', { message: error })}</div>; // Translate error message
  if (!vehicle) return <div className="no-vehicle-found">{t('no_vehicle_found')}</div>; // Translate message

  return (
    <div className="vehicle-services-page">
      <div className="services-header">
        <h1>{t('services_for_vehicle', { make: vehicle.make, model: vehicle.model, year: vehicle.year })}</h1> {/* Translate header */}
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          {t('back_to_dashboard_btn')} {/* Translate button */}
        </button>
      </div>

      {showForm ? (
        <ServiceForm
          onSubmit={handleSaveService}
          onCancel={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          vehicleType={vehicle.type} // Pass vehicle type for conditional inputs
          initial={editingService}
        />
      ) : (
        <button onClick={() => {
          setEditingService(null);
          setShowForm(true);
        }} className="add-service-btn">
          {t('add_new_service_btn')} {/* Translate button */}
        </button>
      )}

      <div className="services-table-container">
        <h2>{t('service_history_title')}</h2> {/* Translate title */}
        {services.length === 0 ? (
          <div className="no-services-message">
            {t('no_service_records_yet')} {/* Translate message */}
          </div>
        ) : (
          <div className="services-table">
            <div className="table-header">
              <div>{t('service_table_date')}</div> {/* Translate header */}
              <div>{t('service_table_type')}</div> {/* Translate header */}
              <div>{t('service_table_description')}</div> {/* Translate header */}
              <div>{t('service_table_cost')}</div> {/* Translate header */}
              <div>{t('service_table_odometer_hours')}</div> {/* Translate header */}
              <div>{t('service_table_next_service')}</div> {/* Translate header */}
              <div>{t('service_table_actions')}</div> {/* Translate header */}
            </div>
            {services.map(service => (
              <div key={service.id} className="table-row">
                <div>{new Date(service.serviceDate).toLocaleDateString()}</div>
                {/* Translate service type here */}
                <div>{t(getServiceTypeTranslationKey(service.serviceType))}</div>
                <div>{service.description || t('n_a_placeholder')}</div> {/* Translate N/A */}
                <div>{service.cost ? `$${service.cost.toFixed(2)}` : t('n_a_placeholder')}</div> {/* Translate N/A */}
                <div>
                  {/* Conditionally display Odometer or Engine Hours */}
                  {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && (service.odometerReading ? `${service.odometerReading} KM` : t('n_a_placeholder'))}
                  {['Excavator', 'Roller'].includes(vehicle.type) && (service.engineHours ? `${service.engineHours} Hrs` : t('n_a_placeholder'))}
                  {!['Car', 'Truck', 'Van', 'Bus', 'Excavator', 'Roller'].includes(vehicle.type) && t('n_a_placeholder')}
                </div>
                <div>
                  {/* Conditionally display Next Odometer or Next Engine Hours */}
                  {['Car', 'Truck', 'Van', 'Bus'].includes(vehicle.type) && (service.nextServiceOdometer ? `${service.nextServiceOdometer} KM` : t('n_a_placeholder'))}
                  {['Excavator', 'Roller'].includes(vehicle.type) && (service.nextServiceHours ? `${service.nextServiceHours} Hrs` : t('n_a_placeholder'))}
                  {!['Car', 'Truck', 'Van', 'Bus', 'Excavator', 'Roller'].includes(vehicle.type) && t('n_a_placeholder')}
                </div>
                <div className="actions">
                  <button onClick={() => {
                    setEditingService(service);
                    setShowForm(true);
                  }} className="edit-service-btn">{t('edit_action')}</button> {/* Translate button */}
                  <button onClick={() => handleDeleteService(service.id)} className="delete-service-btn">{t('delete_action')}</button> {/* Translate button */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
