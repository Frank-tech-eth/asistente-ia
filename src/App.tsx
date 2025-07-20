import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import deepSeekService from './services/deepseekService';
import LoadingScreen from './components/LoadingScreen';
import MusicPlayer from './components/MusicPlayer';
import MiniMusicPlayer from './components/MiniMusicPlayer';
import EmotionTracker from './components/EmotionTracker';
import AchievementSystem from './components/AchievementSystem';
import ThemeSelector from './components/ThemeSelector';
import EmergencyKit from './components/EmergencyKit';
import { useDevice } from './hooks/useDevice';
import { useOrientation } from './hooks/useOrientation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  agent?: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  prompt: string;
}

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

const agents: Agent[] = [
  {
    id: 'chistes',
    name: 'Agente de Chistes',
    description: 'Te cuenta chistes divertidos para alegrar tu día',
    icon: '😄',
    color: '#f59e0b',
    prompt: 'Eres un agente especializado en contar chistes divertidos y amigables. Tu objetivo es hacer reír a personas introvertidas con humor positivo y apropiado. Responde de manera cálida y amigable.'
  },
  {
    id: 'social',
    name: 'Agente Social',
    description: 'Te ayuda a acercarte a las personas y mejorar tus habilidades sociales',
    icon: '🤝',
    color: '#10b981',
    prompt: 'Eres un agente especializado en ayudar a personas introvertidas a mejorar sus habilidades sociales. Proporcionas consejos prácticos, técnicas de conversación y estrategias para acercarse a las personas de manera auténtica y cómoda.'
  },
  {
    id: 'animo',
    name: 'Agente de Ánimo',
    description: 'Te anima cuando te sientes decaído o triste',
    icon: '💪',
    color: '#ef4444',
    prompt: 'Eres un agente especializado en levantar el ánimo de personas que se sienten decaídas o tristes. Proporcionas palabras de aliento, consejos motivacionales y apoyo emocional de manera empática y comprensiva.'
  }
];

