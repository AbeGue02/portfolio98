import React, { useState, useEffect } from 'react';
import './App.css';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import StartupScreen from './components/StartupScreen';
import { AboutMeWindow, MyComputerWindow, MyDocumentsWindow, CalculatorWindow, MinesweeperWindow, RecycleBinWindow, HelpWindow } from './components/WindowContent';

interface OpenWindow {
  id: string;
  title: string;
  component: React.ComponentType<{ onOpenWindow?: (windowType: string) => void }>;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  isMinimized?: boolean;
  isMaximized?: boolean;
  originalPosition?: { x: number; y: number };
  originalSize?: { width: number; height: number };
}

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [showStartup, setShowStartup] = useState(true);

  // Handle window resize for maximized windows
  useEffect(() => {
    const handleResize = () => {
      setOpenWindows(prev => prev.map(windowObj => {
        if (windowObj.isMaximized) {
          const maxWidth = window.innerWidth;
          const maxHeight = window.innerHeight - 40; // Account for taskbar
          return {
            ...windowObj,
            size: { width: maxWidth, height: maxHeight },
          };
        }
        return windowObj;
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openWindow = (windowType: string) => {
    const windowId = `${windowType}-${Date.now()}`;
    let windowConfig: Omit<OpenWindow, 'id'>;

    switch (windowType) {
      case 'about-me':
        windowConfig = {
          title: 'README.txt - Notepad',
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
          size: { width: 400, height: 600 }, // Keep smaller for calculator
        };
        break;
      case 'minesweeper':
        windowConfig = {
          title: 'Minesweeper',
          component: MinesweeperWindow,
          position: { x: 250, y: 100 },
        };
        break;
      case 'recycle-bin':
        windowConfig = {
          title: 'Recycle Bin',
          component: RecycleBinWindow,
          position: { x: 180, y: 140 },
        };
        break;
      case 'help':
        windowConfig = {
          title: 'Portfolio Help',
          component: HelpWindow,
          position: { x: 220, y: 80 },
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
    // If the closed window was active, clear the active window
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, isMinimized: true }
        : window
    ));
    // Clear active window when minimizing
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(windowObj => {
      if (windowObj.id === windowId) {
        if (windowObj.isMaximized) {
          // Restore window
          return {
            ...windowObj,
            isMaximized: false,
            position: windowObj.originalPosition || { x: 100, y: 100 },
            size: windowObj.originalSize || { width: 400, height: 300 },
          };
        } else {
          // Maximize window
          const maxWidth = window.innerWidth;
          const maxHeight = window.innerHeight - 40; // Account for taskbar
          return {
            ...windowObj,
            isMaximized: true,
            originalPosition: windowObj.position,
            originalSize: windowObj.size || { width: 1200, height: 1000 },
            position: { x: 0, y: 0 },
            size: { width: maxWidth, height: maxHeight },
          };
        }
      }
      return windowObj;
    }));
  };

  const restoreFromMaximize = (windowId: string, newPosition: { x: number; y: number }) => {
    setOpenWindows(prev => prev.map(windowObj => {
      if (windowObj.id === windowId && windowObj.isMaximized) {
        return {
          ...windowObj,
          isMaximized: false,
          position: newPosition,
          size: windowObj.originalSize || { width: 1200, height: 1000 },
        };
      }
      return windowObj;
    }));
  };

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleStartMenuItemClick = (item: string) => {
    console.log('Start menu item clicked:', item);
    
    switch (item) {
      case 'Documents':
        openWindow('my-documents');
        break;
      case 'Programs':
        openWindow('my-computer');
        break;
      case 'Help':
        openWindow('help');
        break;
      default:
        // Other menu items could be implemented here
        break;
    }
  };

  const handleWindowSelect = (windowId: string) => {
    // If window is minimized, restore it
    const window = openWindows.find(w => w.id === windowId);
    if (window?.isMinimized) {
      setOpenWindows(prev => prev.map(w => 
        w.id === windowId 
          ? { ...w, isMinimized: false }
          : w
      ));
    }
    setActiveWindowId(windowId);
  };

  // Convert openWindows to the format needed by Taskbar
  const taskbarWindows = openWindows.map(window => ({
    id: window.id,
    title: window.title
  }));

  const handleStartupComplete = () => {
    setShowStartup(false);
  };

  // Show startup screen first
  if (showStartup) {
    return <StartupScreen onComplete={handleStartupComplete} />;
  }

  return (
    <div id="root">
      <Desktop onOpenWindow={openWindow} />
      
      {openWindows
        .filter(window => !window.isMinimized)
        .map(window => {
        const WindowComponent = window.component;
        return (
          <Window
            key={window.id}
            title={window.title}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => setActiveWindowId(window.id)}
            onDragRestore={(newPosition) => restoreFromMaximize(window.id, newPosition)}
            isMaximized={window.isMaximized || false}
            initialPosition={window.position}
            initialSize={window.isMaximized ? 
              { width: globalThis.innerWidth, height: globalThis.innerHeight - 40 } :
              window.size // Use the window's size if specified, otherwise Window component will use its default
            }
            isActive={activeWindowId === window.id}
          >
            <WindowComponent onOpenWindow={openWindow} />
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
