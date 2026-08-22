import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEnrolledCourses } from '@/features/courses/hooks/useEnrolledCourses';
import { FigmaHeader } from '../courses/components/figma_header';
import { FigmaFooter } from '../courses/components/figma_footer';
import { LayoutDashboard, BookOpen, User, LogOut, Sparkles } from 'lucide-react';

export const EnrolledCoursesPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { enrolledCourses: apiCourses } = useEnrolledCourses();

  const userName = user?.fullName || 'Ronald Richard';
  const userEmail = user?.email || 'ronald.richard@example.com';

  // Fallback mock courses matching Figma data structure
  const mockCourses = [
    {
      id: 1,
      slug: 'python-foundations',
      title: 'Python Foundations for Problem Solving',
      instructor: 'Lê Quang Huy',
      progress_percent: 64,
      last_accessed: '2 hours ago',
      next_lesson: 'Sets and frozensets',
      thumbnail_url: 'https://placehold.co/360x200'
    },
    {
      id: 2,
      slug: 'production-react-typescript',
      title: 'Production React & TypeScript',
      instructor: 'Trần Minh Đức',
      progress_percent: 12,
      last_accessed: '5 days ago',
      next_lesson: 'Suspense & data fetching',
      thumbnail_url: 'https://placehold.co/360x200'
    },
    {
      id: 3,
      slug: 'data-structures-algorithms',
      title: 'Data Structures & Algorithms Interview Prep',
      instructor: 'Nguyễn Thu Hà',
      progress_percent: 28,
      last_accessed: 'Yesterday',
      next_lesson: 'Binary search on answer',
      thumbnail_url: 'https://placehold.co/360x200'
    }
  ];

  // Map backend API data or fallback
  const displayCourses = apiCourses && apiCourses.length > 0 ? apiCourses.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    instructor: 'Nguyễn Thu Hà',
    progress_percent: c.progress_percent,
    last_accessed: 'Recently',
    next_lesson: 'Next lesson details',
    thumbnail_url: c.thumbnail_url || 'https://placehold.co/360x200'
  })) : mockCourses;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start items-center">
      <div className="w-full max-w-[1892px] bg-white shadow-2xl rounded-3xl border border-neutral-100 overflow-hidden flex flex-col">
        {/* Figma Header */}
        <FigmaHeader />

        {/* Hero banner */}
        <div className="w-full max-w-[1296px] mx-auto px-4 pt-10">
          <div className="w-full h-48 bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-6 relative z-10">
              <img 
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white" 
                src="https://placehold.co/96x96" 
                alt="Profile Avatar"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{userName}</h2>
                  <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
                </div>
                <p className="text-neutral-200 text-sm font-medium">Student ({userEmail})</p>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10">
              <button className="px-5 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-all cursor-pointer">
                Become a Teacher
              </button>
              <button 
                onClick={() => navigate('/teacher/dashboard')}
                className="px-5 py-2.5 bg-[#FF4667] text-white text-sm font-semibold rounded-full hover:bg-[#e03d5b] transition-all cursor-pointer"
              >
                Teacher Dashboard
              </button>
            </div>

            {/* Background design accents */}
            <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
          </div>
        </div>

        {/* Page body section */}
        <div className="w-full max-w-[1296px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm">
              
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Main Menu</h3>
                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/student/dashboard" className="text-[#6B7280] hover:text-[#FF4667] transition-all flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/student/profile" className="text-[#6B7280] hover:text-[#FF4667] transition-all flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/student/courses" className="text-[#FF4667] font-semibold bg-rose-50/50 px-3 py-2 rounded-xl flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    <span>Enrolled Courses</span>
                  </Link>
                  <Link to="/student/favorites" className="text-[#6B7280] hover:text-[#FF4667] transition-all flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Favorites</span>
                  </Link>
                  <Link to="/interview" className="text-[#6B7280] hover:text-[#FF4667] transition-all flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Interview</span>
                  </Link>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Account Settings</h3>
                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/student/settings" className="text-[#6B7280] hover:text-[#FF4667] transition-all flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50">
                    <User className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-[#6B7280] hover:text-rose-500 transition-all flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-rose-50/50 text-left w-full cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Header & Filter tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <h2 className="text-[20px] font-bold text-[#392C7D]">Enrolled Courses</h2>
              
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-1.5 bg-[#FF4667] text-white text-xs font-semibold rounded-full hover:opacity-95 transition-all cursor-pointer">
                  Enrolled (09)
                </button>
                <button className="px-4 py-1.5 bg-slate-100 text-[#374151] text-xs font-semibold rounded-full hover:bg-slate-200 transition-all cursor-pointer">
                  Active (06)
                </button>
                <button className="px-4 py-1.5 bg-slate-100 text-[#374151] text-xs font-semibold rounded-full hover:bg-slate-200 transition-all cursor-pointer">
                  Completed (03)
                </button>
              </div>
            </div>

            {/* Courses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {displayCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-all">
                  
                  {/* Thumbnail header */}
                  <div className="h-44 bg-[#392C7D] flex items-center justify-center text-white font-bold relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img className="w-full h-full object-cover" src={course.thumbnail_url} alt={course.title} />
                    ) : (
                      <span className="text-lg">LMS Course</span>
                    )}
                  </div>
                  
                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-[#111827] text-[16px] leading-snug line-clamp-2 min-h-[44px]">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#374151] font-medium">{course.instructor}</p>
                    </div>
                    
                    {/* Progress details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-[#374151]">
                        <span>Progress</span>
                        <span>{course.progress_percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#392C7D] rounded-full transition-all duration-300"
                          style={{ width: `${course.progress_percent}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Access Metadata */}
                    <div className="flex flex-col gap-1 text-[11px] text-[#6B7280] bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#374151]">Last accessed:</span>
                        <span>{course.last_accessed}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-medium text-[#374151]">Next:</span>
                        <span className="truncate">{course.next_lesson}</span>
                      </div>
                    </div>
                    
                    {/* Continue Button */}
                    <Link 
                      to={`/learn/${course.slug}`} 
                      className="w-full py-3 bg-[#392C7D] hover:bg-[#2d2263] text-white text-center rounded-xl font-bold text-xs tracking-wide transition-all block cursor-pointer"
                    >
                      Continue Learning
                    </Link>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="w-full flex justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-4">
              <div className="text-xs text-[#6B7280]">Page 1 of 2</div>
              
              <div className="flex gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#374151] rounded-full text-xs font-bold transition-all cursor-pointer">
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#FF4667] text-white rounded-full text-xs font-bold transition-all cursor-pointer">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#374151] rounded-full text-xs font-bold transition-all cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#374151] rounded-full text-xs font-bold transition-all cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#374151] rounded-full text-xs font-bold transition-all cursor-pointer">
                  &gt;
                </button>
              </div>
            </div>

          </div>
          
        </div>

        {/* Figma Footer */}
        <FigmaFooter />
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;