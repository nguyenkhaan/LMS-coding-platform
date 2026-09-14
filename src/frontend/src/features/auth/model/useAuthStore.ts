import { create } from 'zustand';
import { User, Role } from '@/features/auth/model/auth';
import { userApiServices } from '@/services/api/client';

interface AuthStore {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	initializeAuth: () => Promise<void>;
	setAuth: (user: User, token: string, refreshToken?: string) => void;
	setUser: (user: User) => void;
	logout: () => void;
	hasRole: (role: Role) => boolean;
	isTeacherApproved: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => {
	const savedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
	const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

	let initialUser: User | null = null;
	if (savedUser) {
		try {
			initialUser = JSON.parse(savedUser);
		} catch {
			initialUser = null;
		}
	}

	return {
		user: initialUser,
		accessToken: savedToken,
		isAuthenticated: !!savedToken,
		isLoading: false,

		initializeAuth: async () => {
			const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
			if (!token) {
				set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
				return;
			}
			set({ isLoading: true });
			try {
				const identity = await userApiServices.getCurrentUser();
				const existingUser = get().user;
				const currentUser: User = {
					id: existingUser?.id,
					email: identity.email,
					fullName: existingUser?.fullName,
					avatarUrl: existingUser?.avatarUrl,
					roles: identity.roles,
					accountStatus: identity.status,
					teacherProfile: existingUser?.teacherProfile
				};
				localStorage.setItem('user', JSON.stringify(currentUser));
				set({
					user: currentUser,
					accessToken: token,
					isAuthenticated: true,
					isLoading: false
				});
			} catch {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				localStorage.removeItem('user');
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
					isLoading: false
				});
			}
		},

		setAuth: (user, token, refreshToken) => {
			localStorage.setItem('access_token', token);
			localStorage.setItem('user', JSON.stringify(user));
			if (refreshToken) {
				localStorage.setItem('refresh_token', refreshToken);
			}
			set({ user, accessToken: token, isAuthenticated: true });
		},


		setUser: (user) => {
			localStorage.setItem('user', JSON.stringify(user));
			set({ user });
		},

		logout: () => {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('user');
			set({ user: null, accessToken: null, isAuthenticated: false });
			if (typeof window !== 'undefined') {
				window.location.href = '/login';
			}
		},

		hasRole: (role: Role) => {
			const { user } = get();
			if (!user) return false;
			return user.roles.includes(role);
		},

		isTeacherApproved: () => {
			const { user } = get();
			if (!user) return false;
			return (
				user.roles.includes('TEACHER') &&
				user.teacherProfile?.status === 'APPROVED' &&
				user.teacherProfile?.verified === true
			);
		}
	};
});
