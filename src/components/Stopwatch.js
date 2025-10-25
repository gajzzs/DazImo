
import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

const Stopwatch = ({
  stopwatchTime,
  isRunning,
  isDarkMode,
  isFullscreen,
  formatStopwatch,
  toggleTimer,
  resetTimer
}) => {
  return (
    <div className="text-center flex-1 flex flex-col justify-center">
      <div className={`font-light mb-8 font-mono transition-all duration-300 ${
        isFullscreen ? 'text-9xl' : 'text-6xl'
      } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {formatStopwatch(stopwatchTime)}
      </div>
      
      <div className={`flex justify-center transition-all duration-300 ${
        isFullscreen ? 'gap-8' : 'gap-4'
      }`}>
        <button
          onClick={toggleTimer}
          className={`rounded-full flex items-center justify-center transition-all ${
            isFullscreen ? 'w-24 h-24' : 'w-16 h-16'
          } ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Pause size={isFullscreen ? 32 : 24} /> : <Play size={isFullscreen ? 32 : 24} />}
        </button>
        
        <button
          onClick={resetTimer}
          className={`rounded-full flex items-center justify-center transition-all ${
            isFullscreen ? 'w-24 h-24' : 'w-16 h-16'
          } ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
        >
          <Square size={isFullscreen ? 32 : 24} />
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
