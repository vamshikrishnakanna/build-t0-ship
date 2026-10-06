/**
 * client/src/components/Layout/Sidebar.jsx
 * Navigation sidebar with logo and links.
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Sparkles,
  Leaf,
  LogOut,
} from 'lucide-react';
import useAuthStore from '../../context/authStore';
import { getInitials } from '../../utils/formatters';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/farms', icon: Tractor, label: 'My Farms' },
  { to: '/advisory/request', icon: Sparkles, label: 'New Advisory' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5 bg-black/30 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
          <Leaf size={18} className="text-white" />
        </div>
        <div>
          <span className="font-display font-bold text-base text-white">CropAdvisor</span>
          <span className="block text-[10px] text-brand-400 font-medium tracking-wider uppercase">AI Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-700 text-xs font-bold text-brand-100 shrink-0">
            {getInitials(user?.full_name || user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {user?.full_name || 'Farmer'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
