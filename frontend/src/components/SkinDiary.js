// frontend/src/components/SkinDiary.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SkinDiary = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const fetchDiaryEntries = async () => {
    setFetching(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      console.log('[FETCH DIARY] Token from localStorage:', token ? 'present (length ' + token.length + ')' : 'MISSING');
      console.log('[FETCH DIARY] First 30 chars:', token?.substring(0, 30) || 'no token');

      if (!token) throw new Error('No token found – please log in');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      console.log('[FETCH DIARY] Sending request with Authorization header');

      const res = await axios.get('/api/user/skin-diary', config);

      setDiaryEntries(res.data || []);
    } catch (err) {
      console.error('[FETCH DIARY] Error:', err);
      console.error('[FETCH DIARY] Response status:', err.response?.status);
      console.error('[FETCH DIARY] Response headers:', err.response?.headers);
      setError(err.response?.data?.error || err.message || 'Failed to load diary');
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large (max 5 MB)');
        return;
      }
      setPhoto(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!photo) {
      setError('Please select a photo first');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('[UPLOAD] Token from localStorage:', token ? 'present (length ' + token.length + ')' : 'MISSING');

    if (!token) {
      setError('Please log in to upload photos');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', photo);

    const optimisticEntry = {
      _id: `temp-${Date.now()}`,
      date: new Date().toISOString(),
      photoUrl: URL.createObjectURL(photo),
      scores: { hydration: '…', acneSeverity: '…' },
      isOptimistic: true,
    };

    setDiaryEntries((prev) => [optimisticEntry, ...prev]);

    try {
      console.log('[UPLOAD] Sending POST with Authorization header');

      const res = await axios.post('/api/user/skin-diary', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data?.success && res.data?.entry) {
        setDiaryEntries((prev) =>
          prev.map((entry) =>
            entry.isOptimistic ? { ...res.data.entry, isOptimistic: false } : entry
          )
        );
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Upload failed:', err);

      const errorMsg =
        err.response?.data?.error ||
        (err.response?.status === 401 ? 'Session expired – please log in again' :
         err.response?.status === 413 ? 'File too large' :
         err.message || 'Upload failed. Please try again.');

      setError(errorMsg);

      setDiaryEntries((prev) => prev.filter((e) => !e.isOptimistic));
    } finally {
      setLoading(false);
      setPhoto(null);
    }
  };

  const chartData = diaryEntries
    .filter((entry) => !entry.isOptimistic)
    .map((entry) => ({
      date: entry.date ? new Date(entry.date).toLocaleDateString() : '—',
      hydration: entry.scores?.hydration ?? null,
      acne: entry.scores?.acneSeverity ?? null,
    }))
    .filter((d) => d.hydration !== null || d.acne !== null)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-center">Skin Progress Diary</h2>

      <div className="bg-gray-800 rounded-xl p-6 mb-10 shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weekly Skin Photo
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={loading}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
            />
            {photo && (
              <p className="mt-2 text-sm text-gray-400 truncate">
                Selected: {photo.name}
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !photo}
            className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[180px]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Upload & Analyze'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-3 underline hover:text-red-100">
              dismiss
            </button>
          </div>
        )}
      </div>

      {fetching ? (
        <div className="text-center py-12 text-gray-400">Loading your skin diary...</div>
      ) : error && diaryEntries.length === 0 ? (
        <div className="text-center py-12 text-red-400">{error}</div>
      ) : chartData.length > 0 ? (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Progress Trend</h3>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis yAxisId="left" orientation="left" domain={[0, 100]} stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} stroke="#ef4444" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#e5e7eb' }} />
                <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                <Line yAxisId="left" type="monotone" dataKey="hydration" stroke="#3b82f6" name="Hydration (%)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="acne" stroke="#ef4444" name="Acne Severity (0–10)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No entries yet. Take your first weekly photo!</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {diaryEntries.map((entry) => (
          <div
            key={entry._id}
            className={`border border-gray-700 rounded-xl overflow-hidden shadow-lg bg-gray-800 ${entry.isOptimistic ? 'opacity-70' : ''}`}
          >
            <div className="relative">
              <img
                src={entry.photoUrl}
                alt="Skin photo"
                className="w-full h-56 object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
              />
              {entry.isOptimistic && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-sm font-medium">Uploading...</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-400">
                {new Date(entry.date).toLocaleDateString()} • {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>Hydration: <span className="font-medium text-blue-400">{entry.scores?.hydration != null ? `${entry.scores.hydration}%` : '—'}</span></div>
                <div>Acne: <span className="font-medium text-red-400">{entry.scores?.acneSeverity ?? '—'}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinDiary;