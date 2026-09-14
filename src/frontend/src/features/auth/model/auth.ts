export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'BANNED' | 'UNVERIFIED';
export type TeacherRegisterStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
	id?: number;
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

export interface UserIdentityMe {
	email: string;
	roles: Role[];
	status: AccountStatus;
}

export interface StudentProfileView {
	id: number;
	full_name: string;
	address: string | null;
	email: string;
	status: AccountStatus;
	avatar_url?: string | null;
	bio?: string | null;
	learning_preferences?: string | null;
	social_links?: string | null;
}

export interface UserRoleView {
	id: number;
	user_id: number;
	role: Role;
}

export interface UserCapabilitiesView {
	can_learn: boolean;
	can_teach: boolean;
	can_manage_users: boolean;
}

export interface UserView {
	id: number;
	full_name: string;
	address?: string | null;
	email: string;
	avatar_url?: string | null;
	account_status: AccountStatus;
	created_at: string;
	updated_at: string;
}

export interface AdminUserView extends UserView {
	roles: UserRoleView[];
	capabilities: UserCapabilitiesView;
}

export interface AdminUserListQuery {
	q?: string;
	role?: Role;
	account_status?: AccountStatus;
	page?: number;
	size?: number;
}

export interface AdminUserListResponse {
	items: AdminUserView[];
	total_items: number;
	total_pages: number;
	current_page: number;
}

export interface UpdateUserRolesResponse {
	user_id: number;
	roles: UserRoleView[];
	capabilities: UserCapabilitiesView;
}

export interface UpdateUserPersonal {
	full_name?: string;
	address?: string;
	avatar_url?: string;
}

export interface UpdateUserPersonalResponse {
	message: string;
	data: {
		full_name?: string | null;
		address?: string | null;
		avatar_url?: string | null;
	};
}

export interface UpdateStudentProfile {
	bio?: string;
	learning_preferences?: string;
	social_links?: string;
}

export interface UpdateStudentProfileResponse {
	message: string;
	data: {
		bio?: string | null;
		learning_preferences?: string | null;
		social_links?: string | null;
	};
}

export interface UpdateTeacherProfile {
	avatar_url?: string;
	headline?: string;
	expertise_tags?: string;
	years_of_experience?: number;
	education_entries?: string;
	experience_entries?: string;
	github_url?: string;
	linkedin_url?: string;
	website_url?: string;
	email?: string;
	phone?: string;
}

export interface UpdateTeacherProfileResponse {
	message: string;
	data: Partial<UpdateTeacherProfile>;
}

export interface TeacherProfileView {
	user_id: number;
	avatar_url?: string | null;
	headline?: string | null;
	expertise_tags?: string | null;
	years_of_experience?: number | null;
	education_entries?: string | null;
	experience_entries?: string | null;
	github_url?: string | null;
	linkedin_url?: string | null;
	website_url?: string | null;
	email?: string | null;
	phone?: string | null;
	created_at: string;
	updated_at: string;
}


