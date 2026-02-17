import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { insightsAPI, uploadAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AddInsight.css';

const AddInsight = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    image_type: 'local',
    category: 'blog',
    author: admin?.username || '',
    status: 'draft'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);

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
      image_url: ''
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
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await uploadAPI.uploadImage(formData);
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
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.content.trim() || formData.content === '<p><br></p>') throw new Error('Content is required');

      let imageUrl = formData.image_url;
      if (formData.image_type === 'local' && imageFile) {
        imageUrl = await uploadImage();
      } else if (formData.image_type === 'online' && !formData.image_url.trim()) {
        throw new Error('Please provide an image URL');
      }

      const insightData = { ...formData, image_url: imageUrl || null };
      const response = await insightsAPI.create(insightData);

      if (response.data.success) {
        navigate('/admin/dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to create insight');
      }
    } catch (err) {
      setError(err.message || 'Failed to create insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Add New Insight - Admin</title></Helmet>
      <div className="add-insight-page">
        <div className="container">
          <div className="page-header">
            <h1>Add New Insight</h1>
            <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">← Back</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {uploadProgress && <div className="alert alert-info">Uploading image...</div>}

          <form onSubmit={handleSubmit} className="insight-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} required placeholder="Enter title" />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                  <option value="blog">Blog</option>
                  <option value="news">News</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt (Optional)</label>
              <textarea id="excerpt" name="excerpt" className="form-control" value={formData.excerpt} onChange={handleChange} rows="3" placeholder="Short summary" maxLength="200" />
              <small className="form-text">{formData.excerpt.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label>Content *</label>
              <div className="editor-wrapper">
                <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} modules={quillModules} placeholder="Write content..." />
              </div>
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <div className="image-type-selector">
                <label className="radio-label"><input type="radio" name="image_type" value="local" checked={formData.image_type === 'local'} onChange={handleImageTypeChange} /><span>Upload</span></label>
                <label className="radio-label"><input type="radio" name="image_type" value="online" checked={formData.image_type === 'online'} onChange={handleImageTypeChange} /><span>URL</span></label>
              </div>
              {formData.image_type === 'local' ? (
                <div className="file-input-wrapper">
                  <input type="file" id="image" accept="image/*" onChange={handleFileSelect} className="file-input" style={{display:'none'}} />
                  <label htmlFor="image" className="file-label">{imageFile ? imageFile.name : 'Choose Image'}</label>
                  <small className="form-text">Max 5MB</small>
                </div>
              ) : (
                <input type="url" name="image_url" className="form-control" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input type="text" id="author" name="author" className="form-control" value={formData.author} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange} required>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading || uploadProgress}>{loading ? 'Creating...' : 'Create Insight'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddInsight;