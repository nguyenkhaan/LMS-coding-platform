import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ClassroomLayout } from '@/layouts/ClassroomLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RoleGuard } from './RoleGuard';

// Role 1 Pages
import { CourseCatalogPage } from '@/features/courses/pages/CourseCatalogPage';
import { CourseDetailPage } from '@/features/courses/pages/CourseDetailPage';
import { CourseCatalogFigma } from '@/features/courses/Course01';
import { CourseDetailFigma } from '@/features/courses/Course02';
import { CourseOverviewFigma } from '@/features/courses/Course02-01';
import { CourseInstructorFigma } from '@/features/courses/Course02-02';
import { CourseReviewsFigma } from '@/features/courses/Course02-03';
import { CourseReviewsWriteFigma } from '@/features/courses/Course02-04';
import CheckoutPage from '@/features/payment/components/CheckoutPage';
import PaymentResultPage from '@/features/payment/Pay03';
import QuizAttemptPage from '@/features/quiz/QUIZ01';
import QuizPreviewPage from '@/features/quiz/QUIZ02';
import TeacherProfilePage from '@/features/teacher/TC02';
import TeacherEarningsPage from '@/features/teacher/TC04';
import TeacherWalletPage from '@/features/wallet/TC15';
import CourseBuilderPage from '@/features/teacher/TC11';
import CourseApprovalStatusPage from '@/features/teacher/TC14';
import CourseApprovalReviewPage from '@/features/admin/AD02';

// Role 2 Pages
import { ProblemListPage } from '@/features/judge/pages/ProblemListPage';
import { OJWorkspacePage } from '@/features/judge/pages/OJWorkspacePage';
import { ClassroomPage } from '@/features/classroom/pages/ClassroomPage';
import { InterviewSetupPage } from '@/features/interview/pages/InterviewSetupPage';
import { InterviewWorkspacePage } from '@/features/interview/pages/InterviewWorkspacePage';
import { InterviewReportPage } from '@/features/interview/pages/InterviewReportPage';
import { StudentDashboardPage } from '@/features/student/pages/StudentDashboardPage';
import { StudentProfilePage } from '@/features/student/pages/StudentProfilePage';
import { EnrolledCoursesPage } from '@/features/student/pages/EnrolledCoursesPage';
import { StudentFavoritesPage } from '@/features/student/pages/StudentFavoritesPage';
import { StudentHistoryPage } from '@/features/student/pages/StudentHistoryPage';
import { BecomeTeacherPage } from '@/features/teacher/pages/BecomeTeacherPage';
import { AdminVerificationsPage } from '@/features/admin/pages/AdminVerificationsPage';
import { InstructorListPage } from '@/features/instructor/pages/InstructorListPage';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import {
	BookOpen,
	Terminal,
	Sparkles,
	CreditCard,
	GraduationCap,
	ShieldCheck,
	Search,
	DollarSign,
	Wallet,
	Clock
} from 'lucide-react';

const LoginPage = () => <div className="p-6 rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-center max-w-md mx-auto my-12"><h2 className="text-xl font-bold mb-4">Đăng nhập</h2><p className="text-xs text-[hsl(var(--text-secondary))]">Form đăng nhập học viên / giảng viên</p></div>;
const RegisterPage = () => <div className="p-6 rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-center max-w-md mx-auto my-12"><h2 className="text-xl font-bold mb-4">Đăng ký</h2><p className="text-xs text-[hsl(var(--text-secondary))]">Form tạo tài khoản mới</p></div>;

const TeacherDashboard = () => <div><h2 className="text-2xl font-bold mb-4">Teacher Dashboard & Analytics (TC01/TC04)</h2></div>;
const TeacherPendingApprovalPage = () => (
	<div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center select-none">
		<div className="max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center gap-4">
			<div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
				<Clock className="w-8 h-8 text-amber-600 animate-pulse" />
			</div>
			<h2 className="text-2xl font-bold text-gray-900">Registration Pending Approval</h2>
			<p className="text-sm text-gray-600 leading-relaxed font-medium">
				Your teacher registration status is currently under moderation review. Once approved by the administrator, you will gain access to the Teacher Studio, Course Builder, and Wallet.
			</p>
			<div className="flex gap-4 w-full mt-2">
				<Link to="/dashboard" className="flex-1 py-2.5 bg-[#392C7D] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2263] text-center transition-all cursor-pointer">
					Return to Dashboard
				</Link>
			</div>
		</div>
	</div>
);

