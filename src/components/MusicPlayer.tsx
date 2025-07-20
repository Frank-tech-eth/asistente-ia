import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
}

const playlists: Playlist[] = [
  {
    id: 'calm',
    name: 'Música Tranquila',
    description: 'Melodías suaves para relajarte y meditar',
    icon: '🌿',
    color: '#4CAF50',
    videos: [
      { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to', artist: 'Lofi Girl', duration: '24:00', thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg' },
      { id: 'rUxyKA_-grg', title: 'Peaceful Piano & Rain Sounds', artist: 'Relaxing Music', duration: '3:00:00', thumbnail: 'https://img.youtube.com/vi/rUxyKA_-grg/mqdefault.jpg' },
      { id: 'q76bMs-NwRk', title: 'Calm Music for Introverts', artist: 'Ambient Music', duration: '1:00:00', thumbnail: 'https://img.youtube.com/vi/q76bMs-NwRk/mqdefault.jpg' },
      { id: 'DWcJFNfaw9c', title: 'Deep Focus Music for Studying', artist: 'Study Music', duration: '2:00:00', thumbnail: 'https://img.youtube.com/vi/DWcJFNfaw9c/mqdefault.jpg' }
    ]
  },
  {
    id: 'motivation',
    name: 'Motivación Suave',
    description: 'Música que te anima sin ser abrumadora',
    icon: '💪',
    color: '#FF9800',
    videos: [
      { id: 'UfcAVejslrU', title: 'Gentle Motivation - Soft Inspirational Music', artist: 'Motivation Music', duration: '1:30:00', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/mqdefault.jpg' },
      { id: 'lTRiuFIWV54', title: 'Positive Vibes - Uplifting Instrumental', artist: 'Positive Music', duration: '1:00:00', thumbnail: 'https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg' },
      { id: '7NOSDKb0HlU', title: 'Soft Empowerment Music', artist: 'Empowerment Sounds', duration: '45:00', thumbnail: 'https://img.youtube.com/vi/7NOSDKb0HlU/mqdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', duration: '3:33', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
    ]
  },
  {
    id: 'social',
    name: 'Preparación Social',
    description: 'Música que te ayuda a prepararte para interacciones sociales',
    icon: '🤝',
    color: '#2196F3',
    videos: [
      { id: '5yx6BWlEVcY', title: 'Confidence Building Music', artist: 'Confidence Music', duration: '1:00:00', thumbnail: 'https://img.youtube.com/vi/5yx6BWlEVcY/mqdefault.jpg' },
      { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', artist: 'PSY', duration: '4:12', thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg' },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', artist: 'Luis Fonsi', duration: '4:41', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg' },
      { id: 'hT_nvWreIhg', title: 'OneRepublic - Counting Stars', artist: 'OneRepublic', duration: '4:17', thumbnail: 'https://img.youtube.com/vi/hT_nvWreIhg/mqdefault.jpg' }
    ]
  },
  {
    id: 'comfort',
    name: 'Música de Consuelo',
    description: 'Canciones que te hacen sentir acompañado',
    icon: '🫂',
    color: '#9C27B0',
    videos: [
      { id: 'y6120QOlsfU', title: 'Comforting Music for Lonely Times', artist: 'Comfort Music', duration: '1:00:00', thumbnail: 'https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg' },
      { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', duration: '3:33', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg' },
      { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', artist: 'PSY', duration: '4:12', thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg' },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', artist: 'Luis Fonsi', duration: '4:41', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg' }
    ]
  }
];

