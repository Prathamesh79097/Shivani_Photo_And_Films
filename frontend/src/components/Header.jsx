import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full px-4 md:px-8 flex items-center justify-between py-6 gap-3 bg-[#0b0f19] relative z-50 border-b border-white/10">
      <Link to="/" className="flex items-center gap-3 md:gap-4 group z-50 bg-[#0b0f19]">
        <img
          src="/shivani logo.jpg"
          alt="Shivani Photo and Films Logo"
          className="h-10 md:h-14 object-contain mix-blend-screen contrast-125 brightness-110"
          style={{ mixBlendMode: 'lighten' }}
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-lg md:text-2xl font-display text-slate-50 tracking-wide leading-none">
            Shivani Photo and Films
          </h1>
          <p className="text-[0.45rem] md:text-[0.65rem] text-amber-300/70 tracking-[0.2em] mt-1 font-sans uppercase">
            WITH HARSHWARDHAN PAWAR PHOTOGRAPHY
          </p>
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-nowrap gap-3 text-sm text-slate-300 whitespace-nowrap">
        <Link
          to="/"
          className="shrink-0 px-4 py-2 rounded-full border border-white/10 hover:border-amber-300/60 hover:text-amber-200 transition"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="shrink-0 px-4 py-2 rounded-full border border-white/10 hover:border-amber-300/60 hover:text-amber-200 transition"
        >
          About Us
        </Link>
        <Link
          to="/services"
          className="shrink-0 px-4 py-2 rounded-full border border-white/10 hover:border-amber-300/60 hover:text-amber-200 transition"
        >
          Services
        </Link>
        <Link
          to="/gallery"
          className="shrink-0 px-4 py-2 rounded-full border border-white/10 hover:border-amber-300/60 hover:text-amber-200 transition"
        >
          Gallery
        </Link>
        <Link
          to="/contact"
          className="shrink-0 px-4 py-2 rounded-full border border-white/10 hover:border-amber-300/60 hover:text-amber-200 transition"
        >
          Contact
        </Link>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-slate-300 hover:text-amber-300 focus:outline-none z-50 p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <nav className="fixed inset-0 bg-[#0b0f19] flex flex-col items-center justify-center gap-8 md:hidden z-40 animate-fade-in-down">
          <Link
            to="/"
            onClick={toggleMenu}
            className="text-2xl text-slate-300 hover:text-amber-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={toggleMenu}
            className="text-2xl text-slate-300 hover:text-amber-300"
          >
            About Us
          </Link>
          <Link
            to="/services"
            onClick={toggleMenu}
            className="text-2xl text-slate-300 hover:text-amber-300"
          >
            Services
          </Link>
          <Link
            to="/gallery"
            onClick={toggleMenu}
            className="text-2xl text-slate-300 hover:text-amber-300"
          >
            Gallery
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="text-2xl text-slate-300 hover:text-amber-300"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
