import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useCourseStore, Course } from '@/features/courses/model/useCourseStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export const TeacherCoursesPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { courses, loadCourses, addCourse, deleteCourse } = useCourseStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const displayName = user?.fullName || 'Edythe Andrew';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

  const handleCreateCourse = () => {
    const title = prompt('Enter Course Title:', 'New Python Course');
    if (!title || !title.trim()) {
      toast.error('Course title is required to start.');
      return;
    }
    const newId = addCourse({
      title: title.trim(),
      description: 'Enter a detailed description for your new course here.',
      field: 'Programming',
      price: 0,
      thumbnail_url: 'https://placehold.co/360x200',
      status: 'DRAFT'
    });
    toast.success('Course workspace created successfully.');
    navigate(`/teacher/courses/${newId}/edit`);
  };

  const handleDeleteCourse = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will delete all sections, lessons, and activities.`)) {
      deleteCourse(id);
      toast.success('Course deleted successfully.');
    }
  };

  // Filter courses based on active tab
  const filteredCourses = courses.filter((c) => {
    if (activeTab === 'PUBLISHED') return c.status === 'APPROVED' || c.status === 'PENDING_REVIEW';
    if (activeTab === 'DRAFT') return c.status === 'DRAFT' || c.status === 'REJECTED' || c.status === 'ARCHIVED';
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PENDING_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'ARCHIVED':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      case 'DRAFT':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStats = (course: Course) => {
    const sectionCount = course.sections.length;
    let lessonCount = 0;
    let activityCount = 0;
    course.sections.forEach((s) => {
      lessonCount += s.lessons.length;
      s.lessons.forEach((l) => {
        activityCount += l.contents.length;
      });
    });
    return { sectionCount, lessonCount, activityCount };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Teacher Studio</h1>
        <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Course Management Hub</p>
      </div>

      {/* 2. PROFILE HERO BANNER */}
      <div className="w-full max-w-[1340px] mx-auto px-4 pt-8">
        <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-6 relative z-10">
            <img
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white"
              src={avatarUrl}
              alt={displayName}
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
              <p className="text-neutral-200 text-sm font-medium">Teacher</p>
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

      {/* 3. MAIN CONTENT WORKSPACE */}
      <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <TeacherSidebar activePath="/teacher/courses" />

        {/* Main Workspace Layout */}
        <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
          
          {/* Header block with Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h3 className="text-[20px] font-bold text-[#111827]">My Courses</h3>
              <p className="text-[13px] text-[#6B7280] mt-0.5">Create, configure, and publish your course curriculum.</p>
            </div>
            <button
              onClick={handleCreateCourse}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#392C7D] text-white text-sm font-bold rounded-xl hover:bg-[#2d2263] transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          </div>

          {/* Tabs Filter Bar */}
          <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl border">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'border-[#392C7D] text-[#392C7D]'
                  : 'border-transparent text-[#6B7280] hover:text-[#392C7D]'
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('PUBLISHED')}
              className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'PUBLISHED'
                  ? 'border-[#392C7D] text-[#392C7D]'
                  : 'border-transparent text-[#6B7280] hover:text-[#392C7D]'
              }`}
            >
              Published ({courses.filter(c => c.status === 'APPROVED' || c.status === 'PENDING_REVIEW').length})
            </button>
            <button
              onClick={() => setActiveTab('DRAFT')}
              className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'DRAFT'
                  ? 'border-[#392C7D] text-[#392C7D]'
                  : 'border-transparent text-[#6B7280] hover:text-[#392C7D]'
              }`}
            >
              Drafts & Others ({courses.filter(c => c.status !== 'APPROVED' && c.status !== 'PENDING_REVIEW').length})
            </button>
          </div>

          {/* Courses List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const { sectionCount, lessonCount, activityCount } = getStats(course);
              const isPublished = course.status === 'APPROVED';
              const isPending = course.status === 'PENDING_REVIEW';
              
              return (
                <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  {/* Card Image and Badge */}
                  <div className="relative h-44 w-full bg-slate-100 shrink-0">
                    <img
                      src={course.thumbnail_url || 'https://placehold.co/360x200'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase shadow-xs ${getStatusBadgeClass(course.status)}`}>
                        {course.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[11px] font-bold text-[#FF4667] bg-rose-50 px-2 py-0.5 rounded-full tracking-wide">
                        {course.field}
                      </span>
                      <span className="text-sm font-bold text-[#111827]">
                        {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[16px] font-semibold text-[#111827] line-clamp-1 hover:text-[#392C7D] transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-[13px] text-[#374151] mt-1 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Stats List */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#6B7280] border-t border-b border-gray-100 py-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{sectionCount} Sections</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#FF4667]" />
                        <span>{lessonCount} Lessons ({activityCount} Activities)</span>
                      </div>
                    </div>
                    
                    {/* Updated & Published date details */}
                    <div className="flex flex-col gap-1 text-[11px] text-[#6B7280] font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Last Updated: {course.lastUpdated}
                      </span>
                      {course.publishedDate && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          Published Date: {course.publishedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="bg-slate-50 px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Delete logic for draft/rejected/archived only */}
                      {course.status !== 'APPROVED' && course.status !== 'PENDING_REVIEW' && (
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer border border-transparent hover:border-rose-100"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Preview simulation action */}
                      <button
                        onClick={() => {
                          toast.info(`Simulating preview workspace for "${course.title}".`);
                          navigate('/classroom/workspace');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-[#374151] hover:bg-white transition-all cursor-pointer flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Preview
                      </button>

                      {/* Editing actions */}
                      {(isPublished || isPending) ? (
                        <button
                          onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-[#392C7D] hover:bg-indigo-100 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit Course
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FF4667] text-white text-xs font-bold hover:bg-[#e03d5b] transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Continue Editing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCourses.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center gap-3">
                <BookOpen className="w-12 h-12 text-slate-300" />
                <h4 className="text-[16px] font-bold text-[#111827]">No Courses Found</h4>
                <p className="text-[13px] text-[#6B7280]">Create a new course or change your tab filter selection.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
export default TeacherCoursesPage;
