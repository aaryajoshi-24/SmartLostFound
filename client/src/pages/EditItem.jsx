import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Save, Tag, MapPin, Calendar, Image, AlertCircle, Edit3 } from 'lucide-react';

const categories = [
  'Electronics',
  'Documents',
  'Accessories',
  'Bags',
  'Clothing',
  'Keys',
  'Other',
];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    location: '',
    date: '',
    status: 'Active',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/items/${id}`);
        const item = res.data;
        setFormData({
          title: item.title,
          category: item.category,
          description: item.description,
          location: item.location,
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          status: item.status || 'Active',
          image: item.image || '',
        });
        if (item.image) {
          setPreviewUrl(item.image);
        }
      } catch (err) {
        console.error('Error loading item:', err);
        setError(err.response?.data?.message || 'Failed to load notice details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

    try {
      setSaving(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('date', formData.date);
      data.append('status', formData.status);
      if (formData.image) {
        data.append('image', formData.image.trim());
      }
      if (imageFile) {
        data.append('imageFile', imageFile);
      }

      await api.put(`/items/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/items/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.response?.data?.message || 'Failed to update notice.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="noticeboard-frame" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="pin-card" style={{ display: 'inline-block', padding: '2rem 3rem' }}>
          <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
          <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem' }}>Pulling flyer from board...</p>
        </div>
      </div>
    );
  }

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

      <div
        className="pin-card ruled-paper"
        style={{
          background: 'var(--paper-cream)',
          border: '2px solid #d4b996',
          padding: '2.5rem 2rem',
        }}
      >
        <div className="pushpin pushpin-brass">
          <div className="pushpin-head"></div>
          <div className="pushpin-point"></div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px dashed #b89872',
            paddingBottom: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-marker)',
                fontSize: '2.3rem',
                color: '#442812',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Edit3 size={28} color="#92400e" /> Edit Notice
            </h2>
            <p style={{ color: '#78350f', fontSize: '0.9rem' }}>
              Update notice information or change flyer status.
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
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#5c3817',
                marginBottom: '0.3rem',
              }}
            >
              Notice Headline *
            </label>
            <input
              type="text"
              name="title"
              className="paper-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.2rem',
                  color: '#5c3817',
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
                  display: 'block',
                  fontFamily: 'var(--font-marker)',
                  fontSize: '1.2rem',
                  color: '#5c3817',
                  marginBottom: '0.3rem',
                }}
              >
                Notice Status *
              </label>
              <select
                name="status"
                className="paper-input"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Claimed">Claimed</option>
                <option value="Resolved">Resolved</option>
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
                  color: '#5c3817',
                  marginBottom: '0.3rem',
                }}
              >
                <Calendar size={16} /> Date *
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

          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#5c3817',
                marginBottom: '0.3rem',
              }}
            >
              <MapPin size={16} /> Campus Location *
            </label>
            <input
              type="text"
              name="location"
              className="paper-input"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#5c3817',
                marginBottom: '0.3rem',
              }}
            >
              Description *
            </label>
            <textarea
              name="description"
              rows={5}
              className="paper-input"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Image */}
          <div
            style={{
              background: '#fff',
              padding: '1.2rem',
              borderRadius: '6px',
              border: '1px dashed #d6c7b2',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-marker)',
                fontSize: '1.2rem',
                color: '#5c3817',
                marginBottom: '0.3rem',
              }}
            >
              <Image size={16} /> Attached Image
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#57534e', display: 'block', marginBottom: '0.25rem' }}>
                  Upload new file:
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
                  Or update image URL:
                </span>
                <input
                  type="url"
                  name="image"
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: 'transparent',
                border: '1px solid #78350f',
                color: '#78350f',
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
              disabled={saving}
              className="btn-cork-primary"
              style={{ fontSize: '1.25rem', padding: '0.65rem 1.75rem' }}
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
