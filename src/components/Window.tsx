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
  onFocus?: () => void;
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
  onFocus,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isRendering, setIsRendering] = useState(true);
  const [renderHeight, setRenderHeight] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      // Focus the window when clicking on title bar
      if (onFocus) {
        onFocus();
      }
    }
  };

  const handleWindowClick = () => {
    // Focus the window when clicking anywhere on it
    if (onFocus && !isActive) {
      onFocus();
    }
  };

  // Window rendering animation effect
  useEffect(() => {
    setIsRendering(true);
    setRenderHeight(0);
    
    const animationDuration = 500; // milliseconds - slower for more authentic feel
    const targetHeight = size.height;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // More realistic CRT-like rendering with slight stutter
      let easeProgress = progress;
      
      // Add slight stutter effect like old graphics cards
      if (progress < 0.9) {
        const stutterFreq = 20; // How often to stutter
        const stutterAmount = 0.02; // How much to stutter
        const stutter = Math.sin(elapsed * stutterFreq) * stutterAmount * (1 - progress);
        easeProgress = progress + stutter;
      }
      
      // Easing function for more realistic rendering
      const easeOut = 1 - Math.pow(1 - Math.max(0, easeProgress), 2);
      const currentHeight = targetHeight * easeOut;
      
      setRenderHeight(currentHeight);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsRendering(false);
      }
    };
    
    // Small delay to make it feel more authentic
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 50);
  }, [size.height]); // Re-run animation when window size changes

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
      className={`win98-window ${isRendering ? 'rendering' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isActive ? 100 : 50,
        clipPath: isRendering ? `inset(0 0 ${size.height - renderHeight}px 0)` : 'none',
        transition: isRendering ? 'none' : 'clip-path 0.1s ease-out',
      }}
      onClick={handleWindowClick}
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
