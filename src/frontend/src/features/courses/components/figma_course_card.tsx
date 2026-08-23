import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Heart, BookOpen, Clock } from 'lucide-react';
import { FigmaCourse } from './figma-types';

interface CourseCardProps {
	course: FigmaCourse;
	isFav: boolean;
	toggleFav: (id: number) => void;
}

export const FigmaCourseCard: React.FC<CourseCardProps> = ({ course, isFav, toggleFav }) => {
	return (
		<div className="w-full h-full min-h-[360px] bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col overflow-hidden relative group hover:shadow-lg transition-all duration-300">
			{/* Image thumbnail placeholder */}
			<div className="h-36 bg-gradient-to-tr from-[#392C7D] to-indigo-900 relative flex items-end justify-between p-3.5 select-none">
				<span className="px-2 py-0.5 bg-[#FF4667] text-white text-[10px] font-semibold rounded-lg">
					{course.category}
				</span>
				<span className="text-white text-[10px] font-semibold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-lg">
					{course.level}
				</span>
				
				{/* Heart button overlay */}
				<button 
					onClick={(e) => {
						e.stopPropagation();
						toggleFav(course.id);
					}}
					className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
				>
					<Heart className={`w-4 h-4 ${isFav ? 'fill-[#FF4667] text-[#FF4667]' : 'text-neutral-400'}`} />
				</button>
			</div>

			{/* Details Section */}
			<div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
				<div>
					<h3 className="text-zinc-900 text-sm font-semibold leading-tight line-clamp-1 group-hover:text-[#392C7D] transition-colors">
						{course.title}
					</h3>
					<p className="text-neutral-500 text-xs line-clamp-2 mt-1">
						{course.description}
					</p>
				</div>

				{/* Icons Row */}
				<div className="flex gap-3 text-[10px] text-neutral-400 font-semibold border-t border-slate-50 pt-2">
					<span className="flex items-center gap-1">
						<BookOpen className="w-3.5 h-3.5" />
						{course.lessons} lessons
					</span>
					<span className="flex items-center gap-1">
						<Clock className="w-3.5 h-3.5" />
						{course.duration}
					</span>
					<span className="flex items-center gap-1">
						<Users className="w-3.5 h-3.5" />
						{course.enrolled.toLocaleString()}
					</span>
				</div>

				{/* Rating Row */}
				<div className="flex items-center gap-1.5 text-xs">
					<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
					<span className="font-semibold text-zinc-900">{course.rating}</span>
					<span className="text-neutral-400">· {course.instructor}</span>
				</div>

				{/* Purchase Row */}
				<div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-auto">
					<span className="text-[#392C7D] text-sm font-bold">${course.price}</span>
					<Link to={`/courses/${course.id}`}>
						<button className="px-3 py-1 bg-[#392C7D] hover:bg-[#2b215c] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer">
							View course
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
