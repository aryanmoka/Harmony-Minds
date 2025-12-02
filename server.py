# server.py — Hormony Minds backend (full file)
from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv
import re
from collections import Counter
import logging
import time

# Load environment variables from .env
load_dotenv()
logging.basicConfig(level=logging.INFO if os.environ.get('FLASK_ENV') != 'production' else logging.WARNING)

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')

# CORS — allow dev frontends and production Netlify domain
CORS(app, supports_credentials=True, origins=[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://spotifyharmonyminds.netlify.app'  # Add your Netlify domain
])

# Spotify configuration from environment
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
# Dynamic redirect URI: use env var or auto-detect for Render
       # Dynamic redirect URI: use env var or auto-detect for Render
SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI') or (
           os.environ.get('RENDER_EXTERNAL_URL', 'http://127.0.0.1:5000') + '/callback'
       )
       

SCOPE = 'playlist-read-private playlist-read-collaborative user-read-private'

# Warn if client id/secret missing
if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
    logging.warning("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET missing - OAuth will fail until set.")


def get_spotify_oauth():
    """
    Create a SpotifyOAuth helper instance configured from environment variables.
    """
    return SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope=SCOPE,
        cache_path=None,
        show_dialog=True
    )


def create_spotify_client_from_token_info(token_info):
    """
    Create a spotipy.Spotify client from a token_info dict
    """
    access_token = token_info.get('access_token')
    if not access_token:
        return None
    return spotipy.Spotify(auth=access_token)


def get_spotify_client():
    """
    Return an authenticated Spotify client using tokens stored in session.
    Refreshes token automatically if it is expired or near expiry.
    """
    token_info = session.get('token_info')
    if not token_info:
        return None

    sp_oauth = get_spotify_oauth()

    # Refresh logic: refresh if expires_at is present and token is about to expire
    expires_at = token_info.get('expires_at') or 0
    now = int(time.time())
    if expires_at and expires_at - now < 60:
        refresh_token = token_info.get('refresh_token')
        if not refresh_token:
            logging.error("No refresh_token available; user must re-authenticate.")
            return None
        try:
            new_token_info = sp_oauth.refresh_access_token(refresh_token)
            # merge updates (new access_token, expires_at, maybe refresh_token)
            token_info.update(new_token_info)
            session['token_info'] = token_info
            logging.info("Refreshed Spotify access token.")
        except Exception as e:
            logging.exception("Failed to refresh access token: %s", e)
            return None

    return create_spotify_client_from_token_info(token_info)


# ------------------ AUTH ROUTES ------------------ #

@app.route('/api/auth/login')
def login():
    """
    Return the Spotify authorization URL for the frontend to redirect the user to.
    """
    sp_oauth = get_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return jsonify({'auth_url': auth_url}), 200


@app.route('/callback')
def callback():
    """
    OAuth callback endpoint Spotify will redirect to.
    Exchanges code for tokens and stores token_info in Flask session.
    Redirects back to frontend analyze page on success.
    """
    sp_oauth = get_spotify_oauth()
    code = request.args.get('code')

    if code:
        try:
            # Request token_info
            # use as_dict=True to ensure a dict is returned (spotipy versions vary)
            token_info = sp_oauth.get_access_token(code, as_dict=True)

            # Validate token_info
            if not token_info or 'access_token' not in token_info:
                logging.error("Token exchange did not return access_token.")
                return redirect('http://127.0.0.1:5173/?error=auth_failed')

            # Persist token info in session (server-side)
            session['token_info'] = token_info

            # Redirect back to frontend analyze page
            # Dynamic frontend URL: use env var or default to Netlify
            frontend_url = os.getenv('FRONTEND_URL', 'https://spotifyharmonyminds.netlify.app')
            return redirect(f'{frontend_url}/analyze')  # Success
   # For errors: return redirect(f'{frontend_url}/?error=auth_failed')
   

        except Exception as e:
            logging.exception("Error exchanging code for token: %s", e)
            return redirect(f'{frontend_url}/?error=auth_failed')

    # No code present — treat as failure
    return redirect(f'{frontend_url}/?error=auth_failed')


@app.route('/api/auth/status')
def auth_status():
    """
    Return whether the current session is authenticated.
    Frontend should call this with credentials included.
    """
    token_info = session.get('token_info')
    return jsonify({'authenticated': token_info is not None}), 200


@app.route('/api/auth/logout')
def logout():
    session.clear()
    return jsonify({'success': True}), 200


# ------------------ UTILITIES ------------------ #

