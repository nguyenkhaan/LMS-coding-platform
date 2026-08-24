import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useEnrolledCourses } from '../../../hooks/api/useEnrolledCourses.ts';
import { toast } from 'sonner';

interface ReviewItem {
	id: number;
	name: string;
	initials: string;
	verified: boolean;
	time: string;
	rating: number;
	completedPercent: number;
	comment: string;
	helpfulCount: number;
	isCurrentUser?: boolean;
}

interface CourseReviewsProps {
	slug?: string;
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({ slug = "python-foundations" }) => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuthStore();
	const { isEnrolled: checkEnrolled } = useEnrolledCourses();
	const isEnrolled = isAuthenticated && checkEnrolled(slug);

	const defaultReviews: ReviewItem[] = [
		{
			id: 1,
			name: "Nguyen Minh Anh",
			initials: "MA",
			verified: true,
			time: "2 weeks ago",
			rating: 5,
			completedPercent: 78,
			comment: "The in-browser exercises are what made this stick for me. Every concept is immediately followed by a test suite I have to make pass, so I never fooled myself into thinking I understood something I couldn't write.",
			helpfulCount: 46
		},
		{
			id: 2,
			name: "David Okonkwo",
			initials: "DO",
			verified: true,
			time: "1 month ago",
			rating: 5,
			completedPercent: 100,
			comment: "I switched from marketing into a junior backend role three months after finishing the capstone. The mock interview walkthrough in Module 5 is worth the price of the whole course on its own.",
			helpfulCount: 38
		},
		{
			id: 3,
			name: "Priya Raghavan",
			initials: "PR",
			verified: true,
			time: "1 month ago",
			rating: 4,
			completedPercent: 64,
			comment: "Excellent on fundamentals and testing. I would have liked one more graph-algorithms exercise before the hard one, but the hints saved me. Code review feedback on assignments was genuinely useful.",
			helpfulCount: 21
		},
		{
			id: 4,
			name: "Tran Bao Long",
			initials: "BL",
			verified: false,
			time: "2 months ago",
			rating: 5,
			completedPercent: 92,
			comment: "Clean code module changed how I write everything, not just Python. The refactor-a-60-line-function exercise is brutal in the best way.",
			helpfulCount: 17
		},
		{
			id: 5,
			name: "Sara Lindqvist",
			initials: "SL",
			verified: true,
			time: "3 months ago",
			rating: 3,
			completedPercent: 41,
			comment: "Solid content but the pace in Module 3 jumps quickly if you have never seen Big-O before. Rewatching plus the reading fixed it, so more of a warning than a complaint.",
			helpfulCount: 9
		}
	];
	const [reviews, setReviews] = useState<ReviewItem[]>([]);

	useEffect(() => {
		const storedReviews = localStorage.getItem(`course_reviews_${slug}`);
		if (storedReviews) {
			setReviews(JSON.parse(storedReviews));
		} else {
			localStorage.setItem(`course_reviews_${slug}`, JSON.stringify(defaultReviews));
			setReviews(defaultReviews);
		}
	}, [slug]);

	const myReview = reviews.find(r => r.isCurrentUser || (user && r.name === (user.fullName || user.email)));
	const hasExistingReview = !!myReview;

	const handleWriteReviewClick = () => {
		if (!isEnrolled) {
			toast.error("Only enrolled students can write a review. Please enroll in the course first.");
			return;
		}
		navigate(`/courses-reviews/write/${slug}`);
	};

	const [filter, setFilter] = useState<string>("All");

	let filteredReviews = [...reviews];
	if (filter === "Verified") {
		filteredReviews = reviews.filter(r => r.verified);
	} else if (filter.endsWith("★")) {
		filteredReviews = reviews.filter(r => `${r.rating}★` === filter);
	} else if (filter === "Highest") {
		filteredReviews = [...reviews].sort((a, b) => b.rating - a.rating);
	} else if (filter === "Newest") {
		filteredReviews = [...reviews];
	}

