export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type LessonContentType = 'READING' | 'QUIZ' | 'PROBLEM';
export type PriceType = 'free' | 'paid';

export interface CourseItem {
	id: number;
	slug: string;
	title: string;
	thumbnail_url: string;
	price: number;
	price_type: PriceType;
	field: string;
	tags: string[];
	enrolled_count: number;
	rating: number;
}

export interface CourseCatalogResponse {
	total_items: number;
	total_pages: number;
	current_page: number;
	items: CourseItem[];
}

export interface Course {
	id: number;
	title: string;
	slug: string;
	description?: string;
	thumbnailUrl?: string;
	price: number;
	status: CourseStatus;
	teacherId: number;
	teacherName?: string;
	teacherAvatar?: string;
	totalLessons?: number;
	durationHours?: number;
	rating?: number;
	reviewCount?: number;
	isEnrolled?: boolean;
	isFavorite?: boolean;
	createdAt: string;
	sections?: Section[];
}

export interface Section {
	id: number;
	courseId: number;
	title: string;
	position: number;
	lessons: Lesson[];
}

export interface Lesson {
	id: number;
	sectionId: number;
	title: string;
	position: number;
	contents: LessonContent[];
}

export interface LessonContent {
	id: number;
	lessonId: number;
	contentType: LessonContentType;
	contentId: number;
	position: number;
	title?: string;
	isCompleted?: boolean;
}

export interface ReadingContent {
	id: number;
	title: string;
	content: string;
}

export interface SectionOverview {
	id: number;
	title: string;
	position: number;
	lesson_count: number;
}

export interface CourseDetailResponse {
	id: number;
	slug: string;
	title: string;
	description: string;
	price: number;
	price_type: PriceType;
	field: string;
	tags: string[];
	enrolled_count: number;
	rating: number;
	sections: SectionOverview[];
}

export interface EnrolledCourseItem {
	id: number;
	slug: string;
	title: string;
	thumbnail_url: string;
	progress_percent: number;
}

export interface StudentCoursesResponse {
	items: EnrolledCourseItem[];
}

export interface LessonContentStudy {
	id: number;
	content_type: LessonContentType;
	media_url?: string | null;
	completed: boolean;
}

export interface LessonStudy {
	id: number;
	title: string;
	position: number;
	locked: boolean;
	contents: LessonContentStudy[];
}

export interface SectionStudy {
	id: number;
	title: string;
	position: number;
	lessons: LessonStudy[];
}

export interface StudyResponse {
	course_slug: string;
	sections: SectionStudy[];
}

export type EnrollStatus = 'enrolled' | 'pending_payment';

export interface EnrollResponse {
	status: EnrollStatus;
	checkout_url?: string | null;
}

export interface ReviewSummary {
	average_rating: number;
	total_reviews: number;
	rating_distribution?: Record<number, number>;
}

export interface CourseReview {
	id: number;
	course_id: number;
	student_id: number;
	rating: number;
	content?: string | null;
	created_at: string;
	updated_at: string;
}

export interface CourseReviewListResponse {
	data: CourseReview[];
	pagination: {
		page: number;
		size: number;
		total: number;
	};
	summary: ReviewSummary;
}

export interface InstructorProfile {
	user_id: number;
	full_name: string;
	avatar_url?: string | null;
	headline?: string | null;
	expertise_tags?: string | null;
	years_of_experience?: number | null;
	education_entries?: string | null;
	experience_entries?: string | null;
	github_url?: string | null;
	linkedin_url?: string | null;
	website_url?: string | null;
	email?: string | null;
	phone?: string | null;
	bio?: string | null;
	created_at: string;
	updated_at: string;
}

export interface InstructorListResponse {
	data: InstructorProfile[];
	pagination: {
		page: number;
		size: number;
		total: number;
	};
}

export interface InstructorDetailResponse {
	data: InstructorProfile & {
		courses: CourseItem[];
	};
}

export interface CourseFavoriteItem {
	id: number;
	student_id: number;
	course_id: number;
	created_at: string;
	is_favorited: boolean;
	course?: CourseItem | null;
}

export interface FavoriteListResponse {
	data: CourseFavoriteItem[];
	pagination: {
		page: number;
		size: number;
		total: number;
	};
}

