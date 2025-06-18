import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout, fetchWithAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation(); // Initialize useTranslation
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
        alert(t(`vehicle_${editingVehicle ? 'updated' : 'added'}_success`)); // Use translation for alerts
        const datesRes = await fetchWithAuth('/api/dates/user');
        if (datesRes.ok) {
          const datesData = await datesRes.json();
          setAllDates(datesData);
        }
      } else {
        const errorData = await res.json();
        alert(t(`failed_to_${editingVehicle ? 'update' : 'add'}_vehicle`, { message: errorData.message || res.statusText })); // Use translation for alerts
      }
    } catch (error) {
      console.error(`Error ${editingVehicle ? 'updating' : 'adding'} vehicle:`, error);
      if (!error.message.includes("Session expired")) {
        alert(t(`unexpected_${editingVehicle ? 'update' : 'add'}_error_vehicle`)); // Use translation for alerts
      }
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm(t('confirm_delete_vehicle'))) { // Use translation for confirm message
      try {
        const res = await fetchWithAuth(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          setAllDates(prevDates => prevDates.filter(d => d.vehicleId !== vehicleId));
          alert(t('vehicle_deleted_success')); // Use translation for alert
        } else {
          const errorData = await res.json();
          alert(t('failed_to_delete_vehicle', { message: errorData.message || res.statusText })); // Use translation for alert
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        if (!error.message.includes("Session expired")) {
            alert(t('unexpected_delete_error_vehicle')); // Use translation for alert
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

  if (loading) return <div className="loading">{t('loading_dashboard')}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header-main">
        <div className="dashboard-greeting">
          <h1>{t('dashboard_welcome_title', { name: user.name })}</h1>
          <p className="dashboard-subtitle">{t('dashboard_subtitle')}</p>
        </div>
        <div className="header-buttons">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={logout} className="logout-btn">{t('logout_button')}</button>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card total-vehicles">
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{totalVehiclesCount}</div>
          <div className="stat-label">{t('dashboard_total_vehicles_stat')}</div>
        </div>
        <div className="stat-card expired-dates">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{expiredDatesCount}</div>
          <div className="stat-label">{t('dashboard_expired_dates_stat')}</div>
        </div>
        <div className="stat-card upcoming-dates">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{upcomingDatesCount}</div>
          <div className="stat-label">{t('dashboard_upcoming_dates_stat')}</div>
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
            formTitle={editingVehicle ? t('vehicle_form_title_edit') : t('vehicle_form_title_add')} /* Pass the translated title */
          />
        ) : (
          <button onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }} className="add-btn">{t('add_new_vehicle_btn')}</button>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder={t('search_vehicles_placeholder')}
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
        <h2>{t('your_fleet_title')}</h2>
        <div className="table-header">
          <div>{t('vehicle_table_type')}</div>
          <div>{t('vehicle_table_make')}</div>
          <div>{t('vehicle_table_model')}</div>
          <div>{t('vehicle_table_year')}</div>
          <div>{t('vehicle_table_license_plate')}</div>
          <div>{t('vehicle_table_vin')}</div>
          <div>{t('vehicle_table_actions')}</div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            {searchTerm ? t('no_vehicles_found', { searchTerm: searchTerm }) : t('no_vehicles_yet')}
          </div>
        ) : filteredVehicles.map((v) => (
          <div key={v.id} className={`table-row animated-row`}>
            <div>{v.type}</div>
            <div>{v.make}</div>
            <div>{v.model}</div>
            <div>{v.year}</div>
            <div>{v.licensePlate || t('n_a_placeholder')}</div>
            <div>{v.vin || t('n_a_placeholder')}</div>
            <div className="actions">
              <select onChange={e => handleAction(e.target.value, v)} defaultValue="">
                <option value="" disabled>{t('select_action_option')}</option>
                <option value="services">{t('services_action')}</option>
                <option value="dates">{t('dates_action')}</option>
                <option value="edit">{t('edit_action')}</option>
                <option value="delete">{t('delete_action')}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
