import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'indigo',
  message
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          border-4
          ${colorClasses[color as keyof typeof colorClasses]}
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      {message && (
        <p className={`mt-2 text-sm text-${color}-600`}>
          {message}
        </p>
      )}
    </div>
  );
};