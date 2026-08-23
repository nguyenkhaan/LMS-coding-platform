import React from 'react';
import { Award, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
	price: number;
	lessons: number;
	isEnrolled: boolean;
	onEnroll: () => void;
	isPaid?: boolean;
	hasReviewed?: boolean;
	courseSlug?: string;
}

export const FigmaDetailSidebar: React.FC<SidebarProps> = ({ 
	price, 
	lessons, 
	isEnrolled, 
	onEnroll,
	isPaid = false,
	hasReviewed = false,
	courseSlug = "python-foundations"
}) => {
	return (
		<div className="w-[320px] flex flex-col gap-5">
			<div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 flex flex-col gap-5">
				{isPaid ? (
					<div className="flex flex-col gap-2">
						<span className="text-zinc-900 text-base font-bold leading-snug">You have paid for this course</span>
						<Link to="/learn/dsa-module-2" className="w-full py-3 bg-[#392C7D] hover:bg-[#392C7D]/90 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center block">Continue studying</Link>
					</div>
				) : (
					<>
						<div className="flex flex-col">
							<span className="text-[#392C7D] text-3xl font-bold">${price}</span>
							<span className="text-neutral-500 text-xs mt-1">One-time payment · lifetime access</span>
						</div>
						
						<button 
							onClick={onEnroll}
							className="w-full py-3 bg-[#FF4667] hover:bg-[#e03d5b] text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
						>
							{isEnrolled ? "Continue Learning" : "Enroll now"}
						</button>
					</>
				)}

				{!isPaid && (
					<Link to="/learn/dsa-module-2" className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-zinc-900 text-sm font-semibold rounded-xl transition-all border border-neutral-200 cursor-pointer flex items-center justify-center gap-2"><Play className="w-3.5 h-3.5 fill-[#392C7D] text-[#392C7D]" />Preview classroom</Link>
				)}

				<div className="h-px bg-slate-100 my-1" />

				<div className="flex flex-col gap-3 text-xs text-neutral-600 font-medium">
					<div className="flex items-center gap-2.5">
						<CheckCircle className="w-4 h-4 text-[#FF4667]" />
						<span>{lessons} on-demand lessons</span>
					</div>
					<div className="flex items-center gap-2.5">
						<CheckCircle className="w-4 h-4 text-[#FF4667]" />
						<span>Unlimited online judge submissions</span>
					</div>
					<div className="flex items-center gap-2.5">
						<CheckCircle className="w-4 h-4 text-[#FF4667]" />
						<span>AI mock interviews included</span>
					</div>
					<div className="flex items-center gap-2.5">
						<CheckCircle className="w-4 h-4 text-[#FF4667]" />
						<span>Mentor code reviews</span>
					</div>
				</div>

				<div className="h-px bg-slate-100 my-1" />

				<div className="px-3 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold border border-emerald-100">
					<Award className="w-4.5 h-4.5" />
					<span>Certificate on completion</span>
				</div>
			</div>

			{/* Review card showing for paid users who have not reviewed */}
			{isPaid && !hasReviewed && (
				<div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 flex flex-col gap-4">
					<div className="flex flex-col">
						<span className="text-zinc-900 text-base font-bold">Your review</span>
						<span className="text-neutral-500 text-xs mt-1 leading-normal">
							You are enrolled and have not reviewed this course yet. One review per student.
						</span>
					</div>
					<Link
						to={`/courses-reviews/write/${courseSlug}`}
						className="w-full py-2.5 bg-[#FF4667] hover:bg-[#FF4667]/90 text-white text-center text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer block"
					>
						Write a Review
					</Link>
				</div>
			)}
		</div>
	);
};
