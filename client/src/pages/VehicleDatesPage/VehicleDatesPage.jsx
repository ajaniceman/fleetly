import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DateForm from '../../components/DateForm/DateForm';
import { useTranslation } from 'react-i18next';
import './VehicleDatesPage.css'; // Make sure this CSS file exists

const getDateTypeTranslationKey = (typeString) => {
  if (!typeString) return '';
  return `date_type_${typeString.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
};

export default function VehicleDatesPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { t } = useTranslation();

  const [vehicle, setVehicle] = useState(null);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  const fetchVehicleAndDates = useCallback(async () => {
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

      // Fetch dates for this vehicle
      const datesRes = await fetchWithAuth(`/api/dates/vehicle/${vehicleId}`);
      if (!datesRes.ok) {
        throw new Error(`Failed to fetch dates: ${datesRes.statusText}`);
      }
      const datesData = await datesRes.json();
      setDates(datesData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      if (!err.message.includes("Session expired")) {
        alert(t('error_fetching_data', { message: err.message }));
      }
    } finally {
      setLoading(false);
    }
  }, [vehicleId, fetchWithAuth, t]);

  useEffect(() => {
    // Only attempt to fetch if vehicleId is available
    if (vehicleId) {
      fetchVehicleAndDates();
    }
  }, [fetchVehicleAndDates, vehicleId]); // Added vehicleId to dependencies for completeness

  // Helper function to determine date status
  const getDateStatus = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const date = new Date(dueDate);
    date.setHours(0, 0, 0, 0);

    const timeDiff = date.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return 'expired'; // Past due
    } else if (daysRemaining === 0) {
      return 'due_today'; // Due today
    } else if (daysRemaining <= 30) {
      return 'upcoming'; // Due within 30 days
    } else {
      return 'valid'; // Still far in the future
    }
  };

  const handleSaveDate = async (formData) => {
    let res;
    let url;
    let method;

    if (editingDate) {
      url = `/api/dates/${editingDate.id}`;
      method = 'PUT';
    } else {
      url = `/api/dates`;
      method = 'POST';
      formData.vehicle_id = vehicleId; // Add vehicle_id for new date records
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
        await fetchVehicleAndDates(); // Re-fetch all dates to update the table
        setShowForm(false);
        setEditingDate(null);
        alert(t(`date_${editingDate ? 'updated' : 'added'}_success`)); // Translate success alert
      } else {
        const errorData = await res.json();
        alert(t(`failed_to_${editingDate ? 'update' : 'add'}_date`, { message: errorData.message || res.statusText })); // Translate failure alert
      }
    } catch (err) {
      console.error(`Error ${editingDate ? 'updating' : 'adding'} date:`, err);
      if (!err.message.includes("Session expired")) {
        alert(t(`unexpected_${editingDate ? 'update' : 'add'}_error_date`)); // Translate unexpected error alert
      }
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (window.confirm(t('confirm_delete_date'))) { // Translate confirmation dialog
      try {
        const res = await fetchWithAuth(`/api/dates/${dateId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setDates(dates.filter(d => d.id !== dateId));
          alert(t('date_deleted_success')); // Translate success alert
        } else {
          const errorData = await res.json();
          alert(t('failed_to_delete_date', { message: errorData.message || res.statusText })); // Translate failure alert
        }
      } catch (err) {
        console.error("Error deleting date:", err);
        if (!err.message.includes("Session expired")) {
          alert(t('unexpected_delete_error_date')); // Translate unexpected error alert
        }
      }
    }
  };

  if (loading) return <div className="loading">{t('loading_dates')}</div>;
  if (error) return <div className="error-message">{t('error_displaying_dates', { message: error })}</div>;
  if (!vehicle) return <div className="no-vehicle-found">{t('no_vehicle_found')}</div>;

  return (
    <div className="vehicle-dates-page">
      <div className="dates-header">
        <h1>{t('dates_for_vehicle', { make: vehicle.make, model: vehicle.model })}</h1>
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          {t('back_to_dashboard_btn')}
        </button>
      </div>

      {showForm ? (
        <DateForm
          onSubmit={handleSaveDate}
          onCancel={() => {
            setShowForm(false);
            setEditingDate(null);
          }}
          initial={editingDate}
        />
      ) : (
        <button onClick={() => {
          setEditingDate(null);
          setShowForm(true);
        }} className="add-date-btn">
          {t('add_new_date_btn')}
        </button>
      )}

      <div className="dates-table-container">
        <h2>{t('date_history_title')}</h2>
        {dates.length === 0 ? (
          <div className="no-dates-message">
            {t('no_date_records_yet')}
          </div>
        ) : (
          <div className="dates-table">
            <div className="table-header">
              <div>{t('date_table_type')}</div>
              <div>{t('date_table_due_date')}</div>
              <div>{t('date_table_notes')}</div>
              <div>{t('date_table_status')}</div>
              <div>{t('date_table_actions')}</div>
            </div>
            {dates.map(date => {
              const status = getDateStatus(date.dueDate);
              return (
                <div key={date.id} className="table-row">
                  {/* Translate date type here */}
                  <div>{t(getDateTypeTranslationKey(date.dateType))}</div>
                  <div>{new Date(date.dueDate).toLocaleDateString()}</div>
                  <div>{date.notes || t('n_a_placeholder')}</div>
                  <div className={`date-status date-status-${status}`}>
                    {t(`date_status_${status}`)}
                  </div>
                  <div className="actions">
                    <button onClick={() => {
                      setEditingDate(date);
                      setShowForm(true);
                    }} className="edit-date-btn">{t('edit_action')}</button>
                    <button onClick={() => handleDeleteDate(date.id)} className="delete-date-btn">{t('delete_action')}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
