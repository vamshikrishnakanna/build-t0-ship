/**
 * client/src/components/Layout/Navbar.jsx
 * Top navigation bar for authenticated pages.
 */

import { useLocation, Link } from 'react-router-dom';
import { Sparkles, Plus } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your farm overview at a glance' },
  '/farms': { title: 'My Farms', subtitle: 'Manage your farm profiles' },
  '/advisory/request': { title: 'New Advisory', subtitle: 'Generate AI-powered crop recommendations' },
};

export default function Navbar() {
  const location = useLocation();
  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: 'CropAdvisor AI',
    subtitle: '',
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="text-lg font-display font-semibold text-white">
          {pageInfo.title}
        </h1>
        {pageInfo.subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{pageInfo.subtitle}</p>
        )}
      </div>

      <Link to="/advisory/request" className="btn-primary text-xs">
        <Sparkles size={14} />
        New Advisory
      </Link>
    </header>
  );
}
