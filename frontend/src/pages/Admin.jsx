import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { API_BASE } from '../data/constants';
import { FaStar, FaTrash, FaPlus, FaImage, FaVideo } from 'react-icons/fa';

const Admin = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [token, setToken] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [gallerySections, setGallerySections] = useState([]);
  const [services, setServices] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', perks: '' });
  const [status, setStatus] = useState({ auth: '' });
  const [loading, setLoading] = useState({ auth: false, upload: false });
  const [adminLoading, setAdminLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadVideo, setUploadVideo] = useState(null);
  const [selectedSection, setSelectedSection] = useState('');
  const [newSection, setNewSection] = useState({ title: '', description: '', coverImage: null });

  const fetchAdminData = async (activeToken) => {
    if (!activeToken) return;
    setAdminLoading(true);
    try {
      const [feedbackRes, inquiryRes, galleryRes, serviceRes] = await Promise.all([
        fetch(`${API_BASE}/api/feedbacks/all`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        }),
        fetch(`${API_BASE}/api/inquiries`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        }),
        fetch(`${API_BASE}/api/gallery`),
        fetch(`${API_BASE}/api/services`),
      ]);

      if (feedbackRes.status === 401 || inquiryRes.status === 401) {
        setStatus((prev) => ({ ...prev, auth: 'Session expired. Please log in again.' }));
        setToken('');
        setAdminLoading(false);
        return;
      }

      if (feedbackRes.ok) setFeedbacks(await feedbackRes.json());
      if (inquiryRes.ok) setInquiries(await inquiryRes.json());
      if (galleryRes.ok) setGallerySections(await galleryRes.json());
      if (serviceRes.ok) setServices(await serviceRes.json());
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        auth: 'Unable to load admin data. Check API connection.',
      }));
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ auth: '' });
    setLoading((prev) => ({ ...prev, auth: true }));
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await res.json();
      setToken(data.token);
      setStatus((prev) => ({ ...prev, auth: 'Logged in successfully.' }));
      setLoginForm({ username: '', password: '' });
      // fetchAdminData is triggered by useEffect on token change
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        auth: 'Login failed. Check username/password.',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!token) return;
    await fetch(`${API_BASE}/api/feedbacks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAdminData(token);
  };

  const handleDeleteInquiry = async (id) => {
    if (!token) return;
    await fetch(`${API_BASE}/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAdminData(token);
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/feedbacks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !currentStatus }),
      });
      if (res.ok) {
        fetchAdminData(token);
      }
    } catch (err) {
      console.error('Failed to toggle visibility');
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!token || !newSection.title) return;

    const formData = new FormData();
    formData.append('title', newSection.title);
    formData.append('description', newSection.description);
    if (newSection.coverImage) {
      formData.append('coverImage', newSection.coverImage);
    }

    try {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setNewSection({ title: '', description: '', coverImage: null });
        // Reset file input (hacky but simple)
        const fileInput = document.getElementById('newSectionCover');
        if (fileInput) fileInput.value = '';

        fetchAdminData(token);
        alert('Section created successfully');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create section');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating section');
    }
  };

  const handleDeleteSection = async (id) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this entire section and all its contents?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (selectedSection === id) setSelectedSection('');
        fetchAdminData(token);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting section');
    }
  };

  const handleUploadImage = async () => {
    if (!token || !uploadFile || !selectedSection) return;
    setLoading((prev) => ({ ...prev, upload: true }));

    const formData = new FormData();
    formData.append('image', uploadFile);

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${selectedSection}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setUploadFile(null);
        document.getElementById('fileInput').value = '';
        fetchAdminData(token);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleUploadVideo = async () => {
    if (!token || !uploadVideo || !selectedSection) return;
    setLoading((prev) => ({ ...prev, upload: true }));

    const formData = new FormData();
    formData.append('video', uploadVideo);

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${selectedSection}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setUploadVideo(null);
        document.getElementById('videoInput').value = '';
        fetchAdminData(token);
      } else {
        alert('Video upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Video upload failed');
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleDeleteImage = async (slug, imageUrl) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${slug}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });
      if (res.ok) fetchAdminData(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async (slug, videoUrl) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${slug}/videos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoUrl }),
      });
      if (res.ok) fetchAdminData(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const { name, price, perks } = serviceForm;
    const perkList = perks.split(',').map(p => p.trim()).filter(Boolean);

    try {
      const url = editingService
        ? `${API_BASE}/api/services/${editingService._id}`
        : `${API_BASE}/api/services`;

      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, perks: perkList })
      });

      if (res.ok) {
        setServiceForm({ name: '', price: '', perks: '' });
        setEditingService(null);
        fetchAdminData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      price: service.price,
      perks: service.perks.join(', ')
    });
    document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteService = async (id) => {
    if (!token) return;
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`${API_BASE}/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setFeedbacks([]);
    setInquiries([]);
    setIsProfileOpen(false);
  };


  return (
    <section className="mt-8 mb-12">
      <SectionHeader eyebrow="Admin" title="Admin Portal" />
      {!token ? (
        <div className="flex justify-center py-10 min-h-[50vh] items-center">
          <form onSubmit={handleLogin} className="glass-panel p-8 w-full max-w-md space-y-6 shadow-glow">
            <div className="text-center mb-2">
              <p className="text-slate-400 text-sm">Please sign in to continue</p>
            </div>
            <input
              type="text"
              placeholder="Username"
              required
              value={loginForm.username}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-amber-200/50 transition-colors outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-amber-200/50 transition-colors outline-none"
            />
            <button
              type="submit"
              disabled={loading.auth}
              className="w-full rounded-full bg-amber-300 text-slate-900 font-semibold py-3 hover:translate-y-[-2px] transition disabled:opacity-60"
            >
              {loading.auth ? 'Signing in...' : 'Login'}
            </button>
            {status.auth && <p className="text-sm text-amber-200 text-center">{status.auth}</p>}
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between relative">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-300">Authenticated as admin</p>
                <button
                  onClick={() => fetchAdminData(token)}
                  className="px-3 py-1 rounded-full border border-white/10 text-xs text-slate-300 hover:bg-white/5 transition"
                >
                  {adminLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition shadow-glow border border-amber-300/40 overflow-hidden"
              >
                <img src="/logo 2.png" alt="Admin Avatar" className="w-7 h-7 object-contain" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-14 z-50 glass-panel p-4 shadow-2xl w-48 rounded-xl border border-white/10 animate-fade-in flex flex-col gap-2">
                  <h3 className="text-lg font-display text-amber-200 border-b border-white/10 pb-2 mb-2">Profile</h3>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 rounded border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-display">Inquiries</h3>
                <span className="text-sm text-slate-400">{inquiries.length} entries</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {inquiries.map((item) => (
                  <div key={item._id} className="border border-white/5 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="text-xs text-slate-400 hover:text-amber-200 transition-colors">
                              {item.email}
                            </a>
                          )}
                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="text-xs text-slate-400 hover:text-amber-200 transition-colors">
                              {item.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(item._id)}
                        className="text-xs text-amber-200 hover:text-amber-100"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-slate-300 mt-2">{item.message}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <p className="text-sm text-slate-400">No inquiries yet.</p>
                )}
              </div>
            </div>

            <div className="glass-panel p-5 shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-display">Feedbacks</h3>
                <span className="text-sm text-slate-400">{feedbacks.length} entries</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {feedbacks.map((item) => (
                  <div key={item._id} className="border border-white/5 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.email || 'No email'}
                        </p>
                        {item.rating && (
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={12}
                                className={i < item.rating ? 'text-amber-400' : 'text-slate-600'}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleVisibility(item._id, item.isVisible)}
                          className={`text-xs px-2 py-1 rounded border ${item.isVisible
                            ? 'border-green-500/50 text-green-400 bg-green-500/10'
                            : 'border-slate-500/50 text-slate-400'
                            }`}
                        >
                          {item.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(item._id)}
                          className="text-xs text-amber-200 hover:text-amber-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mt-2">{item.message}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                {feedbacks.length === 0 && (
                  <p className="text-sm text-slate-400">No feedback submitted yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 shadow-glow mt-6">
            <h3 className="text-xl font-display mb-4">Service Management</h3>

            <form id="service-form" onSubmit={handleServiceSubmit} className="grid md:grid-cols-3 gap-4 mb-6 border-b border-white/10 pb-6">
              <input
                name="name"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="Service Name (e.g. Cinematic)"
                required
                className="bg-slate-900 border border-white/10 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
              />
              <input
                name="price"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                placeholder="Price (e.g. From ₹35,000)"
                required
                className="bg-slate-900 border border-white/10 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
              />
              <input
                name="perks"
                value={serviceForm.perks}
                onChange={(e) => setServiceForm({ ...serviceForm, perks: e.target.value })}
                placeholder="Perks (comma separated)"
                required
                className="bg-slate-900 border border-white/10 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
              />
              <div className="md:col-span-3 flex gap-3">
                <button type="submit" className="flex-1 bg-amber-300 text-slate-900 font-semibold py-2 rounded hover:bg-amber-200 transition">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
                {editingService && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setServiceForm({ name: '', price: '', perks: '' });
                    }}
                    className="px-6 py-2 rounded border border-white/10 text-slate-300 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
                <div key={service._id} className="border border-white/5 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg text-slate-100 font-bold">{service.name}</h4>
                    <p className="text-amber-200 text-sm mb-2">{service.price}</p>
                    <ul className="text-slate-400 text-xs list-disc pl-4">
                      {service.perks.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="text-amber-200 hover:text-amber-100 text-xs border border-amber-200/20 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="text-red-400 hover:text-red-300 text-xs border border-red-400/20 px-2 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 shadow-glow mt-6">
            <h3 className="text-xl font-display mb-4">Gallery Management</h3>

            {/* Create New Section */}
            <div className="mb-8 p-4 border border-white/10 rounded-lg bg-slate-900/30">
              <h4 className="text-sm text-slate-300 uppercase tracking-widest font-semibold mb-3">Add New Section</h4>
              <form onSubmit={handleCreateSection} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Section Title (e.g. Wedding Films)"
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    className="flex-1 bg-slate-900 border border-white/10 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                    className="flex-[2] bg-slate-900 border border-white/10 rounded px-3 py-2 text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <label className="text-xs text-slate-400 mb-1 block">Cover Image (Optional)</label>
                    <input
                      type="file"
                      id="newSectionCover"
                      accept="image/*"
                      onChange={(e) => setNewSection({ ...newSection, coverImage: e.target.files[0] })}
                      className="text-slate-300 w-full file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 transition-colors bg-slate-800/50 rounded-lg p-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-300 text-slate-900 font-semibold px-6 py-2 rounded hover:bg-amber-200 transition whitespace-nowrap self-end"
                  >
                    <FaPlus className="inline mr-1" /> Create
                  </button>
                </div>
              </form>
            </div>

            {/* Upload Section */}
            <div className="flex flex-col gap-4 mb-8 p-4 border border-white/10 rounded-lg">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded px-3 py-2 text-slate-100 outline-none focus:border-amber-200/50 w-full"
              >
                <option value="">Select Section to Manage</option>
                {gallerySections.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>

              <div className="flex flex-col md:flex-row gap-4 section-upload">
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Upload Image</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="text-slate-300 w-full file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 transition-colors bg-slate-800/50 rounded-lg p-1"
                      />
                      <button
                        onClick={handleUploadImage}
                        disabled={!selectedSection || !uploadFile || loading.upload}
                        className="bg-green-600/80 text-white px-4 py-2 rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors font-medium flex-shrink-0 text-sm"
                      >
                        <FaImage className="inline mr-1" /> {loading.upload ? 'Uploading to Cloud...' : 'Upload'}
                      </button>
                    </div>
                  </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Upload Video</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="videoInput"
                      accept="video/*"
                      onChange={(e) => setUploadVideo(e.target.files[0])}
                      className="text-slate-300 w-full file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 transition-colors bg-slate-800/50 rounded-lg p-1"
                    />
                    <button
                      onClick={handleUploadVideo}
                      disabled={!selectedSection || !uploadVideo || loading.upload}
                      className="bg-blue-600/80 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium flex-shrink-0 text-sm"
                    >
                      <FaVideo className="inline mr-1" /> {loading.upload ? 'Uploading to Cloud...' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery List */}
            <div className="space-y-6">
              {gallerySections.map(section => (
                <div key={section.slug} className="border border-white/5 rounded-lg p-4 bg-slate-900/40">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg text-amber-200">{section.title}</h4>
                    <div className="text-xs text-slate-400 flex gap-3 items-center">
                      <span>{section.images?.length || 0} images</span>
                      <span>{section.videos?.length || 0} videos</span>
                      <button
                        onClick={() => handleDeleteSection(section._id)}
                        className="ml-2 text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded"
                        title="Delete entire section"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Images Grid */}
                  {section.images?.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Images</h5>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {section.images.map((imgObj, idx) => {
                          const img = typeof imgObj === 'string' ? imgObj : imgObj.url;
                          return (
                          <div key={idx} className="relative group aspect-square rounded overflow-hidden border border-white/10">
                            <img
                              src={img?.startsWith('/uploads/') ? `${API_BASE}${img}` : img}
                              alt="Gallery"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => handleDeleteImage(section.slug, img)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                title="Delete Image"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}

                  {/* Videos Grid */}
                  {section.videos?.length > 0 && (
                    <div>
                      <h5 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Videos</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {section.videos.map((vidObj, idx) => {
                          const vid = typeof vidObj === 'string' ? vidObj : vidObj.url;
                          return (
                          <div key={idx} className="relative group aspect-video rounded overflow-hidden border border-white/10 bg-black">
                            <video
                              src={vid?.startsWith('/uploads/') ? `${API_BASE}${vid}` : vid}
                              className="w-full h-full object-cover"
                              controls
                              controlsList="nodownload"
                              onContextMenu={(e) => e.preventDefault()}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDeleteVideo(section.slug, vid)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                title="Delete Video"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}

                  {(!section.images?.length && !section.videos?.length) && (
                    <p className="text-sm text-slate-500 italic">No content in this section.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Admin;
