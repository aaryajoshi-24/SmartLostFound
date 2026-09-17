import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Image, MapPin, Calendar, Tag, AlertCircle } from 'lucide-react';

const categories = [
  'Electronics',
  'Documents',
  'Accessories',
  'Bags',
  'Clothing',
  'Keys',
  'Other',
];

const ReportFound = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a title for the found item.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a description of the item found.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please specify where you found this item.');
      return;
    }
    if (!formData.date) {
      setError('Please provide the date when you found the item.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('type', 'found');
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('date', formData.date);
      if (formData.image.trim()) {
        data.append('image', formData.image.trim());
      }
      if (imageFile) {
        data.append('imageFile', imageFile);
      }

      const res = await api.post('/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/items/${res.data.item._id}`);
    } catch (err) {
      console.error('Error reporting found item:', err);
      setError(err.response?.data?.message || 'Failed to submit found report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '680px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '1.25rem',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="clean-card" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <span className="tag-found" style={{ marginBottom: '0.5rem' }}>
            Found Item Form
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginTop: '0.25rem' }}>
            Report a Found Item
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Help reunite a lost item with its rightful owner by publishing this found notice.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
              Item Name / Summary *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Set of Dorm Room Keys, Casio Calculator, Blue Water Bottle..."
              className="clean-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                name="category"
                className="clean-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
                Date Found *
              </label>
              <input
                type="date"
                name="date"
                className="clean-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
              Location Where Found *
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Main Quad Bench, Student Union Cafeteria..."
              className="clean-input"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>
              Description & Helpful Clues *
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the item general appearance. (Tip: keep one small secret so the owner can prove ownership!)"
              className="clean-input"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Image */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              Attach Photo (Optional)
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  Upload file:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  Or image URL:
                </span>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/photo.jpg"
                  className="clean-input"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
            </div>

            {previewUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '140px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ backgroundColor: '#059669', borderColor: '#059669' }}
            >
              {loading ? 'Submitting...' : 'Post Found Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
