/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg-default)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)'
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)'
        },
        border: {
          muted: 'var(--color-border-muted)'
        },
        brand: {
          DEFAULT: 'var(--color-brand-primary)',
          on: 'var(--color-brand-onPrimary)'
        },
        state: {
          active: 'var(--color-state-active)',
          warning: 'var(--color-state-warning)',
          error: 'var(--color-state-error)',
          success: 'var(--color-state-success)'
        },
        neon: {
          acid: 'var(--color-neon-acid)'
        },
        signal: {
          cyan: 'var(--color-signal-cyan)',
          magenta: 'var(--color-signal-magenta)'
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)'
      },
      boxShadow: {
        elevated: 'var(--shadow-elevated)',
        'glow-acid': 'var(--glow-acid)'
      },
      fontFamily: {
        headline: 'var(--font-headline)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)'
      },
      transitionTimingFunction: {
        productive: 'var(--motion-easing)'
      },
      transitionDuration: {
        fast: 'var(--motion-duration)'
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)'
      }
    }
  },
  plugins: []
};

