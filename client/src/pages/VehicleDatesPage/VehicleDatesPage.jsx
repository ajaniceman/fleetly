import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DateForm from '../../components/DateForm/DateForm';
import { useAuth } from '../../hooks/useAuth';
import './VehicleDatesPage.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function VehicleDatesPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { t } = useTranslation(); // Initialize translation hook

  const [vehicle, setVehicle] = useState(null);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDateForm, setShowDateForm] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  useEffect(() => {
    const fetchVehicleAndDates = async () => {
      try {
        const vehicleRes = await fetchWithAuth(`/api/vehicles/${vehicleId}`);
        if (!vehicleRes.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        const datesRes = await fetchWithAuth(`/api/dates/vehicle/${vehicleId}`);
        if (!datesRes.ok) {
          throw new Error('Failed to fetch dates');
        }
        const datesData = await datesRes.json();
        setDates(datesData);

      } catch (error) {
        console.error("Error loading vehicle dates:", error);
        if (!error.message.includes("Session expired")) {
          alert(t('error_loading_dates', { message: error.message })); // Translated alert
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleAndDates();
    }
  }, [vehicleId, navigate, fetchWithAuth, t]); // Add t to dependency array

  const handleSaveDate = async (formData) => {
    let res;
    let url;
    let method;

    formData.vehicle_id = vehicleId;

    if (editingDate) {
      url = `/api/dates/${editingDate.id}`;
      method = 'PUT';
    } else {
      url = `/api/dates`;
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
        const savedDate = await res.json();
        setDates(prevDates => {
          if (editingDate) {
            return prevDates.map(d => d.id === savedDate.id ? savedDate : d);
          } else {
            return [savedDate, ...prevDates];
          }
        });
        setShowDateForm(false);
        setEditingDate(null);
        alert(t(`date_${editingDate ? 'updated' : 'added'}_success`)); // Translated alert
      } else {
        const errorData = await res.json();
        alert(t(`failed_to_${editingDate ? 'update' : 'add'}_date`, { message: errorData.message || res.statusText })); // Translated alert
      }
    } catch (error) {
      console.error(`Error ${editingDate ? 'updating' : 'adding'} date:`, error);
      if (!error.message.includes("Session expired")) {
        alert(t(`unexpected_${editingDate ? 'update' : 'add'}_error_date`)); // Translated alert
      }
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (window.confirm(t('confirm_delete_date'))) { // Translated confirmation
      try {
        const res = await fetchWithAuth(`/api/dates/${dateId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setDates(prevDates => prevDates.filter(d => d.id !== dateId));
          alert(t('date_deleted_success')); // Translated alert
        } else {
          const errorData = await res.json();
          alert(t('failed_to_delete_date', { message: errorData.message || res.statusText })); // Translated alert
        }
      } catch (error) {
        console.error("Error deleting date record:", error);
        if (!error.message.includes("Session expired")) {
          alert(t('unexpected_delete_error_date')); // Translated alert
        }
      }
    }
  };

  const getDateStatus = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dueDate);
    date.setHours(0, 0, 0, 0);

    const timeDiff = date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return t('status_expired'); // Translated status
    } else if (daysDiff <= 30) {
      return t('status_due_soon'); // Translated status
    } else {
      return t('status_valid'); // Translated status
    }
  };

  if (loading) return <div className="loading">{t('loading_vehicle_dates')}</div>;
  if (!vehicle) return <div className="error-message">{t('vehicle_not_found_error')}</div>;

  return (
    <div className="vehicle-dates-page">
      <div className="dates-header">
        <h1>{t('important_dates_for_vehicle', { make: vehicle.make, model: vehicle.model })}</h1> {/* Translated title */}
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          {t('back_to_dashboard_btn')} {/* Translated */}
        </button>
      </div>

      {showDateForm ? (
        <DateForm
          onSubmit={handleSaveDate}
          onCancel={() => {
            setShowDateForm(false);
            setEditingDate(null);
          }}
          initial={editingDate}
        />
      ) : (
        <button onClick={() => {
          setEditingDate(null);
          setShowDateForm(true);
        }} className="add-date-btn">{t('add_new_date_btn')}</button> /* Translated */
      )}

      <div className="dates-table-container">
        <h2>{t('date_records_title')}</h2> {/* Translated title */}
        {dates.length === 0 ? (
          <div className="no-dates-message">{t('no_date_records_found')}</div> /* Translated message */
        ) : (
          <div className="dates-table">
            <div className="table-header">
              <div>{t('date_table_type')}</div> {/* Translated */}
              <div>{t('date_table_due_date')}</div> {/* Translated */}
              <div>{t('date_table_status')}</div> {/* Translated */}
              <div>{t('date_table_notes')}</div> {/* Translated */}
              <div>{t('date_table_actions')}</div> {/* Translated */}
            </div>
            {dates.map(d => (
              <div key={d.id} className="table-row">
                <div>{d.dateType || t('n_a_placeholder')}</div>
                <div>
                  {d.dueDate && !isNaN(new Date(d.dueDate))
                    ? new Date(d.dueDate).toLocaleDateString()
                    : t('n_a_placeholder')}
                </div>
                <div className={`date-status date-status-${getDateStatus(d.dueDate).toLowerCase().replace(' ', '-')}`}>
                  {getDateStatus(d.dueDate)}
                </div>
                <div>{d.notes || t('n_a_placeholder')}</div>
                <div className="actions">
                  <button onClick={() => {
                    setEditingDate(d);
                    setShowDateForm(true);
                  }} className="edit-date-btn">{t('edit_action')}</button>
                  <button onClick={() => handleDeleteDate(d.id)} className="delete-date-btn">{t('delete_action')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
