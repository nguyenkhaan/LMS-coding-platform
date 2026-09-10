import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { toast } from 'sonner';
import { FileText, HelpCircle, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminSidebar } from '../components/adminSidebar.tsx';

type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

interface HistoryLog {
  id: string;
  date: string;
  status: CourseStatus;
  actor: string;
  note?: string;
}

interface LessonContent {
  id: string;
  content_type: 'Reading' | 'Quiz' | 'Code Problem';
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  position: number;
  contents: LessonContent[];
}

interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface CourseReviewData {
  id: string;
  title: string;
  teacher: string;
  price: number;
  status: CourseStatus;
  description: string;
  sectionsCount: number;
  lessonsCount: number;
  sections: Section[];
  history: HistoryLog[];
  reviewNote?: string;
  submittedAt: string;
}

const INITIAL_COURSES: CourseReviewData[] = [
  {
    id: 'CS-001',
    title: 'Data Structures & Algorithms Interview Prep',
    teacher: 'Edythe Andrew',
    price: 79.00,
    status: 'PENDING_REVIEW',
    submittedAt: '16 Jan 2026',
    description: 'Comprehensive guide to passing technical coding interviews at top tier tech companies.',
    sectionsCount: 2,
    lessonsCount: 3,
    sections: [
      {
        id: 'S-1',
        title: 'Section 1: Arrays & Strings',
        position: 1,
        lessons: [
          {
            id: 'L-1',
            title: 'Two-pointer introduction',
            position: 1,
            contents: [{ id: 'C-1', content_type: 'Reading', title: 'Two-pointer guide' }]
          },
          {
            id: 'L-2',
            title: 'Sliding window concepts',
            position: 2,
            contents: [{ id: 'C-2', content_type: 'Code Problem', title: 'Find longest substring without repeating chars' }]
          }
        ]
      },
      {
        id: 'S-2',
        title: 'Section 2: Dynamic Programming',
        position: 2,
        lessons: [
          {
            id: 'L-3',
            title: 'Memoization basics',
            position: 1,
            contents: [{ id: 'C-3', content_type: 'Quiz', title: 'Memoization vs Tabulation Quiz' }]
          }
        ]
      }
    ],
    history: [
      { id: 'H-1', date: '16 Jan 2026 10:30', status: 'PENDING_REVIEW', actor: 'Edythe Andrew (Teacher)', note: 'Initial course submission for approval.' }
    ]
  },
  {
    id: 'CS-002',
    title: 'Fullstack Microservices with Go and Kubernetes',
    teacher: 'Minh Tran',
    price: 99.00,
    status: 'PENDING_REVIEW',
    submittedAt: '18 Jan 2026',
    description: 'Practical microservices engineering from scratch using Go, Docker, gRPC, and Kubernetes.',
    sectionsCount: 1,
    lessonsCount: 2,
    sections: [
      {
        id: 'S-3',
        title: 'Section 1: Architecture Overview',
        position: 1,
        lessons: [
          {
            id: 'L-4',
            title: 'Event-driven systems',
            position: 1,
            contents: [{ id: 'C-4', content_type: 'Reading', title: 'Kafka and RabbitMQ comparisons' }]
          }
        ]
      }
    ],
    history: [
      { id: 'H-2', date: '18 Jan 2026 14:00', status: 'PENDING_REVIEW', actor: 'Minh Tran (Teacher)', note: 'Ready for admin review.' }
    ]
  }
];

