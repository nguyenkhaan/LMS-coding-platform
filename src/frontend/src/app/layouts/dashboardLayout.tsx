import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useThemeStore } from '@/hooks/context/useThemeStore';
import { Button } from '@/components/ui/button';
import {
	Code2,
	Sun,
	Moon,
	LayoutDashboard,
	BookOpen,
	DollarSign,
	Users,
	ShieldCheck,
	ArrowLeft,
	LogOut
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface DashboardLayoutProps {
	role: 'TEACHER' | 'ADMIN' | 'STUDENT';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
	const { user, logout } = useAuthStore();
	const { theme, toggleTheme } = useThemeStore();
	const location = useLocation();

	const teacherNav = [
		{ to: '/teacher/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
		{ to: '/teacher/courses', label: 'Quản lý khóa học', icon: BookOpen },
		{ to: '/teacher/earnings', label: 'Doanh thu & Ví', icon: DollarSign },
		{ to: '/teacher/students', label: 'Học viên', icon: Users }
	];

	const adminNav = [
		{ to: '/admin/dashboard', label: 'Tổng quan Admin', icon: LayoutDashboard },
		{ to: '/admin/verifications', label: 'Duyệt CCCD Giảng viên', icon: ShieldCheck },
		{ to: '/admin/courses', label: 'Duyệt khóa học', icon: BookOpen },
		{ to: '/admin/users', label: 'Quản trị tài khoản', icon: Users }
	];

	const studentNav = [
		{ to: '/student/courses', label: 'Khóa học của tôi', icon: BookOpen },
		{ to: '/student/favorites', label: 'Yêu thích', icon: LayoutDashboard },
		{ to: '/student/history', label: 'Lịch sử nộp bài', icon: Code2 }
	];

	const navItems = role === 'TEACHER' ? teacherNav : role === 'ADMIN' ? adminNav : studentNav;

	return (
		<div className="min-h-screen flex bg-[hsl(var(--bg-main))] text-[hsl(var(--text-primary))]">
			{/* Sidebar */}
			<aside className="w-64 border-r border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] flex flex-col shrink-0">
				<div className="h-16 px-6 border-b border-[hsl(var(--border-color))] flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] flex items-center justify-center text-white">
						<Code2 className="w-4 h-4" />
					</div>
					<span className="font-bold text-base bg-gradient-to-r from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] bg-clip-text text-transparent">
						{role === 'ADMIN' ? 'Admin Portal' : role === 'TEACHER' ? 'Teacher Studio' : 'Student Hub'}
					</span>
				</div>

				<nav className="p-4 space-y-1 flex-1">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.to;
						return (
							<Link
								key={item.to}
								to={item.to}
								className={cn(
									'flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all',
									isActive
										? 'bg-[hsl(var(--color-brand-indigo))] text-white shadow-sm'
										: 'text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-muted))] hover:text-[hsl(var(--text-primary))]'
								)}
							>
								<Icon className="w-4 h-4" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="p-4 border-t border-[hsl(var(--border-color))] space-y-2">
					<Link
						to="/"
						className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-muted))] hover:text-[hsl(var(--text-primary))]"
					>
						<ArrowLeft className="w-4 h-4" /> Về trang chủ
					</Link>
					<button
						onClick={logout}
						className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
					>
						<LogOut className="w-4 h-4" /> Đăng xuất
					</button>
				</div>
			</aside>

			{/* Main Workspace */}
			<div className="flex-1 flex flex-col min-w-0">
				<header className="h-16 px-8 border-b border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))]/50 backdrop-blur-md flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--bg-muted))] text-[hsl(var(--text-secondary))]">
							Role: {role}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Button variant="ghost" size="icon" onClick={toggleTheme}>
							{theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
						</Button>
						<div className="text-right">
							<p className="text-xs font-semibold text-[hsl(var(--text-primary))]">{user?.fullName || user?.email}</p>
							<p className="text-[10px] text-[hsl(var(--text-muted))]">{user?.email}</p>
						</div>
					</div>
				</header>

				<main className="flex-1 p-8 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
