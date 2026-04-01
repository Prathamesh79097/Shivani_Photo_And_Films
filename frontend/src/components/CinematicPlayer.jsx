import { Player } from '@remotion/player';
import { Slideshow } from '../remotion/Slideshow';
import { useMemo } from 'react';
import { staticFile } from 'remotion'; // Though staticFile is mostly for Remotion internals, paths work generally in player too if public

const CinematicPlayer = ({ items }) => {
    // If no items provided, use defaults
    const slideshowItems = useMemo(() => items || [
        { type: 'image', src: '/assets/cinematic.jpg', title: 'Cinematic Vision' },
        { type: 'image', src: '/assets/wedding.jpg', title: 'Eternal Moments' },
        { type: 'image', src: '/assets/street.jpg', title: 'Urban Stories' },
        { type: 'image', src: '/assets/wild.jpg', title: 'Nature Unbound' },
        { type: 'image', src: '/assets/portrait.jpg', title: 'Human Emotions' },
    ], [items]);

    const durationInFrames = 30 * 5 * slideshowItems.length; // 5s per slide, 30fps

    return (
        <div className="w-full relative rounded-2xl overflow-hidden glass-panel shadow-2xl border border-white/10 group">
            {/* Player Wrapper */}
            <div className="aspect-video w-full relative">
                <Player
                    component={Slideshow}
                    inputProps={{ items: slideshowItems }}
                    durationInFrames={durationInFrames}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    autoPlay
                    loop
                    controls // User asked for UI controls, Player has default ones, we can style container
                />
            </div>

            {/* Custom Overlay / Glassmorphism UI (Optional decorative elements on top) */}
            <div className="absolute top-4 left-4 z-20 px-4 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-xs tracking-widest text-white/80 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                NOW PLAYING: CINEMATIC REEL
            </div>

            <div className="absolute bottom-12 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                    <span className="text-amber-400 text-xs font-bold tracking-widest">LIVE PREVIEW</span>
                </div>
            </div>
        </div>
    );
};

export default CinematicPlayer;