	return (
		<div className="w-[940px] flex flex-col gap-6">
			{/* Ratings Summary Box */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center">
				<div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100/50 w-full md:w-48">
					<span className="text-4xl font-extrabold text-zinc-900">4.8</span>
					<div className="flex items-center gap-1 mt-1 text-[#FF4667]">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} className="w-4.5 h-4.5 fill-[#FF4667] text-[#FF4667]" />
						))}
					</div>
					<span className="text-neutral-500 text-xs mt-2 font-medium">Course Rating</span>
				</div>
				
				{/* Rating Distributions */}
				<div className="flex-1 w-full flex flex-col gap-2.5">
					{[
						{ stars: 5, pct: 85 },
						{ stars: 4, pct: 12 },
						{ stars: 3, pct: 2 },
						{ stars: 2, pct: 1 },
						{ stars: 1, pct: 0 }
					].map((row) => (
						<div key={row.stars} className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
							<span className="w-6 text-right">{row.stars}★</span>
							<div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
								<div className="bg-[#392C7D] h-full rounded-full" style={{ width: `${row.pct}%` }} />
							</div>
							<span className="w-8 text-right">{row.pct}%</span>
						</div>
					))}
				</div>
			</div>

			{/* Filter Chips & Write Review CTA */}
			<div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 gap-3">
				<div className="flex flex-wrap gap-2.5 items-center">
					{["All", "5★", "4★", "3★", "Verified", "Newest", "Highest"].map((chip) => (
						<button
							key={chip}
							onClick={() => setFilter(chip)}
							className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
								filter === chip
									? 'bg-[#392C7D] text-white border-[#392C7D] shadow-xs'
									: 'bg-white text-neutral-500 border-slate-200 hover:bg-slate-50'
							}`}
						>
							{chip === "Verified" ? "Verified Purchase" : chip}
						</button>
					))}
				</div>

				<button
					onClick={handleWriteReviewClick}
					className="px-5 py-2 bg-[#FF4667] text-white text-xs font-semibold rounded-lg hover:bg-[#e03d5b] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
				>
					{hasExistingReview ? "Edit your Review" : "Write a Review"}
				</button>
			</div>

			{/* Reviews List */}
			<div className="flex flex-col gap-5">
				{filteredReviews.map((rev) => (
					<div key={rev.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col gap-4">
						{/* Top details */}
						<div className="flex items-start gap-4">
							<div className="size-10 rounded-full bg-[#392C7D]/10 flex items-center justify-center border border-[#392C7D]/20 text-[#392C7D] text-xs font-bold select-none">
								{rev.initials}
							</div>
							<div className="flex-1 flex flex-col">
								<div className="flex items-center gap-3 flex-wrap">
									<h4 className="text-zinc-900 text-sm font-semibold">{rev.name}</h4>
									{rev.verified && (
										<span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold rounded-md flex items-center gap-1">
											<CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
											Verified Purchase
										</span>
									)}
									<span className="text-neutral-400 text-xs font-medium">{rev.time}</span>
								</div>
								
								<div className="flex items-center gap-3 mt-1.5 flex-wrap">
									<div className="flex items-center">
										{Array.from({ length: 5 }).map((_, i) => (
											<Star 
												key={i} 
												className={`w-3.5 h-3.5 ${
													i < rev.rating 
														? 'fill-amber-400 text-amber-400' 
														: 'text-neutral-250'
												}`} 
											/>
										))}
									</div>
									<span className="text-neutral-500 text-xs font-medium">
										{rev.completedPercent}% of course completed
									</span>
								</div>
							</div>
						</div>

						{/* Comments */}
						<p className="text-neutral-700 text-sm leading-relaxed">
							{rev.comment}
						</p>

						{/* Helpful button CTA */}
						<button className="w-fit px-4 py-1.5 bg-white border border-slate-200 rounded-full flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
							<ThumbsUp className="w-3.5 h-3.5 text-neutral-400" />
							Helpful ({rev.helpfulCount})
						</button>
					</div>
				))}
			</div>
		</div>
	);
};
