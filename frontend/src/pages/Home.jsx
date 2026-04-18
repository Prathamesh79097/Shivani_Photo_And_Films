import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { previewCards } from '../data/constants';
import InteractiveDivider from '../components/InteractiveDivider';
import SectionHeader from '../components/SectionHeader';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Stat = ({ value, label }) => (
  <div className="text-center">
    <p className="text-3xl font-display text-amber-300">{value}</p>
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);

const Home = () => {
  const heroImage = '/hero-camera.jpg';

  const [storyRef, isStoryVisible] = useScrollAnimation(0.2);
  const [philosophyRef, isPhilosophyVisible] = useScrollAnimation(0.2);
  const [closingRef, isClosingVisible] = useScrollAnimation(0.2);
  const [newSectionRef, isNewSectionVisible] = useScrollAnimation(0.2);
  const [exploreRef, isExploreVisible] = useScrollAnimation(0.2);
  const [currentExploreSlide, setCurrentExploreSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentExploreSlide((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero-frame border border-white/5 rounded-3xl p-6 md:p-16 bg-slate-900/60 shadow-glow mt-8 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 text-amber-200 bg-amber-500/10 border border-amber-200/20 px-3 py-1 rounded-full text-sm">
              Crafted visuals for weddings, films, and brands
            </p>
            <h2 className="text-4xl md:text-5xl font-display leading-tight text-slate-50 animate-slide-left delay-1">
              WE CAPTURE YOUR MEMORIES FOREVER.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed animate-slide-left delay-2">
              Every photo tells a silent story. A memory frozen in time forever.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-full bg-amber-300 text-slate-900 font-semibold hover:translate-y-[-2px] transition"
              >
                Book a Consultation
              </Link>
              <Link
                to="/gallery"
                className="px-5 py-3 rounded-full border border-white/15 text-slate-100 hover:border-amber-200/60 transition"
              >
                Explore Gallery
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Stat value="4000+" label="Events delivered" />
              <Stat value="25+" label="Years visual storytelling" />
              <Stat value="1500+" label="Clients Served" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-amber-300/10 rotate-6" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={heroImage}
                alt="Professional photography - hands holding camera"
                className="w-full h-full aspect-[4/3] md:aspect-auto object-cover md:h-[480px] zoom-animation"
              />
            </div>
            <div className="glass-panel p-4 mt-4 inline-block">
              <p className="text-sm text-amber-200">Based in Sangli · Available nationwide</p>
            </div>
          </div>
        </div>
      </section>



      <InteractiveDivider />

      {/* Story Section */}
      <section ref={storyRef} className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column - Headline with Background */}
          <div
            className={`relative p-8 md:p-12 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-center items-center min-h-[300px] md:min-h-[450px] ${isStoryVisible ? 'animate-slide-left' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/c132c5a0-cc14-4002-85b1-be1a049a16f7.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <h2 className="relative z-10 text-4xl md:text-6xl font-display uppercase leading-tight text-slate-50 drop-shadow-lg text-center animate-text-breathe">
              Let's Tell <br />
              <span className="text-amber-200">Your Story</span> <br />
              Together.
            </h2>
          </div>

          {/* Right Column - Text Only */}
          <div className={`space-y-8 ${isStoryVisible ? 'animate-slide-right delay-2' : 'opacity-0'}`}>
            <div className="text-left space-y-2">
              <p className="text-amber-200 font-display text-xl md:text-2xl drop-shadow-md">We are here to give you a</p>
              <div className="text-slate-300 text-base md:text-lg space-y-1 font-medium drop-shadow-sm">
                <p>• meaningful</p>
                <p>• stress-free</p>
                <p>• authentic</p>
              </div>
              <p className="text-sm text-slate-400 uppercase tracking-widest pt-2 font-medium">experience while capturing your love in a unique way.</p>
            </div>

            <div className="text-slate-200 leading-relaxed text-base md:text-lg border-l-2 border-amber-500/40 pl-6 drop-shadow-sm">
              <p>
                Every step of the way, We will be there capturing memories that let you relive your day.
                We want your photos to bring effortless memories and all the feels chills down the spine, goosebumps and all.
              </p>
            </div>
          </div>
        </div>
      </section>

      <InteractiveDivider />

      {/* Philosophy/Goal Section */}
      <section ref={philosophyRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-24 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column - Text */}
          <div className={`space-y-12 text-left ${isPhilosophyVisible ? 'animate-slide-left' : 'opacity-0'}`}>
            <div className="space-y-2">
              <p className="text-amber-200 font-display text-2xl md:text-3xl drop-shadow-md">Our goal is to provide a</p>
              <div className="text-slate-300 text-lg md:text-xl space-y-1 font-medium drop-shadow-sm flex flex-col items-start">
                <p>• vibrant</p>
                <p>• effortless</p>
                <p>• genuine</p>
              </div>
              <p className="text-sm md:text-base text-slate-400 uppercase tracking-widest pt-4 font-medium">experience while freezing your most cherished moments in time.</p>
            </div>

            <div className="text-slate-200 leading-relaxed text-base md:text-lg border-l-2 border-amber-500/40 pl-6 text-left max-w-2xl drop-shadow-sm">
              <p>
                We will be by your side throughout your big day, capturing the energy and the people you love most.
                Our goal is to preserve every hug, every toast, and every heartfelt moment—images that make your heart swell and your spirit glow.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl min-h-[300px] md:min-h-[450px] flex flex-col justify-center items-center text-center p-6 ${isPhilosophyVisible ? 'animate-slide-right delay-2' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/birthday3.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            <h2 className="relative z-10 text-4xl md:text-6xl font-display uppercase leading-tight text-slate-50 drop-shadow-lg animate-text-breathe">
              Let’s Celebrate <br />
              <span className="text-amber-200">Your Life</span> <br />
              Together.
            </h2>
          </div>
        </div>
      </section>

      <InteractiveDivider />

      {/* New 5th Section (Duplicate of Story/3rd Section) */}
      <section ref={closingRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24 md:pb-40 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column - Headline with Background */}
          <div
            className={`relative p-8 md:p-12 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-center items-center min-h-[300px] md:min-h-[450px] ${isClosingVisible ? 'animate-slide-left' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/proddis.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <h2 className="relative z-10 text-4xl md:text-6xl font-display uppercase leading-tight text-slate-50 drop-shadow-lg text-center animate-text-breathe">
              Let’s Bring <br />
              <span className="text-amber-200">Your Product</span> <br />
              to Life.
            </h2>
          </div>

          {/* Right Column - Text Only */}
          <div className={`space-y-8 ${isClosingVisible ? 'animate-slide-right delay-2' : 'opacity-0'}`}>
            <div className="text-left space-y-2">
              <p className="text-amber-200 font-display text-xl md:text-2xl drop-shadow-md">We are here to deliver a</p>
              <div className="text-slate-300 text-base md:text-lg space-y-1 font-medium drop-shadow-sm">
                <p>• purposeful</p>
                <p>• elevated</p>
                <p>• intentional</p>
              </div>
              <p className="text-sm text-slate-400 uppercase tracking-widest pt-2 font-medium">experience while transforming your products into visual stories that connect and convert.</p>
            </div>

            <div className="text-slate-200 leading-relaxed text-base md:text-lg border-l-2 border-amber-500/40 pl-6 drop-shadow-sm">
              <p>
                We work closely with you to capture your brand’s essence, focusing on the details that matter.
                Every image is crafted to elevate your product—creating visuals that stop the scroll and build trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      <InteractiveDivider />

      {/* New Section (Duplicate of Philosophy/2nd Section) */}
      <section ref={newSectionRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-24 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column - Text */}
          <div className={`space-y-12 text-left ${isNewSectionVisible ? 'animate-slide-left' : 'opacity-0'}`}>
            <div className="space-y-2">
              <p className="text-amber-200 font-display text-2xl md:text-3xl drop-shadow-md">We are here to create a</p>
              <div className="text-slate-300 text-lg md:text-xl space-y-1 font-medium drop-shadow-sm flex flex-col items-start">
                <p>• purposeful</p>
                <p>• elevated</p>
                <p>• intentional</p>
              </div>
              <p className="text-sm md:text-base text-slate-400 uppercase tracking-widest pt-4 font-medium">portrait experience that reflects your true essence.</p>
            </div>

            <div className="text-slate-200 leading-relaxed text-base md:text-lg border-l-2 border-amber-500/40 pl-6 text-left max-w-2xl drop-shadow-sm">
              <p>
                From subtle expressions to powerful presence, We focus on the details that matter. The result: Portraits that feel natural, confident, and unmistakably you—images that connect at first glance.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl min-h-[300px] md:min-h-[450px] flex flex-col justify-center items-center text-center p-6 ${isNewSectionVisible ? 'animate-slide-right delay-2' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/port4.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            <h2 className="relative z-10 text-4xl md:text-6xl font-display uppercase leading-tight text-slate-50 drop-shadow-lg animate-text-breathe">
              Portraits <br />
              <span className="text-amber-200">Crafted</span> <br />
              Around You.
            </h2>
          </div>
        </div>
      </section>

      <InteractiveDivider />

      <section
        className="relative w-screen left-1/2 -translate-x-1/2 mt-8 py-12 md:py-32 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center min-h-[40vh] md:min-h-[75vh] gap-8 md:gap-12 bg-black"
      >
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
          {[
            '/back1 (1).jpeg',
            '/back1 (2).jpeg',
            '/back1 (3).jpeg',
            '/back1 (4).jpeg',
            '/back1 (5).jpeg'
          ].map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentExploreSlide ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-slate-900/30 z-10" /> {/* Transparent overlay */}

        <div ref={exploreRef} className={`relative z-10 transition-all duration-1000 ${isExploreVisible ? 'animate-fade-up' : 'opacity-0 translate-y-10'}`}>
          <SectionHeader
            title="Explore More"
            titleClassName="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-6 w-full max-w-6xl relative z-10 px-1 md:px-0">
          {previewCards.map((card) => (
            <Link
              key={card.title}
              to={card.title === 'About Us' ? '/about' : card.title === 'Services' ? '/services' : '/gallery'}
              className="group glass-panel p-3 md:p-8 shadow-2xl preview-card backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 transition-colors block text-center md:text-left h-full flex flex-col justify-between"
            >
              <div>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.25em] text-amber-200/80 mb-2 md:mb-4">{card.title}</p>
                <p className="text-slate-100 text-[10px] md:text-base leading-tight md:leading-relaxed line-clamp-4 md:line-clamp-none">{card.blurb}</p>
              </div>
              <div className="mt-3 md:mt-6 inline-flex items-center justify-center md:justify-start gap-1 md:gap-2 text-amber-300 font-medium hover:text-amber-200 text-[10px] md:text-base">
                <span className="hidden md:inline">Show More</span>
                <span className="md:hidden">More</span> <span className="arrow-animation">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
