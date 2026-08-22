import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface AdminSidebarProps {
	pendingTeachersCount?: number;
	pendingCoursesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
	pendingTeachersCount = 2,
	pendingCoursesCount = 3
}) => {
	const location = useLocation();
	const pathname = location.pathname;

	const isTeacherActive = pathname.includes('/admin/verifications') || pathname.includes('/admin/teachers');
	const isCourseActive = pathname.includes('/admin/courses') || pathname.includes('/admin/course-review');

	return (
		<aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
			{/* Moderation Navigation Card */}
			<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-2">
				<div className="flex items-center justify-between px-3 pb-3 border-b border-slate-100">
					<span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
						Moderation Panel
					</span>
					<span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 text-[10px] font-extrabold">
						Admin
					</span>
				</div>

				<div className="flex flex-col gap-1.5 pt-1">
					{/* 1. Teacher Registration Review */}
					<Link
						to="/admin/verifications"
						className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
							isTeacherActive
								? 'bg-indigo-900 text-white shadow-xs'
								: 'text-zinc-700 hover:bg-slate-50 hover:text-indigo-900'
						}`}
					>
						<div className="flex items-center gap-3">
							<Users className={`w-4 h-4 ${isTeacherActive ? 'text-white' : 'text-neutral-400'}`} />
							<span>Teacher Verifications</span>
						</div>
						{pendingTeachersCount > 0 && (
							<span
								className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
									isTeacherActive ? 'bg-amber-400 text-zinc-900' : 'bg-amber-100 text-amber-900'
								}`}
							>
								{pendingTeachersCount}
							</span>
						)}
					</Link>

					{/* 2. Course Approval Review */}
					<Link
						to="/admin/courses"
						className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
							isCourseActive
								? 'bg-indigo-900 text-white shadow-xs'
								: 'text-zinc-700 hover:bg-slate-50 hover:text-indigo-900'
						}`}
					>
						<div className="flex items-center gap-3">
							<BookOpen className={`w-4 h-4 ${isCourseActive ? 'text-white' : 'text-neutral-400'}`} />
							<span>Course Approval</span>
						</div>
						{pendingCoursesCount > 0 && (
							<span
								className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
									isCourseActive ? 'bg-amber-400 text-zinc-900' : 'bg-amber-100 text-amber-900'
								}`}
							>
								{pendingCoursesCount}
							</span>
						)}
					</Link>
				</div>
			</div>

			{/* Review Guidelines & Policy Card */}
			<div className="bg-slate-100/80 rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3 text-xs text-neutral-600">
				<div className="flex items-center gap-2 text-zinc-900 font-bold">
					<ShieldCheck className="w-4 h-4 text-emerald-600" />
					<span>Audit Compliance Policy</span>
				</div>
				<p className="leading-relaxed text-[11px] text-neutral-500">
					All instructor registrations and new course submissions must comply with the platform quality standards and identity verification guidelines before publishing.
				</p>
			</div>
		</aside>
	);
};
