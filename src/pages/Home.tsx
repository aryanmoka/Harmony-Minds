// src/pages/Home.tsx
import React from 'react';
import { Music, Headphones, Heart, Sparkles, Play, Users } from 'lucide-react';
import { spotifyApi } from '../api/spotify';

interface HomeProps {
  onNavigate: (page: 'analyze') => void;
}

export function Home({ onNavigate }: HomeProps) {
  const handleLogin = async () => {
    const authUrl = await spotifyApi.getAuthUrl();
    // redirect user to spotify auth url
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-14">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-card rounded-md flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <span className="text-sm font-medium text-muted uppercase tracking-wide">Hormony Minds</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Understand the mood of your music — <span className="text-[var(--accent)]">deep, beautiful & humane</span>
            </h1>

            <p className="text-sm md:text-base text-muted max-w-xl">
              Paste any Spotify playlist and uncover its emotional fingerprint: energy, danceability, happiness and
              the genres and artists that shape your soundscape. Tailored visuals, calming design and actionable insights
              to help you feel your music.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--accent)] text-black rounded-full font-semibold shadow hover:brightness-95 transition"
                aria-label="Connect with Spotify"
              >
                <Play className="w-4 h-4" />
                Connect with Spotify
              </button>

              <button
                onClick={() => onNavigate('analyze')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-muted text-sm text-white/90 hover:bg-white/5 transition"
              >
                Try Analyze (already connected)
              </button>
            </div>

            <div className="flex gap-6 mt-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-card rounded-md flex items-center justify-center">
                  <Users className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="font-medium text-white">Personalized</div>
                  <div className="text-xs">Tailored insights from your playlists</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-card rounded-md flex items-center justify-center">
                  <Music className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="font-medium text-white">Audio-first</div>
                  <div className="text-xs">Uses Spotify audio features for real signals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual collage */}
          <div className="hidden md:block relative">
            <div className="absolute -left-8 -top-8 w-40 h-40 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl transform rotate-6 z-0"></div>
            <div className="absolute right-0 top-12 w-48 h-48 rounded-lg bg-gradient-to-br from-green-400 to-teal-400 shadow-2xl transform -rotate-6 z-0"></div>

            <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl bg-card z-10">
              <img
                src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="vinyl"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute left-4 bottom-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-white/6 rounded-md flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=200"
                    alt="album"
                    className="w-12 h-12 object-cover rounded-sm"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Chill Mix</div>
                  <div className="text-xs text-muted">Relaxed beats • 48 tracks</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-card rounded-2xl p-5 border border-muted hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Deep analysis</h3>
            <p className="text-sm text-muted">Genres, top artists, and a breakdown of the sound that makes your playlist.</p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-muted hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mood & emotion</h3>
            <p className="text-sm text-muted">Valence, energy and danceability mapped to friendly mood labels and colors.</p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-muted hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Beautiful visuals</h3>
            <p className="text-sm text-muted">Radar & bar charts, palette suggestions and calm pastel-themed UI for sharing.</p>
          </div>
        </section>

        {/* SAMPLE PLAYLISTS (inspirational) */}
        <section className="mb-12">
          <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Explore examples</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface rounded-xl p-4 flex items-center gap-3 border border-muted">
              <img
                src="https://images.pexels.com/photos/164853/pexels-photo-164853.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="playlist-1"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <div className="font-medium text-white">Acoustic Calm</div>
                <div className="text-xs text-muted">Soft acoustic tracks to slow down</div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 flex items-center gap-3 border border-muted">
              <img
                src="https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="playlist-2"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <div className="font-medium text-white">Upbeat Energy</div>
                <div className="text-xs text-muted">High tempo and feel-good hits</div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 flex items-center gap-3 border border-muted">
              <img
                src="https://images.pexels.com/photos/3971996/pexels-photo-3971996.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="playlist-3"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <div className="font-medium text-white">Night Drive</div>
                <div className="text-xs text-muted">Synthwave and chilled electronic</div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL / NOTE */}
        <section className="bg-card rounded-2xl p-6 border border-muted flex flex-col md:flex-row items-center gap-6 mb-16">
          <div className="flex-1">
            <div className="text-muted text-sm mb-2">Why people love it</div>
            <div className="text-lg font-semibold text-white mb-1">“Gave me a new way to understand why I listen to certain songs at different times.”</div>
            <div className="text-xs text-muted">— A fellow music-lover</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-black rounded-full font-semibold hover:brightness-95 transition"
            >
              <Play className="w-4 h-4" />
              Connect & analyze
            </button>

            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-muted text-sm text-white/90 hover:bg-white/5 transition"
            >
              Analyze a playlist
            </button>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <footer className="text-sm text-muted text-center pb-8">
          <div>Made with ❤️ using Spotify Web API • No account data is stored on this machine</div>
        </footer>
      </div>
    </div>
  );
}
