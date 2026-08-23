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
