import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { FigmaHeader } from '../courses/components/figma_header';
import { FigmaFooter } from '../courses/components/figma_footer';
import { TeacherSidebar } from './components/teacher_sidebar';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  PlusCircle, 
  Settings, 
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const displayName = user?.fullName || 'Teacher Account';
  const avatarUrl = 'https://placehold.co/96x96';

  // Aligned with existing mock data across features/teacher
  const stats = [
    { label: 'Total Courses', value: '5', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Approved Courses', value: '3', icon: Layers, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Students', value: '1,248', icon: Users, color: 'text-rose-600 bg-rose-50' },
    { label: 'Total Revenue', value: '$1,240.00', icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
  ];

  const recentEnrollments = [
    { id: 1, name: 'Jenny Wilson', course: 'Production React & TypeScript', date: 'Just now', progress: 42 },
    { id: 2, name: 'Ronald Richard', course: 'Python Foundations for Problem Solving', date: '2 hours ago', progress: 10 },
    { id: 3, name: 'Bessie Cooper', course: 'Production React & TypeScript', date: '1 day ago', progress: 85 },
    { id: 4, name: 'Cody Fisher', course: 'Python Foundations for Problem Solving', date: '3 days ago', progress: 100 },
  ];

  const activeCourses = [
    { title: 'Python Foundations for Problem Solving', status: 'APPROVED', students: 840, price: 49 },
    { title: 'Production React & TypeScript', status: 'APPROVED', students: 408, price: 64 },
    { title: 'Data Structures & Algorithms Prep', status: 'DRAFT', students: 0, price: 52 },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      {/* 1. HEADER */}
      <FigmaHeader />

      {/* 2. PAGE TITLE BANNER */}
      <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1 shrink-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Teacher Dashboard</h1>
        <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Overview</p>
      </div>

      {/* 3. PROFILE HERO BANNER */}
      <div className="w-full max-w-[1340px] mx-auto px-4 pt-8">
        <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-white shadow-sm">
          <div className="flex items-center gap-6 relative z-10">
            <img
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white"
              src={avatarUrl}
              alt={displayName}
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
              <span className="text-neutral-200 text-sm font-medium">Instructor Studio</span>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-white text-indigo-900 text-sm font-semibold rounded-full hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              Switch to Student
            </button>
          </div>
          <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
        </div>
      </div>

      {/* 4. MAIN WORKSPACE CONTENT */}
      <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start flex-1">
        {/* Left sidebar navigation */}
        <TeacherSidebar activePath="/teacher/dashboard" />

        {/* Right workspace details */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Welcome alert */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-[#111827]">Welcome back, {user?.fullName || 'Instructor'}!</h3>
              <p className="text-sm text-[#6B7280]">Here is what is happening with your courses and students today.</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                  <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#6B7280]">{stat.label}</span>
                    <span className="text-2xl font-bold text-[#111827] mt-0.5">{stat.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#111827]">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/teacher/course-builder"
                className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-250 bg-slate-50/50 hover:bg-slate-50 hover:border-[#392C7D] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-[#392C7D]" />
                  <span className="text-sm font-semibold text-[#374151] group-hover:text-[#392C7D]">Create Course</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                to="/teacher/course-builder"
                className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-250 bg-slate-50/50 hover:bg-slate-50 hover:border-[#392C7D] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-[#374151] group-hover:text-[#392C7D]">Manage Courses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                to="/teacher/students"
                className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-250 bg-slate-50/50 hover:bg-slate-50 hover:border-[#392C7D] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-semibold text-[#374151] group-hover:text-[#392C7D]">View Students</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                to="/teacher/earnings"
                className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-250 bg-slate-50/50 hover:bg-slate-50 hover:border-[#392C7D] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold text-[#374151] group-hover:text-[#392C7D]">View Earnings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Enrollments activity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#111827]">Recent Student Activity</h3>
                <Link to="/teacher/students" className="text-xs font-semibold text-[#FF4667] hover:underline flex items-center gap-0.5">
                  See all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex flex-col gap-3.5">
                {recentEnrollments.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#392C7D] font-bold text-sm shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[#111827] truncate">{student.name}</span>
                        <span className="text-[12px] text-[#6B7280] truncate">{student.course}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs text-[#6B7280] font-medium">{student.date}</span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-100">
                        Progress: {student.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses summary performance */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#111827]">Active Courses</h3>
                <Link to="/teacher/course-builder" className="text-xs font-semibold text-[#FF4667] hover:underline flex items-center gap-0.5">
                  View Builder <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex flex-col gap-3.5">
                {activeCourses.map((course) => (
                  <div key={course.title} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 flex flex-col gap-2.5">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-sm font-bold text-[#111827] line-clamp-1">{course.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                        course.status === 'APPROVED' 
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                          : 'text-amber-700 bg-amber-50 border-amber-100'
                      }`}>
                        {course.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B7280] font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <strong>{course.students}</strong> Enrolled Students
                      </span>
                      <span className="text-[#392C7D] font-extrabold text-sm">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <FigmaFooter />
    </div>
  );
};

export default TeacherDashboardPage;
