import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user types
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  const validateInput = () => {
    let isValid = true;
    const newErrors = { username: '', password: '', general: '' };

    if (!formData.username || !formData.password) {
      newErrors.general = 'Please fill in both username and password';
      isValid = false;
    }

    if (/[^\x00-\x7F]/.test(formData.username)) {
      newErrors.username = 'Username cannot contain special characters';
      isValid = false;
    }

    if (/[^\x00-\x7F]/.test(formData.password)) {
      newErrors.password = 'Password cannot contain special characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;

      if (formData.rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      navigate('/home');
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.message || 'Login failed'
      }));
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>
        </div>

        {errors.general && <div className="error-message general">{errors.general}</div>}

        <button type="submit" className="login-button">Login</button>

        <div className="links">
          <Link to="/auth/register">Register</Link>
          <Link to="/auth/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 