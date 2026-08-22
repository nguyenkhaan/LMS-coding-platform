import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { FigmaHeader } from '../courses/components/FigmaHeader';
import { FigmaFooter } from '../courses/components/FigmaFooter';
import { toast } from 'sonner';
import {
  Search,
  BookOpen,
  DollarSign,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  HelpCircle,
  Code2,
  ChevronDown,
  ChevronUp,
  History,
  ShieldAlert,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

// Interfaces
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

// Initial Mock Course Queue Data
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
            contents: [{ id: 'C-2', content_type: 'Quiz', title: 'Sliding window checkpoint' }]
          }
        ]
      },
      {
        id: 'S-2',
        title: 'Section 2: LinkedLists & Trees',
        position: 2,
        lessons: [
          {
            id: 'L-3',
            title: 'Reverse a Linked List',
            position: 1,
            contents: [{ id: 'C-3', content_type: 'Code Problem', title: 'LinkedList reversal logic' }]
          }
        ]
      }
    ],
    history: [
      { id: 'H-1', date: '16 Jan 2026', status: 'DRAFT', actor: 'Edythe Andrew', note: 'Created initial course draft.' },
      { id: 'H-2', date: '18 Jan 2026', status: 'PENDING_REVIEW', actor: 'Edythe Andrew', note: 'Ready for admin review.' }
    ]
  },
  {
    id: 'CS-002',
    title: 'Python Foundations for Problem Solving',
    teacher: 'Eugene Andre',
    price: 49.00,
    status: 'APPROVED',
    submittedAt: '05 Jan 2026',
    description: 'Learn Python from scratch and solve competitive programming challenges.',
    sectionsCount: 1,
    lessonsCount: 1,
    sections: [
      {
        id: 'S-3',
        title: 'Section 1: Installation and loops',
        position: 1,
        lessons: [
          {
            id: 'L-4',
            title: 'Loops in Python',
            position: 1,
            contents: [{ id: 'C-4', content_type: 'Reading', title: 'Loops syntax sheet' }]
          }
        ]
      }
    ],
    history: [
      { id: 'H-3', date: '05 Jan 2026', status: 'PENDING_REVIEW', actor: 'Eugene Andre' },
      { id: 'H-4', date: '07 Jan 2026', status: 'APPROVED', actor: 'Admin', note: 'Approved. Looks very structured.' }
    ]
  },
  {
    id: 'CS-003',
    title: 'Advanced React & TypeScript Patterns',
    teacher: 'Edythe Andrew',
    price: 99.00,
    status: 'REJECTED',
    submittedAt: '10 Jan 2026',
    description: 'Deep dive into React 19 concurrent features, custom hooks, and strict TypeScript types.',
    sectionsCount: 1,
    lessonsCount: 1,
    sections: [
      {
        id: 'S-4',
        title: 'Section 1: Custom hooks',
        position: 1,
        lessons: [
          {
            id: 'L-5',
            title: 'Writing useTransition custom logic',
            position: 1,
            contents: [{ id: 'C-5', content_type: 'Code Problem', title: 'React 19 concurrent logic problem' }]
          }
        ]
      }
    ],
    reviewNote: 'Please provide a clearer course thumbnail and add at least 3 coding problems in Section 1.',
    history: [
      { id: 'H-5', date: '10 Jan 2026', status: 'PENDING_REVIEW', actor: 'Edythe Andrew' },
      { id: 'H-6', date: '12 Jan 2026', status: 'REJECTED', actor: 'Admin', note: 'Please provide a clearer course thumbnail...' }
    ]
  }
];

