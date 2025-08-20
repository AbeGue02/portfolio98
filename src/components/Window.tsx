import React, { useState, useRef, useEffect } from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  isActive?: boolean;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 300 },
  isActive = true,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      ref={windowRef}
      className="win98-window"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isActive ? 100 : 50,
      }}
    >
      <div
        className={`win98-title-bar ${!isActive ? 'inactive' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <span className="win98-title-text">{title}</span>
        <div className="win98-window-controls">
          {onMinimize && (
            <button className="win98-control-button" onClick={onMinimize}>
              _
            </button>
          )}
          {onMaximize && (
            <button className="win98-control-button" onClick={onMaximize}>
              □
            </button>
          )}
          <button className="win98-control-button" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      <div className="win98-window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
