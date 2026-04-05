import React from 'react';

const Card = ({ children, title, subtitle, footer, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-100/50 overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100/50 bg-gray-50/50">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3 border-t border-gray-100/50 bg-gray-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