function App() {
  // Hooks para detección de dispositivo y orientación
  const deviceInfo = useDevice();
  const orientation = useOrientation();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMiniPlayerMinimized, setIsMiniPlayerMinimized] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'emotions' | 'achievements' | 'themes' | 'emergency'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);





  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'assistant', agent?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      agent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !selectedAgent) return;

    const userMessage = inputText;
    setInputText('');
    setIsLoading(true);

    // Agregar mensaje del usuario
    addMessage(userMessage, 'user');

    try {
      // Llamar al servicio de DeepSeek
      const response = await deepSeekService.sendMessage(userMessage, selectedAgent.prompt);
      
      // Agregar respuesta del asistente
      addMessage(response, 'assistant', selectedAgent.id);
    } catch (error) {
      addMessage('Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?', 'assistant');
    } finally {
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleLoadingComplete = () => {
    setIsAppLoaded(true);
  };

  // Funciones para manejar la música
  const handleMusicPlaylistSelect = (playlist: Playlist, video: Video) => {
    setCurrentPlaylist(playlist);
    setCurrentVideo(video);
    setIsPlaying(true);
    setCurrentTrackIndex(playlist.videos.findIndex(v => v.id === video.id));
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleNextTrack = () => {
    if (currentPlaylist) {
      const nextIndex = (currentTrackIndex + 1) % currentPlaylist.videos.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentVideo(currentPlaylist.videos[nextIndex]);
    }
  };

  const handlePreviousTrack = () => {
    if (currentPlaylist) {
      const prevIndex = currentTrackIndex === 0 ? currentPlaylist.videos.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentVideo(currentPlaylist.videos[prevIndex]);
    }
  };

  const handleOpenFullPlayer = () => {
    setIsMusicPlayerVisible(true);
  };

  const handleMinimizeMiniPlayer = () => {
    setIsMiniPlayerMinimized(true);
  };

  if (!isAppLoaded) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`App ${deviceInfo.isMobile ? 'mobile' : ''} ${deviceInfo.isTablet ? 'tablet' : ''} ${orientation.isPortrait ? 'portrait' : 'landscape'}`}>
      <header className="app-header">
        <h1>🤖 Asistente IA para Introvertidos</h1>
        <p>Tu compañero personal para momentos difíciles</p>
        <div className="header-controls">
          <button 
            className="music-button"
            onClick={() => setIsMusicPlayerVisible(true)}
            title="Abrir reproductor de música"
          >
            🎵 Música
          </button>
          <button 
            className="emergency-button"
            onClick={() => setCurrentView('emergency')}
            title="Kit de Emergencia"
          >
            🆘 Emergencia
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', width: '100%', height: '100%' }}>
        <div className="navigation-panel">
          <div className="nav-buttons">
            <button 
              className={`nav-btn ${currentView === 'chat' ? 'active' : ''}`}
              onClick={() => setCurrentView('chat')}
            >
              💬 Chat
            </button>
            <button 
              className={`nav-btn ${currentView === 'emotions' ? 'active' : ''}`}
              onClick={() => setCurrentView('emotions')}
            >
              📊 Emociones
            </button>
            <button 
              className={`nav-btn ${currentView === 'achievements' ? 'active' : ''}`}
              onClick={() => setCurrentView('achievements')}
            >
              🏆 Logros
            </button>
            <button 
              className={`nav-btn ${currentView === 'themes' ? 'active' : ''}`}
              onClick={() => setCurrentView('themes')}
            >
              🎨 Temas
            </button>
          </div>
        </div>

        <div className="main-container">
          {currentView === 'chat' && (
            <div style={{ display: 'flex', gap: '2rem', width: '100%', height: '100%' }}>
              <div className="agents-panel">
                <h3>Agentes Especializados</h3>
                <div className="agents-grid">
                  {agents.map(agent => (
                    <button
                      key={agent.id}
                      className={`agent-card ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAgent(agent)}
                      style={{ borderColor: agent.color }}
                    >
                      <div className="agent-icon" style={{ backgroundColor: agent.color }}>
                        {agent.icon}
                      </div>
                      <div className="agent-info">
                        <h4>{agent.name}</h4>
                        <p>{agent.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div 
                className={`chat-container ${!selectedAgent ? 'no-agent' : ''}`}
                style={{ 
                  flex: 1, 
                  minHeight: '500px'
                }}
              >
                <div className="chat-header">
                  <h3>
                    {selectedAgent ? (
                      <>
                        {selectedAgent.icon} {selectedAgent.name}
                      </>
                    ) : (
                      '🤖 Selecciona un Agente'
                    )}
                  </h3>
                  {selectedAgent && (
                    <p className="agent-description">{selectedAgent.description}</p>
                  )}
                </div>

                <div className="messages-container">
                  {!selectedAgent ? (
                    <div className="welcome-message">
                      <h2>¡Hola! Soy tu asistente personal 🤖</h2>
                      <p>Me alegra mucho que estés aquí. Estoy diseñado especialmente para personas introvertidas como tú, y tengo 3 agentes especializados que pueden ayudarte en diferentes aspectos de tu vida.</p>
                      <p>Para comenzar, selecciona uno de mis agentes:</p>
                      <ul>
                        <li><strong>Agente de Chistes</strong> - Para alegrar tu día con humor positivo</li>
                        <li><strong>Agente Social</strong> - Para mejorar tus habilidades sociales</li>
                        <li><strong>Agente de Ánimo</strong> - Para cuando te sientas decaído</li>
                      </ul>
                      <p>Recuerda: <strong>Está bien ser introvertido</strong> y cada persona es única y valiosa. ¿Con cuál de mis agentes te gustaría hablar?</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="welcome-message">
                      <h2>¡Perfecto! Has seleccionado a {selectedAgent.name} {selectedAgent.icon}</h2>
                      <p>Este agente está especializado en {selectedAgent.description.toLowerCase()}.</p>
                      <p>Puedes contarle lo que quieras y te ayudará de manera específica y personalizada.</p>
                      <p>¿En qué puedo ayudarte hoy?</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
                      >
                        <div className="message-content">
                          <div className="message-text">{message.text}</div>
                          <div className="message-time">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                        {message.agent && (
                          <div className="message-agent">
                            {agents.find(a => a.id === message.agent)?.icon}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="message assistant-message">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="input-container">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedAgent ? "Escribe tu mensaje aquí..." : "Selecciona un agente para comenzar..."}
                    disabled={isLoading || !selectedAgent}
                    rows={1}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim() || isLoading || !selectedAgent}
                    className="send-button"
                  >
                    {isLoading ? '⏳' : '📤'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentView === 'emotions' && (
            <div className="content-container">
              <div className="back-button-container">
                <button 
                  className="back-button"
                  onClick={() => setCurrentView('chat')}
                >
                  ← Volver al Chat
                </button>
              </div>
              <EmotionTracker />
            </div>
          )}

          {currentView === 'achievements' && (
            <div className="content-container">
              <div className="back-button-container">
                <button 
                  className="back-button"
                  onClick={() => setCurrentView('chat')}
                >
                  ← Volver al Chat
                </button>
              </div>
              <AchievementSystem />
            </div>
          )}

          {currentView === 'themes' && (
            <div className="content-container">
              <div className="back-button-container">
                <button 
                  className="back-button"
                  onClick={() => setCurrentView('chat')}
                >
                  ← Volver al Chat
                </button>
              </div>
              <ThemeSelector />
            </div>
          )}

          {currentView === 'emergency' && (
            <div className="content-container">
              <div className="back-button-container">
                <button 
                  className="back-button"
                  onClick={() => setCurrentView('chat')}
                >
                  ← Volver al Chat
                </button>
              </div>
              <EmergencyKit />
            </div>
          )}
        </div>
      </div>
      
      <MusicPlayer 
        isVisible={isMusicPlayerVisible}
        onClose={() => setIsMusicPlayerVisible(false)}
        onPlaylistSelect={handleMusicPlaylistSelect}
        currentVideo={currentVideo}
        currentPlaylist={currentPlaylist}
        isPlaying={isPlaying}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onVolumeChange={handleVolumeChange}
        onNextTrack={handleNextTrack}
        onPreviousTrack={handlePreviousTrack}
      />
      
      {!isMiniPlayerMinimized && (
        <MiniMusicPlayer
          currentVideo={currentVideo}
          isPlaying={isPlaying}
          volume={volume}
          onTogglePlay={handleTogglePlay}
          onVolumeChange={handleVolumeChange}
          onNextTrack={handleNextTrack}
          onPreviousTrack={handlePreviousTrack}
          onOpenFullPlayer={handleOpenFullPlayer}
          onMinimize={handleMinimizeMiniPlayer}
          playlist={currentPlaylist}
        />
      )}
      
      {isMiniPlayerMinimized && currentVideo && (
        <button 
          className="restore-music-btn"
          onClick={() => setIsMiniPlayerMinimized(false)}
          title="Restaurar reproductor de música"
        >
          🎵
        </button>
      )}
    </div>
  );
}

export default App;
