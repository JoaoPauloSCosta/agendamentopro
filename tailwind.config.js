/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      // === PALETA DE CORES MINIMALISTA ===
      colors: {
        // Tons de Azul Principais
        primary: {
          50: '#eff6ff',   // Azul muito claro
          100: '#dbeafe',  // Azul claro
          200: '#bfdbfe',  // Azul suave
          300: '#93c5fd',  // Azul médio claro
          400: '#60a5fa',  // Azul médio
          500: '#3b82f6',  // Azul principal
          600: '#2563eb',  // Azul escuro
          700: '#1d4ed8',  // Azul mais escuro
          800: '#1e40af',  // Azul muito escuro
          900: '#1e3a8a',  // Azul profundo
          950: '#172554'   // Azul quase preto
        },
        
        // Tons de Cinza Neutros
        neutral: {
          50: '#f8fafc',   // Branco suave
          100: '#f1f5f9',  // Cinza muito claro
          200: '#e2e8f0',  // Cinza claro
          300: '#cbd5e1',  // Cinza médio claro
          400: '#94a3b8',  // Cinza médio
          500: '#64748b',  // Cinza principal
          600: '#475569',  // Cinza escuro
          700: '#334155',  // Cinza mais escuro
          800: '#1e293b',  // Cinza muito escuro
          900: '#0f172a',  // Cinza quase preto
          950: '#020617'   // Preto suave
        },

        // Estados e Feedback
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },

        // Cores Semânticas para Agendamento
        calendar: {
          available: '#22c55e',    // Verde para horários disponíveis
          booked: '#ef4444',       // Vermelho para horários ocupados
          pending: '#f59e0b',      // Amarelo para pendentes
          selected: '#3b82f6'      // Azul para selecionado
        }
      },

      // === TIPOGRAFIA ===
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
      },

      // === ESPAÇAMENTOS ===
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
        '144': '36rem',   // 576px
      },

      // === BORDAS E RAIOS ===
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',    // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',    // 6px
        'lg': '0.5rem',      // 8px
        'xl': '0.75rem',     // 12px
        '2xl': '1rem',       // 16px
        '3xl': '1.5rem',     // 24px
        'full': '9999px',
      },

      // === SOMBRAS ===
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'calendar': '0 4px 12px rgb(59 130 246 / 0.15)',
        'card': '0 2px 8px rgb(0 0 0 / 0.08)',
        'button': '0 2px 4px rgb(59 130 246 / 0.2)',
      },

      // === ANIMAÇÕES ===
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // === TRANSIÇÕES ===
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },

      // === BREAKPOINTS CUSTOMIZADOS ===
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },

      // === GRADIENTES PERSONALIZADOS ===
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-calendar': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      },

      // === COMPONENTES ESPECÍFICOS PARA AGENDAMENTO ===
      width: {
        'calendar': '320px',
        'sidebar': '280px',
        'modal': '480px',
      },
      
      height: {
        'calendar': '400px',
        'time-slot': '48px',
        'header': '64px',
      },

      // === Z-INDEX ===
      zIndex: {
        'modal': '1000',
        'dropdown': '100',
        'header': '50',
        'overlay': '999',
      },
    },
  },
  plugins: [
    // Plugin para componentes customizados
    function({ addComponents, theme }) {
      addComponents({
        // === BOTÕES ===
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.button'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.neutral.100'),
          color: theme('colors.neutral.700'),
          border: `1px solid ${theme('colors.neutral.200')}`,
          '&:hover': {
            backgroundColor: theme('colors.neutral.200'),
            borderColor: theme('colors.neutral.300'),
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.primary.600'),
          '&:hover': {
            backgroundColor: theme('colors.primary.50'),
          },
        },

        // === CARDS ===
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.card'),
          border: `1px solid ${theme('colors.neutral.200')}`,
          padding: theme('spacing.6'),
          transition: 'all 0.2s ease-in-out',
        },
        '.card-hover': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.lg'),
            borderColor: theme('colors.primary.200'),
          },
        },

        // === INPUTS ===
        '.input': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          border: `1px solid ${theme('colors.neutral.300')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
          },
          '&::placeholder': {
            color: theme('colors.neutral.400'),
          },
        },

        // === COMPONENTES DE CALENDÁRIO ===
        '.calendar-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: theme('spacing.1'),
        },
        '.calendar-day': {
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        },
        '.calendar-day-available': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.neutral.700'),
          '&:hover': {
            backgroundColor: theme('colors.primary.50'),
            color: theme('colors.primary.600'),
          },
        },
        '.calendar-day-selected': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
        },
        '.calendar-day-disabled': {
          backgroundColor: theme('colors.neutral.100'),
          color: theme('colors.neutral.400'),
          cursor: 'not-allowed',
        },

        // === TIME SLOTS ===
        '.time-slot': {
          height: theme('height.time-slot'),
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          border: `1px solid ${theme('colors.neutral.200')}`,
          borderRadius: theme('borderRadius.lg'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        },
        '.time-slot-available': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.neutral.700'),
          '&:hover': {
            backgroundColor: theme('colors.primary.50'),
            borderColor: theme('colors.primary.300'),
            color: theme('colors.primary.600'),
          },
        },
        '.time-slot-booked': {
          backgroundColor: theme('colors.error.50'),
          borderColor: theme('colors.error.200'),
          color: theme('colors.error.600'),
          cursor: 'not-allowed',
        },
        '.time-slot-selected': {
          backgroundColor: theme('colors.primary.500'),
          borderColor: theme('colors.primary.500'),
          color: theme('colors.white'),
        },

        // === BADGES E STATUS ===
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.badge-success': {
          backgroundColor: theme('colors.success.50'),
          color: theme('colors.success.700'),
        },
        '.badge-warning': {
          backgroundColor: theme('colors.warning.50'),
          color: theme('colors.warning.700'),
        },
        '.badge-error': {
          backgroundColor: theme('colors.error.50'),
          color: theme('colors.error.700'),
        },
        '.badge-primary': {
          backgroundColor: theme('colors.primary.50'),
          color: theme('colors.primary.700'),
        },
      })
    }
  ],
}