interface MusicPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  onPlaylistSelect?: (playlist: Playlist, video: Video) => void;
  currentVideo?: Video | null;
  currentPlaylist?: Playlist | null;
  isPlaying?: boolean;
  volume?: number;
  onTogglePlay?: () => void;
  onVolumeChange?: (volume: number) => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  isVisible, 
  onClose, 
  onPlaylistSelect,
  currentVideo: externalCurrentVideo,
  currentPlaylist: externalCurrentPlaylist,
  isPlaying: externalIsPlaying,
  volume: externalVolume,
  onTogglePlay,
  onVolumeChange,
  onNextTrack,
  onPreviousTrack
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef<any>(null);

  // Usar valores externos si están disponibles
  const finalCurrentVideo = externalCurrentVideo || currentVideo;
  const finalCurrentPlaylist = externalCurrentPlaylist || selectedPlaylist;
  const finalIsPlaying = externalIsPlaying !== undefined ? externalIsPlaying : isPlaying;
  const finalVolume = externalVolume !== undefined ? externalVolume : volume;

  useEffect(() => {
    if (selectedPlaylist && selectedPlaylist.videos.length > 0) {
      setCurrentVideo(selectedPlaylist.videos[0]);
    }
  }, [selectedPlaylist]);

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentVideo(playlist.videos[0]);
    setIsPlaying(false);
    if (onPlaylistSelect) {
      onPlaylistSelect(playlist, playlist.videos[0]);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setIsPlaying(false);
    if (onPlaylistSelect && selectedPlaylist) {
      onPlaylistSelect(selectedPlaylist, video);
    }
  };

  const togglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    } else {
      setVolume(newVolume);
    }
  };



  if (!isVisible) return null;

  return (
    <div className="music-player-overlay">
      <div className="music-player-container">
        <div className="music-player-header">
          <h2>🎵 Música para Introvertidos</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="music-player-content">
          {!selectedPlaylist ? (
            <div className="playlists-grid">
              <h3>Selecciona una playlist:</h3>
              <div className="playlists-list">
                {playlists.map(playlist => (
                  <button
                    key={playlist.id}
                    className="playlist-card"
                    onClick={() => handlePlaylistSelect(playlist)}
                    style={{ borderColor: playlist.color }}
                  >
                    <div className="playlist-icon" style={{ backgroundColor: playlist.color }}>
                      {playlist.icon}
                    </div>
                    <div className="playlist-info">
                      <h4>{playlist.name}</h4>
                      <p>{playlist.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="player-section">
              <div className="playlist-header">
                <button className="back-button" onClick={() => setSelectedPlaylist(null)}>
                  ← Volver
                </button>
                <h3>{selectedPlaylist.icon} {selectedPlaylist.name}</h3>
                <p>{selectedPlaylist.description}</p>
              </div>

                             <div className="player-main">
                 {finalCurrentVideo && (
                   <div className="video-player">
                     <iframe
                       ref={playerRef}
                       width="100%"
                       height="200"
                       src={`https://www.youtube.com/embed/${finalCurrentVideo.id}?enablejsapi=1&autoplay=${finalIsPlaying ? 1 : 0}&volume=${finalVolume / 100}`}
                       title={finalCurrentVideo.title}
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     />
                   </div>
                 )}

                <div className="player-controls">
                                     <div className="now-playing">
                     <img 
                       src={finalCurrentVideo?.thumbnail} 
                       alt={finalCurrentVideo?.title}
                       className="current-thumbnail"
                     />
                     <div className="track-info">
                       <h4>{finalCurrentVideo?.title}</h4>
                       <p>{finalCurrentVideo?.artist}</p>
                     </div>
                   </div>

                   <div className="control-buttons">
                     <button className="control-btn" onClick={togglePlay}>
                       {finalIsPlaying ? '⏸️' : '▶️'}
                     </button>
                   </div>

                   <div className="volume-control">
                     <span>🔊</span>
                     <input
                       type="range"
                       min="0"
                       max="100"
                       value={finalVolume}
                       onChange={handleVolumeChange}
                       className="volume-slider"
                     />
                   </div>
                </div>
              </div>

              <div className="playlist-tracks">
                <h4>Canciones en esta playlist:</h4>
                <div className="tracks-list">
                                     {finalCurrentPlaylist?.videos.map((video, index) => (
                     <button
                       key={video.id}
                       className={`track-item ${finalCurrentVideo?.id === video.id ? 'active' : ''}`}
                       onClick={() => handleVideoSelect(video)}
                     >
                      <img src={video.thumbnail} alt={video.title} className="track-thumbnail" />
                      <div className="track-details">
                        <h5>{video.title}</h5>
                        <p>{video.artist}</p>
                      </div>
                      <span className="track-duration">{video.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 