const UnauthorizedPage = () => <div className="p-12 text-center"><h2 className="text-2xl font-bold text-rose-500">403 - Bạn không có quyền truy cập trang này</h2></div>;
const NotFoundPage = () => <div className="p-12 text-center"><h2 className="text-2xl font-bold">404 - Trang không tồn tại</h2></div>;

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public / Main Layout */}
			<Route element={<MainLayout />}>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				
				{/* Course Catalog & Details */}
				<Route path="/courses" element={<CourseCatalogFigma />} />
				<Route path="/courses/:courseSlug" element={<CourseDetailFigma />} />
				<Route path="/courses-overview/:courseSlug" element={<CourseOverviewFigma />} />
				<Route path="/courses-instructor/:courseSlug" element={<CourseInstructorFigma />} />
				<Route path="/courses-reviews/:courseSlug" element={<CourseReviewsFigma />} />
				<Route path="/courses-reviews/write/:courseSlug" element={<CourseReviewsWriteFigma />} />
				<Route path="/courses-catalog" element={<CourseCatalogPage />} />
				<Route path="/courses-detail/:courseSlug" element={<CourseDetailPage />} />

				{/* Enrolled Courses & Student Hub */}
				<Route path="/courses/enrolled" element={<EnrolledCoursesPage />} />
				<Route path="/student/courses" element={<EnrolledCoursesPage />} />
				<Route path="/enrolled-courses" element={<EnrolledCoursesPage />} />
				<Route path="/dashboard" element={<StudentDashboardPage />} />
				<Route path="/student/profile" element={<StudentProfilePage />} />
				<Route path="/profile" element={<StudentProfilePage />} />
				<Route path="/student/favorites" element={<StudentFavoritesPage />} />
				<Route path="/favorites" element={<StudentFavoritesPage />} />

				{/* Instructor Directory */}
				<Route path="/instructors" element={<InstructorListPage />} />

				{/* Become a Teacher */}
				<Route path="/become-teacher" element={<BecomeTeacherPage />} />
				<Route path="/teacher/apply" element={<BecomeTeacherPage />} />

				{/* Practice & Submissions */}
				<Route path="/practice" element={<ProblemListPage />} />
				<Route path="/submissions" element={<StudentHistoryPage />} />
				<Route path="/practice/history" element={<StudentHistoryPage />} />

				{/* AI Mock Interview */}
				<Route path="/interview" element={<InterviewSetupPage />} />
				<Route path="/interview/:sessionId" element={<InterviewWorkspacePage />} />
				<Route path="/interview/report" element={<InterviewReportPage />} />
				<Route path="/interview/report/:sessionId" element={<InterviewReportPage />} />

				{/* Classroom Workspace */}
				<Route path="/learn/:courseSlug" element={<ClassroomPage />} />
				<Route path="/classroom/workspace" element={<ClassroomPage />} />

				{/* Payment */}
				<Route path="/checkout/:courseId" element={<CheckoutPage />} />
				<Route path="/payment-result" element={<PaymentResultPage />} />
				<Route path="/unauthorized" element={<UnauthorizedPage />} />
			</Route>

			{/* Standalone Workspaces (OJ02 & Quiz Runners) */}
			<Route path="/practice/:problemSlug" element={<OJWorkspacePage />} />
			<Route path="/quiz/:quizId/attempt" element={<QuizAttemptPage />} />
			<Route path="/quiz/:quizId/preview" element={<QuizPreviewPage />} />

			{/* Auth Layout */}
			<Route element={<AuthLayout />}>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Route>

			{/* Student Protected Hub */}
			<Route element={<RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
				<Route element={<DashboardLayout role="STUDENT" />}>
					<Route path="/student/dashboard" element={<StudentDashboardPage />} />
					<Route path="/student/favorites" element={<StudentFavoritesPage />} />
					<Route path="/student/history" element={<StudentHistoryPage />} />
				</Route>
			</Route>

			{/* Teacher Pending Studio (Unapproved) */}
			<Route element={<RoleGuard allowedRoles={['TEACHER']} requireTeacherApproved={false} />}>
				<Route path="/teacher/pending-approval" element={<TeacherPendingApprovalPage />} />
			</Route>

			{/* Teacher Approved Protected Studio */}
			<Route element={<RoleGuard allowedRoles={['TEACHER']} requireTeacherApproved={true} />}>
				<Route path="/teacher/profile" element={<TeacherProfilePage />} />
				<Route path="/teacher/earnings" element={<TeacherEarningsPage />} />
				<Route path="/teacher/wallet" element={<TeacherWalletPage />} />
				<Route path="/teacher/course-builder" element={<CourseBuilderPage />} />
				<Route path="/teacher/courses/:courseId/review-status" element={<CourseApprovalStatusPage />} />
				<Route element={<DashboardLayout role="TEACHER" />}>
					<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
					<Route path="/teacher/courses" element={<div>Quản lý khóa học</div>} />
					<Route path="/teacher/students" element={<div>Học viên</div>} />
				</Route>
			</Route>

			{/* Admin Protected Panel */}
			<Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
				<Route path="/admin/courses" element={<CourseApprovalReviewPage />} />
				<Route path="/admin/course-review/:courseId" element={<CourseApprovalReviewPage />} />
				<Route element={<DashboardLayout role="ADMIN" />}>
					<Route path="/admin/dashboard" element={<div>Tổng quan Admin</div>} />
					<Route path="/admin/verifications" element={<AdminVerificationsPage />} />
					<Route path="/admin/users" element={<div>Quản trị tài khoản</div>} />
				</Route>
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};
