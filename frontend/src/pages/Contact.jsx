import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { contactDetails, API_BASE } from '../data/constants';
import { FaWhatsapp, FaPhoneAlt, FaInstagram, FaClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Contact = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', rating: 5, message: '' });
  const [status, setStatus] = useState({ contact: '', feedback: '' });
  const [loading, setLoading] = useState({ contact: false, feedback: false });
  const [visibleFeedbacks, setVisibleFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/feedbacks`);
        if (res.ok) {
          setVisibleFeedbacks(await res.json());
        }
      } catch (err) {
        console.error('Failed to load feedbacks');
      }
    };
    fetchFeedbacks();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setStatus({ contact: '', feedback: '' });
    setLoading((prev) => ({ ...prev, contact: true }));
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) {
        throw new Error('Unable to send inquiry');
      }
      setContactForm({ name: '', email: '', message: '' });
      setStatus((prev) => ({ ...prev, contact: 'Inquiry sent successfully.' }));
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        contact: 'Unable to send inquiry. Please try again.',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, contact: false }));
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setStatus({ contact: '', feedback: '' });
    setLoading((prev) => ({ ...prev, feedback: true }));
    try {
      const res = await fetch(`${API_BASE}/api/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm),
      });
      if (!res.ok) {
        throw new Error('Unable to submit feedback');
      }
      setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
      setStatus((prev) => ({ ...prev, feedback: 'Thank you for sharing your feedback!' }));
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        feedback: 'Unable to submit feedback. Please try again.',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, feedback: false }));
    }
  };

  return (
    <>
      <section>
        <div className="relative w-screen left-1/2 -translate-x-1/2 py-20 md:py-32 mb-12 bg-cover bg-[75%_center] md:bg-center overflow-hidden" style={{ backgroundImage: "url('/contactimg.jpg')" }}>
          <div className="absolute inset-0 bg-black/60" />

          {/* Left Blur */}
          <div
            className="absolute inset-y-0 left-0 w-1/4 backdrop-blur-xl z-0"
            style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)' }}
          />

          {/* Right Blur */}
          <div
            className="absolute inset-y-0 right-0 w-1/4 backdrop-blur-xl z-0"
            style={{ maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }}
          />

          <div className="relative z-10">
            <SectionHeader
              eyebrow="Contact Us"
              title="Tell us about your shoot"
              eyebrowClassName="text-xl md:text-3xl font-display mb-4"
              titleClassName="text-3xl md:text-6xl font-display tracking-wide animate-slide-left delay-1"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleContactSubmit} className="glass-panel p-6 space-y-4 shadow-glow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500"
              />
            </div>
            <textarea
              placeholder="What do you have in mind? Dates, location, vibe."
              required
              value={contactForm.message}
              onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500"
              rows={5}
            />
            <button
              type="submit"
              disabled={loading.contact}
              className="w-full rounded-full bg-amber-300 text-slate-900 font-semibold py-3 hover:translate-y-[-2px] transition disabled:opacity-60"
            >
              {loading.contact ? 'Sending...' : 'Send inquiry'}
            </button>
            {status.contact && <p className="text-sm text-amber-200">{status.contact}</p>}
          </form>

          <div className="glass-panel p-6 space-y-4 shadow-glow preview-card">

            <div className="space-y-3 text-slate-300">
              <a
                className="flex items-center gap-2 hover:text-amber-200"
                href={`https://wa.me/${contactDetails.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp size={18} color="#25D366" />
                <span>WhatsApp: {contactDetails.whatsapp}</span>
              </a>
              <div className="flex flex-wrap items-center gap-2 hover:text-amber-200">
                <FaPhoneAlt size={16} color="#34B7F1" />
                <span>Phone:</span>
                <a href="tel:+917249428446" className="hover:underline">+917249428446</a>
                <span>/</span>
                <a href="tel:+919923279879" className="hover:underline">+919923279879</a>
              </div>
              <a
                className="flex items-center gap-2 hover:text-amber-200"
                href={contactDetails.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={18} color="#E4405F" />
                <span>Instagram: @harsh_pawar2005</span>
              </a>
              <a className="flex items-center gap-2 hover:text-amber-200" href={`mailto:${contactDetails.email}`}>
                <MdEmail size={18} color="#EA4335" />
                <span>Email: {contactDetails.email}</span>
              </a>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={16} color="#EA4335" />
                <span>Location: {contactDetails.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock size={16} color="#FFC107" />
                <span>Timing: {contactDetails.timing}</span>
              </div>
            </div>
            <div className="glass-panel p-4 border border-white/5">
              <p className="text-sm text-slate-300">
                We typically respond within the same business day. Let us know your dates and the
                mood you imagine—we will tailor the plan to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader eyebrow="Feedback" title="Leave a note for the studio" />
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleFeedbackSubmit} className="glass-panel p-6 space-y-4 shadow-glow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3">
                <span className="text-slate-400 text-sm mr-2">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: star }))}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <FaStar
                      size={20}
                      className={
                        star <= (feedbackForm.rating || 0)
                          ? 'text-amber-400'
                          : 'text-slate-600 hover:text-amber-400/50'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Share your experience"
              required
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-500"
              rows={4}
            />
            <button
              type="submit"
              disabled={loading.feedback}
              className="w-full rounded-full bg-amber-300 text-slate-900 font-semibold py-3 hover:translate-y-[-2px] transition disabled:opacity-60"
            >
              {loading.feedback ? 'Sending...' : 'Submit feedback'}
            </button>
            {status.feedback && <p className="text-sm text-amber-200">{status.feedback}</p>}
          </form>

          <div className="space-y-4">
            <div className="glass-panel p-6 shadow-glow preview-card">
              <p className="text-slate-300">
                We read every review to refine your experience—from how we direct portraits to how
                we deliver galleries. Thank you for helping us grow.
              </p>
            </div>
            <div className="grid gap-4">
              {visibleFeedbacks.length > 0 ? (
                visibleFeedbacks.map((t) => (
                  <div key={t._id} className="glass-panel p-4 border border-white/5 preview-card">
                    <p className="text-amber-200 text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-300 text-sm mt-2">{t.message}</p>
                    {t.rating && (
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={14}
                            className={i < t.rating ? 'text-amber-400' : 'text-slate-600'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No reviews yet. Be the first to share your experience!</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
