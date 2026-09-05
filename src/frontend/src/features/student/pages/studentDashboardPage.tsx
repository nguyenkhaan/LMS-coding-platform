import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, BookOpen, Heart, Bot, Settings, LogOut, Flame, Clock, Code2, ChevronRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { StudentHeroCard } from '../components/studentHeroCard.tsx';

// Mock Contribution Heatmap Data (52 weeks x 4 rows)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate deterministic pattern for the 4 rows x 48 columns grid
const HEATMAP_ROWS = [
  [3, 1, 2, 3, 2, 2, 0, 2, 2, 2, 1, 2, 2, 0, 2, 0, 2, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 0, 1, 2, 1, 0, 0, 0, 0, 1, 2, 3, 1, 0, 1, 1, 0],
  [3, 2, 1, 2, 3, 2, 2, 2, 1, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 3, 3, 1, 0, 0, 0, 1, 3, 3, 2, 3, 3, 2, 2],
  [3, 0, 0, 2, 3, 2, 1, 2, 2, 1, 3, 2, 2, 1, 1, 1, 1, 3, 3, 3, 1, 1, 0, 0, 3, 2, 2, 2, 2, 2, 3, 1, 2, 1, 2, 3, 1, 1, 2, 1, 1, 3, 1, 0, 0, 1, 1, 0],
  [3, 2, 1, 1, 3, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 0, 0, 0, 0, 2, 2, 0, 1, 2, 2, 2, 2, 1, 0, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 1, 2, 0, 0, 2],
];

