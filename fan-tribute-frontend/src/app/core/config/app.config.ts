// ─── Global App Configuration ───────────────────────────────────────────────
// Edit values here — they propagate to every component automatically.

export const APP_CONFIG = {
  // Brand
  brandName: 'FAN TRIBUTE',
  tagline: 'La plataforma EDM #1 de Colombia y Latinoamérica.',

  // Contact
  email: 'fantributeco@gmail.com',
  city: 'Bogotá, Colombia',

  // Social media
  instagram: 'https://instagram.com/fantribute_col',
  twitter: 'https://twitter.com/fantribute',
  youtube: 'https://youtube.com/@fantribute',
  spotify: 'https://open.spotify.com',

  // WhatsApp (number in international format without +, e.g. 573001234567)
  whatsappNumber: '57XXXXXXXXXX',
  whatsappMerchMessage: 'Hola! Me interesa la Camiseta EDM Summer de FAN TRIBUTE 👕',
  whatsappContactMessage: 'Hola! Me comunico desde FAN TRIBUTE.',

  // Registration / order form (Google Forms URL)
  registrationFormUrl: 'https://forms.google.com/PLACEHOLDER',

  // Spotify playlist for EDM Summer Event
  spotifyPlaylistId: '3TqkQ3ZTP5iKX9Z6ERfLwi',
} as const;

// Derived helpers
export const WHATSAPP_URL = (message: string) =>
  `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const SPOTIFY_EMBED_URL = (playlistId: string) =>
  `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
