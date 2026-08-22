import { ScrollToTop } from '@/components/scroll_to_top';
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/main_layout';
import { DashboardLayout } from '@/layouts/dashboard_layout';
import { AuthLayout } from '@/layouts/auth_layout';
import { RoleGuard } from './role_guard';

// Courses Pages (Role 1)
import { CourseCatalogPage } from '@/features/courses/pages/course_catalog_page';
import { CourseDetailPage } from '@/features/courses/pages/course_detail_page';
import { CourseCatalogGridPage } from '@/features/courses/course_catalog_grid_page';
import { CourseDetailOverviewPage } from '@/features/courses/course_detail_overview_page';
import { CourseDetailCurriculumPage } from '@/features/courses/course_detail_curriculum_page';
import { CourseDetailInstructorPage } from '@/features/courses/course_detail_instructor_page';
import { CourseDetailReviewsPage } from '@/features/courses/course_detail_reviews_page';
import { CourseWriteReviewPage } from '@/features/courses/course_write_review_page';

// Payment Pages (Role 1)
import CheckoutPage from '@/features/payment/components/checkout_page';
import { PaymentResultPage } from '@/features/payment/payment_result_page';

// Quiz Pages (Role 1)
import QuizAttemptPage from '@/features/quiz/quiz_attempt_page';
import QuizPreviewPage from '@/features/quiz/quiz_preview_page';
import { QuizResultPage } from '@/features/quiz/quiz_result_page';

// Teacher Studio Pages (Role 1)
import { TeacherDashboardPage } from '@/features/teacher/teacher_dashboard_page';
import { TeacherProfilePage } from '@/features/teacher/teacher_profile_page';
import { TeacherStudentsPage } from '@/features/teacher/teacher_students_page';
import { TeacherEarningsPage } from '@/features/teacher/teacher_earnings_page';
import { TeacherSettingsPage } from '@/features/teacher/teacher_settings_page';
import { CourseBuilderPage } from '@/features/teacher/teacher_course_builder_page';
import { CourseApprovalStatusPage } from '@/features/teacher/teacher_course_approval_status_page';
import { TeacherWalletPage } from '@/features/wallet/teacher_wallet_page';

// Student settings page
import { StudentSettingsPage } from '@/features/student/pages/student_settings_page';

// Admin Pages (Role 1 & 2)
import CourseApprovalReviewPage from '@/features/admin/admin_course_approval_review_page';
import { AdminVerificationsPage } from '@/features/admin/pages/admin_verifications_page';

// Student & Platform Pages (Role 2)
import { StudentDashboardPage } from '@/features/student/pages/student_dashboard_page';
import { StudentProfilePage } from '@/features/student/pages/student_profile_page';
import { EnrolledCoursesPage } from '@/features/student/pages/enrolled_courses_page';
import { StudentFavoritesPage } from '@/features/student/pages/student_favorites_page';
import { StudentHistoryPage } from '@/features/student/pages/student_history_page';
import { InstructorListPage } from '@/features/instructor/pages/instructor_list_page';
import { InstructorDetailPage } from '@/features/instructor/pages/instructor_detail_page';
import { BecomeTeacherPage } from '@/features/teacher/pages/become_teacher_page';
import { ProblemListPage } from '@/features/judge/pages/problem_list_page';
import { OJWorkspacePage } from '@/features/judge/pages/oj_workspace_page';
import { ClassroomPage } from '@/features/classroom/pages/classroom_page';
import { LessonProblemPreviewPage } from '@/features/classroom/pages/lesson_problem_preview_page';
import { InterviewSetupPage } from '@/features/interview/pages/interview_setup_page';
import { InterviewWorkspacePage } from '@/features/interview/pages/interview_workspace_page';
import { InterviewReportPage } from '@/features/interview/pages/interview_report_page';

import { Clock } from 'lucide-react';

const LoginPage = () => (
	<div className="p-6 rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-center max-w-md mx-auto my-12">
		<h2 className="text-xl font-bold mb-4">Sign In</h2>
		<p className="text-xs text-[hsl(var(--text-secondary))]">Student & Instructor Sign In</p>
	</div>
);

