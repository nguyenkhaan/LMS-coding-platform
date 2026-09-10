import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4001/api';
const BUSINESS_API_URL = import.meta.env.VITE_BUSINESS_API_URL || 'http://localhost:4000/api';

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
			if (error.response?.status === 401) {
				// 401 handler
			}
			return Promise.reject(error);
		}
	);

	return client;
};

export const authApi = createApiClient(AUTH_API_URL);
export const businessApi = createApiClient(BUSINESS_API_URL);
