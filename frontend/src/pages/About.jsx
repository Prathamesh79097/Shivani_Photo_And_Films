import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';

const TEAM_MEMBERS = [
  {
    name: 'Mr. Harshwardhan Pawar',
    role: 'Owner',
    image: '/harshu.jpeg',
    description: 'Professional Photographer with a passion for wild photography and skilled in portrait, event, lifestyle and commercial photography. A passionate photographer with a keen eye for detail.'
  },
  {
    name: 'Mr. Ajit Pawar',
    role: 'Co-founder',
    image: '/ajitpawar.jpeg',
    description: 'Skilled photographer and co-founder of Shivani Photo and Films, known for capturing moments with artistic precision. Their work blends creativity and emotion to tell timeless visual stories.'
  },
  {
    name: 'Mr. Sushant Patil',
    role: 'Drone Operator',
    image: '/sushantpatil.jpeg',
    description: 'As the skilled drone operator at Shivani Photo and Films, Sushant captures breathtaking aerial shots that elevate every project. With sharp angles and creative framing, they add a unique cinematic touch.'
  },
  {
    name: 'Mr. Harish Jadhav',
    role: 'Cinematographer',
    image: '/sagarkhatavkar.jpeg',
    description: 'As the cinematographer at Shivani Photo and Films, he turns real moments into cinematic memories with a unique storytelling style. Their work transforms these moments into beautifully crafted cinematic memories.'
  }
];

const variants = {
  enter: {
    opacity: 0,
    scale: 0.95
  },
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1
  },
  exit: {
    zIndex: 0,
    opacity: 0,
    scale: 0.95
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const About = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const imageIndex = Math.abs(page % TEAM_MEMBERS.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 3000);

    return () => clearInterval(timer);
  }, [page, isAutoPlaying]);

  return (
    <section>
      <div className="relative w-screen left-1/2 -translate-x-1/2 py-20 md:py-32 mb-32 bg-cover bg-[75%_center] md:bg-center overflow-hidden" style={{ backgroundImage: "url('/aboutimg.jpg')" }}>
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
            eyebrow="About Us"
            title="The studio story & vision"
            align="center"
            eyebrowClassName="text-2xl md:text-3xl font-display mb-4"
            titleClassName="text-4xl md:text-6xl font-display tracking-wide animate-slide-left delay-1"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-start px-4 md:px-0">
        {/* Left Column: Text Content */}
        <div className="space-y-6 pt-4">
          <p className="text-xl md:text-2xl text-slate-100 font-display animate-slide-left delay-2 leading-relaxed">
            Shivani Photo and Films is a boutique studio rooted in Sangli, crafting heartfelt
            visual stories for couples, families, and brands.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed animate-slide-left delay-3 font-light">
            We believe the best images blend honest emotion with artful direction. Our team
            plans intentionally—scouting light, refining palettes, and choreographing flow—so
            you can stay present while we capture the essence.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed animate-slide-left font-light">
            From multi-day weddings to editorial portraits and cinematic films, every
            assignment receives a tailored plan, a dedicated lead, and color-true post
            production. Your photos and films are delivered via secure galleries, ready for
            print, social, and keepsakes.
          </p>
        </div>

        {/* Right Column: Image and Highlights Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative p-8 shadow-glow rounded-tl-[5rem] rounded-br-[5rem] overflow-hidden bg-[#0b0f19] h-full min-h-[500px] flex flex-col justify-end"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('/ABOUT1.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />

          {/* Highlights Overlay */}
          <div className="relative z-10 grid grid-cols-1 gap-4 mt-auto">
            {['Editorial Eye', 'Human Connection', 'Meticulous Finish', 'Reliable Delivery'].map(
              (value) => (
                <div key={value} className="glass-panel p-4 text-center preview-card shadow-lg backdrop-blur-md bg-black/40 border-white/10">
                  <p className="text-amber-200 font-semibold tracking-wider uppercase text-sm">{value}</p>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-16 relative px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionHeader eyebrow="Our Team" title="Meet the creative minds behind the lens" />
        </motion.div>

        <div
          className="relative h-[600px] flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
              }}
              className="absolute w-full max-w-lg"
            >
              <div
                className="p-8 team-card rounded-2xl border-2 border-blue-900/50 relative overflow-hidden"
                style={{ backgroundColor: 'rgba(203, 203, 212, 0.08)' }}
              >
                {/* Decorative sheen/gradient for the "glass" feel even on solid color if desired, or just clean */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#0b1120] shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                    <img
                      src={TEAM_MEMBERS[imageIndex].image}
                      alt={TEAM_MEMBERS[imageIndex].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = 'rgba(0,0,0,0.1)';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-slate-50 font-bold">{TEAM_MEMBERS[imageIndex].name}</h3>
                    <p className="text-base text-amber-200/90 font-semibold tracking-wide mt-1 uppercase text-sm">{TEAM_MEMBERS[imageIndex].role}</p>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-base font-medium">
                    {TEAM_MEMBERS[imageIndex].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            className="absolute left-0 z-10 p-3 rounded-full bg-white/5 hover:bg-amber-300/20 text-slate-200 hover:text-amber-300 transition-colors backdrop-blur-sm"
            onClick={() => paginate(-1)}
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            className="absolute right-0 z-10 p-3 rounded-full bg-white/5 hover:bg-amber-300/20 text-slate-200 hover:text-amber-300 transition-colors backdrop-blur-sm"
            onClick={() => paginate(1)}
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
