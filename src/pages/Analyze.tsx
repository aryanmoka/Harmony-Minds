// src/pages/Analyze.tsx
import { useState, useEffect } from 'react';
import { Search, Loader2, Music } from 'lucide-react';
import { spotifyApi } from '../api/spotify';
import { PlaylistAnalysis } from '../types';

interface AnalyzeProps {
  onNavigate: (page: 'home' | 'results') => void;
  onAnalysisComplete: (data: PlaylistAnalysis) => void;
}

export function Analyze({ onNavigate, onAnalysisComplete }: AnalyzeProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');

  const checkAuth = async () => {
    setCheckingAuth(true);
    try {
      const authenticated = await spotifyApi.checkAuthStatus();
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        onNavigate('home');
      }
    } catch (err) {
      console.error('Auth check failed', err);
      setIsAuthenticated(false);
      onNavigate('home');
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validatePlaylistUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    if (/^https?:\/\/(open\.)?spotify\.com\/playlist\/[A-Za-z0-9]+/i.test(trimmed)) return true;
    if (/^spotify:playlist:[A-Za-z0-9]+/i.test(trimmed)) return true;
    if (/^[A-Za-z0-9]{8,40}$/.test(trimmed)) return true;
    return false;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedUrl = playlistUrl.trim();
    if (!validatePlaylistUrl(trimmedUrl)) {
      setError('Please enter a valid Spotify playlist URL or ID.');
      return;
    }

    setLoading(true);
    try {
      const result = await spotifyApi.analyzePlaylist(trimmedUrl);
      onAnalysisComplete(result as PlaylistAnalysis);
      onNavigate('results');
    } catch (err: unknown) {
      console.error('Analyze error', err);
      const message =
        err instanceof Error
          ? err.message
          : (typeof err === 'object' && err !== null && 'message' in err ? (err as any).message : null);
      setError(message || 'Failed to analyze playlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-surface rounded-2xl shadow-lg">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted" />
          <p className="mt-3 text-sm text-muted">Checking Spotify authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-card rounded-md flex items-center justify-center">
            <Music className="w-7 h-7 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Analyze Your Playlist</h1>
            <p className="text-sm text-muted mt-1">Paste a Spotify playlist URL to discover its mood, energy and vibe.</p>
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleAnalyze} className="mb-6" noValidate>
          <div className="bg-card rounded-2xl p-6 shadow-md border border-muted">
            <label htmlFor="playlist-url" className="block text-sm font-medium text-muted mb-3">
              Spotify Playlist URL
            </label>

            <div className="relative">
              <input
                id="playlist-url"
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="w-full px-4 py-3 pr-12 rounded-lg bg-surface border border-transparent focus:border-[var(--accent)] outline-none transition-colors text-white placeholder:text-muted"
                disabled={loading}
                aria-label="Spotify playlist URL"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-800/60 border border-red-700 rounded-lg text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="submit"
                disabled={loading || !playlistUrl.trim()}
                className="col-span-1 sm:col-span-2 inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[var(--accent)] text-black font-semibold hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Playlist'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlaylistUrl('');
                  setError('');
                }}
                className="col-span-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-muted text-sm text-muted hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* How to get URL */}
        <div className="bg-surface rounded-2xl p-4 border border-muted text-sm text-muted">
          <h3 className="text-sm font-medium text-white mb-2">How to get your playlist URL</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open Spotify and find your playlist</li>
            <li>Click the three dots (...) menu</li>
            <li>Select "Share" → "Copy link to playlist"</li>
            <li>Paste the link above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
