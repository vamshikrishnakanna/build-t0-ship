/**
 * client/src/pages/RegisterPage.jsx
 * User registration page with full_name, email, and password fields.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { authApi } from '../services/api';
import useAuthStore from '../context/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const passwordStrength = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  }

  function validate() {
    const newErrors = {};
    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Please enter your full name.';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await authApi.register(payload);
      const { token, user } = response.data;
      setAuth(token, user);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080d08]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-brand-600/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-earth-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 mb-4">
            <Leaf size={22} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start growing smarter today — it's free</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="input-label">Full Name</label>
              <input
                id="reg-name"
                name="full_name"
                type="text"
                autoComplete="name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Smith"
                className="input-field"
              />
              {errors.full_name && <p className="text-xs text-red-400 mt-1">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="input-label">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="input-label">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}

              {/* Password strength indicators */}
              {formData.password && (
                <div className="flex gap-3 mt-2">
                  {[
                    { met: passwordStrength.minLength, label: '8+ chars' },
                    { met: passwordStrength.hasUpper, label: 'Uppercase' },
                    { met: passwordStrength.hasNumber, label: 'Number' },
                  ].map(({ met, label }) => (
                    <div key={label} className={`flex items-center gap-1 text-[10px] ${met ? 'text-brand-400' : 'text-gray-600'}`}>
                      <Check size={10} className={met ? 'text-brand-400' : 'text-gray-600'} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="input-label">Confirm Password</label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="input-field"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-xs text-red-400">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-sm"
              id="register-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
