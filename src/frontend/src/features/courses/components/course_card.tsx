import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CourseItem } from '@/types/course';
import { formatCurrency } from '@/utils/format';

interface CourseCardProps {
	course: CourseItem;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
	const isFree = course.price_type === 'free' || course.price === 0;

	return (
		<Card className="flex flex-col h-full overflow-hidden p-0 border border-[hsl(var(--border-color))] hover:border-slate-400/50 hover:shadow-lg transition-all duration-300 group">
			{/* Thumbnail container */}
			<div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
				{course.thumbnail_url ? (
					<img
						src={course.thumbnail_url}
						alt={course.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] text-white font-bold text-lg select-none px-4 text-center">
						{course.title}
					</div>
				)}

				{/* Price indicator badge on image */}
				<div className="absolute top-3 right-3 z-10">
					<Badge variant={isFree ? 'success' : 'indigo'} size="md" className="shadow-sm font-semibold backdrop-blur-xs">
						{isFree ? 'Miễn phí' : formatCurrency(course.price, 'USD')}
					</Badge>
				</div>
			</div>

			{/* Course content details */}
			<div className="flex flex-col flex-1 p-5 space-y-3">
				{/* Category & Rating */}
				<div className="flex items-center justify-between text-xs">
					<span className="font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
						{course.field}
					</span>
					{course.rating > 0 && (
						<div className="flex items-center gap-1 text-amber-500 font-semibold">
							<Star className="w-3.5 h-3.5 fill-current" />
							<span>{course.rating.toFixed(1)}</span>
						</div>
					)}
				</div>

				{/* Title */}
				<h3 className="font-semibold text-base text-[hsl(var(--text-primary))] line-clamp-2 leading-snug group-hover:text-[hsl(var(--color-brand-indigo))] dark:group-hover:text-indigo-400 transition-colors">
					<Link to={`/courses/${course.slug}`}>
						{course.title}
					</Link>
				</h3>

				{/* Tags */}
				{course.tags && course.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5 pt-1">
						{course.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="default" className="text-xs font-semibold py-0">
								{tag}
							</Badge>
						))}
					</div>
				)}

				<div className="flex-1" />

				{/* Footer of Card */}
				<div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border-color))] mt-auto">
					<div className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--text-secondary))]">
						<Users className="w-4 h-4 text-slate-400" />
						<span>{course.enrolled_count.toLocaleString()} học viên</span>
					</div>

					<Link
						to={`/courses/${course.slug}`}
						className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--color-brand-indigo))] dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
					>
						<span>Chi tiết</span>
						<ArrowRight className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>
		</Card>
	);
};
