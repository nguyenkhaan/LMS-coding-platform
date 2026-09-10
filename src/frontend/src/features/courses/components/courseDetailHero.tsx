import React from 'react';
import { Star } from 'lucide-react';

interface HeroProps {
	title: string;
	instructor: string;
	rating: number;
	reviewsCount: number;
}

export const CourseDetailHero: React.FC<HeroProps> = ({ title, instructor, rating, reviewsCount }) => {
	return (
		<div className="w-full min-h-[260px] bg-primary relative overflow-hidden flex items-center py-8">
			{/* Overlay Tint */}
			<div className="absolute inset-0 bg-black/45" />
			<div className="w-full max-w-[1340px] mx-auto px-4 flex flex-col gap-3 text-white relative z-10">
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-300">
					<span>Dashboard</span><span className="text-slate-400">&gt;</span><span>Courses</span><span className="text-slate-400">&gt;</span><span className="text-white">Detail</span>
				</div>
				<h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white max-w-4xl leading-tight">
					{title}
				</h1>
				<p className="text-sm font-medium text-neutral-300">
					Master programming fundamentals, software design patterns and complexity analysis with real judges.
				</p>
				<div className="flex items-center gap-4 mt-3">
					<div className="flex items-center gap-2">
						<img className="w-12 h-12 rounded-full border-2 border-white/25 shadow-sm" src="https://placehold.co/48x48" alt={instructor} />
						<div className="flex flex-col ml-1">
							<span className="text-sm font-semibold">{instructor}</span>
							<span className="text-[10px] text-neutral-400">Lead Instructor</span>
						</div>
					</div>
					<div className="h-6 w-px bg-white/20" />
					<div className="flex items-center gap-1.5 text-sm font-semibold">
						<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
						<span>{rating}</span>
						<span className="text-neutral-400 font-normal">({reviewsCount.toLocaleString()} reviews)</span>
					</div>
				</div>
			</div>
		</div>
	);
};
