// src/pages/Results.tsx
import React from 'react';
import { Music, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';
import { PlaylistAnalysis } from '../types';
import { RadarChart } from '../components/RadarChart';
import { BarChart } from '../components/BarChart';

interface ResultsProps {
  analysis: PlaylistAnalysis | null;
  onNavigate: (page: 'analyze') => void;
}

export function Results({ analysis, onNavigate }: ResultsProps) {
  if (!analysis) {
    onNavigate('analyze');
    return null;
  }

  const { playlist, top_genres, top_artists, audio_features, mood } = analysis;

  const barChartData = [
    { label: 'Danceability', value: audio_features.danceability, color: 'from-pink-400 to-pink-500' },
    { label: 'Energy', value: audio_features.energy, color: 'from-purple-400 to-purple-500' },
    { label: 'Happiness', value: audio_features.valence, color: 'from-blue-400 to-blue-500' },
    { label: 'Acousticness', value: audio_features.acousticness, color: 'from-teal-400 to-teal-500' },
  ];

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => onNavigate('analyze')}
          className="inline-flex items-center gap-2 text-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Analyze Another Playlist
        </button>

        <div className="space-y-8">
          {/* Mood banner */}
          <div
            className={`relative rounded-2xl p-6 md:p-8 overflow-hidden`}
            style={{
              background: `linear-gradient(90deg, var(--tw-gradient-stops))`,
            }}
          >
            {/* apply gradient via inline style using mood colors mapped to tailwind-like values */}
            <div
              className="absolute inset-0 -z-10 rounded-2xl"
              style={{
                background: `linear-gradient(90deg, ${mood.color_from.replace('from-', '') || '#7c3aed'}, ${mood.color_to.replace('to-', '') || '#ec4899'})`,
                opacity: 0.95,
              }}
            />
            <div className="relative z-10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-7 h-7" />
                <h2 className="text-2xl font-semibold">Your Playlist Mood</h2>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{mood.mood}</h1>
              <p className="text-sm md:text-base text-white/90 max-w-3xl">{mood.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Playlist info (dark card) */}
            <div className="bg-card rounded-2xl p-6 border border-muted">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-pink-600 to-pink-500 p-3 rounded-xl">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Playlist Info</h2>
              </div>

              {playlist.image && (
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-lg mb-4 shadow"
                />
              )}

              <h3 className="text-xl font-semibold text-white mb-2">{playlist.name}</h3>
              {playlist.description && (
                <p className="text-sm text-muted mb-3">{playlist.description}</p>
              )}
              <p className="text-xs text-muted">{playlist.total_tracks ?? 0} tracks</p>
            </div>

            {/* Top genres + artists */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-muted">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-500 p-3 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Top Genres</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {top_genres.slice(0, 5).map((genre, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-surface text-muted border border-muted"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-muted">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Top Artists</h3>
                </div>

                <div className="space-y-2">
                  {top_artists.slice(0, 5).map((artist, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface border border-muted"
                    >
                      <span className="font-medium text-white">{artist.name}</span>
                      <span className="text-sm text-muted">{artist.count} tracks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-6 border border-muted">
              <h3 className="text-lg font-semibold text-white mb-6 text-center">Audio Features Radar</h3>
              <div className="h-72">
                <RadarChart
                  data={{
                    danceability: audio_features.danceability,
                    energy: audio_features.energy,
                    valence: audio_features.valence,
                    acousticness: audio_features.acousticness,
                  }}
                />
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-muted">
              <h3 className="text-lg font-semibold text-white mb-6">Feature Breakdown</h3>
              <div className="h-56">
                <BarChart data={barChartData} />
              </div>

              <div className="mt-6 p-4 bg-surface rounded-lg border border-muted">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-white">Average Tempo:</span>{' '}
                  <span className="ml-2">{Math.round(audio_features.tempo)} BPM</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-28" />
      </div>
    </div>
  );
}
