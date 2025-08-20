import React, { useState, useRef, useEffect } from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onDragRestore?: (newPosition: { x: number; y: number }) => void;
  isMaximized?: boolean;
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
  onDragRestore,
  isMaximized = false,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 300 },
  isActive = true,
  onFocus,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const [isRendering, setIsRendering] = useState(true);
  const [renderHeight, setRenderHeight] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);

  // Update size and position when props change (for maximize/restore)
  useEffect(() => {
    setSize(initialSize);
  }, [initialSize]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

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

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    if (e.button === 0) {
      setIsResizing(true);
      setResizeDirection(direction);
      setResizeStart({
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
        mouseX: e.clientX,
        mouseY: e.clientY,
      });
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
  }, []); // Remove size.height dependency to only run on mount

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        
        // If window is maximized and being dragged, restore it first
        if (isMaximized && onDragRestore) {
          // Calculate where the mouse should be relative to the restored window
          // Position the window so the mouse is roughly in the center of the title bar
          const adjustedPosition = {
            x: e.clientX - 200, // Half of typical window width
            y: e.clientY - 15,  // Adjust for title bar height
          };
          
          // Ensure the window doesn't go off-screen
          const maxX = window.innerWidth - 400; // Assuming 400px width for restored window
          const adjustedX = Math.max(0, Math.min(maxX, adjustedPosition.x));
          const adjustedY = Math.max(0, adjustedPosition.y);
          
          onDragRestore({ x: adjustedX, y: adjustedY });
          return; // Exit early, let the parent handle the state change
        }
        
        setPosition(newPosition);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.x;
        let newY = resizeStart.y;

        // Minimum size constraints
        const minWidth = 200;
        const minHeight = 150;

        // Viewport boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight - 40; // Account for taskbar

        // Handle horizontal resizing
        if (resizeDirection.includes('right')) {
          // Limit right edge to viewport
          const maxWidth = viewportWidth - position.x;
          newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX));
        } else if (resizeDirection.includes('left')) {
          const proposedWidth = resizeStart.width - deltaX;
          const proposedX = resizeStart.x + deltaX;
          
          // Ensure left edge doesn't go below 0 and width meets minimum
          if (proposedWidth >= minWidth && proposedX >= 0) {
            newWidth = proposedWidth;
            newX = proposedX;
          } else if (proposedX < 0) {
            // If trying to move left edge past 0, clamp to 0 and adjust width
            newX = 0;
            newWidth = resizeStart.x + resizeStart.width;
          } else {
            // If width would be too small, maintain minimum width
            newWidth = minWidth;
            newX = resizeStart.x + resizeStart.width - minWidth;
          }
        }

        // Handle vertical resizing
        if (resizeDirection.includes('bottom')) {
          // Limit bottom edge to viewport (accounting for taskbar)
          const maxHeight = viewportHeight - position.y;
          newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY));
        } else if (resizeDirection.includes('top')) {
          const proposedHeight = resizeStart.height - deltaY;
          const proposedY = resizeStart.y + deltaY;
          
          // Ensure top edge doesn't go below 0 and height meets minimum
          if (proposedHeight >= minHeight && proposedY >= 0) {
            newHeight = proposedHeight;
            newY = proposedY;
          } else if (proposedY < 0) {
            // If trying to move top edge past 0, clamp to 0 and adjust height
            newY = 0;
            newHeight = resizeStart.y + resizeStart.height;
          } else {
            // If height would be too small, maintain minimum height
            newHeight = minHeight;
            newY = resizeStart.y + resizeStart.height - minHeight;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Disable text selection while dragging/resizing
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Re-enable text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, position]);

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
              <strong>_</strong>
            </button>
          )}
          {onMaximize && (
            <button className="win98-control-button" onClick={onMaximize}>
              <strong>□</strong>
            </button>
          )}
          <button className="win98-control-button" onClick={onClose}>
            <strong>×</strong>
          </button>
        </div>
      </div>
      <div className="win98-window-content">
        {children}
      </div>
      
      {/* Resize handles */}
      <div 
        className="resize-handle resize-handle-right"
        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
      />
      <div 
        className="resize-handle resize-handle-bottom"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
      />
      <div 
        className="resize-handle resize-handle-corner"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
      />
      <div 
        className="resize-handle resize-handle-left"
        onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
      />
      <div 
        className="resize-handle resize-handle-top"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
      />
      <div 
        className="resize-handle resize-handle-top-left"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
      />
      <div 
        className="resize-handle resize-handle-top-right"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
      />
      <div 
        className="resize-handle resize-handle-bottom-left"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
      />
    </div>
  );
};

export default Window;
