import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { API_BASE, gallerySections as defaultGallerySections } from '../data/constants';
import useScrollAnimation from '../hooks/useScrollAnimation';

import { socket } from '../socket';

const GalleryCard = ({ item, index }) => {
  const [cardRef, isVisible] = useScrollAnimation(0.1);

  const getAnimationClass = (idx) => {
    if (idx % 3 === 0) return 'animate-slide-left';
    if (idx % 3 === 1) return 'animate-fade-up';
    return 'animate-slide-right';
  };

  return (
    <div
      className={`group h-full flex flex-col rounded-2xl border-2 border-amber-500/30 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(251,191,36,0.2)] active:shadow-[0_0_25px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(251,191,36,0.2)] opacity-100 animate-fade-in`}
      style={{
        backgroundColor: 'rgba(203, 203, 212, 0.08)',
        animationDelay: `${(index % 3) * 0.15}s`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col">
        <div className="h-52 overflow-hidden border-b border-amber-500/10">
          <img
            src={
              ['cinematic-shoots', 'films', 'reels', 'cinematic'].includes(item.slug) || item.title.toLowerCase().includes('cinematic')
                ? '/cinematic_cover.jpeg'
                : (item.coverImage || item.image)?.startsWith('/uploads/')
                  ? `${API_BASE}${item.coverImage || item.image}`
                  : item.coverImage || item.image
            }
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = '/hero-camera.jpg')}
          />
        </div>
        <div className="p-5 space-y-3 flex-grow flex flex-col">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-200/90 font-semibold shadow-black drop-shadow-md">{item.title}</p>
          <p className="text-slate-100 text-sm leading-relaxed font-medium">{item.description}</p>
          <Link
            to={`/gallery/${item.slug}`}
            className="text-amber-300 hover:text-amber-200 text-sm inline-flex items-center gap-2 font-medium"
          >
            Explore this style <span className="arrow-animation">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [gallerySections, setGallerySections] = useState(defaultGallerySections);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setGallerySections(data);
        } else {
          setGallerySections(defaultGallerySections);
        }
      } else {
        setGallerySections(defaultGallerySections);
      }
    } catch (err) {
      console.error('Failed to fetch gallery', err);
      setGallerySections(defaultGallerySections);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();

    socket.on('gallery-updated', fetchGallery);

    return () => {
      socket.off('gallery-updated', fetchGallery);
    };
  }, []);

  if (loading) {
    return <div className="text-center text-amber-200 mt-20">Loading gallery...</div>;
  }

  return (
    <section>
      <div className="relative w-[100vw] left-1/2 -translate-x-1/2 py-20 md:py-32 mb-12 overflow-hidden bg-black lg:max-w-none">
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
          {[
            '/gal3.jpg',
            '/gal2.jpeg.jpg',
            '/gal1.jpeg.jpg',
            '/gal4.jpg',
            '/gal5.jpg',
            '/gal6.jpg'
          ].map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-[75%_center] md:bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/30 z-20" />

        {/* Left Blur - Increased z-index to sit on top of bg overlay but below text */}
        <div
          className="absolute inset-y-0 left-0 w-1/4 backdrop-blur-xl z-10 hidden md:block"
          style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)' }}
        />

        {/* Right Blur */}
        <div
          className="absolute inset-y-0 right-0 w-1/4 backdrop-blur-xl z-10 hidden md:block"
          style={{ maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }}
        />

        <div className="relative z-20">
          <SectionHeader
            eyebrow="Gallery"
            title="Curated portfolio highlights"
            eyebrowClassName="text-2xl md:text-3xl font-display mb-4"
            titleClassName="text-4xl md:text-6xl font-display tracking-wide animate-slide-left delay-1"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {gallerySections.map((item, index) => (
          <GalleryCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
