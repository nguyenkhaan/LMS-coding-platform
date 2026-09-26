import { businessApi } from '@/services/api/client';
import {
	CourseCatalogResponse,
	CourseDetailResponse,
	EnrollResponse,
	PriceType,
	StudentCoursesResponse,
	StudyResponse,
	InstructorListResponse,
	InstructorDetailResponse,
	FavoriteListResponse,
	CourseFavoriteItem,
	CourseReviewListResponse,
	CourseReview
} from '@/features/courses/model/course';

export interface FetchCatalogParams {
	page?: number;
	size?: number;
	q?: string;
	field?: string;
	tag?: string;
	price_type?: PriceType;
}

export const courseApi = {
	async fetchCourseCatalog(params: FetchCatalogParams = {}): Promise<CourseCatalogResponse> {
		const response = await businessApi.get<CourseCatalogResponse>('/courses', {
			params: {
				page: params.page ?? 1,
				size: params.size ?? 10,
				q: params.q || undefined,
				field: params.field || undefined,
				tag: params.tag || undefined,
				price_type: params.price_type || undefined
			}
		});
		return response.data;
	},

	async fetchCourseDetail(slug: string): Promise<CourseDetailResponse> {
		const response = await businessApi.get<{ data: CourseDetailResponse } | CourseDetailResponse>(`/courses/${slug}`);
		return 'data' in response.data ? (response.data as { data: CourseDetailResponse }).data : response.data;
	},

	async enrollCourse(slug: string): Promise<EnrollResponse> {
		const response = await businessApi.post<EnrollResponse>(`/courses/${slug}/enroll`);
		return response.data;
	},

	async fetchEnrolledCourses(): Promise<StudentCoursesResponse> {
		const response = await businessApi.get<StudentCoursesResponse>('/student/courses');
		return response.data;
	},

	async fetchStudyContent(slug: string): Promise<StudyResponse> {
		const response = await businessApi.get<StudyResponse>(`/student/courses/${slug}/study`);
		return response.data;
	},

	async fetchInstructors(params: { page?: number; size?: number; q?: string; field?: string } = {}): Promise<InstructorListResponse> {
		const response = await businessApi.get<InstructorListResponse>('/instructors', {
			params: {
				page: params.page ?? 1,
				size: params.size ?? 20,
				q: params.q || undefined,
				field: params.field || undefined
			}
		});
		return response.data;
	},

	async fetchInstructorDetail(userId: number): Promise<InstructorDetailResponse> {
		const response = await businessApi.get<InstructorDetailResponse>(`/instructors/${userId}`);
		return response.data;
	},

	async fetchFavorites(params: { page?: number; size?: number } = {}): Promise<FavoriteListResponse> {
		const response = await businessApi.get<FavoriteListResponse>('/favorites', {
			params: {
				page: params.page ?? 1,
				size: params.size ?? 20
			}
		});
		return response.data;
	},

	async addFavorite(courseId: number): Promise<{ message: string; data: CourseFavoriteItem }> {
		const response = await businessApi.put<{ message: string; data: CourseFavoriteItem }>(`/courses/${courseId}/favorite`);
		return response.data;
	},

	async removeFavorite(courseId: number): Promise<{ message: string; data: { course_id: number; is_favorited: false } }> {
		const response = await businessApi.delete<{ message: string; data: { course_id: number; is_favorited: false } }>(`/courses/${courseId}/favorite`);
		return response.data;
	},

	async fetchCourseReviews(courseId: number, params: { page?: number; size?: number; rating?: number } = {}): Promise<CourseReviewListResponse> {
		const response = await businessApi.get<CourseReviewListResponse>(`/courses/${courseId}/reviews`, {
			params: {
				page: params.page ?? 1,
				size: params.size ?? 20,
				rating: params.rating || undefined
			}
		});
		return response.data;
	},

	async createCourseReview(courseId: number, payload: { rating: number; content?: string }): Promise<{ message: string; data: CourseReview }> {
		const response = await businessApi.post<{ message: string; data: CourseReview }>(`/courses/${courseId}/reviews`, payload);
		return response.data;
	},

	async updateCourseReview(courseId: number, reviewId: number, payload: { rating?: number; content?: string }): Promise<{ message: string; data: CourseReview }> {
		const response = await businessApi.patch<{ message: string; data: CourseReview }>(`/courses/${courseId}/reviews/${reviewId}`, payload);
		return response.data;
	}
};

