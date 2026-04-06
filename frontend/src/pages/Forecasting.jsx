import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TrendingUp, Clock, Wind, Thermometer, Droplets, Info, BarChart3, AlertTriangle, ChevronLeft } from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

const Forecasting = () => {
  const location = useLocation();
  const inputData = location.state?.inputData;

  // Calculate dynamic forecast based on user input
  const forecastData = useMemo(() => {
    if (!inputData) return null;

    const baseGas = parseFloat(inputData.gas_level) || 100;
    const baseTemp = parseFloat(inputData.temperature) || 60;
    const baseSmoke = parseFloat(inputData.smoke_level) || 5;
    const basePressure = 200; // Default as it's not in the input form yet

    const intervals = ['1 Hour Later', '2 Hours Later', '3 Hours Later', '4 Hours Later', '5 Hours Later'];
    
    return intervals.map((time, index) => {
      // Simulate slight trends (e.g., temperature rising 0.5 deg/hr, gas fluctuating)
      const multiplier = (index + 1);
      const tempTrend = baseTemp + (multiplier * 0.8) + (Math.random() * 2 - 1);
      const gasTrend = baseGas + (Math.random() * 20 - 10);
      const pressureTrend = basePressure + (Math.random() * 10 - 5);
      const smokeTrend = Math.max(0, baseSmoke + (Math.random() * 2 - 1));

      // Simple risk rule matching train_model.py logic
      const isRisk = gasTrend > 250 || smokeTrend > 15 || tempTrend > 90;

      return {
        time,
        temp: tempTrend.toFixed(1),
        gas: gasTrend.toFixed(0),
        pressure: pressureTrend.toFixed(0),
        smoke: smokeTrend.toFixed(1),
        risk: isRisk ? 'Warning' : 'Stable'
      };
    });
  }, [inputData]);

  if (!inputData) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-gray-200">
          <BarChart3 size={48} className="text-gray-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-800">No Input Data Found</h2>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Forecasting requires sensor readings. Please complete a hazard detection scan first to see future trends.
          </p>
        </div>
        <Link to="/hazard-detection">
          <Button className="px-8 py-4 text-lg mt-4">
            <ChevronLeft size={20} /> Go to Detection
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate averages from the forecast
  const avgGas = (forecastData.reduce((acc, curr) => acc + parseFloat(curr.gas), 0) / forecastData.length).toFixed(0);
  const avgTemp = (forecastData.reduce((acc, curr) => acc + parseFloat(curr.temp), 0) / forecastData.length).toFixed(1);
  const avgPressure = (forecastData.reduce((acc, curr) => acc + parseFloat(curr.pressure), 0) / forecastData.length).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-gradient-to-br from-white to-gray-50 rounded-[2.5rem] shadow-premium border border-gray-100/50">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">User-Driven Forecast</h1>
          <p className="text-gray-500 font-medium text-lg">
            Projected trends based on your current input: <span className="text-primary font-bold">Gas {inputData.gas_level} | Temp {inputData.temperature}°C | Smoke {inputData.smoke_level}%</span>
          </p>
        </div>
        <Link to="/hazard-detection">
          <Button variant="outline" className="border-2">
            <ChevronLeft size={20} /> New Detection
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Projected Gas" 
          value={`${avgGas} PPM`} 
          icon={Wind} 
          colorClass="bg-blue-50 text-blue-500" 
        />
        <StatCard 
          title="Projected Temp" 
          value={`${avgTemp}°C`} 
          icon={Thermometer} 
          colorClass="bg-orange-50 text-orange-500" 
        />
        <StatCard 
          title="Projected Pressure" 
          value={`${avgPressure} hPa`} 
          icon={BarChart3} 
          colorClass="bg-purple-50 text-purple-500" 
        />
        <StatCard 
          title="Trend Status" 
          value={forecastData.some(f => f.risk === 'Warning') ? 'At Risk' : 'Stable'} 
          icon={forecastData.some(f => f.risk === 'Warning') ? AlertTriangle : Droplets} 
          colorClass={forecastData.some(f => f.risk === 'Warning') ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-500'} 
        />
      </div>

      {/* Forecast Table */}
      <Card title="Future Projection" subtitle="Calculated trends based on current readings" className="shadow-premium border-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Time Window</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Temperature (°C)</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Gas (PPM)</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Pressure (hPa)</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Smoke (%)</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Projected Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forecastData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Clock size={16} />
                      </div>
                      <span className="font-bold text-gray-700">{item.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.temp}°C</td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.gas} PPM</td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.pressure} hPa</td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.smoke}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                      item.risk === 'Warning' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="bg-blue-50 border-2 border-blue-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-soft">
        <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
          <Info size={32} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-blue-900">Forecasting Model</h4>
          <p className="text-blue-700 font-medium">
            This forecast uses a trend-based simulation starting from your latest input. It projects potential sensor drift and evaluates risk levels using the system's safety rules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
