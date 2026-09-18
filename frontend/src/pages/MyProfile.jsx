import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';

function MyProfile() {
  const { token, user, setUser } = useContext(AppContext);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Sector 62, Mohali, Punjab, India',
    gender: user?.gender || 'Male',
    dob: user?.dob || '2000-01-01',
    image: user?.image || ''
  });

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch full profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          const fetched = response.data;
          setUserData({
            name: fetched.name || user?.name || '',
            email: fetched.email || user?.email || '',
            phone: fetched.phone || '+91 98765 43210',
            address: fetched.address || 'Sector 62, Mohali, Punjab, India',
            gender: fetched.gender || 'Male',
            dob: fetched.dob || '2000-01-01',
            image: fetched.image || ''
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle personal image file selection and convert to Base64 data URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes to backend
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        {
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          gender: userData.gender,
          dob: userData.dob,
          image: userData.image
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage('Profile updated successfully!');
        setIsEdit(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract first letter for default avatar badge
  const initial = (userData.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-8">
        
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
            <span>✅</span> {message}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            {userData.image ? (
              <img
                src={userData.image}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover shadow-md group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-extrabold shadow-md">
                {initial}
              </div>
            )}

            {isEdit && (
              <label className="absolute inset-0 bg-slate-900/50 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Upload</span>
                <span className="text-[10px] opacity-80">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 w-full">
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold text-slate-900 border border-slate-300 rounded-xl px-3.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full max-w-md"
                placeholder="Full Name"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {userData.name || 'User Profile'}
              </h1>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Verified Patient
              </span>
              {isEdit && (
                <label className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                  [Choose Photo]
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold mb-1">Email Address (Registered)</p>
              <p className="font-bold text-slate-800">{userData.email}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold mb-1">Phone Number</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              ) : (
                <p className="font-bold text-slate-800">{userData.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold mb-1">Residential Address</p>
              {isEdit ? (
                <input
                  onChange={e => setUserData(prev => ({ ...prev, address: e.target.value }))}
                  value={userData.address}
                  type="text"
                  placeholder="e.g. Sector 62, Mohali, Punjab, India"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="font-semibold text-slate-800 leading-relaxed">
                  {userData.address || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold mb-1">Gender</p>
              {isEdit ? (
                <select
                  onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  value={userData.gender}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="font-bold text-slate-800">{userData.gender || 'Not specified'}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold mb-1">Date of Birth</p>
              {isEdit ? (
                <input
                  type="date"
                  onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                  value={userData.dob}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="font-bold text-slate-800">{userData.dob || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit / Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          {isEdit ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Profile...' : 'Save Profile'}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-8 py-3 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 shadow-md hover:shadow-lg transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
