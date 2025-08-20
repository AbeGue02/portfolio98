import React, { useState, useEffect } from 'react';

interface OpenWindow {
  id: string;
  title: string;
}

interface TaskbarProps {
  onStartClick: () => void;
  isStartMenuOpen: boolean;
  openWindows: OpenWindow[];
  activeWindowId: string | null;
  onWindowSelect: (windowId: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  onStartClick, 
  isStartMenuOpen, 
  openWindows, 
  activeWindowId, 
  onWindowSelect 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="win98-taskbar">
      <button 
        className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <img src="/icons/windows-logo.svg" alt="Start" />
        Start
      </button>
      <div className="taskbar-tasks">
        {openWindows.map(window => (
          <button
            key={window.id}
            className={`taskbar-window-button ${activeWindowId === window.id ? 'active' : ''}`}
            onClick={() => onWindowSelect(window.id)}
            title={window.title}
          >
            <span className="taskbar-window-title">{window.title}</span>
          </button>
        ))}
      </div>
      <div className="taskbar-clock">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Taskbar;
