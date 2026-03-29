import React from 'react';
import { Composition } from 'remotion';
import { Slideshow } from './Slideshow';
import { staticFile } from 'remotion';

// Sample data for CLI rendering
const items = [
    { type: 'image', src: staticFile('assets/cinematic.jpg'), title: 'Cinematic Shoots' },
    { type: 'image', src: staticFile('assets/wedding.jpg'), title: 'Wedding Films' },
    { type: 'image', src: staticFile('assets/street.jpg'), title: 'Street Photography' },
    { type: 'image', src: staticFile('assets/wild.jpg'), title: 'Wildlife' },
    { type: 'image', src: staticFile('assets/portrait.jpg'), title: 'Portraits' },
];

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="CinematicSlideshow"
                component={Slideshow}
                durationInFrames={30 * 5 * items.length} // 5s per slide
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{ items }}
            />
        </>
    );
};
