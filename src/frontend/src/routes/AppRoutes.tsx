import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ClassroomLayout } from '@/layouts/ClassroomLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RoleGuard } from './RoleGuard';

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
	CheckCircle,
	ArrowRight,
	Search
} from 'lucide-react';

// Interactive Home Showcase
const HomePage = () => {
	const { user, setAuth, logout } = useAuthStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('components');

	const mockLogin = (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
		setAuth(
			{
				id: 1,
				email: `${role.toLowerCase()}@skillboost.com`,
				fullName: `${role} Demo User`,
				roles: [role],
				accountStatus: 'ACTIVE',
				teacherProfile:
					role === 'TEACHER'
						? { verified: true, status: 'APPROVED', bio: 'Senior Software Engineer & Instructor' }
						: undefined
			},
			'mock-jwt-token-12345'
		);
		toast.success(`Đã đăng nhập với Role: ${role}`);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
			{/* Hero */}
			<div className="text-center space-y-4 max-w-3xl mx-auto">
				<Badge variant="indigo" size="md">
					🚀 Frontend Phase 1: Shared Foundation Ready
				</Badge>
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-[hsl(var(--color-brand-indigo))] via-[hsl(var(--color-brand-purple))] to-[hsl(var(--color-brand-cyan))] bg-clip-text text-transparent">
					SkillBoost LMS Coding Platform
				</h1>
				<p className="text-base text-[hsl(var(--text-secondary))]">
					Hệ thống học lập trình trực tuyến chuẩn Microservices, tích hợp Online Judge, AI Mock Interview và cổng thanh toán PayOS.
				</p>
			</div>

			{/* Role Simulation Panel */}
			<Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-base font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
							<ShieldCheck className="w-5 h-5 text-indigo-500" />
							Bộ giả lập Quyền (Role Simulation)
						</h3>
						<p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">
							Hiện tại: <span className="font-semibold text-indigo-400">{user ? `${user.fullName} (${user.roles.join(', ')})` : 'Khách vãng lai (Guest)'}</span>
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button size="sm" variant="secondary" onClick={() => mockLogin('STUDENT')}>
							Test Student
						</Button>
						<Button size="sm" variant="primary" onClick={() => mockLogin('TEACHER')}>
							Test Teacher
						</Button>
						<Button size="sm" variant="outline" onClick={() => mockLogin('ADMIN')}>
							Test Admin
						</Button>
						{user && (
							<Button size="sm" variant="danger" onClick={logout}>
								Clear Auth
							</Button>
						)}
					</div>
				</div>
			</Card>

			{/* Module Navigation Grid for Role 1 & Role 2 */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Role 1 Box */}
				<Card className="space-y-4 border-cyan-500/20">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-cyan-500">Phân công Người 1</span>
						<Badge variant="cyan">Role 1</Badge>
					</div>
					<h3 className="text-lg font-bold text-[hsl(var(--text-primary))]">Course / Payment / Wallet / Quiz</h3>
					<p className="text-xs text-[hsl(var(--text-secondary))]">
						Quản lý danh mục khóa học, PayOS checkout, ví giảng viên và bài kiểm tra trắc nghiệm.
					</p>
					<div className="flex flex-wrap gap-2 pt-2">
						<Link to="/courses">
							<Button size="sm" variant="outline" icon={<BookOpen className="w-3.5 h-3.5" />}>
								Course Catalog
							</Button>
						</Link>
						<Link to="/checkout/1">
							<Button size="sm" variant="outline" icon={<CreditCard className="w-3.5 h-3.5" />}>
								PayOS Checkout
							</Button>
						</Link>
						<Link to="/teacher/dashboard">
							<Button size="sm" variant="outline" icon={<GraduationCap className="w-3.5 h-3.5" />}>
								Teacher Dashboard
							</Button>
						</Link>
					</div>
				</Card>

				{/* Role 2 Box */}
				<Card className="space-y-4 border-purple-500/20">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-purple-500">Phân công Người 2</span>
						<Badge variant="purple">Role 2</Badge>
					</div>
					<h3 className="text-lg font-bold text-[hsl(var(--text-primary))]">Learning / OJ / AI Interview / Admin</h3>
					<p className="text-xs text-[hsl(var(--text-secondary))]">
						Không gian học Classroom, trình chấm code Online Judge, AI Phỏng vấn và Quản trị Admin.
					</p>
					<div className="flex flex-wrap gap-2 pt-2">
						<Link to="/learn/python-basics">
							<Button size="sm" variant="outline" icon={<BookOpen className="w-3.5 h-3.5" />}>
								Classroom Workspace
							</Button>
						</Link>
						<Link to="/practice">
							<Button size="sm" variant="outline" icon={<Terminal className="w-3.5 h-3.5" />}>
								Online Judge
							</Button>
						</Link>
						<Link to="/interview">
							<Button size="sm" variant="outline" icon={<Sparkles className="w-3.5 h-3.5" />}>
								AI Interview
							</Button>
						</Link>
						<Link to="/admin/verifications">
							<Button size="sm" variant="outline" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
								Admin CCCD
							</Button>
						</Link>
					</div>
				</Card>
			</div>

			{/* Design System Showcase */}
			<div className="space-y-6 pt-4 border-t border-[hsl(var(--border-color))]">
				<h3 className="text-xl font-bold text-[hsl(var(--text-primary))]">Design System UI Showcase</h3>

				<Tabs
					tabs={[
						{ id: 'components', label: 'Atomic Components' },
						{ id: 'feedback', label: 'Feedback & Modals' },
						{ id: 'placeholders', label: 'Loaders & Empty States' }
					]}
					activeTab={activeTab}
					onChange={setActiveTab}
				/>

				{activeTab === 'components' && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card className="space-y-4">
							<h4 className="text-sm font-semibold">Buttons & Variants</h4>
							<div className="flex flex-wrap gap-2">
								<Button variant="primary">Primary</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="danger">Danger</Button>
								<Button isLoading>Loading</Button>
							</div>
						</Card>

						<Card className="space-y-4">
							<h4 className="text-sm font-semibold">Badges & Statuses</h4>
							<div className="flex flex-wrap gap-2">
								<Badge variant="indigo">Indigo Brand</Badge>
								<Badge variant="purple">Purple Accent</Badge>
								<Badge variant="cyan">Cyan Accent</Badge>
								<Badge variant="success">Accepted / Approved</Badge>
								<Badge variant="warning">Pending Review</Badge>
								<Badge variant="error">Wrong Answer</Badge>
							</div>
						</Card>

						<Card className="space-y-4 md:col-span-2">
							<h4 className="text-sm font-semibold">Form Inputs</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Input label="Họ và tên" placeholder="Nguyễn Văn A" />
								<Input
									label="Tìm kiếm bài tập"
									placeholder="Nhập tên bài hoặc thuật toán..."
									iconPrefix={<Search className="w-4 h-4" />}
								/>
								<Input
									label="Email (Có báo lỗi)"
									placeholder="user@example.com"
									defaultValue="invalid-email"
									error="Định dạng email không hợp lệ"
								/>
								<Input label="Mật khẩu" type="password" placeholder="••••••••" hint="Tối thiểu 8 ký tự" />
							</div>
						</Card>
					</div>
				)}

				{activeTab === 'feedback' && (
					<Card className="space-y-4">
						<h4 className="text-sm font-semibold">Toast & Modal Feedback</h4>
						<div className="flex flex-wrap gap-3">
							<Button variant="primary" onClick={() => toast.success('Thao tác thành công!')}>
								Test Success Toast
							</Button>
							<Button variant="danger" onClick={() => toast.error('Có lỗi xảy ra khi nộp bài!')}>
								Test Error Toast
							</Button>
							<Button variant="outline" onClick={() => setIsModalOpen(true)}>
								Mở Modal Demo
							</Button>
						</div>
					</Card>
				)}

				{activeTab === 'placeholders' && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card className="space-y-3">
							<h4 className="text-sm font-semibold">Shimmer Skeletons</h4>
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<div className="flex gap-2 pt-2">
								<Skeleton className="h-8 w-24" />
								<Skeleton className="h-8 w-24" />
							</div>
						</Card>

						<EmptyState
							title="Chưa có dữ liệu bài tập"
							description="Danh sách bài tập đang được cập nhật, vui lòng quay lại sau."
							actionLabel="Tải lại trang"
							onAction={() => toast.info('Đang tải lại...')}
						/>
					</div>
				)}
			</div>

			{/* Test Modal */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Xác nhận nộp bài (Testcase Runner)"
				description="Hệ thống sẽ chạy toàn bộ bộ testcase ẩn để chấm điểm tự động."
				footer={
					<>
						<Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
							Hủy bỏ
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={() => {
								setIsModalOpen(false);
								toast.success('Đã gửi code lên hệ thống chấm bài!');
							}}
						>
							Chấp nhận nộp
						</Button>
					</>
				}
			>
				<p className="text-sm text-[hsl(var(--text-secondary))]">
					Bạn đang chọn ngôn ngữ <strong className="text-[hsl(var(--text-primary))]">C++ 20</strong>. Thời gian giới hạn tối đa là 1000ms.
				</p>
			</Modal>
		</div>
	);
};

