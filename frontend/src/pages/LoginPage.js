import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]           = useState({ email: '', password: '' });
  const [loading, setLoading]     = useState(false);
  const [showDemo, setShowDemo]   = useState(false); // ← hidden by default

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  // Fill demo credentials on one click
  const fillDemo = (email, password) => {
    setForm({ email, password });
    setShowDemo(false);
    toast('Credentials filled — click Sign In', { icon: '👆' });
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-danger-600 rounded-2xl mb-4">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">DisasterWatch</h1>
          <p className="text-gray-400 mt-1 text-sm">Smart Disaster Response System</p>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold text-lg mb-5">Sign In</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  className="input-field pl-9"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  className="input-field pl-9"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? <RefreshCw size={15} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300">Register</Link>
          </p>

          {/* Demo credentials — hidden behind a button, not shown upfront */}
          <div className="mt-4 border-t border-surface-700 pt-4">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between text-gray-500 hover:text-gray-300 text-xs transition-colors px-1"
            >
              <span>Demo / testing credentials</span>
              {showDemo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {showDemo && (
              <div className="mt-3 space-y-2">
                {[
                  { role: 'Admin',     email: 'admin@disaster.com',     pass: 'Admin@123', color: 'border-purple-700 hover:bg-purple-900/20',  dot: 'bg-purple-400', desc: 'Full system access' },
                  { role: 'Volunteer', email: 'volunteer@disaster.com', pass: 'Vol@123',   color: 'border-orange-700 hover:bg-orange-900/20', dot: 'bg-orange-400', desc: 'Rescue & respond' },
                  { role: 'Citizen',   email: 'citizen@disaster.com',   pass: 'Cit@123',   color: 'border-blue-700 hover:bg-blue-900/20',     dot: 'bg-blue-400',   desc: 'Report & get help' },
                ].map(({ role, email, pass, color, dot, desc }) => (
                  <button
                    key={role}
                    onClick={() => fillDemo(email, pass)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border bg-surface-800 transition-colors text-left ${color}`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs font-medium">{role}</p>
                      <p className="text-gray-500 text-xs truncate">{email}</p>
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">{desc}</span>
                  </button>
                ))}
                <p className="text-gray-600 text-xs text-center mt-1">
                  Click a role to fill credentials automatically
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
