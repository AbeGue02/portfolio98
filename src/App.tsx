import React, { useState } from 'react';
import './App.css';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import { AboutMeWindow, MyComputerWindow, MyDocumentsWindow, CalculatorWindow, MinesweeperWindow } from './components/WindowContent';

interface OpenWindow {
  id: string;
  title: string;
  component: React.ComponentType;
  position: { x: number; y: number };
}

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = (windowType: string) => {
    const windowId = `${windowType}-${Date.now()}`;
    let windowConfig: Omit<OpenWindow, 'id'>;

    switch (windowType) {
      case 'about-me':
        windowConfig = {
          title: 'About Me - Notepad',
          component: AboutMeWindow,
          position: { x: 150, y: 150 },
        };
        break;
      case 'my-computer':
        windowConfig = {
          title: 'My Computer',
          component: MyComputerWindow,
          position: { x: 100, y: 100 },
        };
        break;
      case 'my-documents':
        windowConfig = {
          title: 'My Documents',
          component: MyDocumentsWindow,
          position: { x: 200, y: 120 },
        };
        break;
      case 'calculator':
        windowConfig = {
          title: 'Calculator',
          component: CalculatorWindow,
          position: { x: 300, y: 150 },
        };
        break;
      case 'minesweeper':
        windowConfig = {
          title: 'Minesweeper',
          component: MinesweeperWindow,
          position: { x: 250, y: 100 },
        };
        break;
      default:
        return;
    }

    const newWindow: OpenWindow = {
      id: windowId,
      ...windowConfig,
    };

    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindowId(windowId);
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.filter(window => window.id !== windowId));
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleStartMenuItemClick = (item: string) => {
    console.log('Start menu item clicked:', item);
    // You can add functionality for start menu items here
  };

  const handleWindowSelect = (windowId: string) => {
    setActiveWindowId(windowId);
    // If the window is already active, you could minimize it here in the future
  };

  // Convert openWindows to the format needed by Taskbar
  const taskbarWindows = openWindows.map(window => ({
    id: window.id,
    title: window.title
  }));

  return (
    <div id="root">
      <Desktop onOpenWindow={openWindow} />
      
      {openWindows.map(window => {
        const WindowComponent = window.component;
        return (
          <Window
            key={window.id}
            title={window.title}
            onClose={() => closeWindow(window.id)}
            onFocus={() => setActiveWindowId(window.id)}
            initialPosition={window.position}
            isActive={activeWindowId === window.id}
          >
            <WindowComponent />
          </Window>
        );
      })}

      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onItemClick={handleStartMenuItemClick}
      />

      <Taskbar
        onStartClick={handleStartClick}
        isStartMenuOpen={isStartMenuOpen}
        openWindows={taskbarWindows}
        activeWindowId={activeWindowId}
        onWindowSelect={handleWindowSelect}
      />
    </div>
  );
}

export default App;