def extract_playlist_id(url_or_id: str):
    """
    Extract Spotify playlist id from a variety of formats:
      - https://open.spotify.com/playlist/{id}
      - spotify:playlist:{id}
      - raw id
    Returns None if not found.
    """
    if not url_or_id:
        return None

    url = url_or_id.split('?')[0].strip()

    m = re.search(r'spotify:playlist:([A-Za-z0-9]+)', url)
    if m:
        return m.group(1)

    m = re.search(r'playlist\/([A-Za-z0-9]+)', url)
    if m:
        return m.group(1)

    if re.fullmatch(r'[A-Za-z0-9]{8,40}', url):
        return url

    return None


def calculate_mood(features):
    """
    Simple rule-based mood classifier based on averaged audio features.
    """
    valence = features.get('valence', 0)
    energy = features.get('energy', 0)
    danceability = features.get('danceability', 0)

    if valence > 0.6 and energy > 0.6:
        return {
            'mood': 'Energetic & Joyful',
            'description': 'This playlist radiates positive energy.',
            'color_from': 'from-yellow-300',
            'color_to': 'to-pink-400'
        }
    elif valence > 0.6 and energy < 0.4:
        return {
            'mood': 'Peaceful & Happy',
            'description': 'Calm but uplifting.',
            'color_from': 'from-green-300',
            'color_to': 'to-blue-300'
        }
    elif valence < 0.4 and energy > 0.6:
        return {
            'mood': 'Intense & Passionate',
            'description': 'Strong emotional energy.',
            'color_from': 'from-red-400',
            'color_to': 'to-purple-500'
        }
    elif valence < 0.4 and energy < 0.4:
        return {
            'mood': 'Melancholic & Reflective',
            'description': 'Slow and emotional.',
            'color_from': 'from-indigo-400',
            'color_to': 'to-slate-500'
        }
    elif danceability > 0.7:
        return {
            'mood': 'Groovy & Danceable',
            'description': 'Fun and rhythmic.',
            'color_from': 'from-purple-400',
            'color_to': 'to-pink-500'
        }
    else:
        return {
            'mood': 'Balanced & Versatile',
            'description': 'A flexible blend.',
            'color_from': 'from-teal-300',
            'color_to': 'to-cyan-400'
        }


# ------------------ ANALYZE ROUTE ------------------ #

