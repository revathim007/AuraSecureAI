import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ message = "No data available", icon: Icon = Database }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-200">
        <Icon size={32} className="text-gray-400" />
      </div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;
