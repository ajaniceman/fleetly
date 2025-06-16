import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DateForm from '../../components/DateForm/DateForm';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth
import './VehicleDatesPage.css';

export default function VehicleDatesPage() {
  const { vehicleId } = useParams(); // Changed 'id' to 'vehicleId' to match route parameter
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth(); // Destructure fetchWithAuth
  const [vehicle, setVehicle] = useState(null);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDateForm, setShowDateForm] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  useEffect(() => {
    const fetchVehicleAndDates = async () => {
      try {
        // Fetch vehicle details using fetchWithAuth
        const vehicleRes = await fetchWithAuth(`/api/vehicles/${vehicleId}`); // Use vehicleId
        if (!vehicleRes.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        const vehicleData = await vehicleRes.json();
        setVehicle(vehicleData);

        // Fetch dates for this vehicle using fetchWithAuth
        const datesRes = await fetchWithAuth(`/api/dates/vehicle/${vehicleId}`); // Use vehicleId
        if (!datesRes.ok) {
          throw new Error('Failed to fetch dates');
        }
        const datesData = await datesRes.json();
        setDates(datesData);

      } catch (error) {
        console.error("Error loading vehicle dates:", error);
        if (!error.message.includes("Session expired")) {
          alert(`Error loading dates: ${error.message}`);
          navigate('/dashboard'); // Go back to dashboard on other errors
        }
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) { // Check if vehicleId exists before fetching
      fetchVehicleAndDates();
    }
  }, [vehicleId, navigate, fetchWithAuth]); // Add fetchWithAuth to dependency array

  const handleSaveDate = async (formData) => {
    let res;
    let url;
    let method;

    formData.vehicle_id = vehicleId; // Use vehicleId here

    if (editingDate) {
      url = `/api/dates/${editingDate.id}`;
      method = 'PUT';
    } else {
      url = `/api/dates`;
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
        alert(`Date ${editingDate ? 'updated' : 'added'} successfully!`);
      } else {
        const errorData = await res.json();
        alert(`Failed to ${editingDate ? 'update' : 'add'} date: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${editingDate ? 'updating' : 'adding'} date:`, error);
      if (!error.message.includes("Session expired")) {
        alert(`An unexpected error occurred while ${editingDate ? 'updating' : 'adding'} the date.`);
      }
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (window.confirm("Are you sure you want to delete this date record?")) {
      try {
        const res = await fetchWithAuth(`/api/dates/${dateId}`, { // Use fetchWithAuth
          method: 'DELETE',
        });
        if (res.ok) {
          setDates(prevDates => prevDates.filter(d => d.id !== dateId));
          alert("Date record deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete date record: ${errorData.message || res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting date record:", error);
        if (!error.message.includes("Session expired")) {
          alert("An unexpected error occurred while deleting the date record.");
        }
      }
    }
  };

  // Function to determine status of a date
  const getDateStatus = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const date = new Date(dueDate);
    date.setHours(0, 0, 0, 0);

    const timeDiff = date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return 'Expired';
    } else if (daysDiff <= 30) { // Due within 30 days
      return 'Due Soon';
    } else {
      return 'Valid';
    }
  };

  if (loading) return <div className="loading">Loading vehicle dates...</div>;
  if (!vehicle) return <div className="error-message">Vehicle not found or an error occurred.</div>;

  return (
    <div className="vehicle-dates-page">
      <div className="dates-header">
        <h1>Important Dates for {vehicle.make} {vehicle.model}</h1>
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          Back to Dashboard
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
        }} className="add-date-btn">+ Add New Date</button>
      )}

      <div className="dates-table-container">
        <h2>Date Records</h2>
        {dates.length === 0 ? (
          <div className="no-dates-message">No date records found for this vehicle.</div>
        ) : (
          <div className="dates-table">
            <div className="table-header">
              <div>Type</div>
              <div>Due Date</div>
              <div>Status</div>
              <div>Notes</div>
              <div>Actions</div>
            </div>
            {dates.map(d => (
              <div key={d.id} className="table-row">
                <div>{d.dateType || 'N/A'}</div>
                <div>
                  {d.dueDate && !isNaN(new Date(d.dueDate))
                    ? new Date(d.dueDate).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div className={`date-status date-status-${getDateStatus(d.dueDate).toLowerCase().replace(' ', '-')}`}>
                  {getDateStatus(d.dueDate)}
                </div>
                <div>{d.notes || 'N/A'}</div>
                <div className="actions">
                  <button onClick={() => {
                    setEditingDate(d);
                    setShowDateForm(true);
                  }} className="edit-date-btn">Edit</button>
                  <button onClick={() => handleDeleteDate(d.id)} className="delete-date-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
