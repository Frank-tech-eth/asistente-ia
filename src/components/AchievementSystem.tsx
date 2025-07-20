import React, { useState, useEffect } from 'react';
import './AchievementSystem.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'chat' | 'emotions' | 'music' | 'streak' | 'social';
  requirement: number;
  current: number;
  completed: boolean;
  completedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalMessages: number;
  totalEmotions: number;
  totalMusicTime: number;
  currentStreak: number;
  longestStreak: number;
  socialInteractions: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

const achievements: Achievement[] = [
  // Logros de Chat
  {
    id: 'first-chat',
    title: 'Primera Conversación',
    description: 'Completa tu primera conversación con un agente',
    icon: '💬',
    color: '#10b981',
    category: 'chat',
    requirement: 1,
    current: 0,
    completed: false,
    rarity: 'common'
  },
  {
    id: 'chat-master',
    title: 'Maestro del Chat',
    description: 'Completa 50 conversaciones',
    icon: '🎯',
    color: '#6366f1',
    category: 'chat',
    requirement: 50,
    current: 0,
    completed: false,
    rarity: 'rare'
  },
  {
    id: 'social-butterfly',
    title: 'Mariposa Social',
    description: 'Completa 100 conversaciones',
    icon: '🦋',
    color: '#ec4899',
    category: 'chat',
    requirement: 100,
    current: 0,
    completed: false,
    rarity: 'epic'
  },
  
  // Logros de Emociones
  {
    id: 'emotion-tracker',
    title: 'Rastreador de Emociones',
    description: 'Registra tu primera emoción',
    icon: '📊',
    color: '#f59e0b',
    category: 'emotions',
    requirement: 1,
    current: 0,
    completed: false,
    rarity: 'common'
  },
  {
    id: 'emotion-master',
    title: 'Maestro de las Emociones',
    description: 'Registra 30 emociones diferentes',
    icon: '🧠',
    color: '#8b5cf6',
    category: 'emotions',
    requirement: 30,
    current: 0,
    completed: false,
    rarity: 'rare'
  },
  {
    id: 'emotion-scientist',
    title: 'Científico de Emociones',
    description: 'Registra 100 emociones',
    icon: '🔬',
    color: '#ef4444',
    category: 'emotions',
    requirement: 100,
    current: 0,
    completed: false,
    rarity: 'epic'
  },
  
  // Logros de Música
  {
    id: 'music-lover',
    title: 'Amante de la Música',
    description: 'Escucha música por primera vez',
    icon: '🎵',
    color: '#3b82f6',
    category: 'music',
    requirement: 1,
    current: 0,
    completed: false,
    rarity: 'common'
  },
  {
    id: 'music-connoisseur',
    title: 'Conocedor Musical',
    description: 'Escucha música por 60 minutos',
    icon: '🎧',
    color: '#06b6d4',
    category: 'music',
    requirement: 60,
    current: 0,
    completed: false,
    rarity: 'rare'
  },
  
  // Logros de Racha
  {
    id: 'week-warrior',
    title: 'Guerrero de la Semana',
    description: 'Usa la app 7 días seguidos',
    icon: '🔥',
    color: '#f97316',
    category: 'streak',
    requirement: 7,
    current: 0,
    completed: false,
    rarity: 'rare'
  },
  {
    id: 'month-master',
    title: 'Maestro del Mes',
    description: 'Usa la app 30 días seguidos',
    icon: '👑',
    color: '#fbbf24',
    category: 'streak',
    requirement: 30,
    current: 0,
    completed: false,
    rarity: 'epic'
  },
  {
    id: 'legendary-streak',
    title: 'Racha Legendaria',
    description: 'Usa la app 100 días seguidos',
    icon: '⚡',
    color: '#a855f7',
    category: 'streak',
    requirement: 100,
    current: 0,
    completed: false,
    rarity: 'legendary'
  },
  
  // Logros Sociales
  {
    id: 'social-novice',
    title: 'Novato Social',
    description: 'Completa 10 conversaciones sociales',
    icon: '🤝',
    color: '#10b981',
    category: 'social',
    requirement: 10,
    current: 0,
    completed: false,
    rarity: 'common'
  },
  {
    id: 'social-expert',
    title: 'Experto Social',
    description: 'Completa 50 conversaciones sociales',
    icon: '🌟',
    color: '#f59e0b',
    category: 'social',
    requirement: 50,
    current: 0,
    completed: false,
    rarity: 'epic'
  }
];

