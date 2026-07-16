// Branding y configuración de la app
export const APP_CONFIG = {
  siteName: 'Elena & Sofia | Our Wedding',
  coupleNames: 'Elena & Sofia',
  monogram: 'E & S',
  description:
    'Celebrate love, unity, and the beginning of forever. Join us in commemorating the most beautiful day of our lives.',
}

// URL del backend (inyectada por Vite desde conn/frontend.env)
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
