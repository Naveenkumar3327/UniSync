import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { 
  Home, Megaphone, FileText, Search, Users, Trophy, BookOpen, 
  BarChart2, Bell, User, Settings, LogOut, ChevronLeft, ChevronRight, 
  HelpCircle, Calendar, Shield, Activity, DollarSign, CalendarDays, Briefcase
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarExpanded, toggleSidebar } = useThemeStore();

  const role = user?.role || 'student';
  const profile = user?.profile || {};
  const fullName = profile.full_name || profile.staff_name || profile.admin_name || 'User';
  
  // Custom navigation configurations for roles
  const getNavItems = (): SidebarItem[] => {
    switch (role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/dashboard/student', icon: Home },
          { name: 'Announcements', path: '/dashboard/student/announcements', icon: Megaphone },
          { name: 'Opportunity Hub', path: '/dashboard/student/opportunity-hub', icon: Briefcase },
          { name: 'Complaints', path: '/dashboard/student/complaints', icon: FileText },
          { name: 'Lost & Found', path: '/dashboard/student/lost-found', icon: Search },
          { name: 'Collaborations', path: '/dashboard/student/collaboration', icon: Users },
          { name: 'Study Workspace', path: '/dashboard/student/study-workspace', icon: BookOpen },
          { name: 'Live Polls', path: '/dashboard/student/polls', icon: BarChart2 },
          { name: 'Marketplace', path: '/dashboard/student/marketplace', icon: DollarSign },
          { name: 'Achievements', path: '/dashboard/student/achievements', icon: Trophy },
          { name: 'Notifications', path: '/dashboard/student/notifications', icon: Bell },
          { name: 'Profile', path: '/dashboard/student/profile', icon: User },
        ];
      case 'staff':
        return [
          { name: 'Dashboard', path: '/dashboard/staff', icon: Home },
          { name: 'Exams Plan', path: '/dashboard/staff/exams', icon: CalendarDays },
          { name: 'Timetable', path: '/dashboard/staff/timetable', icon: Calendar },
          { name: 'Announcements', path: '/dashboard/staff/announcements', icon: Megaphone },
          { name: 'Poll Management', path: '/dashboard/staff/polls', icon: BarChart2 },
          { name: 'Collaborations', path: '/dashboard/staff/collaborations', icon: Users },
          { name: 'Analytics', path: '/dashboard/staff/analytics', icon: Activity },
          { name: 'Notifications', path: '/dashboard/staff/notifications', icon: Bell },
          { name: 'Profile', path: '/dashboard/staff/profile', icon: User },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard/admin', icon: Home },
          { name: 'User Management', path: '/dashboard/admin/users', icon: Shield },
          { name: 'Complaints Hub', path: '/dashboard/admin/complaints', icon: FileText },
          { name: 'Announcements', path: '/dashboard/admin/announcements', icon: Megaphone },
          { name: 'Lost & Found Control', path: '/dashboard/admin/lost-found', icon: Search },
          { name: 'Analytics', path: '/dashboard/admin/analytics', icon: Activity },
          { name: 'Audit Logs', path: '/dashboard/admin/audit-logs', icon: Shield },
          { name: 'Notifications', path: '/dashboard/admin/notifications', icon: Bell },
          { name: 'Profile', path: '/dashboard/admin/profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`glass-panel h-screen border-r border-card-border fixed left-0 top-0 z-40 transition-all duration-300 flex flex-col justify-between ${
        sidebarExpanded ? 'w-[280px]' : 'w-[80px]'
      }`}
    >
      {/* Sidebar Top / Brand section */}
      <div>
        <div className="flex items-center justify-between p-5 border-b border-card-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0 animate-float">
              U
            </div>
            {sidebarExpanded && (
              <span className="font-display font-bold text-lg text-text tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                UniSync
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-background-alt text-text-muted flex-shrink-0"
          >
            {sidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation Items Link */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary text-white shadow-premium'
                    : 'text-text-muted hover:text-text hover:bg-primary-light dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-text-muted group-hover:text-primary transition-colors'} />
                {sidebarExpanded && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </span>
                )}
                {!sidebarExpanded && (
                  <div className="absolute left-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile card & Logout */}
      <div className="p-3 border-t border-card-border bg-slate-500/5">
        {sidebarExpanded ? (
          <div className="flex flex-col gap-3">
            {/* User credentials summary */}
            <div className="flex items-center gap-3 p-1">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold border border-card-border">
                {fullName.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-text truncate">{fullName}</span>
                <span className="text-[10px] text-text-muted capitalize truncate">
                  {role} &bull; {profile.department?.split(' ')[0] || 'Office'}
                </span>
              </div>
            </div>
            
            {/* Action buttons */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors text-xs font-semibold"
            >
              <LogOut size={14} />
              Logout Session
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold border border-card-border cursor-pointer">
              {fullName.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
