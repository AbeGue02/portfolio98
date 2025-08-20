import React, { useState, useEffect } from 'react';

interface TaskbarProps {
  onStartClick: () => void;
  isStartMenuOpen: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ onStartClick, isStartMenuOpen }) => {
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
        {/* Task buttons will be rendered here */}
      </div>
      <div className="taskbar-clock">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Taskbar;
