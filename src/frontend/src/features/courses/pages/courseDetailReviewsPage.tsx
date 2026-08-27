import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CourseDetailHero } from '../components/courseDetailHero.tsx';
import { CourseEnrollmentPanel } from '../components/courseEnrollmentPanel.tsx';
import { CourseCatalogItemThumbnailCard } from '../components/coursePreviewCard.tsx';
import { CourseReviews } from '../components/courseReviews.tsx';
import { CourseDetailTabs } from '../components/courseDetailTabs.tsx';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useEnrolledCourses } from '../../../hooks/api/useEnrolledCourses.ts';

export const CourseDetailReviewsPage: React.FC = () => {
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
					<CourseDetailTabs activeTab="Reviews" courseSlug={slug} />

					{/* Section body */}
					<CourseReviews slug={slug} />
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
