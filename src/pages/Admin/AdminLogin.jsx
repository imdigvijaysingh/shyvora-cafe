import React, { useState } from 'react';
import { Coffee, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setIsLoading(true);
      let loginSuccessful = false;
      let tokenToSave = '';

      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: trimmedUser, password: trimmedPass })
        });

        const text = await res.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch (_) {
          // Response is not JSON (e.g. server returning HTML or empty response)
        }

        if (res.ok && data && data.success) {
          loginSuccessful = true;
          tokenToSave = data.token;
        } else if (data && !data.success) {
          throw new Error(data.message || 'Invalid admin credentials');
        }
      } catch (fetchErr) {
        // If it's a specific credential error thrown above, rethrow it
        if (fetchErr.message && !fetchErr.message.includes('fetch') && !fetchErr.message.includes('network') && !fetchErr.message.includes('JSON')) {
          throw fetchErr;
        }
      }

      // Offline / Local fallback: If server is offline or proxy is inactive,
      // allow default admin credentials seamlessly so the owner is never locked out
      if (!loginSuccessful) {
        if (trimmedUser === 'admin' && trimmedPass === 'cafeadmin2026') {
          loginSuccessful = true;
          tokenToSave = 'cafe_admin_local_session_' + Date.now();
        } else {
          throw new Error('Invalid admin credentials. (Default: admin / cafeadmin2026)');
        }
      }

      // Save token
      localStorage.setItem('cafe_admin_token', tokenToSave);
      if (onLoginSuccess) {
        onLoginSuccess(tokenToSave);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('cafeadmin2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#1F2421] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cafe-accent/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#16302B]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#252B27] border border-[#3A433E] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cafe-accent to-[#8C6D46] rounded-2xl flex items-center justify-center shadow-lg shadow-cafe-accent/20 mb-4">
            <Coffee className="text-white w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
            Brew & Bloom Cafe
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1F2421] border border-[#3A433E] rounded-full text-cafe-accent text-xs font-semibold tracking-wider uppercase mt-3">
            <ShieldCheck size={13} />
            Owner Portal & CMS
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-3">
            Authorized management access for menu, seasonal themes, hero media, and orders.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-red-200 text-xs sm:text-sm animate-fade-in-up">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full bg-[#1A1F1C] border border-[#3A433E] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-cafe-accent transition-colors placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-[#1A1F1C] border border-[#3A433E] rounded-xl pl-10 pr-10 py-3 text-white text-sm focus:outline-none focus:border-cafe-accent transition-colors placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Helper */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-cafe-accent hover:underline flex items-center gap-1 font-medium"
            >
              Fill default credentials (admin)
            </button>
            <span className="text-[11px] text-gray-500">Port 5000 / Render</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-cafe-accent to-[#8C6D46] hover:from-[#B89366] hover:to-[#9E7C52] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cafe-accent/25 hover:shadow-cafe-accent/40 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Access Admin Panel</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-[#3A433E]/60 text-center">
          <p className="text-[11px] text-gray-400">
            Protected URL: <span className="font-mono text-cafe-accent">/index-admin</span>. Not listed in public menus or search indices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

