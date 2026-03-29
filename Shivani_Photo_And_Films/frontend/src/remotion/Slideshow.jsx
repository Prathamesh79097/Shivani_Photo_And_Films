import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Img, Video } from 'remotion';
import React from 'react';

const Title = ({ title, entryProgress, exitProgress }) => {
    const opacity = interpolate(entryProgress, [0, 1], [0, 1]);
    const translateY = interpolate(entryProgress, [0, 1], [20, 0]);

    const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
    const exitTranslateY = interpolate(exitProgress, [0, 1], [0, -20]);

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 100,
                left: 50,
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontSize: 50,
                fontWeight: 'bold',
                textShadow: '0px 2px 10px rgba(0,0,0,0.5)',
                opacity: Math.min(opacity, exitOpacity),
                transform: `translateY(${translateY + exitTranslateY}px)`,
                zIndex: 10,
            }}
        >
            {title}
        </div>
    );
};

const Slide = ({ item, transitionStart, duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animate entry
    const entryProgress = spring({
        frame,
        fps,
        config: { damping: 200 },
    });

    // Zoom-blur effect (simulated with scale and opacity)
    const scale = interpolate(frame, [0, duration], [1, 1.1]);

    return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
            {item.type === 'video' ? (
                <Video src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }} />
            ) : (
                <Img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }} />
            )}
            <Title title={item.title} entryProgress={entryProgress} exitProgress={0} /> {/* Simplified exit for now */}

            <AbsoluteFill
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}
            />
        </AbsoluteFill>
    );
};

export const Slideshow = ({ items }) => {
    const { fps } = useVideoConfig();
    const slideDuration = 5 * fps; // 5 seconds per slide
    const transitionDuration = 1 * fps;

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {items.map((item, index) => {
                const from = index * (slideDuration - transitionDuration);
                const duration = slideDuration;

                return (
                    <Sequence key={index} from={from} duration={duration} layout="none">
                        <TransitionWrapper
                            duration={duration}
                            transitionDuration={transitionDuration}
                            isLast={index === items.length - 1}
                        >
                            <Slide item={item} duration={duration} />
                        </TransitionWrapper>
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};

// Handle Cross-Fade Transition
const TransitionWrapper = ({ children, duration, transitionDuration, isLast }) => {
    const frame = useCurrentFrame();

    // Fade in
    const opacityErrors = interpolate(frame, [0, transitionDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Fade out (if not last, actually we handle overlapping sequences so fading in on top handles it mostly, 
    // but for true cross fade, we might need opacity manipulation).
    // In this simpler setup, new slides fade IN over old slides.

    return (
        <AbsoluteFill style={{ opacity: opacityErrors }}>
            {children}
        </AbsoluteFill>
    );
};
