import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, BookOpen, Heart, Bot, Settings, LogOut, Star, ChevronLeft, ChevronRight, Code2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { StudentHeroCard } from '../components/studentHeroCard.tsx';

interface FavoriteCourse {
  id: string;
  title: string;
  instructor: string;
  slug: string;
  rating: number;
  price: string;
  category: string;
}

interface FavoriteProblem {
  id: string;
  code: string;
  title: string;
  topic: string;
  acceptance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const FAVORITE_COURSES: FavoriteCourse[] = [
  {
    id: 'fav-1',
    title: 'Python Foundations for Problem Solving',
    instructor: 'Alex Johnson',
    slug: 'python-foundations',
    rating: 4.8,
    price: '$79.00',
    category: 'Programming'
  },
  {
    id: 'fav-2',
    title: 'Data Structures & Algorithms Interview Prep',
    instructor: 'Edythe Andrew',
    slug: 'dsa-interview-prep',
    rating: 4.9,
    price: '$129.00',
    category: 'Algorithms'
  },
  {
    id: 'fav-3',
    title: 'Production React & TypeScript Masterclass',
    instructor: 'Ronald Richard',
    slug: 'react-typescript',
    rating: 4.8,
    price: '$79.00',
    category: 'Frontend'
  },
  {
    id: 'fav-4',
    title: 'System Design for High-Throughput Services',
    instructor: 'David Miller',
    slug: 'system-design-mastery',
    rating: 4.9,
    price: '$99.00',
    category: 'Architecture'
  }
];

const FAVORITE_PROBLEMS: FavoriteProblem[] = [
  {
    id: 'p1',
    code: 'OJ-204',
    title: 'Longest Substring Without Repeating',
    topic: 'Sliding Window',
    acceptance: '46%',
    difficulty: 'Medium'
  },
  {
    id: 'p2',
    code: 'OJ-231',
    title: 'Course Schedule',
    topic: 'Graph · Topological Sort',
    acceptance: '41%',
    difficulty: 'Medium'
  },
  {
    id: 'p3',
    code: 'OJ-310',
    title: 'Median of Two Sorted Arrays',
    topic: 'Binary Search',
    acceptance: '24%',
    difficulty: 'Hard'
  },
  {
    id: 'p4',
    code: 'OJ-001',
    title: 'Two Sum',
    topic: 'Hash Map · Array',
    acceptance: '82%',
    difficulty: 'Easy'
  }
];

export function StudentFavoritesPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'problems'>('courses');
  const [courseList, setCourseList] = useState<FavoriteCourse[]>(FAVORITE_COURSES);
  const [problemList, setProblemList] = useState<FavoriteProblem[]>(FAVORITE_PROBLEMS);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleRemoveCourse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCourseList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleRemoveProblem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProblemList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. HERO TITLE BANNER (bg-gradient-to-r from-red-50 via-sky-50 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Favorites</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Favorites</span>
        </div>
      </div>

      {/* 2. PROFILE HERO CARD */}
      <StudentHeroCard displayName={user?.fullName} />

      {/* 3. MAIN WORKSPACE (2 Columns: Left Menu Sidebar + Right Favorites Content) */}
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

              <button
                onClick={() => navigate('/student/courses')}
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-neutral-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Enrolled Courses</span>
              </button>

              {/* Favorites - ACTIVE */}
              <button
                className="px-3.5 py-2.5 rounded-xl flex items-center gap-3 bg-rose-50 text-rose-500 font-bold transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
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

        {/* RIGHT MAIN WORKSPACE: FAVORITES CONTENT */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          
          {/* Sub Tab Switcher: Favorite courses / Favorite problems */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <div className="p-1 bg-slate-200/80 rounded-xl inline-flex items-center gap-1">
              <button
                onClick={() => setActiveSubTab('courses')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'courses'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-neutral-600 hover:text-zinc-900'
                }`}
              >
                Favorite courses ({courseList.length})
              </button>

              <button
                onClick={() => setActiveSubTab('problems')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === 'problems'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-neutral-600 hover:text-zinc-900'
                }`}
              >
                Favorite problems ({problemList.length})
              </button>
            </div>
          </div>

          {/* TAB 1: FAVORITE COURSES GRID (Exact Figma 2-Column Cards) */}
          {activeSubTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseList.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.slug}`)}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between relative group cursor-pointer"
                >
                  {/* Top Graphic Media Header */}
                  <div className="h-28 bg-gradient-to-r from-indigo-900 via-indigo-950 to-blue-900 p-4 flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>

                    {/* Red Heart Favorite Toggle Icon */}
                    <button
                      onClick={(e) => handleRemoveCourse(course.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>

                  {/* Course Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-zinc-900 text-sm sm:text-base font-bold line-clamp-2 leading-tight">
                        {course.title}
                      </h3>
                      <span className="text-neutral-500 text-xs font-medium">
                        {course.instructor}
                      </span>
                    </div>

                    {/* Rating Row */}
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-zinc-900 font-bold text-xs font-mono">{course.rating}</span>
                      <span className="text-neutral-400 text-[11px]">· {course.category}</span>
                    </div>

                    {/* Price & View Button */}
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                      <span className="text-indigo-900 text-base font-bold font-mono">
                        {course.price}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.slug}`);
                        }}
                        className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        View
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FAVORITE PROBLEMS LIST */}
          {activeSubTab === 'problems' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problemList.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => navigate(`/practice/${prob.code.toLowerCase()}`)}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between gap-4 cursor-pointer relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-400 text-xs font-mono font-bold">{prob.code}</span>
                      <h4 className="text-zinc-900 text-base font-bold">{prob.title}</h4>
                      <span className="text-neutral-500 text-xs">{prob.topic} · {prob.acceptance} acceptance</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {prob.difficulty}
                      </span>

                      <button
                        onClick={(e) => handleRemoveProblem(prob.id, e)}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-neutral-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/practice/${prob.code.toLowerCase()}`);
                      }}
                      className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      Solve Problem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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
