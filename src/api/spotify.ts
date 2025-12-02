// src/api/spotify.ts
// Prefer a Vite env var for production. Fallback to auto-detect for local dev.
const PROD_API = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

const fallbackHost =
  window.location.hostname === '127.0.0.1' ? '127.0.0.1' : window.location.hostname || 'localhost';

// Use the same protocol as the page (http for dev, https in prod)
const protocol = window.location.protocol || 'http:';

// Default local API (http://localhost:5000/api or http://127.0.0.1:5000/api)
const LOCAL_API = `${protocol}//${fallbackHost}:5000/api`;

// Final base — prefer explicit VITE_API_BASE_URL, otherwise use local auto-detect
export const API_BASE_URL = PROD_API ?? LOCAL_API;

export const spotifyApi = {
  async getAuthUrl(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data.auth_url;
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: 'include',
      });
      const data = await response.json();
      return !!data.authenticated;
    } catch (err) {
      // network/CORS or server down -> treat as not authenticated
      console.error('Auth status check failed', err);
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout failed', err);
    }
  },

  async analyzePlaylist(playlistUrl: string) {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ playlist_url: playlistUrl }),
    });

    if (!response.ok) {
      // try to parse JSON error body, but don't blow up if it's not JSON
      const errBody = await response.json().catch(() => ({} as any));
      const message =
        errBody.error || errBody.details || errBody.message || response.statusText || 'Failed to analyze playlist';
      throw new Error(message);
    }

    return response.json();
  },
};
