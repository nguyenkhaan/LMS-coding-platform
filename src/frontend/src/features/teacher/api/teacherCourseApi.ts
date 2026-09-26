import { businessApi } from '@/services/api/client';
import { CourseStatus } from '@/features/courses/model/course';

export interface TeacherCourseResponse {
	id: number;
	teacher_id: number;
	title: string;
	slug?: string;
	description?: string;
	price: number;
	currency: string;
	thumbnail_url?: string;
	field?: string;
	tags: string[];
	status: CourseStatus;
	rating?: number;
	submitted_at?: string;
	reviewed_by?: number;
	reviewed_note?: string;
	reviewed_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface TeacherCourseCreateRequest {
	title: string;
	description: string;
	price: number;
	thumbnail_url?: string;
	field: string;
	tags: string[];
}

export interface TeacherCourseUpdateRequest {
	title?: string;
	description?: string;
	price?: number;
	thumbnail_url?: string;
	field?: string;
	tags?: string[];
}

export interface TeacherSectionResponse {
	id: number;
	course_id: number;
	title: string;
	position: number;
}

export interface TeacherLessonResponse {
	id: number;
	section_id: number;
	title: string;
	summary?: string;
	score: number;
	position: number;
	created_at?: string;
	updated_at?: string;
}

export interface TeacherLessonContentResponse {
	id: number;
	lesson_id: number;
	content_type: string;
	content_id: number;
	media_url?: string;
	position: number;
	created_at?: string;
}

export interface TeacherReorderItem {
	item_type: 'section' | 'lesson' | 'lesson_content';
	id: number;
	position: number;
	parent_id?: number;
}

export interface AdminCourseView {
	id: number;
	title: string;
	teacher_id: number;
	slug: string;
	rating: number;
	field?: string;
	tags?: string;
	description?: string;
	thumbnail_url?: string;
	price: number;
	currency: string;
	status: CourseStatus;
	submitted_at?: string;
	reviewed_by?: number;
	reviewed_note?: string;
	reviewed_at?: string;
	created_at: string;
	updated_at: string;
}

export interface CourseModerationLogView {
	id: number;
	course_id: number;
	status: CourseStatus;
	note?: string;
	reviewed_by?: number;
	reviewed_at?: string;
	submitted_at: string;
}

export interface AdminCourseDetailResponse {
	data: {
		course: AdminCourseView;
		moderation_history: CourseModerationLogView[];
		sections: Array<{
			id: number;
			course_id: number;
			title: string;
			position: number;
			lessons: Array<{
				id: number;
				section_id: number;
				title: string;
				summary?: string;
				score: number;
				position: number;
				contents: Array<{
					id: number;
					lesson_id: number;
					content_type: string;
					content_id: number;
					media_url?: string;
					position: number;
				}>;
			}>;
		}>;
	};
}

export const teacherCourseApi = {
	async getMyCourses(): Promise<TeacherCourseResponse[]> {
		const response = await businessApi.get<TeacherCourseResponse[]>('/teacher/courses');
		return response.data;
	},

	async getCourseDetail(courseId: number): Promise<TeacherCourseResponse> {
		const response = await businessApi.get<TeacherCourseResponse>(`/teacher/courses/${courseId}`);
		return response.data;
	},

	async createCourse(data: TeacherCourseCreateRequest): Promise<TeacherCourseResponse> {
		const response = await businessApi.post<TeacherCourseResponse>('/teacher/courses', data);
		return response.data;
	},

	async updateCourse(courseId: number, data: TeacherCourseUpdateRequest): Promise<TeacherCourseResponse> {
		const response = await businessApi.put<TeacherCourseResponse>(`/teacher/courses/${courseId}`, data);
		return response.data;
	},

	async submitCourseReview(courseId: number): Promise<TeacherCourseResponse> {
		const response = await businessApi.post<TeacherCourseResponse>(`/teacher/courses/${courseId}/submit-review`);
		return response.data;
	},

	async createSection(courseId: number, data: { title: string; position: number }): Promise<TeacherSectionResponse> {
		const response = await businessApi.post<TeacherSectionResponse>(`/teacher/courses/${courseId}/sections`, data);
		return response.data;
	},

	async updateSection(sectionId: number, data: { title?: string; position?: number }): Promise<TeacherSectionResponse> {
		const response = await businessApi.put<TeacherSectionResponse>(`/teacher/sections/${sectionId}`, data);
		return response.data;
	},

	async deleteSection(sectionId: number): Promise<{ message: string }> {
		const response = await businessApi.delete<{ message: string }>(`/teacher/sections/${sectionId}`);
		return response.data;
	},

	async createLesson(sectionId: number, data: { title: string; summary?: string; score?: number; position: number }): Promise<TeacherLessonResponse> {
		const response = await businessApi.post<TeacherLessonResponse>(`/teacher/sections/${sectionId}/lessons`, data);
		return response.data;
	},

	async updateLesson(lessonId: number, data: { title?: string; summary?: string; score?: number; position?: number }): Promise<TeacherLessonResponse> {
		const response = await businessApi.put<TeacherLessonResponse>(`/teacher/lessons/${lessonId}`, data);
		return response.data;
	},

	async deleteLesson(lessonId: number): Promise<{ message: string }> {
		const response = await businessApi.delete<{ message: string }>(`/teacher/lessons/${lessonId}`);
		return response.data;
	},

	async createReading(lessonId: number, data: { title: string; content: string; position: number }) {
		const response = await businessApi.post(`/teacher/lessons/${lessonId}/readings`, data);
		return response.data;
	},

	async reorderCurriculum(courseId: number, items: TeacherReorderItem[]) {
		const response = await businessApi.put(`/teacher/courses/${courseId}/curriculum/reorder`, { items });
		return response.data;
	}
};

export const adminCourseModerationApi = {
	async listCourses(params: { page?: number; size?: number; status?: CourseStatus; q?: string } = {}) {
		const response = await businessApi.get<{ data: AdminCourseView[]; pagination: { page: number; size: number; total: number } }>('/admin/courses', {
			params: {
				page: params.page ?? 1,
				size: params.size ?? 20,
				status: params.status || undefined,
				q: params.q || undefined
			}
		});
		return response.data;
	},

	async getCourseDetail(courseId: number): Promise<AdminCourseDetailResponse> {
		const response = await businessApi.get<AdminCourseDetailResponse>(`/admin/courses/${courseId}`);
		return response.data;
	},

	async reviewCourse(courseId: number, data: { decision: 'APPROVED' | 'REJECTED'; note?: string }) {
		const response = await businessApi.post(`/admin/courses/${courseId}/review`, data);
		return response.data;
	},

	async archiveCourse(courseId: number, data: { note?: string }) {
		const response = await businessApi.post(`/admin/courses/${courseId}/archive`, data);
		return response.data;
	}
};
