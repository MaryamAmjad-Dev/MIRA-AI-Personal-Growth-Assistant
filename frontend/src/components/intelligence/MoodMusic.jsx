import { useEffect, useState } from 'react';
import { fetchMoodMusic } from '../../api/intelligence';

export default function MoodMusic() {
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => { fetchMoodMusic().then(setPlaylist).catch(() => {}); }, []);

  if (!playlist) return null;

  return (
    <div className="intel-card mood-music">
      <div className="intel-card-header">
        <span className="intel-icon">🎵</span>
        <div>
          <h3>{playlist.title}</h3>
          <p>{playlist.description}</p>
        </div>
      </div>
      <ul className="music-tracks">
        {playlist.tracks?.map((t) => (
          <li key={t}>🎧 {t}</li>
        ))}
      </ul>
    </div>
  );
}
