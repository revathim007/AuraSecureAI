import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldAlert, ShieldCheck, Activity, Bell, X, AlertTriangle, TrendingUp } from 'lucide-react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import { hazardService } from '../services/api';

const HazardDetection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gas_level: '',
    temperature: '',
    smoke_level: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const validate = () => {
    const newErrors = {};
    const validationRules = {
      gas_level: { min: 0, max: 1000, label: 'Gas Level' },
      temperature: { min: -50, max: 150, label: 'Temperature' },
      smoke_level: { min: 0, max: 100, label: 'Smoke Level' }
    };
    
    Object.keys(validationRules).forEach(field => {
      const value = formData[field];
      const rule = validationRules[field];
      
      if (value === '' || value === null || value === undefined) {
        newErrors[field] = `${rule.label} cannot be empty`;
      } else {
        const val = parseFloat(value);
        if (isNaN(val)) {
          newErrors[field] = 'Input must be a valid number';
        } else if (val < rule.min) {
          newErrors[field] = `Minimum allowed value is ${rule.min}`;
        } else if (val > rule.max) {
          newErrors[field] = `Maximum allowed value is ${rule.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for backspacing, otherwise validate basic numeric structure
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
      // Clear error as user types
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setResult(null);
    try {
      const payload = {
        gas_level: parseFloat(formData.gas_level),
        temperature: parseFloat(formData.temperature),
        smoke_level: parseFloat(formData.smoke_level)
      };
      const response = await hazardService.predict(payload);
      setResult(response.data);
      if (response.data.prediction === 'Alarm') {
        setShowModal(true);
      }
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3 py-6">
        <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-soft">
          <Zap size={32} className="text-primary fill-primary/20" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Machine Learning Detection</h1>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
          Input your system's current environmental data to get a real-time hazard prediction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card title="Sensor Input" subtitle="Enter precise sensor readings" className="shadow-premium border-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Gas Level (PPM)"
              type="number"
              name="gas_level"
              value={formData.gas_level}
              onChange={handleChange}
              placeholder="0 - 1000"
              error={errors.gas_level}
              min={0}
              max={1000}
              required
            />
            <InputField
              label="Temperature (°C)"
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="-50 - 150"
              error={errors.temperature}
              min={-50}
              max={150}
              required
            />
            <InputField
              label="Smoke Level (%)"
              type="number"
              name="smoke_level"
              value={formData.smoke_level}
              onChange={handleChange}
              placeholder="0 - 100"
              error={errors.smoke_level}
              min={0}
              max={100}
              required
            />

            {serverError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm animate-in fade-in duration-300">
                {serverError}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth className="py-4 text-lg">
              Check Hazard Status
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card title="Prediction Result" subtitle="ML-generated safety status" className="shadow-premium border-none min-h-[400px] flex flex-col items-center justify-center text-center">
            {result ? (
              <div className="animate-in zoom-in-95 duration-500 space-y-8 py-6 w-full">
                <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto border-4 shadow-premium ${
                  result.prediction === 'Alarm' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-green-50 border-green-100 text-green-500'
                }`}>
                  {result.prediction === 'Alarm' ? <ShieldAlert size={64} /> : <ShieldCheck size={64} />}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">System Status</p>
                  <h3 className={`text-5xl font-black ${result.prediction === 'Alarm' ? 'text-red-500' : 'text-green-500'}`}>
                    {result.prediction}
                  </h3>
                </div>

                <div className="max-w-[200px] mx-auto p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confidence Score</p>
                  <p className="text-2xl font-extrabold text-gray-700">{result.confidence_score.toFixed(1)}%</p>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => navigate('/forecasting', { state: { inputData: formData } })}
                    className="py-3 border-2"
                  >
                    <TrendingUp size={18} /> View Future Forecast
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-10 opacity-50">
                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-gray-200">
                  <Activity size={48} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-bold max-w-[200px] mx-auto leading-relaxed">
                  Enter data on the left to see the ML prediction result here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl border border-red-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="relative flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-red-200 animate-bounce-slow">
                <AlertTriangle size={40} className="text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-gray-900">Critical Hazard!</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Our AI system has detected a potential danger based on the current sensor readings.
                </p>
              </div>

              <div className="w-full space-y-3 pt-2">
                <Button 
                  variant="danger" 
                  fullWidth 
                  className="py-4 text-lg shadow-lg shadow-red-100"
                  onClick={() => {
                    setShowModal(false);
                    navigate('/emergency-contacts');
                  }}
                >
                  <Bell size={20} /> Send Alerts Now
                </Button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Dismiss for now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HazardDetection;
