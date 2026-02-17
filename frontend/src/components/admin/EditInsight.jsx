import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { insightsAPI, uploadAPI, getImageUrl } from '../../services/api';
import './EditInsight.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'blockquote', 'code-block'],
    ['clean'],
  ],
};

/* ── Icons ── */
const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2l11 0 5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin-icon">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const ContentIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
);

const EditInsight = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '', content: '', excerpt: '', image_url: '',
    image_type: 'local', category: 'blog', author: '', status: 'draft',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => { fetchInsight(); }, [id]);

  const fetchInsight = async () => {
    try {
      setFetchLoading(true);
      const res = await insightsAPI.getAll({ limit: 100 });
      const insight = res.data.insights.find(i => i.id === parseInt(id));
      if (insight) {
        setFormData({
          title: insight.title,
          content: insight.content,
          excerpt: insight.excerpt || '',
          image_url: insight.image_url || '',
          image_type: insight.image_type || 'local',
          category: insight.category,
          author: insight.author,
          status: insight.status,
        });
        setCurrentImage(insight.image_url || '');
      } else {
        setError('Insight not found');
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      }
    } catch {
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

  const handleContentChange = (value) => setFormData(prev => ({ ...prev, content: value }));

  const handleImageTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image_type: e.target.value,
      image_url: e.target.value === 'online' ? prev.image_url : '',
    }));
    setImageFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    setImageFile(file);
    setError('');
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    try {
      setUploadProgress(true);
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await uploadAPI.uploadImage(fd);
      if (res.data.success) return res.data.fileUrl;
      throw new Error('Upload failed');
    } catch {
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
      if (formData.image_type === 'local' && imageFile) imageUrl = await uploadImage();
      else if (formData.image_type === 'local' && !imageFile) imageUrl = currentImage;
      else if (formData.image_type === 'online' && !formData.image_url.trim()) imageUrl = currentImage;

      const res = await insightsAPI.update(id, { ...formData, image_url: imageUrl || null });
      if (res.data.success) navigate('/admin/dashboard');
      else throw new Error(res.data.message || 'Failed to update insight');
    } catch (err) {
      setError(err.message || 'Failed to update insight');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="admin-form-page">
      <div className="form-loading">
        <div className="form-spinner" style={{ borderColor: '#fde68a', borderTopColor: '#f59e0b' }} />
        Loading insight…
      </div>
    </div>
  );

  const isDisabled = loading || uploadProgress;

  return (
    <>
      <Helmet><title>Edit Insight – Admin · EdZure Legal LLP</title></Helmet>

      <div className="admin-form-page">

        {/* ── Top Bar ── */}
        <div className="form-top-bar">
          <div className="form-top-bar-left">
            <h1 className="form-page-heading">Edit Insight</h1>
            <span className="form-mode-badge">
              <span className="form-badge-dot" />
              Editing
            </span>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="form-back-btn">
            <ArrowLeft /> Back to Dashboard
          </button>
        </div>

        <div className="form-container">

          {error && (
            <div className="form-alert form-alert-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {uploadProgress && (
            <div className="form-alert form-alert-info">
              <SpinnerIcon /> Uploading image…
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Content Details ── */}
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon icon-content"><ContentIcon /></div>
                <h2 className="form-section-title">Content Details</h2>
                <span className="form-section-sub">Required</span>
              </div>
              <div className="form-card-body">

                <div className="f-row">
                  <div className="f-group">
                    <label className="f-label" htmlFor="title">
                      Title <span className="f-required">*</span>
                    </label>
                    <input type="text" id="title" name="title" className="f-input"
                      value={formData.title} onChange={handleChange}
                      required placeholder="Insight title" />
                  </div>
                  <div className="f-group">
                    <label className="f-label" htmlFor="category">
                      Category <span className="f-required">*</span>
                    </label>
                    <select id="category" name="category" className="f-input f-select"
                      value={formData.category} onChange={handleChange} required>
                      <option value="blog">Blog</option>
                      <option value="news">News</option>
                    </select>
                  </div>
                </div>

                <div className="f-group">
                  <label className="f-label" htmlFor="excerpt">
                    Excerpt <span className="f-optional">(optional)</span>
                  </label>
                  <textarea id="excerpt" name="excerpt"
                    className="f-input f-textarea"
                    value={formData.excerpt} onChange={handleChange}
                    rows={3} placeholder="Short summary…" maxLength={200} />
                  <div className="f-char-count">
                    <span className={formData.excerpt.length > 180 ? 'near-limit' : ''}>
                      {formData.excerpt.length}
                    </span>
                    <span className="f-char-sep">/200</span>
                  </div>
                </div>

                <div className="f-group" style={{ marginBottom: 0 }}>
                  <label className="f-label">Content <span className="f-required">*</span></label>
                  <div className="f-editor-wrap">
                    <ReactQuill theme="snow" value={formData.content}
                      onChange={handleContentChange} modules={quillModules}
                      placeholder="Write your insight content here…" />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Featured Image ── */}
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon icon-image"><ImageIcon /></div>
                <h2 className="form-section-title">Featured Image</h2>
                <span className="form-section-sub">Optional</span>
              </div>
              <div className="form-card-body">

                {currentImage && (
                  <div className="f-current-image">
                    <img src={getImageUrl(currentImage)} alt="Current featured" />
                    <div className="f-current-label">Current image · leave empty to keep</div>
                  </div>
                )}

                <div className="f-radio-group">
                  <label className="f-radio-option">
                    <input type="radio" name="image_type" value="local"
                      checked={formData.image_type === 'local'} onChange={handleImageTypeChange} />
                    Upload from computer
                  </label>
                  <label className="f-radio-option">
                    <input type="radio" name="image_type" value="online"
                      checked={formData.image_type === 'online'} onChange={handleImageTypeChange} />
                    Use online URL
                  </label>
                </div>

                {formData.image_type === 'local' ? (
                  <div className="f-file-area">
                    <input type="file" id="image" accept="image/*"
                      onChange={handleFileSelect} className="f-file-hidden" />
                    <label htmlFor="image" className="f-file-label">
                      {imageFile ? (
                        <>
                          <div className="f-file-icon"><UploadIcon /></div>
                          <span className="f-file-selected">{imageFile.name}</span>
                          <span className="f-file-sub">Click to change</span>
                        </>
                      ) : (
                        <>
                          <div className="f-file-icon"><UploadIcon /></div>
                          <span className="f-file-text">Click to upload a new image</span>
                          <span className="f-file-sub">JPG, PNG, WEBP · Max 5 MB · Leave empty to keep current</span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <input type="url" name="image_url" className="f-input"
                    value={formData.image_url} onChange={handleChange}
                    placeholder="https://example.com/image.jpg" />
                )}

              </div>
            </div>

            {/* ── Publication Settings ── */}
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon icon-publish"><SettingsIcon /></div>
                <h2 className="form-section-title">Publication Settings</h2>
              </div>
              <div className="form-card-body">
                <div className="f-row" style={{ marginBottom: 0 }}>
                  <div className="f-group" style={{ marginBottom: 0 }}>
                    <label className="f-label" htmlFor="author">Author</label>
                    <input type="text" id="author" name="author" className="f-input"
                      value={formData.author} onChange={handleChange}
                      placeholder="Author name" />
                  </div>
                  <div className="f-group" style={{ marginBottom: 0 }}>
                    <label className="f-label" htmlFor="status">
                      Status <span className="f-required">*</span>
                    </label>
                    <select id="status" name="status" className="f-input f-select"
                      value={formData.status} onChange={handleChange} required>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="form-actions-bar">
              <button type="button" className="f-btn-cancel"
                onClick={() => navigate('/admin/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="f-btn-submit" disabled={isDisabled}>
                {loading ? <><SpinnerIcon /> Saving…</> : <><SaveIcon /> Save Changes</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditInsight;
