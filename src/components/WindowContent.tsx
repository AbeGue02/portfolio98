import React from 'react';
import Calculator from './Calculator';
import Minesweeper from './Minesweeper';

interface WindowContentProps {
  onOpenWindow?: (windowType: string) => void;
}

export const AboutMeWindow: React.FC<WindowContentProps> = () => {
  return (
    <div style={{ padding: '8px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '10px' }}>About Me</h3>
      <div className="win98-border-inset" style={{ padding: '8px', minHeight: '150px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '8px', lineHeight: '1.4' }}>
          Welcome to my Windows 98-style portfolio! This is a nostalgic recreation 
          of the classic Windows 98 interface built with modern React and TypeScript.
        </p>
        <p style={{ margin: '0 0 8px 0', fontSize: '8px', lineHeight: '1.4' }}>
          Feel free to explore the desktop, open windows, and experience the 
          retro computing aesthetic.
        </p>
        <p style={{ margin: '0', fontSize: '8px', lineHeight: '1.4' }}>
          Built with ❤️ using React, TypeScript, and Vite.
        </p>
      </div>
    </div>
  );
};

export const MyComputerWindow: React.FC<WindowContentProps> = ({ onOpenWindow }) => {
  const drives = [
    { name: 'Local Disk (C:)', icon: '/icons/hdd.svg', size: '2.5 GB', action: 'my-documents' },
    { name: 'Floppy Disk (A:)', icon: '/icons/floppy.svg', size: '1.44 MB', action: null },
    { name: 'CD-ROM (D:)', icon: '/icons/cdrom.svg', size: '650 MB', action: null },
  ];

  const handleDriveClick = (drive: typeof drives[0]) => {
    if (drive.action && onOpenWindow) {
      onOpenWindow(drive.action);
    }
  };

  return (
    <div style={{ padding: '8px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '8px' }}>My Computer</h3>
      <div className="win98-border-inset" style={{ padding: '8px', minHeight: '200px' }}>
        {drives.map((drive, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '4px', 
              borderBottom: '1px solid #dfdfdf',
              cursor: drive.action ? 'pointer' : 'default',
              backgroundColor: drive.action ? 'transparent' : '#f0f0f0'
            }}
            onClick={() => handleDriveClick(drive)}
            onDoubleClick={() => handleDriveClick(drive)}
          >
            <img 
              src={drive.icon} 
              alt={drive.name} 
              style={{ width: '32px', height: '32px', marginRight: '8px' }}
            />
            <div>
              <div style={{ fontSize: '7px', fontWeight: 'bold' }}>
                {drive.name}
              </div>
              <div style={{ fontSize: '6px', color: '#666' }}>
                {drive.size}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MyDocumentsWindow: React.FC<WindowContentProps> = ({ onOpenWindow }) => {
  const documents = [
    { name: 'Resume.doc', icon: '/icons/doc.svg', date: '8/19/2025', action: 'about-me' },
    { name: 'Projects.txt', icon: '/icons/txt.svg', date: '8/18/2025', action: 'about-me' },
    { name: 'Calculator.exe', icon: '/icons/calculator.svg', date: '8/17/2025', action: 'calculator' },
    { name: 'Minesweeper.exe', icon: '/icons/minesweeper.svg', date: '8/16/2025', action: 'minesweeper' },
    { name: 'Photos', icon: '/icons/folder.svg', date: '8/17/2025', action: null },
  ];

  const handleDocumentClick = (doc: typeof documents[0]) => {
    if (doc.action && onOpenWindow) {
      onOpenWindow(doc.action);
    }
  };

  return (
    <div style={{ padding: '8px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '8px' }}>My Documents</h3>
      <div className="win98-border-inset" style={{ padding: '8px', minHeight: '200px' }}>
        {documents.map((doc, index) => (
          <div 
            key={index}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '4px', 
              borderBottom: '1px solid #dfdfdf',
              cursor: doc.action ? 'pointer' : 'default',
              backgroundColor: doc.action ? 'transparent' : '#f0f0f0'
            }}
            onClick={() => handleDocumentClick(doc)}
            onDoubleClick={() => handleDocumentClick(doc)}
          >
            <img 
              src={doc.icon} 
              alt={doc.name} 
              style={{ width: '16px', height: '16px', marginRight: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '7px' }}>
                {doc.name}
              </div>
            </div>
            <div style={{ fontSize: '6px', color: '#666' }}>
              {doc.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalculatorWindow: React.FC<WindowContentProps> = () => {
  return <Calculator />;
};

export const MinesweeperWindow: React.FC<WindowContentProps> = () => {
  return <Minesweeper />;
};

export const RecycleBinWindow: React.FC<WindowContentProps> = () => {
  const deletedItems = [
    { name: 'Old Resume.doc', icon: '/icons/doc.svg', deletedDate: '8/15/2025' },
    { name: 'Temp Files', icon: '/icons/folder.svg', deletedDate: '8/14/2025' },
    { name: 'Screenshot.png', icon: '/icons/txt.svg', deletedDate: '8/13/2025' },
  ];

  return (
    <div style={{ padding: '8px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '8px' }}>Recycle Bin</h3>
      <div className="win98-border-inset" style={{ padding: '8px', minHeight: '200px' }}>
        {deletedItems.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '8px', 
            color: '#666', 
            marginTop: '50px' 
          }}>
            The Recycle Bin is empty.
          </div>
        ) : (
          deletedItems.map((item, index) => (
            <div 
              key={index}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '4px', 
                borderBottom: '1px solid #dfdfdf',
                cursor: 'default',
                opacity: 0.7
              }}
            >
              <img 
                src={item.icon} 
                alt={item.name} 
                style={{ width: '16px', height: '16px', marginRight: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '7px' }}>
                  {item.name}
                </div>
              </div>
              <div style={{ fontSize: '6px', color: '#666' }}>
                Deleted: {item.deletedDate}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const HelpWindow: React.FC<WindowContentProps> = ({ onOpenWindow }) => {
  const handleLinkClick = (windowType: string) => {
    if (onOpenWindow) {
      onOpenWindow(windowType);
    }
  };

  return (
    <div style={{ padding: '8px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '8px' }}>Portfolio Navigation Help</h3>
      <div className="win98-border-inset" style={{ padding: '8px', minHeight: '300px', fontSize: '7px', lineHeight: '1.4' }}>
        
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ fontSize: '7px', margin: '0 0 4px 0', fontWeight: 'bold' }}>🖥️ Desktop Navigation</h4>
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ marginBottom: '2px' }}>• <strong>Double-click</strong> any desktop icon to open it</div>
            <div style={{ marginBottom: '2px' }}>• <strong>Single-click</strong> to select icons</div>
            <div style={{ marginBottom: '2px' }}>• <strong>Drag windows</strong> by their title bars</div>
            <div style={{ marginBottom: '2px' }}>• <strong>Resize windows</strong> by dragging edges/corners</div>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ fontSize: '7px', margin: '0 0 4px 0', fontWeight: 'bold' }}>📁 File Explorer</h4>
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ marginBottom: '2px' }}>• Open <span 
              style={{ color: '#0054e3', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleLinkClick('my-computer')}
            >My Computer</span> to browse drives</div>
            <div style={{ marginBottom: '2px' }}>• Access <span 
              style={{ color: '#0054e3', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleLinkClick('my-documents')}
            >My Documents</span> for files and programs</div>
            <div style={{ marginBottom: '2px' }}>• Double-click files to open them</div>
            <div style={{ marginBottom: '2px' }}>• View deleted items in <span 
              style={{ color: '#0054e3', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleLinkClick('recycle-bin')}
            >Recycle Bin</span></div>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ fontSize: '7px', margin: '0 0 4px 0', fontWeight: 'bold' }}>🎮 Applications</h4>
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ marginBottom: '2px' }}>• <span 
              style={{ color: '#0054e3', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleLinkClick('calculator')}
            >Calculator</span> - Fully functional calculator app</div>
            <div style={{ marginBottom: '2px' }}>• <span 
              style={{ color: '#0054e3', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleLinkClick('minesweeper')}
            >Minesweeper</span> - Classic puzzle game</div>
            <div style={{ marginBottom: '2px' }}>• <span 
              style={{ color: '#0054e3', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleLinkClick('about-me')}
            >README.txt</span> - About this portfolio</div>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ fontSize: '7px', margin: '0 0 4px 0', fontWeight: 'bold' }}>🚀 Start Menu</h4>
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ marginBottom: '2px' }}>• Click <strong>Start</strong> button for quick access</div>
            <div style={{ marginBottom: '2px' }}>• <strong>Documents</strong> opens My Documents</div>
            <div style={{ marginBottom: '2px' }}>• <strong>Programs</strong> opens My Computer</div>
            <div style={{ marginBottom: '2px' }}>• <strong>Help</strong> opens this window</div>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ fontSize: '7px', margin: '0 0 4px 0', fontWeight: 'bold' }}>⌨️ Window Controls</h4>
          <div style={{ paddingLeft: '8px' }}>
            <div style={{ marginBottom: '2px' }}>• <strong>×</strong> Close window</div>
            <div style={{ marginBottom: '2px' }}>• <strong>_</strong> Minimize window</div>
            <div style={{ marginBottom: '2px' }}>• <strong>□</strong> Maximize window</div>
            <div style={{ marginBottom: '2px' }}>• Click taskbar buttons to switch windows</div>
          </div>
        </div>

        <div style={{ fontSize: '6px', color: '#666', marginTop: '16px', textAlign: 'center' }}>
          This is a nostalgic recreation of Windows 98 built with React & TypeScript.<br/>
          Explore and enjoy the retro computing experience! 🖥️✨
        </div>
      </div>
    </div>
  );
};
