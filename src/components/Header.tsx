// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Music2, Sparkles, Heart, BookOpen, Menu, X } from 'lucide-react';
import { spotifyApi } from '../api/spotify';

interface HeaderProps {
  currentPage: 'home' | 'analyze' | 'results' | 'take-care' | 'blog';
  onNavigate: (page: 'home' | 'analyze' | 'results' | 'take-care' | 'blog') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await spotifyApi.checkAuthStatus();
      setIsAuthenticated(authenticated);
    } catch (e) {
      console.error('Auth check failed', e);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await spotifyApi.logout();
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setIsAuthenticated(false);
      onNavigate('home');
    }
  };

  const handleConnect = async () => {
    try {
      const url = await spotifyApi.getAuthUrl();
      window.location.href = url;
    } catch (e) {
      console.error('Failed to get auth url', e);
    }
  };

  const NavItem = ({ label, icon: Icon, page }: { label: string; icon: React.ComponentType<any>; page: HeaderProps['currentPage'] }) => {
    const active = currentPage === page;
    return (
      <button
        onClick={() => {
          onNavigate(page);
          setMobileOpen(false);
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm font-medium ${
          active
            ? 'text-black bg-[var(--accent)] shadow-sm'
            : 'text-[var(--muted)] hover:text-white/90 hover:bg-card/40'
        }`}
        aria-pressed={active}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-muted" style={{ height: 'var(--header-height)' }}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onNavigate('home'); setMobileOpen(false); }}
            className="flex items-center gap-3"
            aria-label="Go home"
          >
            <div className="w-10 h-10 bg-surface rounded-md flex items-center justify-center">
              <Music2 className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <span className="hidden md:inline text-lg font-semibold text-white">Hormony Minds</span>
          </button>
        </div>

        {/* Center: nav (desktop) */}
        <nav className="hidden md:flex items-center gap-3">
          <NavItem label="Analyze" icon={Sparkles} page="analyze" />
          <NavItem label="Take Care" icon={Heart} page="take-care" />
          <NavItem label="Blog" icon={BookOpen} page="blog" />
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-surface border border-muted text-sm text-[var(--muted)] hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--accent)] text-black text-sm font-semibold hover:brightness-95 transition"
            >
              Connect
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-full bg-surface border border-muted"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5 text-[var(--muted)]" /> : <Menu className="w-5 h-5 text-[var(--muted)]" />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-muted bg-card/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <button onClick={() => { onNavigate('analyze'); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-white/5">Analyze</button>
              <button onClick={() => { onNavigate('take-care'); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-white/5">Take Care</button>
              <button onClick={() => { onNavigate('blog'); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-white/5">Blog</button>
            </div>

            <div className="pt-2">
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full px-3 py-2 rounded-lg bg-surface text-sm text-[var(--muted)]">Logout</button>
              ) : (
                <button onClick={() => { handleConnect(); setMobileOpen(false); }} className="w-full px-3 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold">Connect</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
