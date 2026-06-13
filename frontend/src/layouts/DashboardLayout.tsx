import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Sidebar from '../components/Sidebar';
import { Bell, Sun, Moon, Search, User } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { darkMode, toggleDarkMode, sidebarExpanded } = useThemeStore();

  useEffect(() => {
    // Protected route check
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-xl bg-primary animate-spin" />
      </div>
    );
  }

  const role = user.role || 'student';
  const profile = user.profile || {};
  const fullName = profile.full_name || profile.staff_name || profile.admin_name || 'User';

  return (
    <div className={`min-h-screen bg-background text-text transition-colors duration-300 role-${role}`}>
      {/* Dynamic Background Mesh Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className="transition-all duration-300 min-h-screen flex flex-col"
        style={{ paddingLeft: sidebarExpanded ? '280px' : '80px' }}
      >
        {/* Header toolbar */}
        <header className="glass-panel border-b border-card-border h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources, events, or files..."
                className="w-full bg-background-alt border border-card-border rounded-xl py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-text placeholder-text-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-background-alt border border-card-border hover:bg-primary-light transition-colors text-text-muted hover:text-primary"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => navigate(`/dashboard/${role}/notifications`)}
                className="p-2 rounded-xl bg-background-alt border border-card-border hover:bg-primary-light transition-colors text-text-muted hover:text-primary relative"
              >
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </button>
            </div>

            <div className="w-px h-6 bg-card-border" />

            {/* User credentials banner */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-semibold text-text">{fullName}</span>
                <span className="text-[10px] text-text-muted capitalize">{role} Account</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm cursor-pointer" onClick={() => navigate(`/dashboard/${role}/settings`)}>
                {fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body Router Outlet */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
