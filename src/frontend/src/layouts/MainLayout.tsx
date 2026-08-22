import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  MapPin,
  Phone,
  ChevronDown,
  Search,
  User,
  LogOut,
  Code2,
  Apple,
  Smartphone,
  Mail,
  ShieldCheck,
  GraduationCap,
  FileText
} from 'lucide-react';
import { NotificationDropdown } from '@/features/notification/components/NotificationDropdown';

export const MainLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-zinc-900 font-['Inter'] antialiased">
      
      {/* 1. TOP UTILITY BAR (bg-blue-950) */}
      <div className="w-full bg-blue-950 py-3 shrink-0">
        <div className="max-w-[1340px] w-full mx-auto px-6 flex justify-between items-center text-xs text-white">
          <div className="flex justify-start items-center gap-6">
            <div className="flex justify-start items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-white/80" />
              <span className="opacity-90 font-normal">1442 Crosswind Drive Madisonville</span>
            </div>
            <div className="hidden sm:flex justify-start items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-white/80" />
              <span className="opacity-90 font-normal">+1 45887 77874</span>
            </div>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="flex justify-start items-center gap-1 cursor-pointer">
              <span className="opacity-90 font-normal">English</span>
              <ChevronDown className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="flex justify-start items-center gap-1 cursor-pointer">
              <span className="opacity-90 font-normal">USD</span>
              <ChevronDown className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="hidden md:flex justify-start items-center gap-3 text-white/80">
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">f</span>
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">𝕏</span>
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">in</span>
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">yt</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (Streamlined logical navigation) */}
      <header className="sticky top-0 z-40 w-full py-3.5 bg-white border-b border-slate-100 flex flex-col justify-center items-center shadow-xs">
        <div className="max-w-[1340px] w-full mx-auto px-6 h-14 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-900 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-950">
              Skill<span className="text-rose-500">Boost</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex justify-start items-center gap-8">
            
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/student')
                  ? 'text-indigo-900 font-semibold'
                  : 'text-zinc-900 hover:text-indigo-900'
              }`}
            >
              Dashboard
            </Link>

            {/* Courses */}
            <Link
              to="/courses"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/courses') || location.pathname.startsWith('/learn')
                  ? 'text-indigo-900 font-semibold'
                  : 'text-zinc-900 hover:text-indigo-900'
              }`}
            >
              Courses
            </Link>

            {/* Instructors */}
            <Link
              to="/instructors"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/instructors') ? 'text-indigo-900 font-semibold' : 'text-zinc-900 hover:text-indigo-900'
              }`}
            >
              Instructors
            </Link>

            {/* Practice (OJ) - with Submenu for Problem List & Submission History */}
            <div className="relative group py-2">
              <Link
                to="/practice"
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/practice') || location.pathname.startsWith('/submissions')
                    ? 'text-indigo-900 font-semibold'
                    : 'text-zinc-900 hover:text-indigo-900'
                }`}
              >
                <span>Practice (OJ)</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-900 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Practice Dropdown Menu */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 flex flex-col gap-1">
                  <Link
                    to="/practice"
                    className="p-2.5 rounded-xl hover:bg-indigo-50/70 flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 block">Problem List</span>
                      <span className="text-xs text-neutral-400">Explore 100+ coding challenges</span>
                    </div>
                  </Link>

                  <Link
                    to="/submissions"
                    className="p-2.5 rounded-xl hover:bg-indigo-50/70 flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 block">Submission History</span>
                      <span className="text-xs text-neutral-400">Review past verdicts, code &amp; stats</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Interview */}
            <Link
              to="/interview"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/interview') ? 'text-indigo-900 font-semibold' : 'text-zinc-900 hover:text-indigo-900'
              }`}
            >
              AI Interview
            </Link>
          </nav>

          {/* Actions (Search + Notifications + User profile) */}
          <div className="flex justify-start items-center gap-3">
            <button className="p-2.5 rounded-[40px] border border-neutral-200 hover:bg-slate-50 transition-colors cursor-pointer" title="Search">
              <Search className="w-4 h-4 text-gray-700" />
            </button>

            {/* Notification Center */}
            <NotificationDropdown />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                {user.roles.includes('TEACHER') && (
                  <Link
                    to="/teacher/dashboard"
                    className="px-3.5 py-1.5 rounded-[40px] border border-indigo-900 text-indigo-900 text-xs font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Teacher Portal
                  </Link>
                )}
                {user.roles.includes('ADMIN') && (
                  <Link
                    to="/admin/verifications"
                    className="px-3.5 py-1.5 rounded-[40px] border border-emerald-600 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-[40px] flex items-center gap-1.5 text-zinc-900 text-sm font-medium transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-800" />
                  {user.fullName || user.email.split('@')[0]}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-[40px] hover:bg-rose-50 text-neutral-500 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-[40px] flex items-center gap-1.5 text-zinc-900 text-sm font-medium transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-800" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-[40px] text-white text-sm font-medium transition-colors shadow-sm shadow-rose-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* 3. DREAMS LMS FOOTER (NO CART) */}
      <footer className="self-stretch px-6 lg:px-20 pt-20 pb-10 bg-blue-950 flex flex-col justify-start items-start gap-14 mt-auto">
        <div className="max-w-[1810px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: About LMS */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center text-white">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="text-white text-xl font-extrabold tracking-tight">LMS Coding</span>
            </div>
            <p className="opacity-70 text-white text-sm font-normal leading-relaxed">
              LMS Coding is the ultimate online coding judge and educational platform designed to empower developers and students of all experience levels with world-class coding challenges.
            </p>
            <div className="flex flex-col gap-3">
              <span className="text-white text-sm font-bold">Download our mobile app</span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-neutral-900 rounded-md border border-zinc-800 flex items-center gap-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                  <Apple className="w-4 h-4 text-white" />
                  <div className="flex flex-col text-left">
                    <span className="opacity-60 text-white text-[9px]">Download on the</span>
                    <span className="text-white text-xs font-bold">App Store</span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-neutral-900 rounded-md border border-zinc-800 flex items-center gap-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                  <Smartphone className="w-4 h-4 text-white" />
                  <div className="flex flex-col text-left">
                    <span className="opacity-60 text-white text-[9px]">GET IT ON</span>
                    <span className="text-white text-xs font-bold">Google Play</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: For Instructor */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-lg font-bold">For Instructor</h3>
            <ul className="flex flex-col gap-3.5 text-white/70 text-sm font-normal">
              <li><Link to="/instructors" className="hover:text-white transition-colors">Search Mentors</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Booking</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Students</Link></li>
              <li><Link to="/teacher/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: For Student */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-lg font-bold">For Student</h3>
            <ul className="flex flex-col gap-3.5 text-white/70 text-sm font-normal">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Appointments</Link></li>
              <li><Link to="/submissions" className="hover:text-white transition-colors">Submission History</Link></li>
              <li><Link to="/interview" className="hover:text-white transition-colors">AI Mock Interview</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-lg font-bold">Newsletter</h3>
            <div className="flex flex-col gap-3">
              <div className="p-1.5 bg-white rounded-lg flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 pl-2.5 text-zinc-900 text-sm placeholder:text-neutral-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-5 py-2.5 bg-red-400 hover:bg-red-500 rounded-md text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 text-white/70 text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>1442 Crosswind Drive, Madisonville</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>support@dreamslms.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>+1 45887 77874</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Bottom Bar */}
        <div className="max-w-[1810px] w-full mx-auto pt-6 border-t border-indigo-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <span>© 2025 DreamsLMS. All Rights Reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