@app.route('/api/analyze', methods=['POST'])
def analyze_playlist():
    sp = get_spotify_client()
    if not sp:
        return jsonify({'error': 'Not authenticated'}), 401

    data = request.get_json() or {}
    playlist_url = data.get('playlist_url')
    if not playlist_url:
        return jsonify({'error': 'Playlist URL is required'}), 400

    playlist_id = extract_playlist_id(playlist_url)
    if not playlist_id:
        return jsonify({'error': 'Invalid playlist URL/ID'}), 400

    try:
        # --- playlist metadata (may raise SpotifyException) ---
        playlist = sp.playlist(playlist_id)

        # Collect all tracks (pagination)
        all_items = []
        results = sp.playlist_tracks(playlist_id, limit=100)
        all_items.extend(results.get('items', []))
        while results.get('next'):
            results = sp.next(results)
            all_items.extend(results.get('items', []))

        # Extract track and artist ids
        track_ids = []
        artist_ids = set()
        for item in all_items:
            track = item.get('track')
            if not track:
                continue
            tid = track.get('id')
            if not tid:
                continue
            track_ids.append(tid)
            for artist in track.get('artists', []):
                aid = artist.get('id')
                if aid:
                    artist_ids.add(aid)

        if not track_ids:
            return jsonify({'error': 'Playlist contains no playable tracks'}), 400

        # Audio features (in batches)
        audio_features_list = []
        for i in range(0, len(track_ids), 100):
            batch = track_ids[i:i + 100]
            features = sp.audio_features(batch)
            # features may be None for local/unavailable tracks; filter those
            audio_features_list.extend([f for f in (features or []) if f])

        if not audio_features_list:
            return jsonify({'error': 'No audio features available for playlist tracks'}), 400

        # Artists info for genres
        artists_list = []
        artist_ids_list = list(artist_ids)
        for i in range(0, len(artist_ids_list), 50):
            batch = artist_ids_list[i:i + 50]
            resp = sp.artists(batch)
            artists_list.extend(resp.get('artists', []))

        all_genres = []
        for artist in artists_list:
            all_genres.extend(artist.get('genres', []))

        genre_counter = Counter(all_genres)
        top_genres = genre_counter.most_common(5)

        # Top artists by frequency
        artist_counter = Counter()
        for item in all_items:
            track = item.get('track')
            if not track:
                continue
            for artist in track.get('artists', []):
                name = artist.get('name')
                if name:
                    artist_counter[name] += 1
        top_artists_names = artist_counter.most_common(5)

        # Compute safe averages
        def safe_avg(key):
            vals = [f.get(key) for f in audio_features_list if f and f.get(key) is not None]
            return sum(vals) / len(vals) if vals else 0.0

        avg_features = {
            'danceability': safe_avg('danceability'),
            'energy': safe_avg('energy'),
            'valence': safe_avg('valence'),
            'tempo': safe_avg('tempo'),
            'acousticness': safe_avg('acousticness'),
        }

        mood_result = calculate_mood(avg_features)

        return jsonify({
            'playlist': {
                'name': playlist.get('name'),
                'description': playlist.get('description'),
                'image': (playlist.get('images') or [{}])[0].get('url'),
                'total_tracks': playlist.get('tracks', {}).get('total')
            },
            'top_genres': [{'name': g, 'count': c} for g, c in top_genres],
            'top_artists': [{'name': n, 'count': c} for n, c in top_artists_names],
            'audio_features': avg_features,
            'mood': mood_result
        }), 200

    except spotipy.exceptions.SpotifyException as se:
        logging.exception("Spotify API error: %s", se)
        status = getattr(se, 'http_status', None) or getattr(se, 'status', None)

        # Extract message safely
        try:
            message = se.msg if hasattr(se, 'msg') else (se.args[0] if se.args else str(se))
        except Exception:
            message = str(se)

        # Handle common statuses explicitly
        if status == 401:
            return jsonify({'error': 'Spotify authentication error', 'details': message}), 401

        if status == 403:
            return jsonify({
                'error': 'Spotify forbidden – your account does not have permission for this playlist or its audio features.',
                'details': message
            }), 403

        if status == 404:
            return jsonify({
                'error': 'Playlist not found or inaccessible. Check the URL/ID and make sure the playlist is public or you have access.',
                'details': message
            }), 404

        if status == 429:
            retry_after = None
            try:
                if hasattr(se, 'headers') and se.headers:
                    retry_after = se.headers.get('Retry-After') or se.headers.get('retry-after')
            except Exception:
                pass
            return jsonify({'error': 'Rate limited by Spotify', 'retry_after': retry_after or 'unknown'}), 429

        # Fallback for any other Spotify error
        return jsonify({'error': 'Spotify API error', 'details': message}), 502


    except Exception as e:
        logging.exception("Unexpected error in analyze_playlist: %s", e)
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# DEBUG: show token_info (DO NOT share access_token publicly)
@app.route('/debug/token_info')
def debug_token_info():
    ti = session.get('token_info')
    if not ti:
        return jsonify({'token': None}), 200
    # return only non-sensitive summary
    return jsonify({
        'has_token': True,
        'scope': ti.get('scope'),
        'expires_at': ti.get('expires_at'),
        'access_token_present': 'access_token' in ti,
        'refresh_token_present': 'refresh_token' in ti
    }), 200

# DEBUG: call spotify /me to verify token works
@app.route('/debug/me')
def debug_me():
    sp = get_spotify_client()
    if not sp:
        return jsonify({'error': 'Not authenticated'}), 401
    try:
        me = sp.current_user()
        return jsonify({'id': me.get('id'), 'display_name': me.get('display_name'), 'product': me.get('product')}), 200
    except Exception as e:
        logging.exception("debug_me failed: %s", e)
        return jsonify({'error': 'spotify call failed', 'details': str(e)}), 500
@app.route('/debug/fetch_playlist')
def debug_fetch():
    sp = get_spotify_client()
    if not sp:
        return jsonify({'error': 'Not authenticated'}), 401

    playlist_id = request.args.get('id')
    if not playlist_id:
        return jsonify({'error': 'Missing id param'}), 400

    try:
        pl = sp.playlist(playlist_id)
        return jsonify({
            'name': pl.get('name'),
            'playlist_owner': pl.get('owner', {}).get('id'),
            'public': pl.get('public'),
            'total_tracks': pl.get('tracks', {}).get('total')
        })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch playlist', 'details': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Use Render's PORT or fallback to 5000 for local dev
    app.run(host='0.0.0.0', port=port, debug=False)  # Bind to 0.0.0.0, disable debug in prod
