import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const FigmaWriteReviewForm: React.FC = () => {
	const [rating, setRating] = useState<number>(5);
	const [comment, setComment] = useState<string>("");
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Mock review submission:", { rating, comment });
		alert(`Review submitted successfully! (Mock)\nRating: ${rating}/5 stars\nComment: ${comment}`);
		setComment("");
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
