import React, { useState, useEffect } from 'react';
import './ThemeSelector.css';

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    background: string;
    primary: string;
    secondary: string;
  };
}

const themes: Theme[] = [
  {
    id: 'dark-purple',
    name: 'Púrpura Oscuro',
    description: 'Tema principal con tonos púrpura y azul',
    icon: '🌙',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#e2e8f0',
      textSecondary: '#94a3b8'
    },
    gradients: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      primary: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      secondary: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Océano Azul',
    description: 'Tema relajante con tonos azules del océano',
    icon: '🌊',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: '#0c1e35',
      surface: '#1e3a8a',
      text: '#e0f2fe',
      textSecondary: '#bae6fd'
    },
    gradients: {
      background: 'linear-gradient(135deg, #0c1e35 0%, #1e3a8a 50%, #1e40af 100%)',
      primary: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      secondary: 'linear-gradient(135deg, #0ea5e9, #0284c7, #06b6d4)'
    }
  },
  {
    id: 'forest-green',
    name: 'Bosque Verde',
    description: 'Tema natural con tonos verdes del bosque',
    icon: '🌲',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#064e3b',
      surface: '#065f46',
      text: '#d1fae5',
      textSecondary: '#a7f3d0'
    },
    gradients: {
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      primary: 'linear-gradient(135deg, #10b981, #059669)',
      secondary: 'linear-gradient(135deg, #10b981, #059669, #34d399)'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Atardecer Naranja',
    description: 'Tema cálido con tonos de atardecer',
    icon: '🌅',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#451a03',
      surface: '#7c2d12',
      text: '#fed7aa',
      textSecondary: '#fdba74'
    },
    gradients: {
      background: 'linear-gradient(135deg, #451a03 0%, #7c2d12 50%, #9a3412 100%)',
      primary: 'linear-gradient(135deg, #f97316, #ea580c)',
      secondary: 'linear-gradient(135deg, #f97316, #ea580c, #fb923c)'
    }
  },
  {
    id: 'rose-pink',
    name: 'Rosa Melancólico',
    description: 'Tema suave con tonos rosas y púrpuras',
    icon: '🌸',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      background: '#4c0519',
      surface: '#831843',
      text: '#fce7f3',
      textSecondary: '#fbcfe8'
    },
    gradients: {
      background: 'linear-gradient(135deg, #4c0519 0%, #831843 50%, #be185d 100%)',
      primary: 'linear-gradient(135deg, #ec4899, #db2777)',
      secondary: 'linear-gradient(135deg, #ec4899, #db2777, #f472b6)'
    }
  },
  {
    id: 'midnight-black',
    name: 'Medianoche Negra',
    description: 'Tema minimalista en negro puro',
    icon: '⚫',
    colors: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#9ca3af',
      background: '#000000',
      surface: '#111827',
      text: '#f9fafb',
      textSecondary: '#d1d5db'
    },
    gradients: {
      background: 'linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%)',
      primary: 'linear-gradient(135deg, #6b7280, #4b5563)',
      secondary: 'linear-gradient(135deg, #6b7280, #4b5563, #9ca3af)'
    }
  },
  {
    id: 'aurora-northern',
    name: 'Aurora Boreal',
    description: 'Tema mágico con colores de aurora boreal',
    icon: '🌌',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#22d3ee',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#e0f2fe',
      textSecondary: '#bae6fd'
    },
    gradients: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      primary: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      secondary: 'linear-gradient(135deg, #06b6d4, #0891b2, #22d3ee)'
    }
  },
  {
    id: 'golden-hour',
    name: 'Hora Dorada',
    description: 'Tema cálido con tonos dorados',
    icon: '✨',
    colors: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#fcd34d',
      background: '#451a03',
      surface: '#78350f',
      text: '#fef3c7',
      textSecondary: '#fde68a'
    },
    gradients: {
      background: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)',
      primary: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      secondary: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fcd34d)'
    }
  }
];

