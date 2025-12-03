<<<<<<< HEAD
# Harmony-Minds
Spotify Playlist Analyzer
=======
# Hormony Minds - Spotify Playlist Analyzer
🔗 Live Link: https://spotifyharmonyminds.netlify.app/
A beautiful, pastel-themed web application that analyzes Spotify playlists to reveal their emotional landscape, mood, and audio characteristics.

## Features

- **Spotify Authentication**: Secure OAuth2 login with Spotify
- **Playlist Analysis**: Deep analysis of any Spotify playlist including:
  - Top genres and artists
  - Audio features (danceability, energy, valence, tempo, acousticness)
  - Mood detection based on audio characteristics
  - Beautiful visualizations with radar and bar charts
- **Take Care Section**: Wellness content featuring meditation, exercise, and yoga resources
- **Blog**: Articles about music, mood, and mental health
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Spotify Developer Account

### 1. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Note your Client ID and Client Secret
4. Add `http://localhost:5000/callback` to Redirect URIs in your app settings

### 2. Backend Setup

1. Create a `.env` file in the project root:

```bash
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
FLASK_SECRET_KEY=your_random_secret_key_here
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Start the Flask server:

```bash
python server.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Install Node.js dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Click "Connect with Spotify" to authenticate
3. After login, paste any Spotify playlist URL
4. Click "Analyze Playlist" to see detailed insights
5. Explore the Take Care and Blog sections for additional content

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Python Flask
- **API**: Spotify Web API via Spotipy
- **Charts**: Custom SVG-based visualizations

## Project Structure

```
├── src/
│   ├── api/           # API integration
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── types/         # TypeScript types
│   └── App.tsx        # Main app component
├── server.py          # Flask backend
├── requirements.txt   # Python dependencies
└── package.json       # Node.js dependencies
```

## Design Philosophy

Hormony Minds features a calm, soft aesthetic with:
- Pastel color palette (pink, purple, blue, teal)
- High-quality music-related photography from Pexels
- Glassmorphism effects
- Smooth animations and transitions
- Mobile-first responsive design
>>>>>>> 460836e (Initial commit — Harmony Minds)
