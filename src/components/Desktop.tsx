import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  x: number;
  y: number;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, x, y, onDoubleClick }) => {
  return (
    <div 
      className="desktop-icon" 
      style={{ left: x, top: y }}
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
  const desktopIcons = [
    { name: 'My Computer', icon: '/icons/my-computer.svg', x: 20, y: 20 },
    { name: 'Recycle Bin', icon: '/icons/recycle-bin.svg', x: 20, y: 100 },
    { name: 'My Documents', icon: '/icons/folder.svg', x: 20, y: 180 },
    { name: 'About Me', icon: '/icons/notepad.svg', x: 20, y: 260 },
    { name: 'Calculator', icon: '/icons/calculator.svg', x: 100, y: 20 },
    { name: 'Minesweeper', icon: '/icons/minesweeper.svg', x: 100, y: 100 },
  ];

  return (
    <div className="win98-desktop">
      {desktopIcons.map((icon, index) => (
        <DesktopIcon
          key={index}
          name={icon.name}
          icon={icon.icon}
          x={icon.x}
          y={icon.y}
          onDoubleClick={() => onOpenWindow(icon.name.toLowerCase().replace(' ', '-'))}
        />
      ))}
    </div>
  );
};

export default Desktop;
