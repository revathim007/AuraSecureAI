import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-in slide-in-from-bottom-4 duration-500 shadow-premium">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-500 font-medium">Please login to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe123"
          error={errors.username}
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
        />

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm mb-6 animate-in fade-in duration-300">
            {serverError}
          </div>
        )}

        <Button type="submit" loading={loading} fullWidth className="mt-4">
          Login
        </Button>

        <p className="text-center mt-8 text-sm font-medium text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Login;
