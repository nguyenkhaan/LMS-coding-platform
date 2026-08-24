import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  BookOpen,
  DollarSign,
  Users,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';

interface TeacherSidebarProps {
  activePath: string;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ activePath }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/profile', icon: User, label: 'My Profile' },
    { to: '/teacher/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/teacher/students', icon: Users, label: 'Students' },
    { to: '/teacher/earnings', icon: DollarSign, label: 'Earnings' },
    { to: '/teacher/wallet', icon: Wallet, label: 'Payout & Wallet' },
  ];

  return (
    <div className="w-full lg:w-72 shrink-0 font-['Inter']">
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Main Menu</h3>
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.to || 
                (item.to === '/teacher/courses' && activePath.startsWith('/teacher/courses')) ||
                (item.to === '/teacher/courses' && activePath === '/teacher/course-builder');
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    isActive
                      ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF4667] font-semibold bg-rose-50/60 text-sm'
                      : 'flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-[#FF4667] hover:bg-slate-50 transition-all text-sm font-medium'
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Account Settings</h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/teacher/settings"
              className={
                activePath === '/teacher/settings'
                  ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF4667] font-semibold bg-rose-50/60 text-sm'
                  : 'flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-[#FF4667] hover:bg-slate-50 transition-all text-sm font-medium'
              }
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-rose-500 hover:bg-rose-50/50 transition-all text-sm text-left w-full cursor-pointer font-medium"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
