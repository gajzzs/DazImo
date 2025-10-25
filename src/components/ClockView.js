
import React from 'react';

const ClockView = ({ realTime, isDarkMode, isFullscreen, setActiveTab, setTime, setCurrentSession }) => {
  const handleQuickFocus = (minutes) => {
    setActiveTab('pomodoro');
    setTime(minutes * 60);
    setCurrentSession('work');
  };

  return (
    <div className="text-center flex-1 flex flex-col justify-center">
      <div className={`font-light mb-4 font-mono transition-all duration-`}