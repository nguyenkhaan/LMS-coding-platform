import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * RootRedirect — Decides where to send a user who visits `/`.
 *
 * - Unauthenticated → /login
 * - ADMIN → /admin/verifications
 * - TEACHER or STUDENT → /student/dashboard
 */
export const RootRedirect: React.FC = () => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated || !user) {
		return <Navigate to="/login" replace />;
	}

	if (user.roles.includes('ADMIN')) {
		return <Navigate to="/admin/verifications" replace />;
	}

	return <Navigate to="/student/dashboard" replace />;
};
