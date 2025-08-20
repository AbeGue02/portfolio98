import React, { useState, useEffect } from 'react';

interface StartupScreenProps {
  onComplete: () => void;
}

const StartupScreen: React.FC<StartupScreenProps> = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Starting AG Studio...');

  const loadingMessages = [
    'Starting AG Studio...',
    'Loading system files...',
    'Initializing desktop environment...',
    'Preparing user interface...',
    'Loading applications...',
    'Welcome to AG Studio',
  ];

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total
    const steps = 100;
    const stepDuration = totalDuration / steps;

    let currentStep = 0;
    let messageIndex = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      setLoadingProgress(currentStep);

      // Update message based on progress
      const newMessageIndex = Math.floor((currentStep / steps) * (loadingMessages.length - 1));
      if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
        messageIndex = newMessageIndex;
        setCurrentMessage(loadingMessages[messageIndex]);
      }

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        // Show final message briefly before completing
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, stepDuration);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="startup-screen">
      <div className="startup-content">
        {/* AG Studio Logo/Title */}
        <div className="startup-logo">
          <div className="logo-icon">💻</div>
          <h1 className="startup-title">AG Studio</h1>
          <div className="startup-subtitle">Personal Portfolio Environment</div>
        </div>

        {/* Loading Section */}
        <div className="startup-loading">
          <div className="loading-message">{currentMessage}</div>
          
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="progress-text">{loadingProgress}%</div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="startup-footer">
          <div className="startup-info">
            AG Studio &copy; 2025 Abraham Guerrero<br/>
            Built with React + TypeScript
          </div>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="startup-scanlines"></div>
    </div>
  );
};

export default StartupScreen;
