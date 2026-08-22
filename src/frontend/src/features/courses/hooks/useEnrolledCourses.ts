import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { courseApi } from '../services/courseApi';
import { EnrolledCourseItem } from '@/types/course';

export const useEnrolledCourses = () => {
	const { isAuthenticated } = useAuthStore();
	const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCourses = useCallback(async () => {
		if (!isAuthenticated) {
			setEnrolledCourses([]);
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			const data = await courseApi.fetchEnrolledCourses();
			setEnrolledCourses(data.items);
		} catch (err) {
			console.error('Lỗi khi tải danh sách khóa học đã đăng ký:', err);
			setError('Không thể tải danh sách khóa học của bạn.');
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		fetchCourses();
	}, [fetchCourses]);

	const isEnrolled = useCallback(
		(slug: string): boolean => {
			return enrolledCourses.some((course) => course.slug === slug);
		},
		[enrolledCourses]
	);

	return {
		enrolledCourses,
		isLoading,
		error,
		refetch: fetchCourses,
		isEnrolled
	};
};
