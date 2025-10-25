
import React from 'react';
import { Moon, Sun, Maximize, Minimize } from 'lucide-react';

const Header = ({ 
  realTime, 
  isDarkMode, 
  isFullscreen, 
  isRunning,
  toggleDarkMode, 
  toggleFullscreen 
}) => {
  return (
    <div className={`flex justify-between items-center mb-8 transition-opacity duration-500 ${
      isFullscreen && isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="text-center flex-1">
        <h1 className={`font-light mb-2 transition-all duration-300 ${
          isFullscreen ? 'text-4xl' : 'text-2xl'
        } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Focus Timer
        </h1>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${
          isFullscreen ? 'text-lg' : ''
        }`}>
          {realTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={toggleDarkMode}
          className={`rounded-full flex items-center justify-center transition-all ${
            isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
          } ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
        >
          {isDarkMode ? <Sun size={isFullscreen ? 24 : 20} /> : <Moon size={isFullscreen ? 24 : 20} />}
        </button>
        
        <button
          onClick={toggleFullscreen}
          className={`rounded-full flex items-center justify-center transition-all ${
            isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
          } ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
        >
          {isFullscreen ? <Minimize size={isFullscreen ? 24 : 20} /> : <Maximize size={isFullscreen ? 24 : 20} />}
        </button>
      </div>
    </div>
  );
};

export default Header;
