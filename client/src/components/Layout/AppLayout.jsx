/**
 * client/src/components/Layout/AppLayout.jsx
 * Wrapper layout for authenticated pages with sidebar and top navbar.
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#080d08] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
