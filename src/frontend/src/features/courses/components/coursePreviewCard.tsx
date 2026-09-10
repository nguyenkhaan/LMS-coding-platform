import React from 'react';
import { Star, PlayCircle, Clock, User } from 'lucide-react';

export const CourseCatalogItemThumbnailCard: React.FC = () => {
	return (
		<div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm flex flex-col">
			{/* Thumbnail Image */}
			<div className="w-full h-[240px] relative overflow-hidden bg-slate-900 flex justify-center items-center">
				<img 
					className="w-full h-full object-cover opacity-80" 
					src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80" 
					alt="Python Coding Course Thumbnail" 
				/>
				{/* Visual play button overlay matching video previews */}
				<div className="absolute inset-0 flex justify-center items-center">
					<div className="size-16 rounded-full bg-white/20 backdrop-blur-xs flex justify-center items-center text-white shadow-lg cursor-pointer hover:scale-105 transition-all">
						<PlayCircle className="w-10 h-10 fill-white stroke-primary" />
					</div>
				</div>
			</div>
			{/* Course Stats row */}
			<div className="w-full px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 text-xs font-semibold text-neutral-500">
				<div className="flex items-center gap-1.5">
					<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
					<span className="text-zinc-900 font-semibold">4.8</span>
					<span>(12,480 students)</span>
				</div>
				<div className="flex items-center gap-1.5">
					<PlayCircle className="w-4 h-4 text-neutral-400" />
					<span>42 lessons</span>
				</div>
				<div className="flex items-center gap-1.5">
					<Clock className="w-4 h-4 text-neutral-400" />
					<span>18 hours</span>
				</div>
				<div className="flex items-center gap-1.5">
					<User className="w-4 h-4 text-neutral-400" />
					<span>Lê Quang Huy</span>
				</div>
			</div>
		</div>
	);
};
