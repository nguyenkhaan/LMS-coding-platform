import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Heart,
  Bot,
  Settings,
  LogOut
} from 'lucide-react';

interface StudentSidebarProps {
  activePath: string;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ activePath }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const mainItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'My Profile' },
    { to: '/student/courses', icon: BookOpen, label: 'Enrolled Courses' },
    { to: '/student/favorites', icon: Heart, label: 'Favorites' },
    { to: '/interview', icon: Bot, label: 'AI Interview' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs shrink-0 flex flex-col gap-6 font-['Inter']">
      {/* Main Menu Group */}
      <div className="flex flex-col gap-3">
        <span className="text-zinc-900 text-sm font-bold tracking-wide px-2">Main Menu</span>
        <div className="flex flex-col gap-1 text-sm font-medium">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.to || 
              (item.to === '/student/profile' && activePath === '/profile') ||
              (item.to === '/student/courses' && activePath === '/courses/enrolled');
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  isActive
                    ? 'px-3.5 py-2.5 rounded-xl flex items-center gap-3 bg-rose-50 text-rose-500 font-bold transition-colors cursor-pointer'
                    : 'px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer font-medium'
                }
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      {/* Account Settings Group */}
      <div className="flex flex-col gap-3">
        <span className="text-zinc-900 text-sm font-bold tracking-wide px-2">Account Settings</span>
        <div className="flex flex-col gap-1 text-sm font-medium">
          <Link
            to="/student/settings"
            className={
              activePath === '/student/settings'
                ? 'px-3.5 py-2.5 rounded-xl flex items-center gap-3 bg-rose-50 text-rose-500 font-bold transition-colors cursor-pointer'
                : 'px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer font-medium'
            }
          >
            <Settings className={`w-4 h-4 ${activePath === '/student/settings' ? 'text-rose-500' : 'text-neutral-500'}`} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer text-left w-full font-medium"
          >
            <LogOut className="w-4 h-4 text-neutral-500 hover:text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
