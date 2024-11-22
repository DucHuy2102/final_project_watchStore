import flowbite from 'flowbite-react/tailwind';
import typography from 'flowbite-typography';
/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
    theme: {
        extend: {
            fontFamily: {
                playfair: ['Playfair Display', 'serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
                'rotate-y-180': 'rotateY 1s forwards',
                'gradient-x': 'gradient-x 3s ease-in-out infinite',
                'float-slow': 'float 3s ease-in-out infinite',
                'float-slow-delay': 'float 3s ease-in-out 1.5s infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'shine-luxury': 'shineLuxury 3s ease-in-out infinite',
                shine: 'shine 1.5s ease-in-out infinite',
                fadeIn: 'fadeIn 1s ease-in-out',
                blob: 'blob 7s infinite',
                shimmer: 'shimmer 2s linear infinite',
                tilt: 'tilt 10s infinite linear',
            },
            keyframes: {
                shine: {
                    '0%': { left: '-100%', opacity: 0 },
                    '50%': { opacity: 0.5 },
                    '100%': { left: '100%', opacity: 0 },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                blob: {
                    '0%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                    '100%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                },
                rotateY: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
                shimmer: {
                    '100%': {
                        backgroundPosition: '200% center',
                    },
                },
                tilt: {
                    '0%, 50%, 100%': {
                        transform: 'rotate(0deg)',
                    },
                    '25%': {
                        transform: 'rotate(0.5deg)',
                    },
                    '75%': {
                        transform: 'rotate(-0.5deg)',
                    },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
                letterAppear: {
                    '0%, 100%': {
                        transform: 'scale(1) rotate(0deg)',
                        opacity: '1',
                    },
                    '5%': {
                        transform: 'scale(0) rotate(-180deg)',
                        opacity: '0',
                    },
                    '50%': {
                        transform: 'scale(1.2) rotate(0deg)',
                        opacity: '0.5',
                    },
                    '95%': {
                        transform: 'scale(1) rotate(0deg)',
                        opacity: '1',
                    },
                },
                glowAppear: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: '0.3',
                    },
                    '5%': {
                        transform: 'scale(0)',
                        opacity: '0',
                    },
                    '50%': {
                        transform: 'scale(1.5)',
                        opacity: '0.7',
                    },
                    '95%': {
                        transform: 'scale(1)',
                        opacity: '0.3',
                    },
                },
            },
            scale: {
                102: '1.02',
            },
        },
    },
    plugins: [flowbite.plugin(), typography()],
};
