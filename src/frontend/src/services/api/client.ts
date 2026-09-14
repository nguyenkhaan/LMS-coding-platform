import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4001/api';
const BUSINESS_API_URL = import.meta.env.VITE_BUSINESS_API_URL || 'http://localhost:4000/api';

let refreshPromise: Promise<string> | null = null;

const getOrStartRefreshToken = async (): Promise<string> => {
	if (refreshPromise) {
		return refreshPromise;
	}

	refreshPromise = (async () => {
		const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
		if (!refreshToken) {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				localStorage.removeItem('user');
			}
			throw new Error('No refresh token available');
		}

		try {
			const response = await axios.post<{ access_token: string; refresh_token?: string }>(
				`${AUTH_API_URL}/auth/refresh`,
				{ refresh_token: refreshToken }
			);

			const newAccessToken = response.data.access_token;
			if (typeof window !== 'undefined') {
				localStorage.setItem('access_token', newAccessToken);
				if (response.data.refresh_token) {
					localStorage.setItem('refresh_token', response.data.refresh_token);
				}
			}
			return newAccessToken;
		} catch (err) {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				localStorage.removeItem('user');
			}
			throw err;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
};

const PUBLIC_AUTH_ENDPOINTS = [
	'/auth/login',
	'/auth/register',
	'/auth/code',
	'/auth/resend-otp',
	'/auth/forgot-password',
	'/auth/verify-password-changing',
	'/auth/confirm-email-change',
	'/auth/google',
	'/auth/refresh'
];

const isPublicAuthEndpoint = (url?: string): boolean => {
	if (!url) return false;
	return PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const createApiClient = (baseURL: string): AxiosInstance => {
	const client = axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json'
		},
		timeout: 30000
	});

	client.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	client.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

			if (
				error.response?.status === 401 &&
				originalRequest &&
				!originalRequest._retry &&
				!isPublicAuthEndpoint(originalRequest.url)
			) {
				originalRequest._retry = true;

				try {
					const newAccessToken = await getOrStartRefreshToken();
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					}
					return client(originalRequest);
				} catch {
					return Promise.reject(error);
				}
			}

			return Promise.reject(error);
		}
	);

	return client;
};

export const authApi = createApiClient(AUTH_API_URL);
export const businessApi = createApiClient(BUSINESS_API_URL);

import {
	UserIdentityMe,
	StudentProfileView,
	AdminUserListQuery,
	AdminUserListResponse,
	UserView,
	UpdateUserRolesResponse,
	Role,
	UpdateUserPersonal,
	UpdateUserPersonalResponse,
	UpdateStudentProfile,
	UpdateStudentProfileResponse,
	UpdateTeacherProfile,
	UpdateTeacherProfileResponse,
	TeacherProfileView
} from '@/features/auth/model/auth';

export const authApiServices = {
	forgotPassword: async (email: string) => {
		const response = await authApi.post<{ message: string }>('/auth/forgot-password', { email });
		return response.data;
	},

	resetPassword: async (code: string, new_password: string) => {
		const response = await authApi.post<{ message: string }>('/auth/verify-password-changing', {
			code,
			new_password
		});
		return response.data;
	},

	changeEmail: async (new_email: string, password: string) => {
		const response = await authApi.post<{ message: string }>('/auth/change-email', {
			new_email,
			password
		});
		return response.data;
	},

	confirmEmailChange: async (token: string) => {
		const response = await authApi.post<{ message: string }>('/auth/confirm-email-change', {
			token
		});
		return response.data;
	}
};

export const userApiServices = {
	getCurrentUser: async () => {
		const response = await businessApi.get<UserIdentityMe>('/users/me');
		return response.data;
	},

	getStudentProfile: async () => {
		const response = await businessApi.get<StudentProfileView>('/users/me/student');
		return response.data;
	},

	getAdminUsers: async (params?: AdminUserListQuery) => {
		const response = await businessApi.get<AdminUserListResponse>('/admin/users', { params });
		return response.data;
	},

	updateUserStatus: async (userId: number, account_status: 'ACTIVE' | 'BANNED') => {
		const response = await businessApi.put<UserView>(`/admin/users/${userId}/status`, {
			account_status
		});
		return response.data;
	},

	updateUserRoles: async (userId: number, roles: Role[]) => {
		const response = await businessApi.put<UpdateUserRolesResponse>(`/admin/users/${userId}/roles`, {
			roles
		});
		return response.data;
	},

	updatePersonalInformation: async (data: UpdateUserPersonal) => {
		const response = await businessApi.put<UpdateUserPersonalResponse>('/users/', data);
		return response.data;
	},

	updateStudentProfile: async (data: UpdateStudentProfile) => {
		const response = await businessApi.put<UpdateStudentProfileResponse>('/users/me/student-profile', data);
		return response.data;
	},

	createTeacherProfile: async (data: UpdateTeacherProfile) => {
		const response = await businessApi.post<TeacherProfileView>('/users/me/teacher-profile', data);
		return response.data;
	},

	updateTeacherProfile: async (data: UpdateTeacherProfile) => {
		const response = await businessApi.put<UpdateTeacherProfileResponse>('/users/me/teacher-profile', data);
		return response.data;
	}
};

