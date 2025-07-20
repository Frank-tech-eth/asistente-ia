import React, { useState, useEffect, useRef } from 'react';
import './EmergencyKit.css';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  color: string;
}

interface GroundingExercise {
  id: string;
  name: string;
  description: string;
  steps: string[];
  icon: string;
  color: string;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'Respiración Cuadrada',
    description: 'Técnica militar para calmar la ansiedad rápidamente',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 5,
    color: '#6366f1'
  },
  {
    id: '4-7-8',
    name: 'Respiración 4-7-8',
    description: 'Método del Dr. Weil para inducir relajación',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
    color: '#10b981'
  },
  {
    id: 'triangle-breathing',
    name: 'Respiración Triangular',
    description: 'Respiración equilibrada para centrarse',
    inhale: 3,
    hold: 3,
    exhale: 3,
    cycles: 6,
    color: '#f59e0b'
  },
  {
    id: 'extended-exhale',
    name: 'Exhalación Extendida',
    description: 'Respiración que activa el sistema parasimpático',
    inhale: 4,
    hold: 0,
    exhale: 8,
    cycles: 5,
    color: '#ec4899'
  }
];

const groundingExercises: GroundingExercise[] = [
  {
    id: '5-4-3-2-1',
    name: 'Técnica 5-4-3-2-1',
    description: 'Usa tus sentidos para conectarte con el presente',
    steps: [
      '5 cosas que puedes VER',
      '4 cosas que puedes TOCAR',
      '3 cosas que puedes ESCUCHAR',
      '2 cosas que puedes OLER',
      '1 cosa que puedes SABOREAR'
    ],
    icon: '👁️',
    color: '#8b5cf6'
  },
  {
    id: 'body-scan',
    name: 'Escaneo Corporal',
    description: 'Conecta con cada parte de tu cuerpo',
    steps: [
      'Dedos de los pies',
      'Pies y tobillos',
      'Pantorrillas',
      'Muslos',
      'Caderas',
      'Abdomen',
      'Pecho',
      'Hombros',
      'Brazos',
      'Manos',
      'Cuello',
      'Cara'
    ],
    icon: '🧘',
    color: '#06b6d4'
  },
  {
    id: 'temperature',
    name: 'Temperatura y Textura',
    description: 'Enfócate en sensaciones físicas',
    steps: [
      'Toca algo frío (hielo, metal)',
      'Toca algo caliente (taza de té)',
      'Toca algo suave (tela, peluche)',
      'Toca algo áspero (papel de lija)',
      'Toca algo liso (vidrio, plástico)'
    ],
    icon: '🌡️',
    color: '#f97316'
  },
  {
    id: 'counting',
    name: 'Conteo Regresivo',
    description: 'Cuenta hacia atrás para distraer tu mente',
    steps: [
      'Cuenta de 100 a 0 de 3 en 3',
      'Cuenta de 50 a 0 de 2 en 2',
      'Cuenta de 20 a 0 de 1 en 1',
      'Cuenta de 10 a 0 muy lentamente'
    ],
    icon: '🔢',
    color: '#ef4444'
  }
];

