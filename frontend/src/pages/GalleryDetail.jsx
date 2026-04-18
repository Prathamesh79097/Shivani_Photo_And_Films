import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE, gallerySections as defaultGallerySections } from '../data/constants';
import SectionHeader from '../components/SectionHeader';
import CinematicPlayer from '../components/CinematicPlayer';

import { useRef } from 'react';
import { socket } from '../socket';

const AutoPlayVideo = ({ src }) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current.muted = false;
                    videoRef.current.play().catch(err => {
                        console.warn("Autoplay with sound blocked, trying muted:", err);
                        videoRef.current.muted = true;
                        videoRef.current.play();
                    });
                } else {
                    videoRef.current.pause();
                }
            },
            { threshold: 0.6 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleFullscreen = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        }
    };

    return (
        <div 
            className="relative w-full h-full group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                loop
                playsInline
                preload="metadata"
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
            />
            
            <AnimatePresence>
                {isHovered && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={handleFullscreen}
                        className="absolute top-4 right-4 z-30 p-2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-amber-500 transition-colors"
                        aria-label="Fullscreen"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

const GalleryDetail = () => {
    const { slug } = useParams();
    const [section, setSection] = useState(() => defaultGallerySections.find((s) => s.slug === slug));
    const [loading, setLoading] = useState(() => !defaultGallerySections.some((s) => s.slug === slug));
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/gallery`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const found = data.find((s) => s.slug === slug);
                        setSection(found);
                    } else {
                        const found = defaultGallerySections.find((s) => s.slug === slug);
                        setSection(found);
                    }
                } else {
                    const found = defaultGallerySections.find((s) => s.slug === slug);
                    setSection(found);
                }
            } catch (err) {
                console.error('Failed to fetch gallery', err);
                const found = defaultGallerySections.find((s) => s.slug === slug);
                setSection(found);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();

        socket.on('gallery-updated', fetchGallery);

        return () => {
            socket.off('gallery-updated', fetchGallery);
        };
    }, [slug]);

    if (loading) {
        return <div className="text-center text-amber-200 mt-20">Loading...</div>;
    }

    if (!section) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl text-amber-50">Gallery not found</h2>
                <Link to="/gallery" className="text-amber-200 hover:text-amber-100">
                    ← Back to Gallery
                </Link>
            </div>
        );
    }

    return (
        <section className="mt-2">
            <div className="w-full flex justify-start mb-4">
                <Link
                    to="/gallery"
                    className="inline-flex items-center justify-center w-12 h-12 border border-amber-200/30 rounded-lg text-amber-200 hover:bg-amber-200/10 hover:scale-105 transition-all"
                    aria-label="Back to Gallery"
                >
                    <span className="text-2xl pb-1">←</span>
                </Link>
            </div>
            <div className="mb-8 text-center">
                <SectionHeader eyebrow="Gallery" title={section.title} eyebrowClassName="text-sm" />
                <p className="text-slate-300 max-w-2xl mt-4 mx-auto text-center">{section.description}</p>
            </div>

            {section.images && section.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
                    {section.images.map((imgObj, index) => {
                        const img = typeof imgObj === 'string' ? imgObj : imgObj.url;
                        return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            className="group relative aspect-[4/5] overflow-hidden rounded-sm glass-panel shadow-lg cursor-pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img?.startsWith('/uploads/') ? `${API_BASE}${img}` : img}
                                alt={`${section.title} ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    )})}
                </div>
            ) : null}

            {/* Videos Section */}
            {(section.videos && section.videos.length > 0) ? (
                <div className="flex flex-col gap-12 mt-12 w-full max-w-4xl mx-auto">
                    {section.videos.map((videoObj, index) => {
                        const video = typeof videoObj === 'string' ? videoObj : videoObj.url;
                        const isCinematic = ['cinematic-shoots', 'films', 'reels', 'cinematic'].includes(slug) || 
                                           section.title.toLowerCase().includes('cinematic');
                        const videoUrl = video?.startsWith('/uploads/') ? `${API_BASE}${video}` : video;

                        return (
                        <div
                            key={index}
                            className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl relative"
                        >
                            {isCinematic ? (
                                <AutoPlayVideo src={videoUrl} />
                            ) : (
                                <video
                                    src={videoUrl}
                                    className="w-full h-full object-contain"
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                    preload="metadata"
                                />
                            )}
                        </div>
                    )})}
                </div>
            ) : (['cinematic-shoots', 'films', 'reels', 'cinematic'].includes(slug)) ? (
                <div className="mt-12 w-screen relative left-1/2 -translate-x-1/2 md:w-full md:left-auto md:translate-x-0 mx-auto">
                    <CinematicPlayer />
                </div>
            ) : null}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <span className="text-4xl">&times;</span>
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage.startsWith('/uploads/') ? `${API_BASE}${selectedImage}` : selectedImage}
                            alt="Full screen view"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GalleryDetail;
