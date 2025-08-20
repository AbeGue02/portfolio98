import React, { useState } from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  x: number;
  y: number;
  isSelected: boolean;
  onDoubleClick: () => void;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  name, 
  icon, 
  x, 
  y, 
  isSelected, 
  onDoubleClick, 
  onClick 
}) => {
  return (
    <div 
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={{ left: x, top: y }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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

  const desktopIcons = [
    { name: 'My Computer', icon: '/icons/my-computer.svg', x: 20, y: 20 },
    { name: 'Recycle Bin', icon: '/icons/recycle-bin.svg', x: 20, y: 100 },
    { name: 'My Documents', icon: '/icons/folder.svg', x: 20, y: 180 },
    { name: 'About Me', icon: '/icons/notepad.svg', x: 20, y: 260 },
    { name: 'Calculator', icon: '/icons/calculator.svg', x: 100, y: 20 },
    { name: 'Minesweeper', icon: '/icons/minesweeper.svg', x: 100, y: 100 },
  ];

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleIconDoubleClick = (iconName: string) => {
    setSelectedIcon(iconName);
    onOpenWindow(iconName.toLowerCase().replace(' ', '-'));
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
        />
      ))}
    </div>
  );
};

export default Desktop;
