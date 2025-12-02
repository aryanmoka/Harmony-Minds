export interface PlaylistAnalysis {
  playlist: {
    name: string;
    description: string;
    image: string | null;
    total_tracks: number;
  };
  top_genres: Array<{ name: string; count: number }>;
  top_artists: Array<{ name: string; count: number }>;
  audio_features: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
  };
  mood: {
    mood: string;
    description: string;
    color_from: string;
    color_to: string;
  };
}
