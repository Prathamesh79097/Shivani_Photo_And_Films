import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { API_BASE, servicePackages as initialPackages } from '../data/constants';
import useScrollAnimation from '../hooks/useScrollAnimation';

import { socket } from '../socket';

const ServiceCard = ({ service, index }) => {
    const [cardRef, isVisible] = useScrollAnimation(0.1);

    const getAnimationClass = (idx) => {
        if (idx % 3 === 0) return 'animate-slide-left';
        if (idx % 3 === 1) return 'animate-fade-up';
        return 'animate-slide-right';
    };

    return (
        <div
            ref={cardRef}
            className={`group flex flex-col h-full rounded-2xl border-2 border-amber-500/30 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(251,191,36,0.2)] active:shadow-[0_0_25px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(251,191,36,0.2)] backdrop-blur-md ${isVisible ? getAnimationClass(index) : 'opacity-0'
                }`}
            style={{
                backgroundColor: 'rgba(203, 203, 212, 0.08)',
                animationDelay: isVisible ? `${(index % 3) * 0.15}s` : '0s'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 p-5 flex flex-col h-full">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-display text-slate-50">{service.name}</h3>
                    <span className="text-amber-200 text-sm">{service.price}</span>
                </div>
                <ul className="mt-4 space-y-2 text-slate-300 text-sm flex-1">
                    {service.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-200 mt-[2px]">•</span>
                            <span>{perk}</span>
                        </li>
                    ))}
                </ul>
                <Link
                    to="/contact"
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-amber-200/40 text-amber-100 px-4 py-2 hover:border-amber-200 transition"
                >
                    Explore package <span className="arrow-animation ml-1">→</span>
                </Link>
            </div>
        </div>
    );
};

const Services = () => {
    const [services, setServices] = useState(initialPackages);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/services`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setServices(data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch services', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();

        socket.on('services-updated', fetchServices);

        return () => {
            socket.off('services-updated', fetchServices);
        };
    }, []);

    return (
        <section>
            <div className="relative w-screen left-1/2 -translate-x-1/2 py-20 md:py-32 mb-12 bg-cover bg-[75%_center] md:bg-center overflow-hidden" style={{ backgroundImage: "url('/serviceimg.jpg')" }}>
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
                        eyebrow="Services"
                        title="Signature packages & deliverables"
                        eyebrowClassName="text-2xl md:text-3xl font-display mb-4"
                        titleClassName="text-4xl md:text-6xl font-display tracking-wide animate-slide-left delay-1"
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <ServiceCard key={service._id || service.name} service={service} index={index} />
                ))}
            </div>
        </section>
    );
};

export default Services;
