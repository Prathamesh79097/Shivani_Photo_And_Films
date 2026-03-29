import React from 'react';

const InteractiveDivider = () => {
    return (
        <div className="py-12 flex items-center justify-center relative w-full">
            <div className="w-full h-12 flex items-center justify-center">

                {/* The Base Line - slightly reduced width to let the glow fade out nicely at edges */}
                <div className="h-[1px] bg-slate-800 w-11/12"></div>

                {/* The Glowing Active Line - Always visible */}
                <div className="absolute h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent w-full opacity-100 blur-[1px]"></div>

                {/* The Central Diamond/Dot - Always expanded/active */}
                <div className="absolute w-3 h-3 rotate-45 border border-amber-400 bg-amber-900/20 scale-150 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
            </div>
        </div>
    );
};

export default InteractiveDivider;
