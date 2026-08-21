export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type LessonContentType = 'READING' | 'QUIZ' | 'PROBLEM';

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
