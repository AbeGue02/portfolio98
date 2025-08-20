import React, { useState } from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  x: number;
  y: number;
  isSelected: boolean;
  onDoubleClick: () => void;
  onClick: () => void;
  isMobile?: boolean;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  name, 
  icon, 
  x, 
  y, 
  isSelected, 
  onDoubleClick, 
  onClick,
  isMobile = false
}) => {
  const iconStyle = isMobile 
    ? {} // Let CSS handle positioning on mobile
    : { left: x, top: y };

  const handleClick = () => {
    if (isMobile) {
      // On mobile, single click should open the window
      onDoubleClick();
    } else {
      // On desktop, single click just selects
      onClick();
    }
  };

  const handleDoubleClick = () => {
    if (!isMobile) {
      // Only handle double click on desktop
      onDoubleClick();
    }
  };

  return (
    <div 
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={iconStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <img src={icon} alt={name} />
      <div className="desktop-icon-label">{name}</div>
    </div>
  );
};

interface DesktopProps {
  onOpenWindow: (windowType: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({ onOpenWindow }) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability and screen size
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(hasTouchScreen && isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const desktopIcons = [
    { name: 'README.txt', icon: '/icons/notepad.svg', x: 30, y: 30 },
    { name: 'My Computer', icon: '/icons/my-computer.svg', x: 30, y: 160 },
    { name: 'Recycle Bin', icon: '/icons/recycle-bin.svg', x: 30, y: 290 },
    { name: 'My Documents', icon: '/icons/folder.svg', x: 30, y: 420 },
    { name: 'Calculator', icon: '/icons/calculator.svg', x: 180, y: 30 },
    { name: 'Minesweeper', icon: '/icons/minesweeper.svg', x: 180, y: 160 },
  ];

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleIconDoubleClick = (iconName: string) => {
    setSelectedIcon(null);
    
    switch (iconName) {
      case 'Calculator':
        onOpenWindow('calculator');
        break;
      case 'Minesweeper':
        onOpenWindow('minesweeper');
        break;
      case 'README.txt':
        onOpenWindow('about-me');
        break;
      case 'My Computer':
        onOpenWindow('my-computer');
        break;
      case 'My Documents':
        onOpenWindow('my-documents');
        break;
      case 'Recycle Bin':
        onOpenWindow('recycle-bin');
        break;
      default:
        // For other icons, you could add more window types or show placeholder content
        break;
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Clear selection when clicking on empty desktop
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  };

  return (
    <div className="win98-desktop" onClick={handleDesktopClick}>
      {desktopIcons.map((icon, index) => (
        <DesktopIcon
          key={index}
          name={icon.name}
          icon={icon.icon}
          x={icon.x}
          y={icon.y}
          isSelected={selectedIcon === icon.name}
          onClick={() => handleIconClick(icon.name)}
          onDoubleClick={() => handleIconDoubleClick(icon.name)}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default Desktop;
