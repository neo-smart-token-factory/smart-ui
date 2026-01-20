/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    acid: '#D8F244',
                },
                obsidian: {
                    DEFAULT: '#0E0E0E',
                    surface: '#111214',
                    elevated: '#1A1C1F',
                },
                signal: {
                    magenta: '#FF2E9A',
                    cyan: '#00E5FF',
                }
            },
            fontFamily: {
                headline: ['var(--font-headline)', 'Space Grotesk', 'sans-serif'],
                body: ['var(--font-body)', 'Inter', 'sans-serif'],
                mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-energy': 'linear-gradient(135deg, #D8F244 0%, #B3FF4E 60%, #00E5FF 100%)',
                'gradient-signal': 'linear-gradient(165deg, #FF2E9A, #00E5FF)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
