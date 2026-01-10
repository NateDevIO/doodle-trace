import { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import type { CanvasRef } from './components/Canvas';
import { Controls } from './components/Controls';
import { DashedLetter } from './components/LetterGuide';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './App.css';

type TraceMode = 'upper' | 'lower' | 'numbers';

function App() {
  const [mode, setMode] = useState<TraceMode>('upper');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FF4136'); // Default red
  const canvasRef = useRef<CanvasRef>(null);

  // Character sets
  const charSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    numbers: '0123456789'.split('')
  };

  const currentSet = charSets[mode];
  const currentChar = currentSet[currentIndex];

  // Reset index when mode changes
  useEffect(() => {
    setCurrentIndex(0);
    canvasRef.current?.clear();
  }, [mode]);

  const handleNext = () => {
    // Loop back to start if at end
    if (currentIndex === currentSet.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
    canvasRef.current?.clear();
  };

  const handlePrev = () => {
    // Loop to end if at start
    if (currentIndex === 0) {
      setCurrentIndex(currentSet.length - 1);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
    canvasRef.current?.clear();
  };

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <h1>DoodleTrace ✏️</h1>
          </div>

          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'upper' ? 'active' : ''}`}
              onClick={() => setMode('upper')}
            >
              ABC
            </button>
            <button
              className={`mode-btn ${mode === 'lower' ? 'active' : ''}`}
              onClick={() => setMode('lower')}
            >
              abc
            </button>
            <button
              className={`mode-btn ${mode === 'numbers' ? 'active' : ''}`}
              onClick={() => setMode('numbers')}
            >
              123
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="navigation-wrapper">
          <button
            className="nav-btn side-nav"
            onClick={handlePrev}
            title="Previous"
          >
            <ArrowLeft size={48} />
          </button>

          <div className="canvas-wrapper">
            <DashedLetter char={currentChar} />

            <Canvas
              ref={canvasRef}
              color={selectedColor}
              tool="brush"
              brushSize={20} // Thicker brush
            />
          </div>

          <button
            className="nav-btn side-nav"
            onClick={handleNext}
            title="Next"
          >
            <ArrowRight size={48} />
          </button>
        </div>

        <div className="bottom-controls">
          <Controls
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            onClear={handleClear}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
