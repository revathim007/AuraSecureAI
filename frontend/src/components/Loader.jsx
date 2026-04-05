import React from 'react';

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-primary/20 border-t-primary',
    secondary: 'border-secondary/20 border-t-secondary',
    white: 'border-white/20 border-t-white',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin transition-all`} />
    </div>
  );
};

export default Loader;