const CourseCatalogPage = () => <div className="p-8 max-w-7xl mx-auto"><h2 className="text-2xl font-bold">Danh sách Khóa học (COURSE01)</h2></div>;
const CourseDetailPage = () => <div className="p-8 max-w-7xl mx-auto"><h2 className="text-2xl font-bold">Chi tiết Khóa học (COURSE02)</h2></div>;
const CheckoutPage = () => <div className="p-8 max-w-7xl mx-auto"><h2 className="text-2xl font-bold">Thanh toán PayOS (PAY02)</h2></div>;

const ProblemListPage = () => <div className="p-8 max-w-7xl mx-auto"><h2 className="text-2xl font-bold">Danh sách Bài tập OJ (OJ01)</h2></div>;
const OJWorkspacePage = () => <div className="p-8 max-w-7xl mx-auto"><h2 className="text-2xl font-bold">Online Judge Workspace (OJ02)</h2></div>;
const InterviewPage = () => <div className="p-8 max-w-7xl mx-auto"><h2 className="text-2xl font-bold">AI Mock Interview (INTERVIEW02)</h2></div>;

const LoginPage = () => <div className="p-6 rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-center"><h2 className="text-xl font-bold mb-4">Đăng nhập</h2><p className="text-xs text-[hsl(var(--text-secondary))]">Form đăng nhập học viên / giảng viên</p></div>;
const RegisterPage = () => <div className="p-6 rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-center"><h2 className="text-xl font-bold mb-4">Đăng ký</h2><p className="text-xs text-[hsl(var(--text-secondary))]">Form tạo tài khoản mới</p></div>;

