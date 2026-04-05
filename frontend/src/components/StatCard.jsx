import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass = 'bg-primary-light text-primary' }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 transition-all hover:shadow-premium">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
