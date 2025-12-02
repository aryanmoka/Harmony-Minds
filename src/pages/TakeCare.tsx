// src/pages/TakeCare.tsx
import React from 'react';
import { Heart, Flower2, Activity } from 'lucide-react';

export function TakeCare() {
  const sections = [
    {
      title: 'Meditation',
      icon: Flower2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-900/40 to-pink-900/20',
      description: 'Find inner peace through guided meditation and mindfulness practices.',
      image:
        'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=1600',
      practices: [
        'Breathing exercises for stress relief',
        'Body scan meditation',
        'Loving-kindness meditation',
        'Mindful awareness practice',
      ],
      playlists: [
        { name: 'Peaceful Piano', description: 'Relax and indulge with beautiful piano pieces' },
        { name: 'Ambient Relaxation', description: 'Softly spoken affirmations with tranquil music' },
      ],
    },
    {
      title: 'Exercise',
      icon: Activity,
      color: 'from-blue-400 to-teal-400',
      bgColor: 'from-blue-900/30 to-teal-900/10',
      description: 'Energize your body and mind with movement and physical activity.',
      image:
        'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1600',
      practices: [
        'Cardio workouts for endurance',
        'Strength training basics',
        'HIIT for maximum efficiency',
        'Stretching and flexibility',
      ],
      playlists: [
        { name: 'Power Workout', description: 'High-energy beats to fuel your fitness' },
        { name: 'Running Motivation', description: 'Keep your pace with upbeat tracks' },
      ],
    },
    {
      title: 'Yoga',
      icon: Heart,
      color: 'from-teal-400 to-green-400',
      bgColor: 'from-teal-900/30 to-green-900/10',
      description: 'Connect body, mind, and spirit through yoga and gentle movement.',
      image:
        'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1600',
      practices: [
        'Morning sun salutations',
        'Restorative evening flows',
        'Balance and stability poses',
        'Breathwork and pranayama',
      ],
      playlists: [
        { name: 'Yoga & Meditation', description: 'Calming sounds for your practice' },
        { name: 'Nature Sounds', description: 'Connect with earth through natural ambience' },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-card rounded-md flex items-center justify-center">
            <Heart className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Take Care of Yourself</h1>
            <p className="text-sm text-muted mt-1">
              Nurture your mind, body and soul with practices that bring balance and calm.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="rounded-2xl overflow-hidden border border-muted bg-gradient-to-br"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)' }}
              >
                <div className="grid md:grid-cols-2 gap-6 items-stretch">
                  {/* Text column */}
                  <div className="p-6 md:p-8 flex flex-col justify-center bg-card">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-4`}
                      style={{
                        background: `linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))`,
                      }}
                    >
                      <div className={`p-2 rounded-md`} style={{ background: 'transparent' }}>
                        <Icon className="w-6 h-6 text-[var(--accent)]" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-white mb-3">{section.title}</h2>
                    <p className="text-sm text-muted mb-4">{section.description}</p>

                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-white mb-2">Practices</h3>
                      <ul className="space-y-2 text-sm text-muted">
                        {section.practices.map((p, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-[var(--accent)] mt-1">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Recommended Playlists</h3>
                      <div className="space-y-3">
                        {section.playlists.map((pl, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-surface border border-muted flex flex-col sm:flex-row sm:justify-between gap-2"
                          >
                            <div>
                              <div className="font-semibold text-white">{pl.name}</div>
                              <div className="text-sm text-muted">{pl.description}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 rounded-md text-sm bg-[var(--accent)] text-black font-semibold hover:brightness-95">
                                Open
                              </button>
                              <button className="px-3 py-1 rounded-md text-sm border border-muted text-muted hover:text-white">
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image column */}
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom card */}
        <div className="mt-10 bg-surface rounded-2xl p-6 border border-muted flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Your Journey to Wellness</h3>
            <p className="text-sm text-muted mb-3">
              Remember, self-care is not selfish. Start with just a few minutes each day and let your practice grow.
            </p>
            <p className="text-xs italic text-muted">“Almost everything will work again if you unplug it for a few minutes, including you.”</p>
          </div>

          <div className="w-full md:w-48">
            <div className="bg-card rounded-lg p-3 text-sm text-muted">
              <div className="font-semibold text-white mb-2">Quick Tips</div>
              <ul className="space-y-2">
                <li>- Try 5 minutes of breathing daily</li>
                <li>- Move your body for at least 20 minutes</li>
                <li>- End the day with a short reflection</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-28" />
      </div>
    </div>
  );
}
