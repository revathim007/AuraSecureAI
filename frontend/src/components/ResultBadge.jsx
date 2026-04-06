import React from 'react';

const ResultBadge = ({ prediction, confidence }) => {
  const isAlarm = prediction === 'Alarm' || prediction === 1;
  const status = isAlarm ? 'Alarm' : 'Safe';
  const confidenceScore = confidence ? Number(confidence).toFixed(1) : null;

  return (
    <div className={`inline-flex flex-col items-center gap-1 px-4 py-2 rounded-xl border shadow-sm transition-all animate-in fade-in zoom-in duration-300 ${
      isAlarm 
        ? 'bg-red-50 border-red-100 text-red-600' 
        : 'bg-green-50 border-green-100 text-green-600'
    }`}>
      <span className="text-sm font-bold uppercase tracking-wider">{status}</span>
      {confidenceScore && (
        <span className="text-[10px] font-medium opacity-75">Confidence: {confidenceScore}%</span>
      )}
    </div>
  );
};

export default ResultBadge;
