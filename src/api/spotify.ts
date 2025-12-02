// Auto-detect frontend origin to avoid CORS mismatch
const backendHost =
  window.location.hostname === '127.0.0.1'
    ? '127.0.0.1'
    : 'localhost';

const API_BASE_URL = `http://${backendHost}:5000/api`;

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
      return data.authenticated;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      credentials: 'include',
    });
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze playlist');
    }

    return response.json();
  },
};
