import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FigmaDetailHero } from './components/figma_detail_hero';
import { FigmaDetailSidebar } from './components/figma_detail_sidebar';
import { FigmaCourseThumbnailCard } from './components/figma_course_thumbnail_card';
import { FigmaDetailBody } from './components/figma_detail_body';
import { useEnrolledCourses } from '@/features/courses/hooks/useEnrolledCourses';

export const CourseDetailOverviewPage: React.FC = () => {
	const { courseSlug } = useParams<{ courseSlug: string }>();
	const { isEnrolled: checkEnrolled } = useEnrolledCourses();
	const navigate = useNavigate();

	const slug = courseSlug || "python-foundations";
	const isEnrolled = checkEnrolled(slug);

	const handleEnroll = () => {
		if (isEnrolled) {
			navigate(`/learn/${slug}`);
		} else {
			navigate(`/checkout/${slug}`);
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			{/* Hero Banner */}
			<FigmaDetailHero
				title="Python Foundations for Problem Solving"
				instructor="Lê Quang Huy"
				rating={4.8}
				reviewsCount={12480}
			/>

			{/* Main Detail Core Page layout */}
			<div className="w-full max-w-[1340px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
				{/* Left: Main detailed sections */}
				<div className="flex-1 w-full flex flex-col gap-6">
					{/* Course Thumbnail & Stats Card */}
					<FigmaCourseThumbnailCard />

					{/* Navigation tabs */}
					<div className="w-fit p-1 bg-slate-100 rounded-xl inline-flex justify-center items-center gap-1.5 font-semibold text-sm text-neutral-500 shadow-xs border border-slate-200/50">
						<Link to={`/courses/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Overview' === 'Overview' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Overview</Link>
						<Link to={`/courses-overview/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Overview' === 'Curriculum' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Curriculum</Link>
						<Link to={`/courses-instructor/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Overview' === 'Instructor' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Instructor</Link>
						<Link to={`/courses-reviews/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Overview' === 'Reviews' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Reviews</Link>
					</div>

					{/* Section body */}
					<FigmaDetailBody />
				</div>

				{/* Right: Sidebar card */}
				<FigmaDetailSidebar
					price={49}
					lessons={42}
					isEnrolled={isEnrolled}
					onEnroll={handleEnroll}
					courseSlug={slug}
				/>
			</div>
		</div>
	);
};