const AchievementSystem: React.FC = () => {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [userStats, setUserStats] = useState<UserStats>({
    totalMessages: 0,
    totalEmotions: 0,
    totalMusicTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    socialInteractions: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    saveUserData();
    checkAchievements();
  }, [userStats, userAchievements]);

  const loadUserData = () => {
    const savedStats = localStorage.getItem('userStats');
    const savedAchievements = localStorage.getItem('userAchievements');
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    if (savedAchievements) {
      setUserAchievements(JSON.parse(savedAchievements).map((achievement: any) => ({
        ...achievement,
        completedDate: achievement.completedDate ? new Date(achievement.completedDate) : undefined
      })));
    }
  };

  const saveUserData = () => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
  };

  const checkAchievements = () => {
    const updatedAchievements = userAchievements.map(achievement => {
      let current = 0;
      
      switch (achievement.category) {
        case 'chat':
          current = userStats.totalMessages;
          break;
        case 'emotions':
          current = userStats.totalEmotions;
          break;
        case 'music':
          current = userStats.totalMusicTime;
          break;
        case 'streak':
          current = userStats.currentStreak;
          break;
        case 'social':
          current = userStats.socialInteractions;
          break;
      }
      
      const completed = current >= achievement.requirement && !achievement.completed;
      
      if (completed) {
        const newAchievement = {
          ...achievement,
          current,
          completed: true,
          completedDate: new Date()
        };
        
        // Mostrar notificación
        setTimeout(() => {
          setShowNotification(newAchievement);
          setTimeout(() => setShowNotification(null), 5000);
        }, 100);
        
        // Dar experiencia
        const expGained = getExpForAchievement(achievement.rarity);
        addExperience(expGained);
        
        return newAchievement;
      }
      
      return { ...achievement, current };
    });
    
    setUserAchievements(updatedAchievements);
  };

  const getExpForAchievement = (rarity: string) => {
    switch (rarity) {
      case 'common': return 10;
      case 'rare': return 25;
      case 'epic': return 50;
      case 'legendary': return 100;
      default: return 10;
    }
  };

  const addExperience = (exp: number) => {
    const newExp = userStats.experience + exp;
    const newLevel = Math.floor(newExp / userStats.experienceToNext) + 1;
    const newExpToNext = newLevel * 100;
    
    setUserStats(prev => ({
      ...prev,
      experience: newExp,
      level: newLevel,
      experienceToNext: newExpToNext
    }));
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') {
      return userAchievements;
    }
    return userAchievements.filter(achievement => achievement.category === selectedCategory);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#fbbf24';
      default: return '#6b7280';
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.current / achievement.requirement) * 100, 100);
  };

  const completedAchievements = userAchievements.filter(a => a.completed).length;
  const totalAchievements = userAchievements.length;

  return (
    <div className="achievement-system">
      <div className="achievement-header">
        <h2>🏆 Sistema de Logros</h2>
        <div className="user-level">
          <div className="level-info">
            <span className="level-number">Nivel {userStats.level}</span>
            <div className="exp-bar">
              <div 
                className="exp-fill"
                style={{ width: `${(userStats.experience % userStats.experienceToNext) / userStats.experienceToNext * 100}%` }}
              />
            </div>
            <span className="exp-text">
              {userStats.experience % userStats.experienceToNext} / {userStats.experienceToNext} EXP
            </span>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span className="stat-value">{userStats.totalMessages}</span>
          <span className="stat-label">Mensajes</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{userStats.totalEmotions}</span>
          <span className="stat-label">Emociones</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎵</span>
          <span className="stat-value">{userStats.totalMusicTime}m</span>
          <span className="stat-label">Música</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{userStats.currentStreak}</span>
          <span className="stat-label">Racha</span>
        </div>
      </div>

      <div className="achievement-progress">
        <h3>Progreso: {completedAchievements}/{totalAchievements} logros completados</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(completedAchievements / totalAchievements) * 100}%` }}
          />
        </div>
      </div>

      <div className="category-filters">
        <button 
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Todos
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'chat' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('chat')}
        >
          💬 Chat
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'emotions' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('emotions')}
        >
          📊 Emociones
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'music' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('music')}
        >
          🎵 Música
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'streak' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('streak')}
        >
          🔥 Racha
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'social' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('social')}
        >
          🤝 Social
        </button>
      </div>

      <div className="achievements-grid">
        {getFilteredAchievements().map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.completed ? 'completed' : ''}`}
            style={{ borderColor: getRarityColor(achievement.rarity) }}
          >
            <div className="achievement-icon" style={{ color: achievement.color }}>
              {achievement.icon}
            </div>
            <div className="achievement-info">
              <h4 className="achievement-title">{achievement.title}</h4>
              <p className="achievement-description">{achievement.description}</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${getProgressPercentage(achievement)}%`,
                      backgroundColor: achievement.color
                    }}
                  />
                </div>
                <span className="progress-text">
                  {achievement.current}/{achievement.requirement}
                </span>
              </div>
              {achievement.completed && (
                <div className="completion-date">
                  Completado: {achievement.completedDate?.toLocaleDateString('es-ES')}
                </div>
              )}
            </div>
            <div className="rarity-badge" style={{ backgroundColor: getRarityColor(achievement.rarity) }}>
              {achievement.rarity.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {showNotification && (
        <div className="achievement-notification">
          <div className="notification-content">
            <div className="notification-icon">{showNotification.icon}</div>
            <div className="notification-text">
              <h4>¡Logro Desbloqueado!</h4>
              <p>{showNotification.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem; 