// client/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import './Dashboard.css'; // Assuming you have Dashboard.css
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme context for the toggle button
import ThemeToggleButton from '../components/ThemeToggleButton/ThemeToggleButton'; // Import the toggle button

export default function Dashboard() {
  const { user, logout, fetchWithAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook
  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

  const [vehicles, setVehicles] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch vehicles and dates on component mount
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
            // Using translated alert message
            alert(t('error_loading_dashboard_data', { message: error.message }));
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Only fetch if user is authenticated
      fetchData();
    } else {
      setLoading(false);
      navigate('/login'); // Redirect to login if no user
    }
  }, [user, navigate, fetchWithAuth, t]); // Added t to dependency array

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
        alert(t(`vehicle_${editingVehicle ? 'updated' : 'added'}_success`)); // Translated alert
        const datesRes = await fetchWithAuth('/api/dates/user');
        if (datesRes.ok) {
          const datesData = await datesRes.json();
          setAllDates(datesData);
        }
      } else {
        const errorData = await res.json();
        alert(t(`failed_to_${editingVehicle ? 'update' : 'add'}_vehicle`, { message: errorData.message || res.statusText })); // Translated alert
      }
    } catch (error) {
      console.error(`Error ${editingVehicle ? 'updating' : 'adding'} vehicle:`, error);
      if (!error.message.includes("Session expired")) {
        alert(t(`unexpected_${editingVehicle ? 'update' : 'add'}_error_vehicle`)); // Translated alert
      }
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm(t('confirm_delete_vehicle'))) { // Translated confirmation
      try {
        const res = await fetchWithAuth(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          setAllDates(prevDates => prevDates.filter(d => d.vehicleId !== vehicleId));
          alert(t('vehicle_deleted_success')); // Translated alert
        } else {
          const errorData = await res.json();
          alert(t('failed_to_delete_vehicle', { message: errorData.message || res.statusText })); // Translated alert
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        if (!error.message.includes("Session expired")) {
            alert(t('unexpected_delete_error_vehicle')); // Translated alert
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
    <div className="dashboard-page">
      <div className="dashboard-header-main">
        <div className="dashboard-greeting">
          <h1>{t('dashboard_welcome_title', { name: user?.name || t('user_placeholder') })}</h1> {/* Translated greeting */}
          <p className="dashboard-subtitle">{t('dashboard_subtitle')}</p> {/* Translated subtitle */}
        </div>
        <div className="header-buttons">
          {/* Theme Toggle Button */}
          {/* Note: This ThemeToggleButton is now also in the NavBar. You might want to consider
              if you need it in both places or just one, depending on your desired UI. */}
          <ThemeToggleButton />
          {/* Logout button restored as per your request */}
          {user && <button onClick={logout} className="logout-btn">{t('logout_button')}</button>}
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card total-vehicles">
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{totalVehiclesCount}</div>
          <div className="stat-label">{t('dashboard_total_vehicles_stat')}</div> {/* Translated */}
        </div>
        <div className="stat-card expired-dates">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{expiredDatesCount}</div>
          <div className="stat-label">{t('dashboard_expired_dates_stat')}</div> {/* Translated */}
        </div>
        <div className="stat-card upcoming-dates">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{upcomingDatesCount}</div>
          <div className="stat-label">{t('dashboard_upcoming_dates_stat')}</div> {/* Translated */}
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
            // Pass the translated title to VehicleForm
            formTitle={editingVehicle ? t('vehicle_form_title_edit') : t('vehicle_form_title_add')}
          />
        ) : (
          <button
            onClick={() => {
              setEditingVehicle(null);
              setShowForm(true);
            }}
            className="add-btn"
          >
            {t('add_new_vehicle_btn')} {/* Translated */}
          </button>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder={t('search_vehicles_placeholder')} /* Translated placeholder */
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
        <h2>{t('your_fleet_title')}</h2> {/* Translated title */}
        <div className="table-header">
          <div>{t('vehicle_table_type')}</div> {/* Translated */}
          <div>{t('vehicle_table_make')}</div> {/* Translated */}
          <div>{t('vehicle_table_model')}</div> {/* Translated */}
          <div>{t('vehicle_table_year')}</div> {/* Translated */}
          <div>{t('vehicle_table_license_plate')}</div> {/* Translated */}
          <div>{t('vehicle_table_vin')}</div> {/* Translated */}
          <div>{t('vehicle_table_actions')}</div> {/* Translated */}
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            {searchTerm ? t('no_vehicles_found', { searchTerm: searchTerm }) : t('no_vehicles_yet')} {/* Translated messages */}
          </div>
        ) : filteredVehicles.map((v) => (
          <div key={v.id} className={`table-row animated-row`}>
            <div>{v.type}</div>
            <div>{v.make}</div>
            <div>{v.model}</div>
            <div>{v.year}</div>
            <div>{v.licensePlate || t('n_a_placeholder')}</div> {/* Translated N/A */}
            <div>{v.vin || t('n_a_placeholder')}</div> {/* Translated N/A */}
            <div className="actions">
              <select onChange={e => handleAction(e.target.value, v)} defaultValue="">
                <option value="" disabled>{t('select_action_option')}</option> {/* Translated */}
                <option value="services">{t('services_action')}</option> {/* Translated */}
                <option value="dates">{t('dates_action')}</option> {/* Translated */}
                <option value="edit">{t('edit_action')}</option> {/* Translated */}
                <option value="delete">{t('delete_action')}</option> {/* Translated */}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
