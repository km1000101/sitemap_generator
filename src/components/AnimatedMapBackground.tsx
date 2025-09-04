import React from 'react';

const AnimatedMapBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%] opacity-[1]"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Subtle gradient background */}
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1d2a5b" />
            <stop offset="100%" stopColor="#0b122b" />
          </radialGradient>

          {/* Glow for arcs */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dashed line pattern for latitude/longitude */}
          <pattern id="gridPattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 0 80" stroke="#6ea8fe" strokeOpacity="0.25" strokeWidth="1" />
            <path d="M 0 0 L 80 0" stroke="#6ea8fe" strokeOpacity="0.25" strokeWidth="1" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="1600" height="900" fill="url(#bgGradient)" />

        {/* Long/lat grid with slow pan */}
        <g className="map-pan-slow">
          <rect x="0" y="0" width="1600" height="900" fill="url(#gridPattern)" />
        </g>

        {/* Stylized continents silhouettes */}
        <g fill="#3b82f6" fillOpacity="0.12">
          <path d="M180 360 C 260 300, 380 280, 520 320 C 640 360, 700 420, 760 420 C 820 420, 900 380, 980 360 C 1040 344, 1120 348, 1180 380 C 1240 412, 1280 472, 1320 520 C 1240 520, 1160 520, 1080 520 C 980 520, 880 520, 780 520 C 660 520, 540 520, 420 520 C 320 520, 220 520, 120 520 C 140 460, 140 400, 180 360 Z" />
          <path d="M1060 160 C 1120 140, 1200 140, 1260 160 C 1300 172, 1340 208, 1360 240 C 1320 240, 1280 240, 1240 240 C 1180 240, 1120 240, 1060 240 C 1040 208, 1020 176, 1060 160 Z" />
        </g>

        {/* Animated data arcs between pseudo cities */}
        <g filter="url(#softGlow)">
          <path className="map-arc arc-delay-1" d="M300 600 C 550 350, 1050 350, 1300 600" stroke="#60a5fa" strokeOpacity="0.7" strokeWidth="2.5" fill="none" />
          <path className="map-arc arc-delay-2" d="M250 500 C 550 250, 1050 250, 1350 500" stroke="#93c5fd" strokeOpacity="0.6" strokeWidth="2" fill="none" />
          <path className="map-arc arc-delay-3" d="M350 680 C 650 420, 950 420, 1250 680" stroke="#3b82f6" strokeOpacity="0.65" strokeWidth="2.5" fill="none" />
        </g>

        {/* Moving dots along arcs */}
        <circle className="map-dot arc-delay-1" r="3.5" fill="#93c5fd">
          <animateMotion dur="7s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path="M300 600 C 550 350, 1050 350, 1300 600" />
        </circle>
        <circle className="map-dot arc-delay-2" r="3" fill="#60a5fa">
          <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path="M250 500 C 550 250, 1050 250, 1350 500" />
        </circle>
        <circle className="map-dot arc-delay-3" r="3.5" fill="#3b82f6">
          <animateMotion dur="8s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path="M350 680 C 650 420, 950 420, 1250 680" />
        </circle>
      </svg>
    </div>
  );
};

export default AnimatedMapBackground;


