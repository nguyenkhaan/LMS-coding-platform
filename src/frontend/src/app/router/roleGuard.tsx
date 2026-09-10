import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Role } from '@/features/auth/model/auth';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export interface RoleGuardProps {
	allowedRoles?: Role[];
	requireTeacherApproved?: boolean;
}

/**
 * RoleGuard — Protects routes by enforcing authentication and optional role checks.
 *
 * - Unauthenticated users are redirected to /login, preserving the intended destination.
 * - Authenticated users without the required role are redirected to /unauthorized.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
	allowedRoles,
	requireTeacherApproved,
}) => {
	const { isAuthenticated, user } = useAuthStore();
	const location = useLocation();

	// Not authenticated at all — send to login, preserve intended destination
	if (!isAuthenticated || !user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// If specific roles are required, check them
	if (allowedRoles && allowedRoles.length > 0) {
		const hasAllowedRole = allowedRoles.some((role) => user.roles.includes(role));
		if (!hasAllowedRole) {
			return <Navigate to="/unauthorized" replace />;
		}
	}

	// If teacher approval is specifically required, verify it
	if (requireTeacherApproved === true) {
		const isApproved =
			user.roles.includes('TEACHER') &&
			user.teacherProfile?.status === 'APPROVED' &&
			user.teacherProfile?.verified === true;
		if (!isApproved) {
			return <Navigate to="/teacher/pending-approval" replace />;
		}
	}

	return <Outlet />;
};
