import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';

// Receive props from Appointment.jsx
export default function BookingForm({ onClose, docInfo, selectedDate, selectedTime }) {
  const { token, user } = useContext(AppContext);

  // States for the form fields
  const [patientName, setPatientName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // States for loading and errors
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    if (user) {
      if (user.name) setPatientName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Format the date for display
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Authentication required. Please sign in or create an account to book an appointment.');
      return;
    }
    
    // Check if a time is selected
    if (!selectedTime) {
      setError('Please select a time slot before booking.');
      return;
    }

    setLoading(true);
    setError('');

    // This is the data object we will send to the backend
    const bookingData = {
      doctorName: docInfo.name,
      patientName: patientName,
      patientEmail: email,
      gender: gender,
      address: address,
      appointmentDate: formattedDate,
      appointmentTime: selectedTime
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/appointments/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Booking successful:', response.data);
      alert('Appointment booked successfully!');
      onClose(); // Close the modal

    } catch (err) {
      console.error('Booking failed:', err);
      let errorMsg = 'Booking failed. Please try again.';
      if (err.response && err.response.data) {
        errorMsg = typeof err.response.data === 'string' ? err.response.data : (err.response.data.message || errorMsg);
      } else if (err.request) {
        errorMsg = 'Network error. Is the backend server running?';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-fadeIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm transition-all"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Confirm Booking
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Book Appointment
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            With <strong className="text-slate-800">{docInfo.name}</strong> on <strong className="text-slate-800">{formattedDate}</strong> at <strong className="text-blue-600">{selectedTime || 'Not selected'}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Patient Full Name *
            </label>
            <input 
              type="text" 
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Patient Email Address *
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select 
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-sm px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 transition-all bg-white"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Location *
              </label>
              <input 
                type="text" 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Mohali"
                className="w-full text-sm px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Confirming Booking...' : 'Confirm Appointment'}
          </button>
        </form>

      </div>
    </div>
  );
}