const INTENSITY_COLORS = [
  'bg-neutral-100 border border-neutral-200', // 0
  'bg-emerald-200',                           // 1
  'bg-emerald-400',                           // 2
  'bg-emerald-600',                           // 3
];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'courses' | 'favorites' | 'interview'>('dashboard');

  return (
    <div className="w-full min-h-screen bg-slate-100 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. HERO TITLE BANNER (bg-gradient-to-r from-red-100 via-sky-100 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <span className="text-zinc-900 font-semibold">Student Dashboard</span>
        </div>
      </div>

      {/* 2. PROFILE HERO CARD */}
      <StudentHeroCard displayName={user?.fullName} />

      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row justify-start items-start gap-8">
        
        {/* LEFT SIDEBAR MENU (w-80) */}
        <aside className="w-full lg:w-72 bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs shrink-0 flex flex-col gap-6">
          
          {/* Main Menu Group */}
          <div className="flex flex-col gap-3">
            <span className="text-zinc-900 text-sm font-bold tracking-wide px-2">Main Menu</span>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-rose-50 text-rose-500 font-bold'
                    : 'text-neutral-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-rose-500" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/student/profile')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => navigate('/student/courses')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Enrolled Courses</span>
              </button>

              <button
                onClick={() => navigate('/student/favorites')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </button>

              <button
                onClick={() => navigate('/interview')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4 text-indigo-900" />
                <span>AI Interview</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Account Settings Group */}
          <div className="flex flex-col gap-3">
            <span className="text-zinc-900 text-sm font-bold tracking-wide px-2">Account Settings</span>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <button
                onClick={() => alert('Opening account settings...')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={logout}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

        </aside>

        {/* RIGHT MAIN WORKSPACE (flex-1) */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-8">
          
          {/* Greeting Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-zinc-900 text-2xl font-bold tracking-tight">Welcome back, Ronald!</h2>
            <p className="text-neutral-500 text-sm">Keep up the great work on your learning journey.</p>
          </div>

          {/* 4 TOP KPI CARDS (Recently) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* KPI 1: Courses in Progress */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-medium">Courses in progress</span>
                <span className="text-zinc-900 text-2xl font-bold font-mono">3</span>
                <span className="text-neutral-400 text-[11px]">1 finishing this week</span>
              </div>
            </div>

            {/* KPI 2: Problems Solved */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Code2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-medium">Problems solved</span>
                <span className="text-zinc-900 text-2xl font-bold font-mono">128</span>
                <span className="text-emerald-600 text-[11px] font-semibold">+12 this week</span>
              </div>
            </div>

            {/* KPI 3: Current Streak */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-medium">Current streak</span>
                <span className="text-zinc-900 text-2xl font-bold font-mono">17 days</span>
                <span className="text-neutral-400 text-[11px]">Best: 31 days</span>
              </div>
            </div>

            {/* KPI 4: Study Time */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                <Clock className="w-6 h-6 text-sky-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-medium">Study time</span>
                <span className="text-zinc-900 text-2xl font-bold font-mono">42h</span>
                <span className="text-neutral-400 text-[11px]">Last 30 days</span>
              </div>
            </div>

          </div>

          {/* CONTRIBUTION HEATMAP SECTION (Exact Figma specs) */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 flex flex-col gap-4">
            
            {/* Heatmap Header */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <div className="flex flex-col">
                <span className="text-neutral-500 text-xs font-medium">Number of contributions</span>
                <span className="text-zinc-900 text-2xl font-bold font-mono">3,936</span>
              </div>
              <div className="px-3 py-1 bg-violet-50 border border-violet-200 rounded-full flex items-center gap-1.5 text-xs text-violet-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>You are in 1% of creators</span>
              </div>
            </div>

            {/* Month Labels & Heatmap Grid */}
            <div className="flex flex-col gap-2 overflow-x-auto pt-2">
              {/* Month Header Row */}
              <div className="grid grid-cols-12 gap-1 text-center text-[11px] font-medium text-neutral-500 min-w-[720px]">
                {MONTHS.map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>

              {/* Matrix Grid (4 rows x 48 columns) */}
              <div className="flex flex-col gap-1 min-w-[720px]">
                {HEATMAP_ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-1">
                    {row.map((intensity, colIdx) => (
                      <div
                        key={colIdx}
                        className={`w-3.5 h-3.5 rounded-xs transition-transform hover:scale-125 cursor-pointer ${INTENSITY_COLORS[intensity]}`}
                        title={`Level ${intensity} activity`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Footer Legend */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
              <span className="cursor-pointer hover:underline">Learn how we count contributions</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-xs bg-neutral-100 border border-neutral-300" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-emerald-200" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-emerald-400" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-emerald-600" />
                </div>
                <span>More</span>
              </div>
            </div>

          </div>

          {/* CONTINUE LEARNING SECTION (Exact Figma 3 Courses) */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h3 className="text-zinc-900 text-lg font-bold">Continue learning</h3>
                <p className="text-neutral-500 text-xs">Pick up where you left off</p>
              </div>
              <Link to="/courses" className="text-indigo-900 text-sm font-semibold hover:underline flex items-center gap-1">
                <span>All courses</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Course Rows */}
            <div className="p-6 flex flex-col gap-4">
              
              {/* Course 1 */}
              <div className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-900" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="text-zinc-900 text-base font-bold truncate">Python Foundations for Problem Solving</h4>
                    <span className="text-neutral-500 text-xs">Lê Quang Huy</span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-900 rounded-full" style={{ width: '64%' }} />
                      </div>
                      <span className="text-xs font-bold font-mono text-neutral-600">64%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/learn/python-foundations')}
                  className="px-5 py-2 border border-neutral-200 hover:border-indigo-900 hover:text-indigo-900 rounded-xl text-sm font-semibold transition-colors cursor-pointer self-start sm:self-center"
                >
                  Open
                </button>
              </div>

              {/* Course 2 */}
              <div className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-900" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="text-zinc-900 text-base font-bold truncate">Data Structures &amp; Algorithms Interview Prep</h4>
                    <span className="text-neutral-500 text-xs">Nguyễn Thu Hà</span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-900 rounded-full" style={{ width: '28%' }} />
                      </div>
                      <span className="text-xs font-bold font-mono text-neutral-600">28%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/learn/dsa-interview-prep')}
                  className="px-5 py-2 border border-neutral-200 hover:border-indigo-900 hover:text-indigo-900 rounded-xl text-sm font-semibold transition-colors cursor-pointer self-start sm:self-center"
                >
                  Open
                </button>
              </div>

              {/* Course 3 */}
              <div className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-900 shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-900" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="text-zinc-900 text-base font-bold truncate">Production React &amp; TypeScript</h4>
                    <span className="text-neutral-500 text-xs">Trần Minh Đức</span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-900 rounded-full" style={{ width: '12%' }} />
                      </div>
                      <span className="text-xs font-bold font-mono text-neutral-600">12%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/learn/react-typescript')}
                  className="px-5 py-2 border border-neutral-200 hover:border-indigo-900 hover:text-indigo-900 rounded-xl text-sm font-semibold transition-colors cursor-pointer self-start sm:self-center"
                >
                  Open
                </button>
              </div>

            </div>
          </div>

          {/* BOTTOM ROW: 2 COLUMNS (AI Interview History vs Recommended Problems) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: AI INTERVIEW HISTORY (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="text-zinc-900 text-lg font-bold">AI Interview History</h3>
                <span className="text-xs text-neutral-400 font-mono">3 sessions</span>
              </div>

              <div className="p-6 flex flex-col gap-3.5">
                
                {/* Session 1 */}
                <div
                  onClick={() => navigate('/interview/report/session-001')}
                  className="p-3.5 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="text-center shrink-0">
                      <span className="text-indigo-900 text-sm font-bold block">03/08</span>
                      <span className="text-neutral-400 text-[10px] font-medium">19:00</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h5 className="text-zinc-900 text-sm font-bold truncate">AI mock interview - 1</h5>
                      <span className="text-neutral-400 text-xs truncate">System Design &amp; Cache</span>
                    </div>
                  </div>
                  {/* Purple Percentage Pill */}
                  <div className="w-12 h-12 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center text-indigo-900 font-bold font-mono text-xs shrink-0 shadow-2xs">
                    50%
                  </div>
                </div>

                {/* Session 2 */}
                <div
                  onClick={() => navigate('/interview/report/session-002')}
                  className="p-3.5 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="text-center shrink-0">
                      <span className="text-indigo-900 text-sm font-bold block">03/08</span>
                      <span className="text-neutral-400 text-[10px] font-medium">06:30</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h5 className="text-zinc-900 text-sm font-bold truncate">AI mock interview — 2</h5>
                      <span className="text-neutral-400 text-xs truncate">Algorithms &amp; Two-Pointer</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center text-indigo-900 font-bold font-mono text-xs shrink-0 shadow-2xs">
                    80%
                  </div>
                </div>

                {/* Session 3 */}
                <div
                  onClick={() => navigate('/interview/report/session-003')}
                  className="p-3.5 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="text-center shrink-0">
                      <span className="text-indigo-900 text-sm font-bold block">02/08</span>
                      <span className="text-neutral-400 text-[10px] font-medium">22:00</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h5 className="text-zinc-900 text-sm font-bold truncate">AI mock interview - 3</h5>
                      <span className="text-neutral-400 text-xs truncate">Concurrency &amp; Locks</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center text-indigo-900 font-bold font-mono text-xs shrink-0 shadow-2xs">
                    20%
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT: RECOMMENDED PROBLEMS (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                <div>
                  <h3 className="text-zinc-900 text-lg font-bold">Recommended problems</h3>
                  <p className="text-neutral-500 text-xs">Chosen from your weakest topics</p>
                </div>
                <Link to="/practice" className="text-indigo-900 text-sm font-semibold hover:underline flex items-center gap-1">
                  <span>Problem list</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 4 Problem Cards */}
              <div className="p-6 flex flex-col gap-3.5">
                
                {/* Problem 1 */}
                <div
                  onClick={() => navigate('/practice/longest-substring-without-repeating')}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-neutral-400 text-xs font-mono font-semibold">OJ-204</span>
                    <h5 className="text-zinc-900 text-base font-bold truncate">Longest Substring Without Repeating</h5>
                    <span className="text-neutral-500 text-xs">Sliding Window · 46% acceptance</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg shrink-0">
                    Medium
                  </span>
                </div>

                {/* Problem 2 */}
                <div
                  onClick={() => navigate('/practice/course-schedule')}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-neutral-400 text-xs font-mono font-semibold">OJ-231</span>
                    <h5 className="text-zinc-900 text-base font-bold truncate">Course Schedule</h5>
                    <span className="text-neutral-500 text-xs">Graph · 41% acceptance</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg shrink-0">
                    Medium
                  </span>
                </div>

                {/* Problem 3 */}
                <div
                  onClick={() => navigate('/practice/median-of-two-sorted-arrays')}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-neutral-400 text-xs font-mono font-semibold">OJ-310</span>
                    <h5 className="text-zinc-900 text-base font-bold truncate">Median of Two Sorted Arrays</h5>
                    <span className="text-neutral-500 text-xs">Binary Search · 24% acceptance</span>
                  </div>
                  <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg shrink-0">
                    Hard
                  </span>
                </div>

                {/* Problem 4 */}
                <div
                  onClick={() => navigate('/practice/word-ladder-ii')}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-neutral-400 text-xs font-mono font-semibold">OJ-344</span>
                    <h5 className="text-zinc-900 text-base font-bold truncate">Word Ladder II</h5>
                    <span className="text-neutral-500 text-xs">BFS · 19% acceptance</span>
                  </div>
                  <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg shrink-0">
                    Hard
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
