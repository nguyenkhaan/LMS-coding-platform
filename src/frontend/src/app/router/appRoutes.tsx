import { ScrollToTop } from '@/components/common/scrollToTop';
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/mainLayout';
import { AuthLayout } from '@/app/layouts/authLayout';
import { RoleGuard } from './roleGuard.tsx';

// Auth Pages
import { LoginPage } from '@/features/auth/pages/authLoginPage';
import { RegisterPage } from '@/features/auth/pages/authRegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/authForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/authResetPasswordPage';

// Courses Pages
import { CourseCatalogPage } from '@/features/courses/pages/courseCatalogPage';
import { CourseDetailPage } from '@/features/courses/pages/courseDetailPage';
import { CourseCatalogGridPage } from '@/features/courses/pages/courseCatalogGridPage';
import { CourseDetailOverviewPage } from '@/features/courses/pages/courseDetailOverviewPage';
import { CourseDetailCurriculumPage } from '@/features/courses/pages/courseDetailCurriculumPage';
import { CourseDetailInstructorPage } from '@/features/courses/pages/courseDetailInstructorPage';
import { CourseDetailReviewsPage } from '@/features/courses/pages/courseDetailReviewsPage';
import { CourseWriteReviewPage } from '@/features/courses/pages/courseWriteReviewPage';

// Payment Pages
import CheckoutPage from '@/features/payment/components/checkoutPage';
import { PaymentResultPage } from '@/features/payment/pages/paymentResultPage';

// Quiz Pages
import QuizAttemptPage from '@/features/quiz/pages/quizAttemptPage';
import QuizPreviewPage from '@/features/quiz/pages/quizPreviewPage';
import { QuizResultPage } from '@/features/quiz/pages/quizResultPage';

// Teacher Studio Pages
import { TeacherDashboardPage } from '@/features/teacher/pages/teacherDashboardPage';
import { TeacherProfilePage } from '@/features/teacher/pages/teacherProfilePage';
import { TeacherStudentsPage } from '@/features/teacher/pages/teacherStudentsPage';
import { TeacherEarningsPage } from '@/features/teacher/pages/teacherEarningsPage';
import { TeacherSettingsPage } from '@/features/teacher/pages/teacherSettingsPage';
import { CourseBuilderPage } from '@/features/teacher/pages/teacherCourseBuilderPage';
import { CourseApprovalStatusPage } from '@/features/teacher/pages/teacherCourseApprovalStatusPage';
import { TeacherWalletPage } from '@/features/teacher/pages/teacherWalletPage';
import { TeacherCoursesPage } from '@/features/teacher/pages/teacherCoursesPage';
import { ReadingBuilderPage } from '@/features/teacher/pages/readingBuilderPage';
import { ProblemBuilderPage } from '@/features/teacher/pages/problemBuilderPage';
import { QuizBuilderPage } from '@/features/teacher/pages/quizBuilderPage';

// Admin Pages
import CourseApprovalReviewPage from '@/features/admin/pages/adminCourseApprovalReviewPage';
import { AdminVerificationsPage } from '@/features/admin/pages/adminVerificationsPage';

// Student Pages
import { StudentDashboardPage } from '@/features/student/pages/studentDashboardPage';
import { StudentProfilePage } from '@/features/student/pages/studentProfilePage';
import { EnrolledCoursesPage } from '@/features/student/pages/enrolledCoursesPage';
import { StudentFavoritesPage } from '@/features/student/pages/studentFavoritesPage';
import { StudentHistoryPage } from '@/features/student/pages/studentHistoryPage';
import { StudentSettingsPage } from '@/features/student/pages/studentSettingsPage';

// Instructor Directory
import { InstructorListPage } from '@/features/instructor/pages/instructorListPage';
import { InstructorDetailPage } from '@/features/instructor/pages/instructorDetailPage';

// Become a Teacher
import { BecomeTeacherPage } from '@/features/teacher/pages/becomeTeacherPage';

// Practice / OJ
import { ProblemListPage } from '@/features/judge/pages/problemListPage';
import { OJWorkspacePage } from '@/features/judge/pages/ojWorkspacePage';

