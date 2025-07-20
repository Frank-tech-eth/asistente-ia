import React, { useState, useEffect } from 'react';
import './EmotionTracker.css';

interface EmotionEntry {
  id: string;
  date: Date;
  emotion: string;
  intensity: number;
  notes: string;
  activities: string[];
}

interface EmotionData {
  [key: string]: number;
}

const emotions = [
  { id: 'feliz', label: '😊 Feliz', color: '#10b981' },
  { id: 'tranquilo', label: '😌 Tranquilo', color: '#6366f1' },
  { id: 'neutral', label: '😐 Neutral', color: '#6b7280' },
  { id: 'ansioso', label: '😰 Ansioso', color: '#f59e0b' },
  { id: 'triste', label: '😢 Triste', color: '#3b82f6' },
  { id: 'enojado', label: '😠 Enojado', color: '#ef4444' },
  { id: 'emocionado', label: '🤩 Emocionado', color: '#ec4899' },
  { id: 'agotado', label: '😴 Agotado', color: '#8b5cf6' }
];

const activities = [
  'Ejercicio', 'Lectura', 'Música', 'Meditación', 'Socializar',
  'Trabajo', 'Estudio', 'Cine/TV', 'Cocinar', 'Pasear',
  'Juegos', 'Arte', 'Naturaleza', 'Tecnología', 'Descanso'
];

const EmotionTracker: React.FC = () => {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'chart' | 'stats'>('form');

  useEffect(() => {
    const savedEntries = localStorage.getItem('emotionEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('emotionEntries', JSON.stringify(entries));
  }, [entries]);

  const addEmotionEntry = () => {
    if (!selectedEmotion) return;

    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      date: new Date(),
      emotion: selectedEmotion,
      intensity,
      notes,
      activities: selectedActivities
    };

    setEntries(prev => [newEntry, ...prev]);
    setSelectedEmotion('');
    setIntensity(5);
    setNotes('');
    setSelectedActivities([]);
    setShowForm(false);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const getEmotionStats = () => {
    const last7Days = entries.filter(entry => {
      const daysDiff = (Date.now() - entry.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const emotionCount: EmotionData = {};
    const avgIntensity = last7Days.reduce((sum, entry) => sum + entry.intensity, 0) / last7Days.length || 0;

    last7Days.forEach(entry => {
      emotionCount[entry.emotion] = (emotionCount[entry.emotion] || 0) + 1;
    });

    return { emotionCount, avgIntensity, totalEntries: last7Days.length };
  };

  const getEmotionColor = (emotionId: string) => {
    return emotions.find(e => e.id === emotionId)?.color || '#6b7280';
  };

  const getEmotionLabel = (emotionId: string) => {
    return emotions.find(e => e.id === emotionId)?.label || emotionId;
  };

  const stats = getEmotionStats();

  return (
    <div className="emotion-tracker">
      <div className="emotion-header">
        <h2>📊 Tracker de Emociones</h2>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'form' ? 'active' : ''}`}
            onClick={() => setViewMode('form')}
          >
            📝 Registrar
          </button>
          <button 
            className={`view-btn ${viewMode === 'chart' ? 'active' : ''}`}
            onClick={() => setViewMode('chart')}
          >
            📈 Gráficos
          </button>
          <button 
            className={`view-btn ${viewMode === 'stats' ? 'active' : ''}`}
            onClick={() => setViewMode('stats')}
          >
            📊 Estadísticas
          </button>
        </div>
      </div>

      {viewMode === 'form' && (
        <div className="emotion-form">
          <div className="emotion-grid">
            {emotions.map(emotion => (
              <button
                key={emotion.id}
                className={`emotion-btn ${selectedEmotion === emotion.id ? 'selected' : ''}`}
                onClick={() => setSelectedEmotion(emotion.id)}
                style={{ borderColor: emotion.color }}
              >
                <span className="emotion-icon">{emotion.label.split(' ')[0]}</span>
                <span className="emotion-name">{emotion.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {selectedEmotion && (
            <div className="emotion-details">
              <div className="intensity-slider">
                <label>Intensidad: {intensity}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="activities-section">
                <label>Actividades del día:</label>
                <div className="activities-grid">
                  {activities.map(activity => (
                    <button
                      key={activity}
                      className={`activity-btn ${selectedActivities.includes(activity) ? 'selected' : ''}`}
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="notes-section">
                <label>Notas adicionales:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="¿Cómo te sientes hoy? ¿Qué pasó?"
                  rows={3}
                />
              </div>

              <button className="save-btn" onClick={addEmotionEntry}>
                💾 Guardar Entrada
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'chart' && (
        <div className="emotion-chart">
          <h3>Últimos 7 días</h3>
          <div className="chart-container">
            {Object.entries(stats.emotionCount).map(([emotion, count]) => (
              <div key={emotion} className="chart-bar">
                <div className="bar-label">{getEmotionLabel(emotion)}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(count / stats.totalEntries) * 100}%`,
                      backgroundColor: getEmotionColor(emotion)
                    }}
                  />
                </div>
                <div className="bar-value">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'stats' && (
        <div className="emotion-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h4>📅 Entradas esta semana</h4>
              <div className="stat-value">{stats.totalEntries}</div>
            </div>
            <div className="stat-card">
              <h4>⚡ Intensidad promedio</h4>
              <div className="stat-value">{stats.avgIntensity.toFixed(1)}/10</div>
            </div>
            <div className="stat-card">
              <h4>😊 Emoción más frecuente</h4>
              <div className="stat-value">
                {Object.entries(stats.emotionCount).length > 0 
                  ? getEmotionLabel(Object.entries(stats.emotionCount).sort((a, b) => b[1] - a[1])[0][0])
                  : 'Sin datos'
                }
              </div>
            </div>
          </div>

          <div className="recent-entries">
            <h4>📝 Entradas Recientes</h4>
            <div className="entries-list">
              {entries.slice(0, 5).map(entry => (
                <div key={entry.id} className="entry-item">
                  <div className="entry-header">
                    <span className="entry-emotion">
                      {getEmotionLabel(entry.emotion)}
                    </span>
                    <span className="entry-date">
                      {entry.date.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="entry-details">
                    <span className="entry-intensity">Intensidad: {entry.intensity}/10</span>
                    {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionTracker; 