export const CourseApprovalReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuthStore();

  // State Management
  const [courses, setCourses] = useState<CourseReviewData[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId || INITIAL_COURSES[0].id);
  const [decisionNote, setDecisionNote] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'S-1': true,
    'S-2': true
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Search logic
  const filteredQueue = courses.filter(
    c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Moderation Handlers
  const handleApprove = () => {
    if (selectedCourse.status !== 'PENDING_REVIEW') {
      toast.error('Only PENDING_REVIEW courses can be moderated.');
      return;
    }

    const updated = courses.map(c => {
      if (c.id === selectedCourse.id) {
        const newLog: HistoryLog = {
          id: `H-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'APPROVED',
          actor: 'Admin',
          note: decisionNote || 'Course approved successfully.'
        };
        return {
          ...c,
          status: 'APPROVED' as CourseStatus,
          history: [newLog, ...c.history],
          reviewNote: undefined
        };
      }
      return c;
    });

    setCourses(updated);
    setDecisionNote('');
    toast.success('Course approved and published live.');
  };

  const handleReject = (requestChanges: boolean = false) => {
    if (selectedCourse.status !== 'PENDING_REVIEW') {
      toast.error('Only PENDING_REVIEW courses can be moderated.');
      return;
    }

    if (!decisionNote.trim()) {
      toast.error('A decision note/moderation feedback is required for rejections or changes.');
      return;
    }

    const finalStatus: CourseStatus = requestChanges ? 'DRAFT' : 'REJECTED';

    const updated = courses.map(c => {
      if (c.id === selectedCourse.id) {
        const newLog: HistoryLog = {
          id: `H-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: finalStatus,
          actor: 'Admin',
          note: decisionNote
        };
        return {
          ...c,
          status: finalStatus,
          reviewNote: decisionNote,
          history: [newLog, ...c.history]
        };
      }
      return c;
    });

    setCourses(updated);
    setDecisionNote('');
    toast.warning(requestChanges ? 'Changes requested. Course reverted to DRAFT.' : 'Course submission rejected.');
  };

  const getContentIcon = (type: 'Reading' | 'Quiz' | 'Code Problem') => {
    switch (type) {
      case 'Quiz':
        return <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Code Problem':
        return <Code2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'Reading':
      default:
        return <FileText className="w-4 h-4 text-[#392C7D] shrink-0" />;
    }
  };

  const displayName = user?.fullName || 'Admin';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start items-center">
      <div className="w-full max-w-[1892px] bg-white shadow-2xl rounded-3xl border border-neutral-100 overflow-hidden flex flex-col">
        <FigmaHeader />

        {/* Page title banner */}
        <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
          <h1 className="text-[36px] font-extrabold text-white tracking-tight leading-tight">Course Approval Console</h1>
          <p className="text-[13px] font-medium text-white/70">Home &rsaquo; Admin &rsaquo; Course Review</p>
        </div>

        {/* Profile hero banner */}
        <div className="w-full max-w-[1296px] mx-auto px-4 pt-8">
          <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-6 relative z-10">
              <img
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white"
                src={avatarUrl}
                alt={displayName}
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
                <p className="text-neutral-200 text-sm font-medium">Administrator</p>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-all cursor-pointer">
                Go to Portal
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-5 py-2.5 bg-[#FF4667] text-white text-sm font-semibold rounded-full hover:bg-[#e03d5b] transition-all cursor-pointer"
              >
                Admin Dashboard
              </button>
            </div>
            <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
          </div>
        </div>

        {/* Content Body */}
        <div className="w-full max-w-[1296px] mx-auto px-4 py-10">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
            
            {/* Left Side: Searchable Queue */}
            <div className="xl:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-1.5">
                  <ClipboardList className="w-5 h-5 text-[#392C7D]" />
                  Moderation Queue
                </h3>
                
                {/* Search Input */}
                <div className="relative mt-3">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search courses or teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#392C7D] bg-[#FFFFFF] text-[#111827]"
                  />
                </div>
              </div>

              {/* Queue List */}
              <div className="divide-y divide-[#E5E7EB] max-h-[600px] overflow-y-auto bg-[#FFFFFF]">
                {filteredQueue.map(c => {
                  const isSelected = c.id === selectedCourseId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        setDecisionNote('');
                      }}
                      className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors ${
                        isSelected ? 'bg-indigo-50/40 border-l-4 border-[#392C7D]' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-[#111827] truncate">{c.title}</p>
                        <p className="text-[12px] text-[#6B7280] mt-0.5 font-medium">By: {c.teacher}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${
                          c.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : c.status === 'PENDING_REVIEW'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        {c.status === 'PENDING_REVIEW' ? 'Pending' : c.status.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
                {filteredQueue.length === 0 && (
                  <p className="p-6 text-center text-[13px] text-[#6B7280] italic bg-[#FFFFFF]">
                    No courses match your search criteria.
                  </p>
                )}
              </div>
            </div>

            {/* Right Side: Selected Course Review View */}
            <div className="xl:col-span-3 flex flex-col gap-6">
              
              {/* Metadata summary */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4 text-[#111827]">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Selected Course</span>
                    <h3 className="text-[20px] font-bold text-[#111827] mt-0.5">{selectedCourse.title}</h3>
                    <p className="text-[13px] text-[#374151] font-semibold mt-1">Instructor: {selectedCourse.teacher}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      selectedCourse.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : selectedCourse.status === 'PENDING_REVIEW'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {selectedCourse.status}
                  </span>
                </div>

                <p className="text-[13.5px] text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-3 bg-transparent">
                  {selectedCourse.description}
                </p>

                <div className="grid grid-cols-3 gap-4 border-t border-[#E5E7EB] pt-3 text-[13px]">
                  <div className="flex flex-col">
                    <span className="text-[#6B7280] font-medium">Price</span>
                    <span className="font-bold text-[#392C7D]">${selectedCourse.price.toFixed(2)} USD</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#6B7280] font-medium">Sections</span>
                    <span className="font-bold text-[#111827]">{selectedCourse.sectionsCount} Modules</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#6B7280] font-medium">Lessons</span>
                    <span className="font-bold text-[#111827]">{selectedCourse.lessonsCount} Classes</span>
                  </div>
                </div>
              </div>

              {/* Curriculum preview accordion */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Curriculum Chapters</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Inspect section lessons and resources</p>
                </div>

                <div className="flex flex-col gap-3">
                  {selectedCourse.sections.map((section, secIdx) => {
                    const isExpanded = expandedSections[section.id];
                    return (
                      <div key={section.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                        <div
                          onClick={() => toggleSection(section.id)}
                          className="bg-[#F8FAFC] px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
                            <span className="text-[12px] font-extrabold text-[#392C7D] bg-indigo-50 px-2 py-0.5 rounded-full">
                              {secIdx + 1}
                            </span>
                            {section.title}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#6B7280]" /> : <ChevronDown className="w-4 h-4 text-[#6B7280]" />}
                        </div>

                        {isExpanded && (
                          <div className="p-3 divide-y divide-[#E5E7EB] bg-[#FFFFFF]">
                            {section.lessons.map((lesson, lesIdx) => (
                              <div key={lesson.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2 bg-[#FFFFFF]">
                                <h5 className="text-[13.5px] font-bold text-[#111827]">
                                  {secIdx + 1}.{lesIdx + 1} {lesson.title}
                                </h5>
                                
                                <div className="pl-6 flex flex-col gap-2">
                                  {lesson.contents.map(c => (
                                    <div key={c.id} className="flex items-center gap-2 text-[12px] font-semibold text-[#374151] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5">
                                      {getContentIcon(c.content_type)}
                                      <span className="text-[#6B7280] capitalize font-bold shrink-0">{c.content_type}:</span>
                                      <span className="truncate text-[#111827]">{c.title}</span>
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

              {/* Decision Form block */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Moderation Decision</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Determine approval catalog status</p>
                </div>

                {selectedCourse.status !== 'PENDING_REVIEW' ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-bold text-amber-700">Actions Locked</p>
                      <p className="text-[12px] text-amber-600 mt-0.5 text-left">
                        Only courses with <span className="font-semibold">PENDING_REVIEW</span> status can be moderated. This course is currently in <span className="font-semibold uppercase">{selectedCourse.status}</span>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 bg-[#FFFFFF]">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="decision-note" className="text-[13px] font-semibold text-[#374151]">
                        Decision feedback / Review Note
                      </label>
                      <textarea
                        id="decision-note"
                        rows={3}
                        placeholder="Enter review notes or rejection feedback rationale..."
                        value={decisionNote}
                        onChange={(e) => setDecisionNote(e.target.value)}
                        className="w-full px-3.5 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-[#FFFFFF] text-[#111827]"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleReject(true)}
                        className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[#FF4667] hover:bg-rose-50 text-[14px] font-semibold transition-all cursor-pointer bg-white"
                      >
                        Request Changes
                      </button>
                      <button
                        onClick={() => handleReject(false)}
                        className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 text-[14px] font-semibold transition-all shadow-sm cursor-pointer border-none"
                      >
                        Reject Course
                      </button>
                      <button
                        onClick={handleApprove}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-[14px] font-semibold transition-all shadow-sm cursor-pointer border-none"
                      >
                        Approve Course
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* History logs block */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-1.5">
                  <History className="w-5 h-5 text-[#6B7280]" />
                  Moderation History Logs
                </h3>

                <div className="divide-y divide-[#E5E7EB] bg-[#FFFFFF]">
                  {selectedCourse.history.map(log => (
                    <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1 text-[13px] bg-[#FFFFFF]">
                      <div className="flex justify-between items-center bg-[#FFFFFF]">
                        <span className="font-semibold text-[#111827]">{log.actor}</span>
                        <span className="text-[#6B7280] font-medium">{log.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 bg-[#FFFFFF]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : log.status === 'PENDING_REVIEW'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {log.status}
                        </span>
                        {log.note && <span className="text-[#374151] font-medium bg-[#FFFFFF]">&mdash; {log.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        <FigmaFooter />
      </div>
    </div>
  );
};

export default CourseApprovalReviewPage;
