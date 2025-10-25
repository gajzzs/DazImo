
import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import PomodoroSettings from './PomodoroSettings';

const PomodoroTimer = ({
  time,
  isRunning,
  currentSession,
  sessionCount,
  pomodoroSettings,
  showSettings,
  isDarkMode,
  isFullscreen,
  formatTime,
  toggleTimer,
  resetTimer,
  switchSession,
  setShowSettings,
  updateSettings
}) => {
  return (
    <div className="text-center flex-1 flex flex-col justify-center">
      <div className="mb-4">
        {/* Session buttons */}
        <div className={`flex justify-center gap-2 mb-6 transition-opacity duration-500 ${
          isFullscreen && isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          {['work', 'shortBreak', 'longBreak'].map((session) => (
            <button
              key={session}
              onClick={() => switchSession(session)}
              className={`rounded-lg text-sm transition-all ${
                isFullscreen ? 'px-6 py-3 text-base' : 'px-4 py-2'
              } ${
                currentSession === session
                  ? `${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              {session === 'work' ? 'Work' : session === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>
        
        {/* Main timer display */}
        <div className={`mb-4 font-mono transition-all duration-300 font-light ${
          isFullscreen ? 'text-9xl mb-8' : 'text-6xl mb-2'
        } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {formatTime(time)}
        </div>
        
        {/* Session info */}
        <div className={`mb-6 transition-all duration-500 ${
          isFullscreen && isRunning ? 'text-lg opacity-70' : isFullscreen ? 'text-xl' : 'text-sm'
        } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {isFullscreen && isRunning ? (
            <div>
              <div className="mb-2">{currentSession === 'work' ? '🎯 Focus Time' : '☕ Break Time'}</div>
              <div className="text-sm opacity-60">Session {sessionCount + 1}</div>
            </div>
          ) : (
            `Session ${sessionCount + 1} • ${currentSession === 'work' ? 'Focus Time' : 'Break Time'}`
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className={`flex justify-center gap-4 mb-6 transition-all duration-300 ${
        isFullscreen ? 'gap-8' : 'gap-4'
      }`}>
        <button
          onClick={toggleTimer}
          className={`rounded-full flex items-center justify-center transition-all ${
            isFullscreen ? 'w-24 h-24' : 'w-16 h-16'
          } ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
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
          <RotateCcw size={isFullscreen ? 32 : 24} />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`rounded-full flex items-center justify-center transition-all duration-500 ${
            isFullscreen ? 'w-24 h-24' : 'w-16 h-16'
          } ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          } ${isFullscreen && isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Settings size={isFullscreen ? 32 : 24} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <PomodoroSettings
          pomodoroSettings={pomodoroSettings}
          isDarkMode={isDarkMode}
          updateSettings={updateSettings}
        />
      )}
    </div>
  );
};

export default PomodoroTimer;

import React from 'react';
import { Timer, Target, Clock } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab, isDarkMode, isFullscreen, isRunning }) => {
  const tabs = [
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'stopwatch', label: 'Stopwatch', icon: Target },
    { id: 'clock', label: 'Clock', icon: Clock }
  ];

  return (
    <div className={`rounded-2xl p-1 mb-8 transition-opacity duration-500 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    } ${isFullscreen && isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all duration-200 ${
              isFullscreen ? 'py-4 px-6' : 'py-3 px-4'
            } ${
              activeTab === id
                ? `${isDarkMode ? 'bg-gray-600 text-blue-400' : 'bg-white text-blue-600'} shadow-sm`
                : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800'}`
            }`}
          >
            <Icon size={isFullscreen ? 20 : 16} />
            <span className={`font-medium ${isFullscreen ? 'text-base' : 'text-sm'}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
