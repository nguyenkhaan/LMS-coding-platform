import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CourseDetailHero } from '../components/courseDetailHero.tsx';
import { CourseEnrollmentPanel } from '../components/courseEnrollmentPanel.tsx';
import { CourseCatalogItemThumbnailCard } from '../components/coursePreviewCard.tsx';
import { CourseReviewForm } from '../components/courseReviewForm.tsx';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useEnrolledCourses } from '../../../hooks/api/useEnrolledCourses.ts';

export const CourseWriteReviewPage: React.FC = () => {
	const { courseSlug } = useParams<{ courseSlug: string }>();
	const { isAuthenticated } = useAuthStore();
	const { isEnrolled: checkEnrolled } = useEnrolledCourses();
	
	const slug = courseSlug || "python-foundations";
	const isEnrolled = isAuthenticated && checkEnrolled(slug);
	const navigate = useNavigate();

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
			<CourseDetailHero
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
					<CourseCatalogItemThumbnailCard />

					{/* Navigation tabs */}
					<div className="w-fit p-1 bg-slate-100 rounded-xl inline-flex justify-center items-center gap-1.5 font-semibold text-sm text-neutral-500 shadow-xs border border-slate-200/50">
						<Link to={`/courses/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Reviews' === 'Overview' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Overview</Link>
						<Link to={`/courses-overview/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Reviews' === 'Curriculum' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Curriculum</Link>
						<Link to={`/courses-instructor/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Reviews' === 'Instructor' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Instructor</Link>
						<Link to={`/courses-reviews/${slug}`} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer select-none ${'Reviews' === 'Reviews' ? 'bg-white text-[#392C7D] font-bold shadow-xs' : 'hover:bg-white/50'}`}>Reviews</Link>
					</div>

					{/* Section body */}
					{isEnrolled ? (
						<CourseReviewForm slug={slug} />
					) : (
						<div className="w-[940px] bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center flex flex-col items-center gap-4">
							<div className="size-12 rounded-full bg-rose-50 flex items-center justify-center text-[#FF4667]">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<h3 className="text-lg font-bold text-zinc-900">Enrollment Required</h3>
							<p className="text-sm text-neutral-500 max-w-md">
								You must be enrolled in this course to write a review. Only students who have active enrollment can share their learning experience.
							</p>
							<button 
								onClick={handleEnroll}
								className="mt-2 px-6 py-2.5 bg-[#392C7D] text-white rounded-lg text-sm font-semibold hover:bg-[#392C7D]/90 transition-all cursor-pointer"
							>
								Enroll in Course
							</button>
						</div>
					)}
				</div>

				{/* Right: Sidebar card */}
				<CourseEnrollmentPanel
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