const ThemeSelector: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('dark-purple');
  const [showPreview, setShowPreview] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--surface-color', theme.colors.surface);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--text-secondary-color', theme.colors.textSecondary);
    root.style.setProperty('--background-gradient', theme.gradients.background);
    root.style.setProperty('--primary-gradient', theme.gradients.primary);
    root.style.setProperty('--secondary-gradient', theme.gradients.secondary);
    
    localStorage.setItem('selectedTheme', themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
  };

  const handleCustomColorChange = (colorType: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const applyCustomTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', customColors.primary);
    root.style.setProperty('--secondary-color', customColors.secondary);
    root.style.setProperty('--accent-color', customColors.accent);
    
    localStorage.setItem('customColors', JSON.stringify(customColors));
    localStorage.setItem('selectedTheme', 'custom');
  };

  const resetToDefault = () => {
    handleThemeChange('dark-purple');
  };

  return (
    <div className="theme-selector">
      <div className="theme-header">
        <h2>🎨 Selector de Temas</h2>
        <p>Personaliza la apariencia de tu asistente IA</p>
      </div>

      <div className="theme-controls">
        <button 
          className="control-btn"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? '👁️ Ocultar Vista Previa' : '👁️ Mostrar Vista Previa'}
        </button>
        <button 
          className="control-btn reset-btn"
          onClick={resetToDefault}
        >
          🔄 Restablecer
        </button>
      </div>

      {showPreview && (
        <div className="theme-preview">
          <h3>Vista Previa del Tema</h3>
          <div className="preview-container">
            <div className="preview-header">
              <h4>🤖 Asistente IA para Introvertidos</h4>
              <p>Tu compañero personal para momentos difíciles</p>
            </div>
            <div className="preview-content">
              <div className="preview-panel">
                <h5>Agentes Especializados</h5>
                <div className="preview-agent">
                  <span className="preview-icon">😄</span>
                  <div>
                    <strong>Agente de Chistes</strong>
                    <p>Te cuenta chistes divertidos</p>
                  </div>
                </div>
              </div>
              <div className="preview-chat">
                <div className="preview-message user">
                  <p>Hola, ¿cómo estás?</p>
                </div>
                <div className="preview-message assistant">
                  <p>¡Hola! Estoy muy bien, gracias por preguntar 😊</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="themes-grid">
        {themes.map(theme => (
          <div 
            key={theme.id}
            className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
            onClick={() => handleThemeChange(theme.id)}
          >
            <div className="theme-icon">{theme.icon}</div>
            <div className="theme-info">
              <h4>{theme.name}</h4>
              <p>{theme.description}</p>
            </div>
            <div className="theme-colors">
              <div 
                className="color-preview"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="color-preview"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="color-preview"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="custom-theme">
        <h3>🎨 Tema Personalizado</h3>
        <p>Crea tu propio tema con colores únicos</p>
        
        <div className="color-inputs">
          <div className="color-input">
            <label>Color Primario:</label>
            <input
              type="color"
              value={customColors.primary}
              onChange={(e) => handleCustomColorChange('primary', e.target.value)}
            />
            <span>{customColors.primary}</span>
          </div>
          
          <div className="color-input">
            <label>Color Secundario:</label>
            <input
              type="color"
              value={customColors.secondary}
              onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
            />
            <span>{customColors.secondary}</span>
          </div>
          
          <div className="color-input">
            <label>Color de Acento:</label>
            <input
              type="color"
              value={customColors.accent}
              onChange={(e) => handleCustomColorChange('accent', e.target.value)}
            />
            <span>{customColors.accent}</span>
          </div>
        </div>
        
        <button className="apply-custom-btn" onClick={applyCustomTheme}>
          ✨ Aplicar Tema Personalizado
        </button>
      </div>

      <div className="theme-info">
        <h3>💡 Consejos</h3>
        <ul>
          <li>Los temas se guardan automáticamente en tu dispositivo</li>
          <li>Puedes crear temas personalizados con tus colores favoritos</li>
          <li>Algunos temas son mejores para usar de día o de noche</li>
          <li>El tema se aplica a toda la aplicación instantáneamente</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeSelector; 