// Classroom
import { ClassroomPage } from '@/features/classroom/pages/classroomPage';
import { LessonProblemPreviewPage } from '@/features/classroom/pages/lessonProblemPreviewPage';

// AI Interview
import { InterviewSetupPage } from '@/features/interview/pages/interviewSetupPage';
import { InterviewWorkspacePage } from '@/features/interview/pages/interviewWorkspacePage';
import { InterviewReportPage } from '@/features/interview/pages/interviewReportPage';

import { Clock } from 'lucide-react';

// ─── Inline utility pages ───────────────────────────────────────────────────

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
					to="/student/dashboard"
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
		<h2 className="text-2xl font-bold text-rose-500">403 — You do not have permission to access this page.</h2>
	</div>
);

const NotFoundPage = () => (
	<div className="p-12 text-center">
		<h2 className="text-2xl font-bold">404 — Page not found.</h2>
	</div>
);

// ─── Routes ─────────────────────────────────────────────────────────────────

export const AppRoutes: React.FC = () => {
	return (
		<>
			<ScrollToTop />
			<Routes>
				{/* ── AUTH LAYOUT (unauthenticated entry) ── */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
				</Route>

				{/* ── PUBLIC BROWSEABLE ROUTES (MainLayout with header + footer) ── */}
				<Route element={<MainLayout />}>
					<Route path="/" element={<CourseCatalogGridPage />} />
					{/* Course Catalog & Details */}
					<Route path="/courses" element={<CourseCatalogGridPage />} />
					<Route path="/courses/:courseSlug" element={<CourseDetailOverviewPage />} />
					<Route path="/courses-overview/:courseSlug" element={<CourseDetailCurriculumPage />} />
					<Route path="/courses-instructor/:courseSlug" element={<CourseDetailInstructorPage />} />
					<Route path="/courses-reviews/:courseSlug" element={<CourseDetailReviewsPage />} />
					<Route path="/courses-reviews/write/:courseSlug" element={<CourseWriteReviewPage />} />
					<Route path="/courses-catalog" element={<CourseCatalogPage />} />
					<Route path="/courses-detail/:courseSlug" element={<CourseDetailPage />} />

					{/* Instructor Directory */}
					<Route path="/instructors" element={<InstructorListPage />} />
					<Route path="/instructors/:instructorId" element={<InstructorDetailPage />} />
					<Route path="/instructor/detail" element={<InstructorDetailPage />} />

					{/* Practice & Submissions */}
					<Route path="/practice" element={<ProblemListPage />} />
					<Route path="/submissions" element={<StudentHistoryPage />} />
					<Route path="/practice/history" element={<StudentHistoryPage />} />

					{/* AI Mock Interview Setup */}
					<Route path="/interview" element={<InterviewSetupPage />} />

					<Route path="/unauthorized" element={<UnauthorizedPage />} />
				</Route>

				{/* ── STANDALONE WORKSPACES (no shared layout) ── */}
				<Route path="/practice/:problemSlug" element={<OJWorkspacePage />} />

				{/* Protected standalone quiz attempt/result workspaces */}
				<Route element={<RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
					<Route path="/quiz/:quizId/attempt" element={<QuizAttemptPage />} />
					<Route path="/quiz/:quizId/preview" element={<QuizPreviewPage />} />
					<Route path="/quiz/:quizId/result" element={<QuizResultPage />} />
				</Route>

				{/* ── STUDENT PROTECTED ROUTES ── */}
				{/*
					StudentDashboardPage, EnrolledCoursesPage, etc. have their OWN full-page
					content layout (profile hero card + sidebar + content). They do NOT need
					DashboardLayout. They DO need MainLayout for the sticky top navigation.
				*/}
				<Route element={<RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
					<Route element={<MainLayout />}>
						<Route path="/student/dashboard" element={<StudentDashboardPage />} />
						<Route path="/student/courses" element={<EnrolledCoursesPage />} />
						<Route path="/enrolled-courses" element={<EnrolledCoursesPage />} />
						<Route path="/courses/enrolled" element={<EnrolledCoursesPage />} />
						<Route path="/student/profile" element={<StudentProfilePage />} />
						<Route path="/profile" element={<StudentProfilePage />} />
						<Route path="/student/favorites" element={<StudentFavoritesPage />} />
						<Route path="/favorites" element={<StudentFavoritesPage />} />
						<Route path="/student/history" element={<StudentHistoryPage />} />
						<Route path="/student/settings" element={<StudentSettingsPage />} />

						{/* Classroom Workspace */}
						<Route path="/learn/:courseSlug" element={<ClassroomPage />} />
						<Route path="/classroom/workspace" element={<ClassroomPage />} />
						<Route path="/classroom/lesson/problem-preview" element={<LessonProblemPreviewPage />} />
						<Route path="/classroom/problem-preview" element={<LessonProblemPreviewPage />} />
						<Route path="/prog01" element={<LessonProblemPreviewPage />} />

						{/* Payment */}
						<Route path="/checkout/:courseId" element={<CheckoutPage />} />
						<Route path="/payment-result" element={<PaymentResultPage />} />

						{/* AI Mock Interview Workspaces & Reports */}
						<Route path="/interview/:sessionId" element={<InterviewWorkspacePage />} />
						<Route path="/interview/report" element={<InterviewReportPage />} />
						<Route path="/interview/report/:sessionId" element={<InterviewReportPage />} />

						{/* Become a Teacher Application (Authenticated) */}
						<Route path="/become-teacher" element={<BecomeTeacherPage />} />
						<Route path="/teacher/apply" element={<BecomeTeacherPage />} />

						{/* Legacy /dashboard alias → redirect to canonical URL */}
						<Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
					</Route>
				</Route>

				{/* ── TEACHER PENDING APPROVAL (has TEACHER role but not yet approved) ── */}
				<Route element={<RoleGuard allowedRoles={['TEACHER']} requireTeacherApproved={false} />}>
					<Route path="/teacher/pending-approval" element={<TeacherPendingApprovalPage />} />
				</Route>

				{/* ── TEACHER APPROVED STUDIO ── */}
				<Route element={<RoleGuard allowedRoles={['TEACHER']} requireTeacherApproved={true} />}>
					<Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
					<Route path="/teacher/profile" element={<TeacherProfilePage />} />
					<Route path="/teacher/course-builder" element={<CourseBuilderPage />} />
					<Route path="/teacher/courses/:courseId/edit" element={<CourseBuilderPage />} />
					<Route path="/teacher/courses/:courseId/problem-builder/new" element={<ProblemBuilderPage />} />
					<Route path="/teacher/courses/:courseId/problem-builder/:activityId/edit" element={<ProblemBuilderPage />} />
					<Route path="/teacher/courses/:courseId/reading-builder/new" element={<ReadingBuilderPage />} />
					<Route path="/teacher/courses/:courseId/reading-builder/:activityId/edit" element={<ReadingBuilderPage />} />
					<Route path="/teacher/courses/:courseId/quiz-builder/new" element={<QuizBuilderPage />} />
					<Route path="/teacher/courses/:courseId/quiz-builder/:activityId/edit" element={<QuizBuilderPage />} />
					<Route path="/teacher/students" element={<TeacherStudentsPage />} />
					<Route path="/teacher/earnings" element={<TeacherEarningsPage />} />
					<Route path="/teacher/wallet" element={<TeacherWalletPage />} />
					<Route path="/teacher/settings" element={<TeacherSettingsPage />} />
					<Route path="/teacher/courses" element={<TeacherCoursesPage />} />
					<Route path="/teacher/courses/:courseId/review-status" element={<CourseApprovalStatusPage />} />
				</Route>

				{/* ── ADMIN PROTECTED PANEL ── */}
				<Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
					<Route path="/admin/courses" element={<CourseApprovalReviewPage />} />
					<Route path="/admin/course-review/:courseId" element={<CourseApprovalReviewPage />} />
					<Route path="/admin/verifications" element={<AdminVerificationsPage />} />
					<Route path="/admin/teachers" element={<AdminVerificationsPage />} />
					{/* Admin root redirects */}
					<Route path="/admin" element={<Navigate to="/admin/verifications" replace />} />
					<Route path="/admin/dashboard" element={<Navigate to="/admin/verifications" replace />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
};
