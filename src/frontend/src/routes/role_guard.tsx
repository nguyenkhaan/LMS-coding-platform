import React from 'react';
import { Outlet } from 'react-router-dom';
import { Role } from '@/types/auth';

export interface RoleGuardProps {
	allowedRoles?: Role[];
	requireTeacherApproved?: boolean;
}

/**
 * RoleGuard - Temporarily configured in Permissive Review Mode
 * Allows direct access to all Teacher Studio & Admin Review screens for testing.
 */
export const RoleGuard: React.FC<RoleGuardProps> = () => {
	return <Outlet />;
};
