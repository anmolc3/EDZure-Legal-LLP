import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { insightsAPI, uploadAPI, getImageUrl } from '../../services/api';
import './EditInsight.css';

const EditInsight = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    image_type: 'local',
    category: 'blog',
    author: '',
    status: 'draft'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchInsight();
  }, [id]);

  const fetchInsight = async () => {
    try {
      setFetchLoading(true);
      const response = await insightsAPI.getAll({ limit: 100 });
      const insight = response.data.insights.find(i => i.id === parseInt(id));
      
      if (insight) {
        setFormData({
          title: insight.title,
          content: insight.content,
          excerpt: insight.excerpt || '',
          image_url: insight.image_url || '',
          image_type: insight.image_type || 'local',
          category: insight.category,
          author: insight.author,
          status: insight.status
        });
        setCurrentImage(insight.image_url || '');
      } else {
        setError('Insight not found');
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error fetching insight:', error);
      setError('Failed to load insight');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image_type: e.target.value,
      image_url: e.target.value === 'online' ? prev.image_url : ''
    }));
    setImageFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploadProgress(true);
      const formDataObj = new FormData();
      formDataObj.append('image', imageFile);

      const response = await uploadAPI.uploadImage(formDataObj);
      if (response.data.success) {
        return response.data.fileUrl;
      }
      throw new Error('Upload failed');
    } catch (error) {
      throw new Error('Failed to upload image');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim() || formData.content === '<p><br></p>') {
        throw new Error('Content is required');
      }

      // Upload new image if local file selected
      let imageUrl = formData.image_url;
      if (formData.image_type === 'local' && imageFile) {
        imageUrl = await uploadImage();
      } else if (formData.image_type === 'online' && !formData.image_url.trim()) {
        imageUrl = currentImage; // Keep existing image if no new URL provided
      } else if (formData.image_type === 'local' && !imageFile) {
        imageUrl = currentImage; // Keep existing image if no new file selected
      }

      // Update insight
      const insightData = {
        ...formData,
        image_url: imageUrl || null
      };

      const response = await insightsAPI.update(id, insightData);

      if (response.data.success) {
        navigate('/admin/dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to update insight');
      }
    } catch (err) {
      setError(err.message || 'Failed to update insight');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="loading">Loading insight...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Edit Insight - Admin - EdZure Legal LLP</title>
      </Helmet>
      <div className="add-insight-page">
        <div className="container">
          <div className="page-header">
            <h1>Edit Insight</h1>
            <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">
              ← Back to Dashboard
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {uploadProgress && <div className="alert alert-info">Uploading image...</div>}

          <form onSubmit={handleSubmit} className="insight-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter insight title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="blog">Blog</option>
                  <option value="news">News</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt (Optional)</label>
              <textarea
                id="excerpt"
                name="excerpt"
                className="form-control"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                placeholder="Short summary (max 200 characters)"
                maxLength="200"
              />
              <small className="form-text">{formData.excerpt.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label>Content *</label>
              <div className="editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  placeholder="Write your insight content here..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              {currentImage && (
                <div className="current-image">
                  <img src={getImageUrl(currentImage)} alt="Current" style={{ maxWidth: '300px', marginBottom: '15px', borderRadius: '8px' }} />
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Current image</p>
                </div>
              )}
              <div className="image-type-selector">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="image_type"
                    value="local"
                    checked={formData.image_type === 'local'}
                    onChange={handleImageTypeChange}
                  />
                  <span>Upload from Computer</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="image_type"
                    value="online"
                    checked={formData.image_type === 'online'}
                    onChange={handleImageTypeChange}
                  />
                  <span>Use Online URL</span>
                </label>
              </div>

              {formData.image_type === 'local' ? (
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <label htmlFor="image" className="file-label">
                    {imageFile ? imageFile.name : 'Choose New Image'}
                  </label>
                  <small className="form-text">Max size: 5MB (JPG, PNG, GIF, WEBP). Leave empty to keep current image.</small>
                </div>
              ) : (
                <input
                  type="url"
                  name="image_url"
                  className="form-control"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || uploadProgress}>
                {loading ? 'Updating...' : 'Update Insight'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditInsight;