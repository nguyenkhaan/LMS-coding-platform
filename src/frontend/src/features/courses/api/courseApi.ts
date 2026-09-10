import { businessApi } from '@/services/api/client';
import {
	CourseCatalogResponse,
	CourseDetailResponse,
	EnrollResponse,
	PriceType,
	StudentCoursesResponse,
	StudyResponse
} from '@/features/courses/model/course';

export interface FetchCatalogParams {
	page?: number;
	size?: number;
	q?: string;
	price_type?: PriceType;
}

export const courseApi = {
	async fetchCourseCatalog(params: FetchCatalogParams = {}): Promise<CourseCatalogResponse> {
		const response = await businessApi.get<CourseCatalogResponse>('/courses', {
			params: {
				page: params.page ?? 1,
				size: params.size ?? 10,
				q: params.q || undefined,
				price_type: params.price_type || undefined
			}
		});
		return response.data;
	},

	async fetchCourseDetail(slug: string): Promise<CourseDetailResponse> {
		const response = await businessApi.get<CourseDetailResponse>(`/courses/${slug}`);
		return response.data;
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
	}
};
