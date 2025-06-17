// components/LoadingSpinner.tsx (or .js)
import React from 'react';

interface LoadingSpinnerProps {
  message?: string; // Optional message to display below the spinner
  size?: 'sm' | 'md' | 'lg'; // Optional size control
  color?: string; // Optional color for the spinner
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...", // Default message
  size = "md", // Default size
  color = "text-blue-500", // Default color
}) => {
  let spinnerSizeClasses = 'h-8 w-8'; // Default for md
  let messageSizeClass = 'text-lg';

  if (size === 'sm') {
    spinnerSizeClasses = 'h-6 w-6';
    messageSizeClass = 'text-base';
  } else if (size === 'lg') {
    spinnerSizeClasses = 'h-12 w-12';
    messageSizeClass = 'text-xl';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <div className={`animate-spin rounded-full border-b-2 ${spinnerSizeClasses} ${color}`}></div>
      {message && <p className={`mt-4 font-semibold ${messageSizeClass} ${color.replace('text-', 'text-')}`}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;