import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, AlertTriangle, Users, Tent, Heart,
  TrendingUp, Package, Bell, Settings, LogOut, Menu, X, Shield,
  ChevronRight, Activity, ShieldCheck, Boxes
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import NotificationPanel from '../Alerts/NotificationPanel';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/map', label: 'Risk Map', icon: Map },
  { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { path: '/predictions', label: 'Predictions', icon: TrendingUp },
  { path: '/safety', label: 'Safety Advisory', icon: ShieldCheck },
  { path: '/volunteers', label: 'Volunteers', icon: Users, roles: ['volunteer', 'admin'] },
  { path: '/shelters', label: 'Shelters', icon: Tent },
  { path: '/help-requests', label: 'Help Requests', icon: Heart },
  { path: '/resources', label: 'Resources', icon: Package },
  { path: '/allocate', label: 'Allocate Resources', icon: Boxes, roles: ['admin'] },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useAlerts();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 glass-panel border-r-0 border-r-white/5 flex flex-col transition-all duration-300 ease-in-out z-20`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="flex-shrink-0 w-8 h-8 bg-danger-600 rounded-lg flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">DisasterWatch</p>
              <p className="text-gray-500 text-xs">Response System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {filteredNav.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full ${active ? 'nav-item-active' : 'nav-item'} ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                title={!sidebarOpen ? label : ''}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium truncate">{label}</span>}
                {active && sidebarOpen && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="border-t border-white/5 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <button onClick={logout} className={`w-full nav-item text-danger-400 hover:text-danger-300 mt-1 ${!sidebarOpen ? 'justify-center px-2' : ''}`}>
            <LogOut size={16} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top bar */}
        <header className="glass-panel rounded-b-2xl border-x-0 border-t-0 border-b-white/5 px-4 py-3 flex items-center gap-4 flex-shrink-0 mx-4 mt-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-surface-700/50 transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex-1">
            <h1 className="text-white font-semibold text-sm">
              {filteredNav.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs text-success-400">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse-slow" />
            <span className="hidden sm:block">System Online</span>
          </div>

          {/* Notifications bell */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate('/profile')} className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors">
            <Settings size={18} className="text-gray-400 hover:text-white" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Notification panel */}
      {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
    </div>
  );
}
