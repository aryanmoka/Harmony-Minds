// src/pages/Blog.tsx
import React from 'react';
import { BookOpen, Music, Heart, Sparkles, Brain, Coffee, Link2 } from 'lucide-react';

type Article = {
  title: string;
  excerpt: string;
  image: string;
  icon: any;
  color: string;
  readTime: string;
  author: string;
  tags: string[];
  spotify?: string; // optional playlist url for "Listen"
};

export function Blog() {
  const articles: Article[] = [
    {
      title: 'How Music Shapes Your Mood — The Neuroscience Behind the Beat',
      excerpt:
        'From heart rate to memory recall, music changes the chemistry of our brains. Learn which musical features trigger emotion and how to use them intentionally to shift mood.',
      image:
        'https://images.pexels.com/photos/3755421/pexels-photo-3755421.jpeg?auto=compress&cs=tinysrgb&w=1600',
      icon: Brain,
      color: 'from-pink-500 to-rose-500',
      readTime: '7 min read',
      author: 'Dr. S. Kapoor',
      tags: ['science', 'emotion', 'research'],
      spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
    },
    {
      title: 'Design Your Morning — Playlists That Wake You Gently (and Fast)',
      excerpt:
        'A practical guide to building a morning playlist that matches the different phases of waking up — gentle openings, energising mid-section, and focus-ready closers.',
      image:
        'https://images.pexels.com/photos/3769716/pexels-photo-3769716.jpeg?auto=compress&cs=tinysrgb&w=1600',
      icon: Coffee,
      color: 'from-purple-500 to-indigo-500',
      readTime: '5 min read',
      author: 'Lena M.',
      tags: ['curation', 'productivity', 'tips'],
      spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWY4xHQp97fN6',
    },
    {
      title: 'Music Therapy — Evidence, Practices & Everyday Uses',
      excerpt:
        'A friendly overview of music therapy techniques you can use at home and what to expect from professional sessions. Includes breathing exercises paired with song examples.',
      image:
        'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=1600',
      icon: Heart,
      color: 'from-blue-500 to-cyan-400',
      readTime: '8 min read',
      author: 'Therapist Collective',
      tags: ['therapy', 'wellbeing', 'practice'],
      spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY',
    },
    {
      title: 'Nostalgia in Music — Why Old Songs Feel Like Home',
      excerpt:
        'Nostalgia boosts belonging and comfort — but it can also be bittersweet. We break down why certain harmonies, timbres and lyrics unlock memory lanes.',
      image:
        'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=1600',
      icon: Sparkles,
      color: 'from-teal-400 to-green-400',
      readTime: '6 min read',
      author: 'R. Patel',
      tags: ['culture', 'memory', 'story'],
      spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWY4xHQp97fN6',
    },
    {
      title: 'Rhythm & Work — Use Tempo to Enter Flow',
      excerpt:
        'Tempo regulates perceived time and attention. Here’s how to pick BPM ranges for deep work, light tasks, and creative bursts — plus a sample playlist for each.',
      image:
        'https://images.pexels.com/photos/3971996/pexels-photo-3971996.jpeg?auto=compress&cs=tinysrgb&w=1600',
      icon: Music,
      color: 'from-orange-400 to-amber-400',
      readTime: '5 min read',
      author: 'Productivity Lab',
      tags: ['focus', 'tempo', 'work'],
      spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6',
    },
    {
      title: 'Build Emotional Playlists — A Simple 5-Step Method',
      excerpt:
        'A short, hands-on framework for making playlists that support specific emotional goals: calm, energy, nostalgia, motivation, and healing.',
      image:
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1600',
      icon: Heart,
      color: 'from-pink-500 to-purple-500',
      readTime: '6 min read',
      author: 'Curation Studio',
      tags: ['how-to', 'curation', 'emotions'],
      spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj',
    },
  ];

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-card rounded-md flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Music & Mind</h1>
            <p className="text-sm text-muted mt-1 max-w-xl">
              Long-reads, practical guides and curated playlists about how music shapes our feelings, focus and wellbeing.
            </p>
          </div>
        </div>

        {/* Articles grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => {
            const Icon = article.icon;
            return (
              <article
                key={index}
                className="bg-card rounded-2xl overflow-hidden border border-muted hover:shadow-xl transition-transform transform hover:-translate-y-1"
                aria-labelledby={`article-title-${index}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r {article.color}">
                    {/* using inline style for gradient classes won't interpolate in template literal; apply via className below */}
                  </div>
                  <div
                    className={`absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r ${article.color}`}
                    aria-hidden
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-muted mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-muted">{article.readTime}</span>
                      <span className="text-muted">·</span>
                      <span className="text-sm text-white/80">By {article.author}</span>
                    </div>
                    <div className="flex gap-2">
                      {article.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 id={`article-title-${index}`} className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-sm text-muted mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-[var(--accent)] font-semibold text-sm hover:underline flex items-center gap-2"
                        onClick={() => {
                          // placeholder - ideally open article modal or route to article page
                          alert('Open article — coming soon');
                        }}
                      >
                        Read More
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {article.spotify && (
                        <a
                          href={article.spotify}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/90 bg-surface px-3 py-1.5 rounded-full hover:brightness-95"
                        >
                          <Link2 className="w-4 h-4 text-[var(--accent)]" />
                          Listen
                        </a>
                      )}
                    </div>

                    <div className="text-sm text-muted">Share</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Subscribe card */}
        <div className="mt-10 bg-surface rounded-2xl p-6 border border-muted flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <Sparkles className="w-10 h-10 text-[var(--accent)]" />
              <div>
                <h3 className="text-lg font-semibold text-white">Join our newsletter</h3>
                <p className="text-sm text-muted">Get a weekly digest: new articles, fresh playlists and mental-health tips.</p>
              </div>
            </div>

            <div className="flex gap-3 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-lg bg-card border border-muted text-white placeholder:text-muted outline-none"
                aria-label="Email for newsletter"
              />
              <button className="px-4 py-2 bg-[var(--accent)] text-black rounded-lg font-semibold hover:brightness-95">
                Subscribe
              </button>
            </div>
          </div>

          <div className="w-56 hidden md:block">
            <div className="bg-card rounded-lg p-3 text-sm text-muted">
              <div className="font-semibold text-white mb-2">Popular</div>
              <ul className="space-y-2">
                <li className="truncate">How Music Shapes Your Mood</li>
                <li className="truncate">Build Emotional Playlists</li>
                <li className="truncate">Rhythm & Work — Use Tempo to Enter Flow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-28" />
      </div>
    </div>
  );
}
