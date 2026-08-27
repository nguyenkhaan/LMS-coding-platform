import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, BookOpen, Heart, Bot, Settings, LogOut, Clock, ChevronLeft, ChevronRight, Code2, PlayCircle, Award } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { StudentHeroCard } from '../components/studentHeroCard.tsx';

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  slug: string;
  progress: number;
  lastAccessed: string;
  nextLesson: string;
  status: 'active' | 'completed';
  category: string;
}

const COURSES_DATA: EnrolledCourse[] = [
  {
    id: 'c1',
    title: 'Python Foundations for Problem Solving',
    instructor: 'Lê Quang Huy',
    slug: 'python-foundations',
    progress: 64,
    lastAccessed: '2 hours ago',
    nextLesson: 'Sets and frozensets',
    status: 'active',
    category: 'Programming'
  },
  {
    id: 'c2',
    title: 'Production React & TypeScript',
    instructor: 'Trần Minh Đức',
    slug: 'react-typescript',
    progress: 12,
    lastAccessed: '5 days ago',
    nextLesson: 'Suspense & data fetching',
    status: 'active',
    category: 'Frontend'
  },
  {
    id: 'c3',
    title: 'Data Structures & Algorithms Interview Prep',
    instructor: 'Nguyễn Thu Hà',
    slug: 'dsa-interview-prep',
    progress: 28,
    lastAccessed: 'Yesterday',
    nextLesson: 'Binary search on answer',
    status: 'active',
    category: 'Algorithms'
  },
  {
    id: 'c4',
    title: 'System Design for High-Throughput Services',
    instructor: 'Hoàng Nam',
    slug: 'system-design-mastery',
    progress: 85,
    lastAccessed: '1 day ago',
    nextLesson: 'Distributed Caching with Redis',
    status: 'active',
    category: 'Architecture'
  },
  {
    id: 'c5',
    title: 'Modern C++ 20 Masterclass & Concurrency',
    instructor: 'Vũ Đức',
    slug: 'modern-cpp-20',
    progress: 45,
    lastAccessed: '3 days ago',
    nextLesson: 'Memory Models & Atomic Operations',
    status: 'active',
    category: 'Systems'
  },
  {
    id: 'c6',
    title: 'Full-Stack Microservices with Go & gRPC',
    instructor: 'Phạm Hùng',
    slug: 'golang-microservices',
    progress: 100,
    lastAccessed: '1 week ago',
    nextLesson: 'Course Completed · Certificate Earned',
    status: 'completed',
    category: 'Backend'
  }
];

import { useEnrolledCourses } from '@/hooks/api/useEnrolledCourses';

export function EnrolledCoursesPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { enrolledCourses } = useEnrolledCourses();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const allCourses: EnrolledCourse[] = [...COURSES_DATA];
  
  enrolledCourses.forEach(ec => {
    if (!allCourses.some(c => c.slug === ec.slug || String(c.id) === String(ec.id))) {
      allCourses.push({
        id: String(ec.id),
        title: ec.title,
        instructor: 'Instructor',
        slug: ec.slug,
        progress: ec.progress_percent || 0,
        lastAccessed: 'Just now',
        nextLesson: 'Start Learning',
        status: 'active',
        category: 'Programming'
      });
    }
  });

  const filteredCourses = allCourses.filter((course) => {
    if (filter === 'active') return course.status === 'active';
    if (filter === 'completed') return course.status === 'completed';
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-slate-100 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. HERO TITLE BANNER (bg-gradient-to-r from-red-50 via-sky-50 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Enrolled Courses</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Enrolled Courses</span>
        </div>
      </div>

      {/* 2. PROFILE HERO CARD */}
      <StudentHeroCard displayName={user?.fullName} />

      {/* 3. MAIN WORKSPACE (2 Columns: Left Menu Sidebar + Right Course Grid) */}
      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row justify-start items-start gap-8">
        
        {/* LEFT SIDEBAR MENU (w-72) */}
        <aside className="w-full lg:w-72 bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs shrink-0 flex flex-col gap-6">
          
          {/* Main Menu Group */}
          <div className="flex flex-col gap-3">
            <span className="text-zinc-900 text-sm font-bold tracking-wide px-2">Main Menu</span>
            <div className="flex flex-col gap-1 text-sm font-medium">
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/student/profile')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              {/* Enrolled Courses - ACTIVE */}
              <button
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 bg-rose-50 text-rose-500 font-bold transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-rose-500" />
                <span>Enrolled Courses</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
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
                onClick={() => alert('Opening settings...')}
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

        {/* RIGHT MAIN WORKSPACE: ENROLLED COURSES */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          
          {/* Header Row with Filter Pills (Enrolled 09, Active 06, Completed 03) */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-200">
            <h2 className="text-zinc-900 text-2xl font-bold tracking-tight">Enrolled Courses</h2>
            
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-[40px] text-sm font-medium transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-200/80 hover:bg-slate-200 text-zinc-800'
                }`}
              >
                Enrolled (09)
              </button>

              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-[40px] text-sm font-medium transition-colors cursor-pointer ${
                  filter === 'active'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-200/80 hover:bg-slate-200 text-zinc-800'
                }`}
              >
                Active (06)
              </button>

              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-[40px] text-sm font-medium transition-colors cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-200/80 hover:bg-slate-200 text-zinc-800'
                }`}
              >
                Completed (03)
              </button>
            </div>
          </div>

          {/* Enrolled Courses Grid (3 Columns on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Course Card Top Media Banner */}
                <div className="h-28 bg-gradient-to-r from-indigo-900 via-indigo-950 to-blue-900 p-4 flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold rounded-md uppercase">
                    {course.category}
                  </span>
                </div>

                {/* Course Card Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  
                  <div className="flex flex-col gap-1">
                    <h3 className="text-zinc-900 text-base font-bold line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    <span className="text-neutral-500 text-xs font-medium">
                      {course.instructor}
                    </span>
                  </div>

                  {/* Progress Tube Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          course.progress === 100
                            ? 'bg-emerald-500'
                            : course.progress >= 50
                            ? 'bg-indigo-900'
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400 text-[11px]">Completion</span>
                      <span className="text-zinc-900 font-bold font-mono text-[11px]">{course.progress}%</span>
                    </div>
                  </div>

                  {/* Activity Metadata */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Last accessed {course.lastAccessed}</span>
                    </div>
                    <span className="text-neutral-600 font-medium truncate">
                      Next: {course.nextLesson}
                    </span>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => navigate(`/learn/${course.slug}`)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                      course.progress === 100
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-indigo-900 hover:bg-indigo-950 text-white'
                    }`}
                  >
                    {course.progress === 100 ? (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Review Course</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pt-6 border-t border-neutral-200 flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-500">
              Page {currentPage} of 2
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === 1
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'
                }`}
              >
                1
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === 2
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'
                }`}
              >
                2
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                disabled={currentPage === 2}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
