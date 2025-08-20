import React from 'react';
import Calculator from './Calculator';
import Minesweeper from './Minesweeper';

export const AboutMeWindow: React.FC = () => {
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

export const MyComputerWindow: React.FC = () => {
  const drives = [
    { name: 'Local Disk (C:)', icon: '/icons/hdd.svg', size: '2.5 GB' },
    { name: 'Floppy Disk (A:)', icon: '/icons/floppy.svg', size: '1.44 MB' },
    { name: 'CD-ROM (D:)', icon: '/icons/cdrom.svg', size: '650 MB' },
  ];

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
              cursor: 'pointer'
            }}
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

export const MyDocumentsWindow: React.FC = () => {
  const documents = [
    { name: 'Resume.doc', icon: '/icons/doc.svg', date: '8/19/2025' },
    { name: 'Projects.txt', icon: '/icons/txt.svg', date: '8/18/2025' },
    { name: 'Photos', icon: '/icons/folder.svg', date: '8/17/2025' },
  ];

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
              cursor: 'pointer'
            }}
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

export const CalculatorWindow: React.FC = () => {
  return <Calculator />;
};

export const MinesweeperWindow: React.FC = () => {
  return <Minesweeper />;
};
