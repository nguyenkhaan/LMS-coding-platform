import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Button } from '@/components/ui/Button';
import { Sun, Moon, Code2, BookOpen, Terminal, Sparkles, User, LogOut, ShieldCheck, GraduationCap } from 'lucide-react';

export const MainLayout: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const { theme, toggleTheme } = useThemeStore();

	return (
		<div className="min-h-screen flex flex-col bg-[hsl(var(--bg-main))] text-[hsl(var(--text-primary))]">
			{/* Navbar */}
			<header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))]/80 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-8">
						<Link to="/" className="flex items-center gap-2.5">
							<div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
								<Code2 className="w-5 h-5" />
							</div>
							<span className="font-bold text-lg tracking-tight bg-gradient-to-r from-[hsl(var(--color-brand-indigo))] via-[hsl(var(--color-brand-purple))] to-[hsl(var(--color-brand-cyan))] bg-clip-text text-transparent">
								SkillBoost
							</span>
						</Link>

						<nav className="hidden md:flex items-center gap-1">
							<Link
								to="/courses"
								className="px-3 py-2 text-sm font-medium rounded-lg text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-muted))] transition-colors flex items-center gap-1.5"
							>
								<BookOpen className="w-4 h-4" />
								Khóa học
							</Link>
							<Link
								to="/practice"
								className="px-3 py-2 text-sm font-medium rounded-lg text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-muted))] transition-colors flex items-center gap-1.5"
							>
								<Terminal className="w-4 h-4" />
								Luyện Code (OJ)
							</Link>
							<Link
								to="/interview"
								className="px-3 py-2 text-sm font-medium rounded-lg text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-muted))] transition-colors flex items-center gap-1.5"
							>
								<Sparkles className="w-4 h-4 text-purple-500" />
								AI Interview
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							title="Chuyển đổi giao diện Sáng / Tối"
						>
							{theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
						</Button>

						{isAuthenticated && user ? (
							<div className="flex items-center gap-2">
								{user.roles.includes('TEACHER') && (
									<Link to="/teacher/dashboard">
										<Button variant="outline" size="sm" icon={<GraduationCap className="w-4 h-4 text-indigo-500" />}>
											Teacher Portal
										</Button>
									</Link>
								)}
								{user.roles.includes('ADMIN') && (
									<Link to="/admin/verifications">
										<Button variant="outline" size="sm" icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}>
											Admin
										</Button>
									</Link>
								)}
								<Link to="/student/dashboard">
									<Button variant="secondary" size="sm" icon={<User className="w-4 h-4" />}>
										{user.fullName || user.email.split('@')[0]}
									</Button>
								</Link>
								<Button variant="ghost" size="icon" onClick={logout} title="Đăng xuất">
									<LogOut className="w-4 h-4 text-rose-500" />
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Link to="/login">
									<Button variant="ghost" size="sm">Đăng nhập</Button>
								</Link>
								<Link to="/register">
									<Button variant="primary" size="sm">Đăng ký</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1">
				<Outlet />
			</main>

			{/* Footer */}
			<footer className="border-t border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] py-8 text-center text-xs text-[hsl(var(--text-secondary))]">
				<div className="max-w-7xl mx-auto px-4">
					<p>© 2026 SkillBoost LMS Coding Platform. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};
