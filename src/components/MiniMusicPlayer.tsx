import React, { useState } from 'react';
import './MiniMusicPlayer.css';

interface Video {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  videos: Video[];
}

interface MiniMusicPlayerProps {
  currentVideo: Video | null;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onOpenFullPlayer: () => void;
  onMinimize: () => void;
  playlist: Playlist | null;
}

const MiniMusicPlayer: React.FC<MiniMusicPlayerProps> = ({
  currentVideo,
  isPlaying,
  volume,
  onTogglePlay,
  onVolumeChange,
  onNextTrack,
  onPreviousTrack,
  onOpenFullPlayer,
  onMinimize,
  playlist
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentVideo || !playlist) return null;

  return (
    <div className={`mini-music-player ${isExpanded ? 'expanded' : ''}`}>
      <div className="mini-player-main">
        <div className="mini-player-info" onClick={() => setIsExpanded(!isExpanded)}>
          <img 
            src={currentVideo.thumbnail} 
            alt={currentVideo.title}
            className="mini-thumbnail"
          />
          <div className="mini-track-info">
            <h4>{currentVideo.title}</h4>
            <p>{currentVideo.artist}</p>
            <span className="playlist-name">{playlist.icon} {playlist.name}</span>
          </div>
        </div>

        <div className="mini-controls">
          <button className="mini-control-btn" onClick={onPreviousTrack} title="Anterior">
            ⏮️
          </button>
          <button className="mini-control-btn play-btn" onClick={onTogglePlay} title={isPlaying ? 'Pausar' : 'Reproducir'}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="mini-control-btn" onClick={onNextTrack} title="Siguiente">
            ⏭️
          </button>
        </div>

        <div className="mini-volume">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="mini-volume-slider"
            title={`Volumen: ${volume}%`}
          />
        </div>

        <button className="mini-expand-btn" onClick={onOpenFullPlayer} title="Abrir reproductor completo">
          ⚙️
        </button>
        <button className="mini-minimize-btn" onClick={onMinimize} title="Minimizar reproductor">
          ➖
        </button>
      </div>

      {isExpanded && (
        <div className="mini-player-expanded">
          <div className="mini-player-video">
            <iframe
              width="100%"
              height="150"
              src={`https://www.youtube.com/embed/${currentVideo.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&volume=${volume / 100}&controls=0&modestbranding=1`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniMusicPlayer; 