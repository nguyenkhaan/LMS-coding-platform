import React from 'react';
import { Link } from 'react-router-dom';

export type CourseDetailTab = 'Overview' | 'Curriculum' | 'Instructor' | 'Reviews';

interface CourseDetailTabsProps {
	activeTab: CourseDetailTab;
	courseSlug: string;
}

const TABS: { id: CourseDetailTab; label: string; getPath: (slug: string) => string }[] = [
	{ id: 'Overview', label: 'Overview', getPath: (slug) => `/courses/${slug}` },
	{ id: 'Curriculum', label: 'Curriculum', getPath: (slug) => `/courses-overview/${slug}` },
	{ id: 'Instructor', label: 'Instructor', getPath: (slug) => `/courses-instructor/${slug}` },
	{ id: 'Reviews', label: 'Reviews', getPath: (slug) => `/courses-reviews/${slug}` },
];

export const CourseDetailTabs: React.FC<CourseDetailTabsProps> = ({ activeTab, courseSlug }) => {
	return (
		<div className="w-fit p-1 bg-slate-100 rounded-xl inline-flex justify-center items-center gap-1.5 font-semibold text-sm text-neutral-500 shadow-xs border border-slate-200/50">
			{TABS.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<Link
						key={tab.id}
						to={tab.getPath(courseSlug)}
						className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${
							isActive
								? 'bg-white text-primary font-bold shadow-xs'
								: 'hover:bg-white/50 text-neutral-500'
						}`}
					>
						{tab.label}
					</Link>
				);
			})}
		</div>
	);
};
