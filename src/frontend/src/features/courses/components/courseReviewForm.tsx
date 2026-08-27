import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

interface CourseReviewFormProps {
	slug?: string;
}

interface ReviewRecord {
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

export const CourseReviewForm: React.FC<CourseReviewFormProps> = ({ slug = "python-foundations" }) => {
	const navigate = useNavigate();
	const { user } = useAuthStore();

	// Load reviews from localStorage
	const stored = localStorage.getItem(`course_reviews_${slug}`);
	const reviews: ReviewRecord[] = stored ? JSON.parse(stored) : [];
	
	const myReview = reviews.find((r: ReviewRecord) => r.isCurrentUser || (user && r.name === (user.fullName || user.email)));

	const [rating, setRating] = useState<number>(myReview ? myReview.rating : 5);
	const [comment, setComment] = useState<string>(myReview ? myReview.comment : "");
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!comment.trim()) {
			alert("Please enter a review comment.");
			return;
		}

		const storedReviews = localStorage.getItem(`course_reviews_${slug}`);
		let reviewsList: ReviewRecord[] = storedReviews ? JSON.parse(storedReviews) : [];

		const userName = user ? (user.fullName || user.email) : "Current Student";
		const userInitials = user 
			? (user.fullName 
				? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() 
				: user.email.substring(0, 2).toUpperCase()) 
			: "CS";

		const existingIndex = reviewsList.findIndex((r: ReviewRecord) => r.isCurrentUser || r.name === userName);
		const existingItem = reviewsList[existingIndex];

		if (existingIndex > -1 && existingItem) {
			// Update existing review
			reviewsList[existingIndex] = {
				...existingItem,
				rating,
				comment: comment.trim(),
				time: "Just now",
				isCurrentUser: true
			};
			alert("Review updated successfully!");
		} else {
			// Create new review
			const newReview: ReviewRecord = {
				id: Date.now(),
				name: userName,
				initials: userInitials,
				verified: true,
				time: "Just now",
				rating,
				completedPercent: 100,
				comment: comment.trim(),
				helpfulCount: 0,
				isCurrentUser: true
			};
			reviewsList = [newReview, ...reviewsList];
			alert("Review submitted successfully!");
		}

		localStorage.setItem(`course_reviews_${slug}`, JSON.stringify(reviewsList));
		navigate(`/courses-reviews/${slug}`);
	};

	return (
		<div className="w-[940px] bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col gap-6">
			<div>
				<h2 className="text-zinc-900 text-2xl font-bold">Write a Review</h2>
				<p className="text-neutral-500 text-sm mt-1">
					Reviews are public and tied to your enrollment in TypeScript Fullstack Engineering.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				{/* Rating Stars Input */}
				<div className="flex flex-col gap-2">
					<label className="text-zinc-900 text-sm font-semibold">Your rating</label>
					<div className="flex items-center gap-1.5">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								type="button"
								onClick={() => setRating(star)}
								onMouseEnter={() => setHoveredRating(star)}
								onMouseLeave={() => setHoveredRating(null)}
								className="p-1 hover:scale-110 transition-transform cursor-pointer"
							>
								<Star
									className={`w-8 h-8 ${
										star <= (hoveredRating ?? rating)
											? 'fill-amber-400 text-amber-400'
											: 'text-neutral-250'
									}`}
								/>
							</button>
						))}
					</div>
				</div>

				{/* Review text area input */}
				<div className="flex flex-col gap-2">
					<label className="text-zinc-900 text-sm font-semibold">Your review</label>
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Write your review here..."
						maxLength={2000}
						className="w-full h-44 p-4 rounded-xl border border-slate-200 focus:border-[#392C7D] focus:outline-hidden text-sm leading-relaxed transition-colors resize-none"
					/>
					<span className="text-right text-xs font-semibold text-neutral-400 self-end">
						{comment.length} / 2000
					</span>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="w-full sm:w-fit px-8 py-3 bg-[#392C7D] text-white rounded-lg text-sm font-semibold hover:bg-[#392C7D]/90 shadow-sm transition-all cursor-pointer"
				>
					Submit review
				</button>
			</form>
		</div>
	);
};
