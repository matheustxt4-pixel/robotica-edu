/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        robo: {
          yellow: {
            DEFAULT: '#FFD166',
            light: '#FFE08B',
            dark: '#E0B042'
          },
          blue: {
            DEFAULT: '#118AB2',
            light: '#3AA7CD',
            dark: '#0B6483'
          },
          green: {
            DEFAULT: '#06D6A0',
            light: '#39E6B5',
            dark: '#049E76'
          },
          orange: {
            DEFAULT: '#F78C6C',
            light: '#FAAB93',
            dark: '#D86543'
          },
          purple: {
            DEFAULT: '#7209B7',
            light: '#9131D4',
            dark: '#520687'
          },
          dark: {
            DEFAULT: '#073B4C',
            surface: '#112233',
            card: '#1A2E40'
          },
          light: {
            DEFAULT: '#F8F9FA',
            card: '#FFFFFF',
            accent: '#E9ECEF'
          }
        }
      },
      fontFamily: {
        display: ['Fredoka', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif']
      },
      boxShadow: {
        '3d-yellow': '0 4px 0 0 #E0B042',
        '3d-blue': '0 4px 0 0 #0B6483',
        '3d-green': '0 4px 0 0 #049E76',
        '3d-orange': '0 4px 0 0 #D86543',
        '3d-purple': '0 4px 0 0 #520687',
        '3d-gray': '0 4px 0 0 #CBD5E1',
        '3d-pressed': '0 0 0 0 transparent'
      },
      keyframes: {
        bounceSmall: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' }
        }
      },
      animation: {
        'bounce-small': 'bounceSmall 1.5s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out'
      }
    },
  },
  plugins: [],
}

