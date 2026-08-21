import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Role } from '@/types/auth';

export interface RoleGuardProps {
	allowedRoles?: Role[];
	requireTeacherApproved?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
	allowedRoles = [],
	requireTeacherApproved = false
}) => {
	const { user, isAuthenticated, hasRole, isTeacherApproved } = useAuthStore();

	if (!isAuthenticated || !user) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles.length > 0) {
		const hasPermission = allowedRoles.some((role) => hasRole(role));
		if (!hasPermission) {
			return <Navigate to="/unauthorized" replace />;
		}
	}

	if (requireTeacherApproved && !isTeacherApproved()) {
		return <Navigate to="/teacher/pending-approval" replace />;
	}

	return <Outlet />;
};
