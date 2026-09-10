export interface ApiResponse<T = unknown> {
	success?: boolean;
	data?: T;
	message?: string;
	error_code?: string;
	details?: unknown[];
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
