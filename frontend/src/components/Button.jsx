import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, fullWidth = false, className = '' }) => {
  const baseStyles = 'px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-soft active:scale-95 flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark disabled:bg-gray-300',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light disabled:border-gray-200 disabled:text-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;
