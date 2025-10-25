
import React, { useState } from 'react';
import { Plus, X, Palette } from 'lucide-react';

const BackgroundSettings = ({ 
  backgroundConfig, 
  setBackgroundConfig, 
  isDarkMode 
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingColorIndex, setEditingColorIndex] = useState(null);

  const presetBackgrounds = [
    { name: 'Pure White', type: 'solid', colors: ['#FFFFFF'] },
    { name: 'Pure Black', type: 'solid', colors: ['#000000'] },
    { name: 'Focus Only', type: 'solid', colors: ['#007fff'] },
    { name: 'Introspection Only', type: 'solid', colors: ['#009e60'] },
    { name: 'Creative Only', type: 'solid', colors: ['#f5deb3'] },
    { name: 'Systematic & Practical Effect', type: 'solid', colors: ['#00ffff'] },
    { name: 'Love, Harmony & Pece Effect', type: 'gradient', colors: ['#ffff00', '#c54b8c', '#c54b8c'], angle: 45 }, // 2 ,6 ,4
    { name: 'Focus & Achievements', type: 'gradient', colors: ['#00ffff', '#007fff', '#eb284f'], angle: 45 }, // 8,1,4
    { name: 'Freedom Light, Deep Thinking & Unique as leader', type: 'gradient', colors: ['#ccccff', '#c54b8c', '#eb284f'], angle: 90 }, // 5,7,1
    { name: 'Degrade Negative Thoughts by allow every thoughts', type: 'gradient', colors: ['#b22222', '#ccccff', '#c54b8c', '#ffff00'], angle: 45 }, // 9 , 5 ,6 ,2
  ];

  const addColor = () => {
    const newColors = [...backgroundConfig.colors, '#667eea'];
    setBackgroundConfig({ ...backgroundConfig, colors: newColors });
  };

  const removeColor = (index) => {
    if (backgroundConfig.colors.length > 1) {
      const newColors = backgroundConfig.colors.filter((_, i) => i !== index);
      setBackgroundConfig({ ...backgroundConfig, colors: newColors });
    }
  };

  const updateColor = (index, color) => {
    const newColors = [...backgroundConfig.colors];
    newColors[index] = color;
    setBackgroundConfig({ ...backgroundConfig, colors: newColors });
  };

  const applyPreset = (preset) => {
    setBackgroundConfig({
      type: preset.type,
      colors: [...preset.colors],
      angle: preset.angle || 135
    });
  };

  const toggleGradientType = () => {
    setBackgroundConfig({
      ...backgroundConfig,
      type: backgroundConfig.type === 'solid' ? 'gradient' : 'solid'
    });
  };

  return (
    <div className={`rounded-2xl p-6 mt-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <Palette size={20} />
        Background Settings
      </h3>

      {/* Preset Backgrounds */}
      <div className="mb-6">
        <label className={`text-sm font-medium mb-2 block ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetBackgrounds.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className={`relative rounded-lg p-3 text-xs font-medium transition-all overflow-hidden ${
                isDarkMode 
                  ? 'hover:ring-2 hover:ring-blue-400' 
                  : 'hover:ring-2 hover:ring-blue-500'
              }`}
              style={{
                background: preset.type === 'solid' 
                  ? preset.colors[0]
                  : `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`,
                color: preset.colors[0] === '#FFFFFF' ? '#000000' : '#FFFFFF'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="mb-4">
        <label className={`text-sm font-medium mb-2 block ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Custom Colors
        </label>
        
        <div className="space-y-2 mb-3">
          {backgroundConfig.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className={`w-12 h-10 rounded cursor-pointer border-2 ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-mono ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-800'
                  }`}
                  placeholder="#667eea"
                />
              </div>
              {backgroundConfig.colors.length > 1 && (
                <button
                  onClick={() => removeColor(index)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-red-900/30 text-red-400' 
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {backgroundConfig.colors.length < 5 && (
          <button
            onClick={addColor}
            className={`w-full py-2 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:border-blue-400 text-gray-300 hover:text-blue-400' 
                : 'border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600'
            }`}
          >
            <Plus size={16} />
            <span className="text-sm">Add Color</span>
          </button>
        )}
      </div>

      {/* Gradient Toggle */}
      <div className="mb-4">
        <button
          onClick={toggleGradientType}
          className={`w-full py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
            backgroundConfig.type === 'gradient'
              ? isDarkMode 
                ? 'bg-blue-900 text-blue-300' 
                : 'bg-blue-100 text-blue-700'
              : isDarkMode 
                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {backgroundConfig.type === 'gradient' ? 'Gradient Mode' : 'Solid Color Mode'}
        </button>
      </div>

      {/* Gradient Angle */}
      {backgroundConfig.type === 'gradient' && backgroundConfig.colors.length > 1 && (
        <div>
          <label className={`text-sm font-medium mb-2 block ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Gradient Angle: {backgroundConfig.angle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={backgroundConfig.angle}
            onChange={(e) => setBackgroundConfig({ 
              ...backgroundConfig, 
              angle: parseInt(e.target.value) 
            })}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1">
            <button
              onClick={() => setBackgroundConfig({ ...backgroundConfig, angle: 0 })}
              className={`px-2 py-1 rounded ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              0°
            </button>
            <button
              onClick={() => setBackgroundConfig({ ...backgroundConfig, angle: 45 })}
              className={`px-2 py-1 rounded ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              45°
            </button>
            <button
              onClick={() => setBackgroundConfig({ ...backgroundConfig, angle: 90 })}
              className={`px-2 py-1 rounded ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              90°
            </button>
            <button
              onClick={() => setBackgroundConfig({ ...backgroundConfig, angle: 135 })}
              className={`px-2 py-1 rounded ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              135°
            </button>
            <button
              onClick={() => setBackgroundConfig({ ...backgroundConfig, angle: 180 })}
              className={`px-2 py-1 rounded ${
                isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              180°
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mt-4">
        <label className={`text-sm font-medium mb-2 block ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Preview
        </label>
        <div
          className="w-full h-20 rounded-lg border-2"
          style={{
            background: backgroundConfig.type === 'solid' 
              ? backgroundConfig.colors[0]
              : `linear-gradient(${backgroundConfig.angle}deg, ${backgroundConfig.colors.join(', ')})`,
            borderColor: isDarkMode ? '#4B5563' : '#D1D5DB'
          }}
        />
      </div>
    </div>
  );
};

export default BackgroundSettings;
