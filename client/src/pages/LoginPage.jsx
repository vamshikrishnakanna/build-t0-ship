/**
 * client/src/pages/LoginPage.jsx
 * User login page with email/password form.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';
import useAuthStore from '../context/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      const { token, user } = response.data;
      setAuth(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080d08]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-600/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-earth-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 mb-4">
            <Leaf size={22} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your CropAdvisor account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="input-label">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="input-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-sm"
              id="login-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
