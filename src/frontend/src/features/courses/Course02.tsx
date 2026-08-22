import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FigmaHeader } from './components/FigmaHeader';
import { FigmaDetailHero } from './components/FigmaDetailHero';
import { FigmaDetailSidebar } from './components/FigmaDetailSidebar';
import { FigmaCourseThumbnailCard } from './components/FigmaCourseThumbnailCard';
import { FigmaDetailBody } from './components/FigmaDetailBody';
import { FigmaFooter } from './components/FigmaFooter';

export const CourseDetailFigma: React.FC = () => {
	const { courseSlug } = useParams<{ courseSlug: string }>();
	const isEnrolled = false;

	const navigate = useNavigate();

	const handleEnroll = () => {
		const targetSlug = courseSlug || "python-foundations";
		navigate(`/checkout/${targetSlug}`);
	};

	const slug = courseSlug || "python-foundations";

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col justify-start items-center">
			<div className="w-full max-w-[1892px] bg-white shadow-2xl rounded-3xl border border-neutral-100 overflow-hidden flex flex-col">
				{/* Header */}
				<FigmaHeader />

				{/* Hero Banner */}
				<FigmaDetailHero
					title="Python Foundations for Problem Solving"
					instructor="Lê Quang Huy"
					rating={4.8}
					reviewsCount={12480}
				/>

				{/* Main Detail Core Page layout: Centered with same max-width grid */}
				<div className="w-full max-w-[1296px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
					{/* Left: Main detailed sections */}
					<div className="flex-1 flex flex-col gap-6">
						{/* Course Thumbnail & Stats Card */}
						<FigmaCourseThumbnailCard />

						{/* Navigation tabs */}
						<div className="w-fit p-1 bg-slate-100 rounded-xl inline-flex justify-center items-center gap-1.5 font-semibold text-sm text-neutral-500 shadow-sm border border-slate-200/50">
							<Link to={`/courses/${slug}`} className="px-4 py-1.5 bg-white text-[#392C7D] rounded-lg shadow-xs cursor-pointer select-none">Overview</Link>
							<Link to={`/courses-overview/${slug}`} className="px-4 py-1.5 hover:bg-white/50 rounded-lg cursor-pointer transition-colors select-none">Curriculum</Link>
							<Link to={`/courses-instructor/${slug}`} className="px-4 py-1.5 hover:bg-white/50 rounded-lg cursor-pointer transition-colors select-none">Instructor</Link>
							<Link to={`/courses-reviews/${slug}`} className="px-4 py-1.5 hover:bg-white/50 rounded-lg cursor-pointer transition-colors select-none">Reviews</Link>
						</div>

						{/* Sections layout */}
						<FigmaDetailBody />
					</div>

					{/* Right: Sidebar card (aligned correctly to the main grid) */}
					<FigmaDetailSidebar
						price={49}
						lessons={42}
						isEnrolled={isEnrolled}
						onEnroll={handleEnroll}
					/>
				</div>

				{/* Footer flows naturally at the end of content */}
				<FigmaFooter />
			</div>
		</div>
	);
};