export const CourseApprovalReviewPage: React.FC = () => {
  const { user } = useAuthStore();
  const { courseId } = useParams<{ courseId: string }>();

  const [courses, setCourses] = useState<CourseReviewData[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId || INITIAL_COURSES[0]?.id || 'CS-001');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'S-1': true,
    'S-2': true,
    'S-3': true
  });

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0] || INITIAL_COURSES[0]!;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApprove = () => {
    const updated = courses.map(c => {
      if (c.id === currentCourse.id) {
        return {
          ...c,
          status: 'APPROVED' as CourseStatus,
          history: [
            ...c.history,
            {
              id: `H-${Date.now()}`,
              date: new Date().toLocaleString('en-US'),
              status: 'APPROVED' as CourseStatus,
              actor: `${user?.fullName || 'Admin'} (Admin)`,
              note: reviewNote || 'Course meets all quality standards. Approved for publication.'
            }
          ]
        };
      }
      return c;
    });
    setCourses(updated);
    toast.success(`Course "${currentCourse.title}" has been APPROVED!`);
  };

  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast.error('Please enter a moderation note explaining what needs revision.');
      return;
    }
    const updated = courses.map(c => {
      if (c.id === currentCourse.id) {
        return {
          ...c,
          status: 'REJECTED' as CourseStatus,
          history: [
            ...c.history,
            {
              id: `H-${Date.now()}`,
              date: new Date().toLocaleString('en-US'),
              status: 'REJECTED' as CourseStatus,
              actor: `${user?.fullName || 'Admin'} (Admin)`,
              note: reviewNote
            }
          ]
        };
      }
      return c;
    });
    setCourses(updated);
    toast.warning(`Course "${currentCourse.title}" marked as REJECTED (Changes requested).`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      
      {/* 1. Hero Breadcrumb Banner */}
      <div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Course Approval Moderation
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Course Moderation Review</span>
        </div>
      </div>

      {/* 2. Main Body Container (max-w-[1340px] centered) */}
      <div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start flex-1">
        
        {/* Standardized Left Admin Sidebar with Course Queue */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          <AdminSidebar pendingCoursesCount={courses.filter(c => c.status === 'PENDING_REVIEW').length} />

          {/* Pending Course Submissions Queue */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Courses Queue ({courses.length})
            </span>

            <div className="flex flex-col gap-2">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    selectedCourseId === course.id
                      ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs line-clamp-1">{course.title}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
                        course.status === 'APPROVED'
                          ? 'bg-emerald-500 text-white'
                          : course.status === 'REJECTED'
                          ? 'bg-rose-500 text-white'
                          : selectedCourseId === course.id
                          ? 'bg-amber-400 text-zinc-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {course.status === 'PENDING_REVIEW' ? 'PENDING' : course.status}
                    </span>
                  </div>
                  <span className={`text-[11px] ${selectedCourseId === course.id ? 'text-slate-200' : 'text-neutral-500'}`}>
                    Teacher: {course.teacher} · ${course.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Course Review Panel */}
        <div className="flex-1 w-full flex flex-col gap-6">
          
          {/* Status Bar */}
          <div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-zinc-900">{currentCourse.title}</h2>
              <span className="text-xs text-neutral-500 font-medium">
                Submitted by: <strong className="text-zinc-800">{currentCourse.teacher}</strong> on {currentCourse.submittedAt}
              </span>
            </div>

            <span
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider border ${
                currentCourse.status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : currentCourse.status === 'REJECTED'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-orange-50 text-amber-700 border-amber-400 animate-pulse'
              }`}
            >
              {currentCourse.status}
            </span>
          </div>

          {/* Course Overview Metadata */}
          <div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
              Course Details &amp; Pricing
            </h3>
            
            <p className="text-sm text-neutral-600 leading-relaxed">
              {currentCourse.description}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-neutral-400 font-semibold uppercase">Pricing</span>
                <span className="text-lg font-bold text-indigo-950">${currentCourse.price}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-neutral-400 font-semibold uppercase">Sections</span>
                <span className="text-lg font-bold text-zinc-900">{currentCourse.sections.length} Sections</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-neutral-400 font-semibold uppercase">Total Lessons</span>
                <span className="text-lg font-bold text-zinc-900">
                  {currentCourse.sections.reduce((acc, s) => acc + s.lessons.length, 0)} Lessons
                </span>
              </div>
            </div>
          </div>

          {/* Curriculum Structure Review */}
          <div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
              Curriculum Curriculum &amp; Content Review
            </h3>

            <div className="flex flex-col gap-3">
              {currentCourse.sections.map((section, sIdx) => {
                const isExpanded = expandedSections[section.id] ?? true;
                return (
                  <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-4 bg-slate-50/80 hover:bg-slate-100 flex justify-between items-center text-left transition-colors cursor-pointer border-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <span className="font-bold text-sm text-zinc-900">{section.title}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 flex flex-col gap-3 border-t border-slate-100 bg-white">
                        {section.lessons.map(lesson => (
                          <div key={lesson.id} className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 flex flex-col gap-2">
                            <span className="text-xs font-bold text-zinc-800">{lesson.title}</span>
                            <div className="flex flex-wrap gap-2">
                              {lesson.contents.map(content => (
                                <div
                                  key={content.id}
                                  className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-neutral-700 flex items-center gap-1.5 shadow-xs"
                                >
                                  {content.content_type === 'Quiz' ? (
                                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                                  ) : content.content_type === 'Code Problem' ? (
                                    <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                  <span>{content.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviewer Note */}
          <div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold text-zinc-900">
                Reviewer Moderation Feedback
              </h3>
              <span className="text-xs text-neutral-400 font-medium">
                {reviewNote.length}/500
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Add your review notes or revision requirements for the course creator (max 500 chars)..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-900/20 focus:outline-none resize-none"
            />
          </div>

          {/* History Log */}
          <div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-3">
            <h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
              Audit History
            </h3>
            <div className="flex flex-col gap-2.5">
              {currentCourse.history.map(h => (
                <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-zinc-900">{h.actor} — {h.note}</span>
                    <span className="text-neutral-400">{h.date}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-200 text-neutral-700 font-bold rounded-md text-[10px]">
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full pt-2 flex items-center justify-end gap-4">
            <button
              onClick={handleReject}
              className="px-8 py-3 rounded-2xl border-2 border-rose-500 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Reject (Request Changes)
            </button>
            <button
              onClick={handleApprove}
              className="px-8 py-3 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Approve Course
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CourseApprovalReviewPage;
