import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false, min, max, step = "any" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isNumber = type === 'number';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
          {label} {required && <span className="text-red-500 font-black">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={isNumber ? step : undefined}
          className={`input-field pr-10 font-medium ${error ? 'border-red-400 ring-2 ring-red-100' : 'hover:border-gray-200'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
