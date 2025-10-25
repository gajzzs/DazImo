
import React from 'react';

const PomodoroSettings = ({ pomodoroSettings, isDarkMode, updateSettings }) => {
  return (
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
              onChange={(e) => updateSettings(key, parseInt(e.target.value) || 1)}
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
  );
};

export default PomodoroSettings;
