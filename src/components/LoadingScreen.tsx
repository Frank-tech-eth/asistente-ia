import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    { text: 'Preparando tu asistente personal...', emoji: '🤖' },
    { text: 'Cargando agentes especializados...', emoji: '✨' },
    { text: 'Conectando con la IA...', emoji: '🧠' },
    { text: 'Preparando respuestas amigables...', emoji: '💬' },
    { text: '¡Todo listo! Bienvenido...', emoji: '🌟' }
  ];

  useEffect(() => {
    const totalSteps = loadingSteps.length;
    const stepDuration = 800; // 800ms por paso

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / totalSteps);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return newProgress;
      });
    }, stepDuration);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [onComplete, loadingSteps.length]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-header">
          <div className="loading-logo">
            <div className="logo-icon">🤖</div>
            <h1>Asistente IA para Introvertidos</h1>
          </div>
          <p className="loading-subtitle">Tu compañero personal para momentos difíciles</p>
        </div>

        <div className="loading-content">
          <div className="loading-animation">
            <div className="robot-animation">
              <div className="robot-head">
                <div className="robot-eyes">
                  <div className="eye left-eye"></div>
                  <div className="eye right-eye"></div>
                </div>
                <div className="robot-mouth"></div>
              </div>
              <div className="robot-body">
                <div className="robot-arms">
                  <div className="arm left-arm"></div>
                  <div className="arm right-arm"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="loading-steps">
            <div className="current-step">
              <span className="step-emoji">{loadingSteps[currentStep].emoji}</span>
              <span className="step-text">{loadingSteps[currentStep].text}</span>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{Math.round(progress)}%</div>
            </div>
          </div>

          <div className="loading-tips">
            <h3>💡 Consejos mientras cargas:</h3>
            <ul>
              <li>Respira profundo y relájate</li>
              <li>Recuerda que está bien ser introvertido</li>
              <li>Cada paso que das es valioso</li>
              <li>Estamos aquí para ayudarte</li>
            </ul>
          </div>
        </div>

        <div className="loading-footer">
          <p>Hecho con ❤️ para personas introvertidas</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 