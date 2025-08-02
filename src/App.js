import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Timer, Clock, Coffee, Target, Settings, Maximize, Minimize, Moon, Sun } from 'lucide-react';

const ProductivityTimer = () => {
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [currentSession, setCurrentSession] = useState('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [realTime, setRealTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Real-time clock update
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && activeTab === 'pomodoro') {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            playNotification();
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (isRunning && activeTab === 'stopwatch') {
      intervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, activeTab]);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fallback for browsers that don't support fullscreen
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const playNotification = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleSessionComplete = () => {
    if (currentSession === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount % 4 === 0) {
        setCurrentSession('longBreak');
        setTime(pomodoroSettings.longBreak * 60);
      } else {
        setCurrentSession('shortBreak');
        setTime(pomodoroSettings.shortBreak * 60);
      }
    } else {
      setCurrentSession('work');
      setTime(pomodoroSettings.work * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (activeTab === 'pomodoro') {
      setTime(pomodoroSettings[currentSession] * 60);
    } else if (activeTab === 'stopwatch') {
      setStopwatchTime(0);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const switchSession = (session) => {
    setCurrentSession(session);
    setTime(pomodoroSettings[session] * 60);
    setIsRunning(false);
  };

  const updateSettings = (setting, value) => {
    const newSettings = { ...pomodoroSettings, [setting]: value };
    setPomodoroSettings(newSettings);
    if (currentSession === setting) {
      setTime(value * 60);
    }
  };

  const tabs = [
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'stopwatch', label: 'Stopwatch', icon: Target },
    { id: 'clock', label: 'Clock', icon: Clock }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`rounded-3xl shadow-xl w-full transition-all duration-300 ${
        isFullscreen ? 'max-w-none h-screen rounded-none p-16 flex flex-col justify-center' : 'max-w-md p-8'
      } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header with controls - hidden in fullscreen when timer is running */}
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

        {/* Tab Navigation - hidden in fullscreen when timer is running */}
        <div className={`rounded-2xl p-1 mb-8 transition-opacity duration-500 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        } ${isFullscreen && isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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

        {/* Timer Display */}
        {activeTab === 'pomodoro' && (
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="mb-4">
              {/* Session buttons - hidden in fullscreen when running */}
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
              
              {/* Session info - smaller in fullscreen when running */}
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
              
              {/* Settings button - hidden in fullscreen when running */}
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
              <div className={`rounded-2xl p-6 mt-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Timer Settings
                </h3>
                <div className="space-y-4">
                  {Object.entries(pomodoroSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {key === 'work' ? 'Work' : key === 'shortBreak' ? 'Short Break' : 'Long Break'} (min)
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateSettings(key, parseInt(e.target.value))}
                        className={`w-16 px-2 py-1 rounded-lg border text-center ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-800 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        }`}
                        min="1"
                        max="60"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stopwatch' && (
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
        )}

        {activeTab === 'clock' && (
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className={`font-light mb-4 font-mono transition-all duration-300 ${
              isFullscreen ? 'text-9xl' : 'text-6xl'
            } ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {realTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            
            <div className={`mb-6 transition-all duration-300 ${
              isFullscreen ? 'text-2xl' : 'text-lg'
            } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {realTime.toLocaleDateString([], { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div className={`rounded-2xl transition-all duration-300 ${
              isFullscreen ? 'p-8' : 'p-6'
            } ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <div className={`font-medium mb-4 transition-all duration-300 ${
                isFullscreen ? 'text-lg' : 'text-sm'
              } ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Quick Focus
              </div>
              <div className={`grid grid-cols-3 transition-all duration-300 ${
                isFullscreen ? 'gap-4' : 'gap-2'
              }`}>
                {[5, 15, 25].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => {
                      setActiveTab('pomodoro');
                      setTime(minutes * 60);
                      setCurrentSession('work');
                    }}
                    className={`rounded-lg transition-all ${
                      isFullscreen ? 'py-4 px-6 text-lg' : 'py-2 px-3 text-sm'
                    } ${
                      isDarkMode 
                        ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' 
                        : 'bg-white text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return <ProductivityTimer />;
};

export default App;