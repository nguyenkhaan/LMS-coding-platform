import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeroBannerProps {
	title?: string;
	breadcrumb?: string;
	parentTitle?: string;
	parentLink?: string;
}

export const FigmaHeroBanner: React.FC<PageHeroBannerProps> = ({
	title = 'Course Grid',
	breadcrumb = 'Courses',
	parentTitle = 'Dashboard',
	parentLink = '/dashboard'
}) => {
	return (
		<div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
			<h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
				{title}
			</h1>
			<div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
				<Link to={parentLink} className="text-neutral-500 hover:text-zinc-900 transition-colors">
					{parentTitle}
				</Link>
				<span className="text-neutral-400 font-normal">&gt;</span>
				<span className="text-zinc-900 font-semibold">{breadcrumb}</span>
			</div>
		</div>
	);
};
