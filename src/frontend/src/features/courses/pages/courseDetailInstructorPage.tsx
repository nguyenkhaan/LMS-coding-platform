import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseDetailHero } from '../components/courseDetailHero.tsx';
import { CourseEnrollmentPanel } from '../components/courseEnrollmentPanel.tsx';
import { CourseCatalogItemThumbnailCard } from '../components/coursePreviewCard.tsx';
import { CourseInstructorProfile } from '../components/courseInstructorProfile.tsx';
import { CourseDetailTabs } from '../components/courseDetailTabs.tsx';
import { useEnrolledCourses } from '@/hooks/api/useEnrolledCourses';

export const CourseDetailInstructorPage: React.FC = () => {
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
			{/* Breadcrumb hero */}
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
					<CourseDetailTabs activeTab="Instructor" courseSlug={slug} />

					{/* Section body */}
					<CourseInstructorProfile />
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
