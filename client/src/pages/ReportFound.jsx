import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Pin, ArrowLeft, Image, MapPin, Calendar, Tag, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="noticeboard-frame" style={{ maxWidth: '760px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#3e240f',
          fontFamily: 'var(--font-marker)',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '1rem',
        }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Physical Report Tag Flyer */}
      <div
        className="pin-card ruled-paper"
        style={{
          background: 'var(--paper-found)',
          border: '2px solid #a7f3d0',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Green Pushpin */}
        <div className="pushpin pushpin-green">
          <div className="pushpin-head"></div>
          <div className="pushpin-point"></div>
        </div>

        {/* Tag Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px dashed #34d399',
            paddingBottom: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span className="badge-found" style={{ padding: '0.3rem 0.8rem', borderRadius: '4px' }}>
              ✦ GOOD SAMARITAN NOTICE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '2.3rem',
                color: '#065f46',
                marginTop: '0.5rem',
              }}
            >
              Report a Found Item
            </h2>
            <p style={{ color: '#047857', fontSize: '0.9rem' }}>
              Help reunite this item with its rightful owner by pinning a found flyer to the board.
            </p>
          </div>

          <div className="punch-hole" />
        </div>

        {error && (
          <div className="notice-alert notice-alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
          {/* Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#065f46',
                marginBottom: '0.3rem',
              }}
            >
              Found Item Title / Brief Summary *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Set of Dorm Room Keys with Blue Lanyard, Casio Scientific Calculator..."
              className="paper-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.2rem',
                  color: '#065f46',
                  marginBottom: '0.3rem',
                }}
              >
                <Tag size={16} /> Category *
              </label>
              <select
                name="category"
                className="paper-input"
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
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.2rem',
                  color: '#065f46',
                  marginBottom: '0.3rem',
                }}
              >
                <Calendar size={16} /> Date Found *
              </label>
              <input
                type="date"
                name="date"
                className="paper-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#065f46',
                marginBottom: '0.3rem',
              }}
            >
              <MapPin size={16} /> Location Where Found *
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Main Quad Benches, Dining Hall Table 4, Library 3rd Floor..."
              className="paper-input"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#065f46',
                marginBottom: '0.3rem',
              }}
            >
              Description & Helpful Clues *
            </label>
            <textarea
              name="description"
              rows={5}
              placeholder="Describe the item's general appearance. TIP: Keep one or two unique details secret so the claimant can prove ownership when they file a claim request!"
              className="paper-input"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Image Upload or URL */}
          <div
            style={{
              background: 'rgba(255,255,255,0.7)',
              padding: '1.2rem',
              borderRadius: '6px',
              border: '1px dashed #6ee7b7',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#065f46',
                marginBottom: '0.3rem',
              }}
            >
              <Image size={16} /> Photo of Found Item (Optional)
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#57534e', display: 'block', marginBottom: '0.25rem' }}>
                  Upload image file:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', color: '#57534e', display: 'block', marginBottom: '0.25rem' }}>
                  Or paste direct image URL:
                </span>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/photo.jpg"
                  className="paper-input"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
            </div>

            {previewUrl && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '180px', borderRadius: '4px', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                />
              </div>
            )}
          </div>

          {/* Submit button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: 'transparent',
                border: '1px solid #065f46',
                color: '#065f46',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-tag-found"
              style={{ fontSize: '1.25rem', padding: '0.65rem 1.75rem' }}
            >
              <Sparkles size={18} /> {loading ? 'Pinning Notice...' : 'Pin Found Notice to Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
