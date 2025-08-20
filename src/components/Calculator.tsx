import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = currentValue / inputValue;
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation('=');
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  return (
    <div style={{ padding: '8px', minWidth: '220px' }}>
      <div 
        className="win98-border-inset" 
        style={{ 
          padding: '4px', 
          marginBottom: '8px', 
          textAlign: 'right',
          fontSize: '16px',
          fontFamily: 'monospace',
          backgroundColor: 'white',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        {display}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
        <button className="win98-button" onClick={clear} style={{ gridColumn: 'span 2' }}>
          Clear
        </button>
        <button className="win98-button" onClick={() => setDisplay(display.slice(0, -1) || '0')}>
          ←
        </button>
        <button className="win98-button" onClick={() => performOperation('/')}>
          ÷
        </button>

        <button className="win98-button" onClick={() => inputNumber('7')}>7</button>
        <button className="win98-button" onClick={() => inputNumber('8')}>8</button>
        <button className="win98-button" onClick={() => inputNumber('9')}>9</button>
        <button className="win98-button" onClick={() => performOperation('*')}>×</button>

        <button className="win98-button" onClick={() => inputNumber('4')}>4</button>
        <button className="win98-button" onClick={() => inputNumber('5')}>5</button>
        <button className="win98-button" onClick={() => inputNumber('6')}>6</button>
        <button className="win98-button" onClick={() => performOperation('-')}>-</button>

        <button className="win98-button" onClick={() => inputNumber('1')}>1</button>
        <button className="win98-button" onClick={() => inputNumber('2')}>2</button>
        <button className="win98-button" onClick={() => inputNumber('3')}>3</button>
        <button className="win98-button" onClick={() => performOperation('+')} style={{ gridRow: 'span 2' }}>
          +
        </button>

        <button className="win98-button" onClick={() => inputNumber('0')} style={{ gridColumn: 'span 2' }}>
          0
        </button>
        <button className="win98-button" onClick={inputDecimal}>.</button>

        <button className="win98-button" onClick={calculate} style={{ gridColumn: 'span 3' }}>
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
