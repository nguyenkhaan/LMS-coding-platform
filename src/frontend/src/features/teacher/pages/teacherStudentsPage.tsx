import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { SiteHeader } from '../../../components/common/siteHeader.tsx';
import { SiteFooter } from '../../../components/common/siteFooter.tsx';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  Mail,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface StudentItem {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  enrolledDate: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
}

const MOCK_STUDENTS: StudentItem[] = [
  {
    id: 'S1',
    name: 'Jenny Wilson',
    email: 'jenny.wilson@example.com',
    course: 'Production React & TypeScript',
    progress: 42,
    enrolledDate: '18 Jan 2026',
    status: 'Active',
    lastActivity: 'Solved problem "Merge Intervals" yesterday'
  },
  {
    id: 'S2',
    name: 'Ronald Richard',
    email: 'ronald.richard@example.com',
    course: 'Python Foundations for Problem Solving',
    progress: 10,
    enrolledDate: '16 Jan 2026',
    status: 'Active',
    lastActivity: 'Started Lesson 3 today'
  },
  {
    id: 'S3',
    name: 'Bessie Cooper',
    email: 'bessie.cooper@example.com',
    course: 'Production React & TypeScript',
    progress: 85,
    enrolledDate: '12 Dec 2025',
    status: 'Active',
    lastActivity: 'Submitted quiz "Advanced Hooks" 2 days ago'
  },
  {
    id: 'S4',
    name: 'Cody Fisher',
    email: 'cody.fisher@example.com',
    course: 'Python Foundations for Problem Solving',
    progress: 100,
    enrolledDate: '18 Dec 2025',
    status: 'Active',
    lastActivity: 'Completed course'
  },
  {
    id: 'S5',
    name: 'Patricia Sanders',
    email: 'patricia.sanders@example.com',
    course: 'Data Structures & Algorithms Prep',
    progress: 0,
    enrolledDate: '22 Jan 2026',
    status: 'Active',
    lastActivity: 'Enrolled in course'
  }
];

export const TeacherStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const displayName = user?.fullName || 'Teacher Account';
  const avatarUrl = 'https://placehold.co/96x96';

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'All' || student.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      {/* 1. HEADER */}
      <SiteHeader />

      {/* 2. PAGE TITLE BANNER */}
      <div className="w-full bg-gradient-to-r from-primary to-purple-600 py-8 flex flex-col items-center justify-center gap-1 shrink-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-extrabold">Student Directory</h1>
        <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Students</p>
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
        <TeacherSidebar activePath="/teacher/students" />

        {/* Right workspace details */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all bg-white text-zinc-900"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-neutral-400" />
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all bg-white text-zinc-700 w-full sm:w-auto"
                >
                  <option value="All">All Courses</option>
                  <option value="Python Foundations for Problem Solving">Python Foundations</option>
                  <option value="Production React & TypeScript">React &amp; TypeScript</option>
                  <option value="Data Structures & Algorithms Prep">DS &amp; Algorithms Prep</option>
                </select>
              </div>

              <button
                onClick={handleRefresh}
                className="p-2 border border-gray-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer text-neutral-500 shrink-0"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
              </button>
            </div>
          </div>

          {/* Student list card panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <h3 className="text-base font-bold text-zinc-900">Active Enrolled Students</h3>
              <span className="text-xs font-semibold text-neutral-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {filteredStudents.length} Students found
              </span>
            </div>

            {/* View states: loading, error, empty, list */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-neutral-500">Loading student directory...</span>
              </div>
            ) : error ? (
              <div className="p-8 border border-rose-100 bg-rose-50/50 rounded-2xl flex items-center gap-3 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center text-neutral-400">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">No Students Found</h4>
                <p className="text-sm text-neutral-500 max-w-xs">
                  Try adjusting your search terms or course filter selection to find students.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className="p-5 rounded-2xl border border-slate-150 bg-white hover:shadow-xs transition-all flex flex-col gap-4"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
                          {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-zinc-900">{student.name}</span>
                          <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            {student.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border text-emerald-700 bg-emerald-50 border-emerald-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {student.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 pt-4 mt-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-zinc-700 truncate max-w-[200px] sm:max-w-xs">{student.course}</span>
                          <span className="text-indigo-950 font-bold">{student.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${student.progress}%` }} 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-450" />
                          Enrolled: <strong>{student.enrolledDate}</strong>
                        </span>
                        <span className="text-neutral-500 mt-1 font-medium italic truncate">
                          Last activity: {student.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default TeacherStudentsPage;