const EmergencyKit: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTime, setBreathingTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [isGroundingActive, setIsGroundingActive] = useState(false);
  const [showEmergencyButton, setShowEmergencyButton] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState('');

  const breathingInterval = useRef<NodeJS.Timeout | null>(null);
  const groundingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadEmergencyContacts();
    
    // Mostrar botón de emergencia después de 3 segundos
    const timer = setTimeout(() => {
      setShowEmergencyButton(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (breathingInterval.current) clearInterval(breathingInterval.current);
      if (groundingInterval.current) clearInterval(groundingInterval.current);
    };
  }, []);

  const loadEmergencyContacts = () => {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setEmergencyContacts(JSON.parse(saved));
    }
  };

  const saveEmergencyContacts = (contacts: string[]) => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  };

  const startBreathingExercise = (exerciseId: string) => {
    const exercise = breathingExercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    setActiveExercise(exerciseId);
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingTime(exercise.inhale);
    setCurrentCycle(1);

    breathingInterval.current = setInterval(() => {
      setBreathingTime(prev => {
        if (prev <= 1) {
          // Cambiar fase
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold');
            return exercise.hold;
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale');
            return exercise.exhale;
          } else {
            // Completar ciclo
            if (currentCycle >= exercise.cycles) {
              stopBreathingExercise();
              return 0;
            } else {
              setCurrentCycle(prev => prev + 1);
              setBreathingPhase('inhale');
              return exercise.inhale;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopBreathingExercise = () => {
    setIsBreathingActive(false);
    setActiveExercise(null);
    if (breathingInterval.current) {
      clearInterval(breathingInterval.current);
      breathingInterval.current = null;
    }
  };

  const startGroundingExercise = (exerciseId: string) => {
    const exercise = groundingExercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    setActiveExercise(exerciseId);
    setIsGroundingActive(true);
    setGroundingStep(0);

    groundingInterval.current = setInterval(() => {
      setGroundingStep(prev => {
        if (prev >= exercise.steps.length - 1) {
          stopGroundingExercise();
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const stopGroundingExercise = () => {
    setIsGroundingActive(false);
    setActiveExercise(null);
    if (groundingInterval.current) {
      clearInterval(groundingInterval.current);
      groundingInterval.current = null;
    }
  };

  const addEmergencyContact = () => {
    if (newContact.trim() && !emergencyContacts.includes(newContact.trim())) {
      const updatedContacts = [...emergencyContacts, newContact.trim()];
      setEmergencyContacts(updatedContacts);
      saveEmergencyContacts(updatedContacts);
      setNewContact('');
    }
  };

  const removeEmergencyContact = (contact: string) => {
    const updatedContacts = emergencyContacts.filter(c => c !== contact);
    setEmergencyContacts(updatedContacts);
    saveEmergencyContacts(updatedContacts);
  };

  const getCurrentExercise = () => {
    if (activeExercise) {
      return breathingExercises.find(e => e.id === activeExercise) || 
             groundingExercises.find(e => e.id === activeExercise);
    }
    return null;
  };

  const currentExercise = getCurrentExercise();

  return (
    <div className="emergency-kit">
      <div className="emergency-header">
        <h2>🆘 Kit de Emergencia</h2>
        <p>Técnicas rápidas para momentos de ansiedad y estrés</p>
      </div>

      {showEmergencyButton && (
        <div className="emergency-button-container">
          <button 
            className="emergency-button"
            onClick={() => startBreathingExercise('box-breathing')}
          >
            🚨 BOTÓN DE PÁNICO
            <span>Respiración de emergencia</span>
          </button>
        </div>
      )}

      {isBreathingActive && currentExercise && 'inhale' in currentExercise && (
        <div className="breathing-overlay">
          <div className="breathing-circle" style={{ borderColor: currentExercise.color }}>
            <div className="breathing-text">
              <h3>{currentExercise.name}</h3>
              <div className="breathing-instruction">
                {breathingPhase === 'inhale' && 'INHALA'}
                {breathingPhase === 'hold' && 'MANTÉN'}
                {breathingPhase === 'exhale' && 'EXHALA'}
              </div>
              <div className="breathing-timer">{breathingTime}</div>
              <div className="breathing-cycle">Ciclo {currentCycle}/{currentExercise.cycles}</div>
            </div>
          </div>
          <button className="stop-exercise-btn" onClick={stopBreathingExercise}>
            ⏹️ Detener
          </button>
        </div>
      )}

      {isGroundingActive && currentExercise && 'steps' in currentExercise && (
        <div className="grounding-overlay">
          <div className="grounding-card" style={{ borderColor: currentExercise.color }}>
            <div className="grounding-icon">{currentExercise.icon}</div>
            <h3>{currentExercise.name}</h3>
            <div className="grounding-step">
              {currentExercise.steps[groundingStep]}
            </div>
            <div className="grounding-progress">
              Paso {groundingStep + 1} de {currentExercise.steps.length}
            </div>
          </div>
          <button className="stop-exercise-btn" onClick={stopGroundingExercise}>
            ⏹️ Detener
          </button>
        </div>
      )}

      <div className="emergency-sections">
        <div className="breathing-section">
          <h3>🫁 Técnicas de Respiración</h3>
          <p>Ejercicios para calmar tu sistema nervioso</p>
          
          <div className="exercises-grid">
            {breathingExercises.map(exercise => (
              <div 
                key={exercise.id}
                className={`exercise-card ${activeExercise === exercise.id ? 'active' : ''}`}
                style={{ borderColor: exercise.color }}
              >
                <div className="exercise-header">
                  <h4>{exercise.name}</h4>
                  <p>{exercise.description}</p>
                </div>
                <div className="exercise-details">
                  <span>Inhalar: {exercise.inhale}s</span>
                  <span>Mantener: {exercise.hold}s</span>
                  <span>Exhalar: {exercise.exhale}s</span>
                  <span>Ciclos: {exercise.cycles}</span>
                </div>
                <button 
                  className="start-exercise-btn"
                  onClick={() => startBreathingExercise(exercise.id)}
                  style={{ backgroundColor: exercise.color }}
                >
                  🚀 Comenzar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grounding-section">
          <h3>🌍 Ejercicios de Grounding</h3>
          <p>Técnicas para conectarte con el presente</p>
          
          <div className="exercises-grid">
            {groundingExercises.map(exercise => (
              <div 
                key={exercise.id}
                className={`exercise-card ${activeExercise === exercise.id ? 'active' : ''}`}
                style={{ borderColor: exercise.color }}
              >
                <div className="exercise-header">
                  <div className="exercise-icon">{exercise.icon}</div>
                  <h4>{exercise.name}</h4>
                  <p>{exercise.description}</p>
                </div>
                <div className="exercise-steps">
                  {exercise.steps.map((step, index) => (
                    <div key={index} className="step-item">
                      {index + 1}. {step}
                    </div>
                  ))}
                </div>
                <button 
                  className="start-exercise-btn"
                  onClick={() => startGroundingExercise(exercise.id)}
                  style={{ backgroundColor: exercise.color }}
                >
                  🚀 Comenzar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="contacts-section">
          <h3>📞 Contactos de Emergencia</h3>
          <p>Personas que puedes contactar en momentos difíciles</p>
          
          <div className="contacts-list">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="contact-item">
                <span className="contact-name">{contact}</span>
                <button 
                  className="remove-contact-btn"
                  onClick={() => removeEmergencyContact(contact)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-contact">
            <input
              type="text"
              placeholder="Nombre o número de contacto"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addEmergencyContact()}
            />
            <button onClick={addEmergencyContact}>➕ Agregar</button>
          </div>
        </div>

        <div className="quick-tips">
          <h3>💡 Consejos Rápidos</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">💧</span>
              <h4>Bebe Agua</h4>
              <p>La deshidratación puede empeorar la ansiedad</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🏃</span>
              <h4>Muévete</h4>
              <p>Haz algunos estiramientos o camina un poco</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🎵</span>
              <h4>Escucha Música</h4>
              <p>Música relajante puede ayudar a calmar</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📱</span>
              <h4>Llama a Alguien</h4>
              <p>Hablar con alguien de confianza puede ayudar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyKit; 