import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Edit3, ExternalLink, Lock, RefreshCw } from 'lucide-react';

// Types
type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

interface CourseSummary {
  id: string;
  title: string;
  price: number;
  sectionsCount: number;
  lessonsCount: number;
  submittedAt?: string;
  reviewNote?: string;
}

// Initial mock course data
const MOCK_COURSE: CourseSummary = {
  id: 'CS-001',
  title: 'Data Structures & Algorithms Interview Prep',
  price: 79.00,
  sectionsCount: 4,
  lessonsCount: 24,
  submittedAt: '16 Jan 2026',
  reviewNote: 'Please provide a clearer course thumbnail and add at least 3 coding problems in Section 2.'
};

export const CourseApprovalStatusPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {  } = useParams<{ courseId: string }>();

  // Status simulation state to make testing easy
  const [status, setStatus] = useState<CourseStatus>('PENDING_REVIEW');
  const [course] = useState<CourseSummary>(MOCK_COURSE);

  const displayName = user?.fullName || 'Edythe Andrew';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

  const handleSubmitForReview = () => {
    setStatus('PENDING_REVIEW');
    toast.success('Course submitted for moderation review.');
  };

  const handleWithdrawSubmission = () => {
    setStatus('DRAFT');
    toast.info('Submission withdrawn. Course reverted to DRAFT.');
  };

  const handleResubmit = () => {
    setStatus('PENDING_REVIEW');
    toast.success('Course resubmitted for admin approval.');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">

        {/* Page title banner */}
        <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Course Submission Status</h1>
          <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Course &rsaquo; Review Status</p>
        </div>

        {/* Profile hero banner */}
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

        {/* Body content */}
        <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <TeacherSidebar activePath="/teacher/course-builder" />

          {/* Main workspace column */}
          <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
            
            {/* Status simulator row */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-[18px] font-bold text-[#392C7D]">Review Status simulator</h2>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#6B7280] font-semibold">Change Simulated Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CourseStatus)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl text-[13px] font-bold text-[#374151] focus:outline-none focus:border-[#392C7D] cursor-pointer bg-white"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  <option value="APPROVED">APPROVED (PUBLISHED)</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            {/* Split layout: status timeline & course details */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left timeline status box */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Status Timeline</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Approval progress log</p>
                </div>

                <div className="relative pl-6 border-l-2 border-slate-100 flex flex-col gap-6 py-1">
                  
                  {/* Draft step */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                      status !== 'DRAFT'
                        ? 'bg-[#392C7D] border-[#392C7D]'
                        : 'bg-white border-[#392C7D]'
                    }`}>
                      {status !== 'DRAFT' && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#111827]">Draft Creation</p>
                      <p className="text-[11px] text-[#6B7280]">Course information saved as draft</p>
                    </div>
                  </div>

                  {/* Pending review step */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                      status === 'APPROVED' || status === 'REJECTED'
                        ? 'bg-[#392C7D] border-[#392C7D]'
                        : status === 'PENDING_REVIEW'
                        ? 'bg-amber-500 border-amber-500'
                        : 'bg-white border-gray-200'
                    }`}>
                      {(status === 'APPROVED' || status === 'REJECTED') && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${
                        status === 'PENDING_REVIEW' ? 'text-amber-600' : 'text-[#111827]'
                      }`}>
                        Admin Moderation Review
                      </p>
                      <p className="text-[11px] text-[#6B7280]">Checks checklist guidelines</p>
                    </div>
                  </div>

                  {/* Final Status step */}
                  <div className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                      status === 'APPROVED'
                        ? 'bg-emerald-500 border-emerald-500'
                        : status === 'REJECTED'
                        ? 'bg-rose-500 border-rose-500'
                        : status === 'ARCHIVED'
                        ? 'bg-slate-500 border-slate-500'
                        : 'bg-white border-gray-200'
                    }`}>
                      {status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {status === 'REJECTED' && <XCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${
                        status === 'APPROVED'
                          ? 'text-emerald-700'
                          : status === 'REJECTED'
                          ? 'text-rose-700'
                          : status === 'ARCHIVED'
                          ? 'text-slate-700'
                          : 'text-[#111827]'
                      }`}>
                        {status === 'APPROVED'
                          ? 'Published & Live'
                          : status === 'REJECTED'
                          ? 'Review Rejected'
                          : status === 'ARCHIVED'
                          ? 'Archived'
                          : 'Awaiting Decision'}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {status === 'APPROVED'
                          ? 'Course is purchaseable'
                          : status === 'REJECTED'
                          ? 'Requires adjustments'
                          : status === 'ARCHIVED'
                          ? 'Withdrawn from catalog'
                          : 'Final status pending'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Admin Decision card details */}
                <div className="bg-slate-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                  <h4 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide">Admin Review details</h4>
                  
                  <div className="flex flex-col gap-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Current status:</span>
                      <span className={`font-bold uppercase ${
                        status === 'APPROVED'
                          ? 'text-emerald-600'
                          : status === 'PENDING_REVIEW'
                          ? 'text-amber-500'
                          : status === 'REJECTED'
                          ? 'text-rose-500'
                          : 'text-[#374151]'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Submission date:</span>
                      <span className="font-semibold text-[#374151]">
                        {status !== 'DRAFT' ? course.submittedAt : '—'}
                      </span>
                    </div>
                  </div>

                  {status === 'REJECTED' && course.reviewNote && (
                    <div className="border-t border-gray-200/50 pt-2.5 mt-1 flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Rejection Feedback
                      </span>
                      <p className="text-[12px] text-rose-800 font-medium bg-rose-50/50 border border-rose-100/50 p-2.5 rounded-xl leading-relaxed">
                        {course.reviewNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right course summary & checklist box */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Course Summary</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Overview of builder elements</p>
                </div>

                {/* Course stats grid */}
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Title</span>
                    <span className="text-[14px] font-bold text-[#111827] truncate">{course.title}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Base Price</span>
                    <span className="text-[14px] font-bold text-[#392C7D]">${course.price.toFixed(2)} USD</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Modules Count</span>
                    <span className="text-[14px] font-semibold text-[#374151]">{course.sectionsCount} Sections</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">Lessons Count</span>
                    <span className="text-[14px] font-semibold text-[#374151]">{course.lessonsCount} Lessons</span>
                  </div>
                </div>

                {/* Submission Checklist */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide">Readiness Checklist</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#374151]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Course Information</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#374151]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Curriculum Chapters</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#374151]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Lesson Content</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#374151]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Valid Base Price</span>
                    </div>
                  </div>
                </div>

                {/* Status-dependent Action block */}
                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/teacher/course-builder')}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    Open Course Builder
                  </button>

                  {status === 'DRAFT' && (
                    <button
                      onClick={handleSubmitForReview}
                      className="flex-1 py-2.5 rounded-xl bg-[#392C7D] text-white text-[14px] font-semibold hover:bg-[#2d2263] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Submit for review
                    </button>
                  )}

                  {status === 'PENDING_REVIEW' && (
                    <button
                      onClick={handleWithdrawSubmission}
                      className="flex-1 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#FF4667] text-[14px] font-semibold hover:bg-rose-100/50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      Withdraw submission
                    </button>
                  )}

                  {status === 'REJECTED' && (
                    <button
                      onClick={handleResubmit}
                      className="flex-1 py-2.5 rounded-xl bg-[#FF4667] text-white text-[14px] font-semibold hover:bg-[#e03d5b] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Adjust & Resubmit
                    </button>
                  )}

                  {status === 'APPROVED' && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); toast.success('Redirecting to public course detail catalog.'); }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-[14px] font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Public Page
                    </a>
                  )}

                  {status === 'ARCHIVED' && (
                    <button
                      disabled
                      className="flex-1 py-2.5 rounded-xl bg-gray-200 text-gray-400 text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4" />
                      Course Archived
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

        </div>
  );
};

export default CourseApprovalStatusPage;
