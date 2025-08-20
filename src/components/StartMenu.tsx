import React from 'react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (item: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onItemClick }) => {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'Programs', icon: '/icons/programs.svg' },
    { name: 'Documents', icon: '/icons/documents.svg' },
    { name: 'Settings', icon: '/icons/settings.svg' },
    { name: 'Find', icon: '/icons/find.svg' },
    { name: 'Help', icon: '/icons/help.svg' },
    { name: 'Run...', icon: '/icons/run.svg' },
    { name: 'Shut Down...', icon: '/icons/shutdown.svg' },
  ];

  const handleItemClick = (itemName: string) => {
    onItemClick(itemName);
    onClose();
  };

  return (
    <>
      {/* Invisible overlay to close menu when clicking outside */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div className="start-menu">
        <div className="start-menu-header">
          AG Studio
        </div>
        <div className="start-menu-items">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="start-menu-item"
              onClick={() => handleItemClick(item.name)}
            >
              <img src={item.icon} alt={item.name} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StartMenu;