const RegisterPage = () => (
	<div className="p-6 rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-center max-w-md mx-auto my-12">
		<h2 className="text-xl font-bold mb-4">Sign Up</h2>
		<p className="text-xs text-[hsl(var(--text-secondary))]">Create a new account</p>
	</div>
);



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
				<Link
					to="/dashboard"
					className="flex-1 py-2.5 bg-[#392C7D] text-white text-sm font-semibold rounded-xl hover:bg-[#2d2263] text-center transition-all cursor-pointer"
				>
					Return to Dashboard
				</Link>
			</div>
		</div>
	</div>
);

const UnauthorizedPage = () => (
	<div className="p-12 text-center">
		<h2 className="text-2xl font-bold text-rose-500">403 - Bạn không có quyền truy cập trang này</h2>
	</div>
);

const NotFoundPage = () => (
	<div className="p-12 text-center">
		<h2 className="text-2xl font-bold">404 - Trang không tồn tại</h2>
	</div>
);

export const AppRoutes: React.FC = () => {
	return (
		<>
			<ScrollToTop />
			<Routes>
			{/* Public / Main Layout */}
			<Route element={<MainLayout />}>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />

				{/* Course Catalog & Details */}
				<Route path="/courses" element={<CourseCatalogGridPage />} />
				<Route path="/courses/:courseSlug" element={<CourseDetailOverviewPage />} />
				<Route path="/courses-overview/:courseSlug" element={<CourseDetailCurriculumPage />} />
				<Route path="/courses-instructor/:courseSlug" element={<CourseDetailInstructorPage />} />
				<Route path="/courses-reviews/:courseSlug" element={<CourseDetailReviewsPage />} />
				<Route path="/courses-reviews/write/:courseSlug" element={<CourseWriteReviewPage />} />
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
				<Route path="/student/settings" element={<StudentSettingsPage />} />

				{/* Instructor Directory */}
				<Route path="/instructors" element={<InstructorListPage />} />
				<Route path="/instructors/:instructorId" element={<InstructorDetailPage />} />
				<Route path="/instructor/detail" element={<InstructorDetailPage />} />

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
				<Route path="/classroom/lesson/problem-preview" element={<LessonProblemPreviewPage />} />
				<Route path="/classroom/problem-preview" element={<LessonProblemPreviewPage />} />
				<Route path="/prog01" element={<LessonProblemPreviewPage />} />

				{/* Payment */}
				<Route path="/checkout/:courseId" element={<CheckoutPage />} />
				<Route path="/payment-result" element={<PaymentResultPage />} />

				<Route path="/unauthorized" element={<UnauthorizedPage />} />
			</Route>

			{/* Standalone Workspaces (OJ02 & Quiz Runners) */}
			<Route path="/practice/:problemSlug" element={<OJWorkspacePage />} />
			<Route path="/quiz/:quizId/attempt" element={<QuizAttemptPage />} />
			<Route path="/quiz/:quizId/preview" element={<QuizPreviewPage />} />
			<Route path="/quiz/:quizId/result" element={<QuizResultPage />} />

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
				<Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
				<Route path="/teacher/profile" element={<TeacherProfilePage />} />
				<Route path="/teacher/course-builder" element={<CourseBuilderPage />} />
				<Route path="/teacher/students" element={<TeacherStudentsPage />} />
				<Route path="/teacher/earnings" element={<TeacherEarningsPage />} />
				<Route path="/teacher/wallet" element={<TeacherWalletPage />} />
				<Route path="/teacher/settings" element={<TeacherSettingsPage />} />
				<Route path="/teacher/courses" element={<Navigate to="/teacher/course-builder" replace />} />
				<Route path="/teacher/courses/:courseId/review-status" element={<CourseApprovalStatusPage />} />
			</Route>

			{/* Admin Protected Panel (2 Moderation Subpages) */}
			<Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
				{/* 1. Course Approval Review */}
				<Route path="/admin/courses" element={<CourseApprovalReviewPage />} />
				<Route path="/admin/course-review/:courseId" element={<CourseApprovalReviewPage />} />
				
				{/* 2. Teacher Registration Review */}
				<Route path="/admin/verifications" element={<AdminVerificationsPage />} />
				<Route path="/admin/teachers" element={<AdminVerificationsPage />} />
				
				{/* Admin Default Redirects */}
				<Route path="/admin" element={<Navigate to="/admin/verifications" replace />} />
				<Route path="/admin/dashboard" element={<Navigate to="/admin/verifications" replace />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
		</>
	);
};
