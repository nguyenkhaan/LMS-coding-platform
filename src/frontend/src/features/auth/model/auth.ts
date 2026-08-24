export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'BANNED' | 'UNVERIFIED';
export type TeacherRegisterStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
	id: number;
	email: string;
	fullName?: string;
	avatarUrl?: string;
	roles: Role[];
	accountStatus: AccountStatus;
	createdAt?: string;
	teacherProfile?: {
		verified: boolean;
		status: TeacherRegisterStatus;
		bio?: string;
	};
}

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	email: string;
	password: string;
	fullName: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token?: string;
	token_type?: string;
	user: User;
}