const StudentDashboard = () => <div><h2 className="text-2xl font-bold mb-4">Student Dashboard (STD01)</h2></div>;
const TeacherDashboard = () => <div><h2 className="text-2xl font-bold mb-4">Teacher Dashboard & Analytics (TC01/TC04)</h2></div>;
const AdminVerifications = () => <div><h2 className="text-2xl font-bold mb-4">Duyệt CCCD Giảng viên (AD01)</h2></div>;

const ClassroomPage = () => <div className="p-8 flex-1"><h2 className="text-2xl font-bold">Classroom Learning Workspace (CLASS01)</h2></div>;
const UnauthorizedPage = () => <div className="p-12 text-center"><h2 className="text-2xl font-bold text-rose-500">403 - Bạn không có quyền truy cập trang này</h2></div>;
const NotFoundPage = () => <div className="p-12 text-center"><h2 className="text-2xl font-bold">404 - Trang không tồn tại</h2></div>;

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public / Student Layout */}
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/courses" element={<CourseCatalogPage />} />
				<Route path="/courses/:courseSlug" element={<CourseDetailPage />} />
				<Route path="/practice" element={<ProblemListPage />} />
				<Route path="/practice/:problemSlug" element={<OJWorkspacePage />} />
				<Route path="/interview" element={<InterviewPage />} />
				<Route path="/checkout/:courseId" element={<CheckoutPage />} />
				<Route path="/unauthorized" element={<UnauthorizedPage />} />
			</Route>

			{/* Auth Layout */}
			<Route element={<AuthLayout />}>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Route>

			{/* Student Protected Hub */}
			<Route element={<RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
				<Route element={<DashboardLayout role="STUDENT" />}>
					<Route path="/student/dashboard" element={<StudentDashboard />} />
				</Route>
			</Route>

			{/* Teacher Protected Studio */}
			<Route element={<RoleGuard allowedRoles={['TEACHER']} requireTeacherApproved={false} />}>
				<Route element={<DashboardLayout role="TEACHER" />}>
					<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
					<Route path="/teacher/courses" element={<div>Quản lý khóa học</div>} />
					<Route path="/teacher/earnings" element={<div>Doanh thu</div>} />
					<Route path="/teacher/students" element={<div>Học viên</div>} />
				</Route>
			</Route>

			{/* Admin Protected Panel */}
			<Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
				<Route element={<DashboardLayout role="ADMIN" />}>
					<Route path="/admin/dashboard" element={<div>Tổng quan Admin</div>} />
					<Route path="/admin/verifications" element={<AdminVerifications />} />
					<Route path="/admin/courses" element={<div>Duyệt khóa học</div>} />
					<Route path="/admin/users" element={<div>Quản trị tài khoản</div>} />
				</Route>
			</Route>

			{/* Classroom Workspace */}
			<Route element={<RoleGuard allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
				<Route element={<ClassroomLayout />}>
					<Route path="/learn/:courseSlug" element={<ClassroomPage />} />
				</Route>
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};
