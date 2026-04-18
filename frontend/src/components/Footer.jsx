import { contactDetails } from '../data/constants';
import { FaWhatsapp, FaPhoneAlt, FaInstagram, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-12 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-3 gap-16 md:gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 mb-3">Studio at</p>
          <div className="flex items-center gap-2">
            <img
              src="/shivani logo.jpg"
              alt="Shivani Photo and Films Logo"
              className="h-7 w-auto mix-blend-screen contrast-125 brightness-110"
              style={{ mixBlendMode: 'lighten' }}
            />
            <p className="text-lg font-display text-slate-50">Shivani Photo and Films</p>
          </div>
          <div className="flex items-start gap-2 text-slate-400 text-xs md:text-sm mt-2">
            <FaMapMarkerAlt size={16} color="#EA4335" className="mt-0.5 shrink-0" />
            <p>{contactDetails.location}</p>
          </div>
        </div>
        <div className="space-y-2 text-xs md:text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 mb-2">Contact us</p>
          <div className="flex items-center gap-2 text-slate-300">
            <FaWhatsapp size={18} color="#25D366" />
            <span>WhatsApp:</span>
            <a href={`https://wa.me/${contactDetails.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="hover:text-amber-200 transition-colors">
              {contactDetails.whatsapp}
            </a>
          </div>
          <div className="text-slate-300 flex flex-wrap items-center gap-2">
            <FaPhoneAlt size={16} color="#34B7F1" />
            <span>Phone:</span>
            <a href="tel:+917249428446" className="hover:text-amber-200 transition-colors">+917249428446</a>
            <span>/</span>
            <a href="tel:+919923279879" className="hover:text-amber-200 transition-colors">+919923279879</a>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <FaInstagram size={18} color="#E4405F" />
            <span>Instagram:</span>
            <a href={contactDetails.instagram} target="_blank" rel="noreferrer" className="hover:text-amber-200 transition-colors">
              @harsh_pawar2005
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MdEmail size={18} color="#EA4335" />
            <span>Email:</span>
            <a href={`mailto:${contactDetails.email}`} className="hover:text-amber-200 transition-colors">
              {contactDetails.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <FaClock size={16} color="#FFC107" />
            <span>Timing: {contactDetails.timing}</span>
          </div>
        </div>
        <div className="space-y-3 text-xs md:text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 mb-2">Follow us</p>
          <a
            href={`https://wa.me/${contactDetails.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-white/10 text-slate-100 hover:border-amber-200/60 transition-all"
          >
            <FaWhatsapp size={24} color="#25D366" />
            WhatsApp Direct
          </a>
          <a
            href={contactDetails.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-white/10 text-slate-100 hover:border-amber-200/60 transition-all"
          >
            <FaInstagram size={24} color="#E4405F" />
            Instagram Profile
          </a>
          <a
            href={`mailto:${contactDetails.email}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-white/10 text-slate-100 hover:border-amber-200/60 transition-all"
          >
            <MdEmail size={24} color="#EA4335" />
            Email the Studio
          </a>
        </div>
      </div>
      <div className="border-t border-white/20 py-6 mt-8 flex justify-center px-4">
        <a href="/admin" className="text-xs text-slate-500 hover:text-amber-200 transition-colors text-center block">
          &copy; 2026 Shivani Photo And Films. created by prathamesh patil
        </a>
      </div>
    </footer>
  );
};

export default Footer;
