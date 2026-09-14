import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, UserX, UserCheck, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw, X, ShieldAlert, Check } from 'lucide-react';
import { toast } from 'sonner';
import { AdminSidebar } from '../components/adminSidebar';
import { userApiServices } from '@/services/api/client';
import { AdminUserView, Role, AccountStatus } from '@/features/auth/model/auth';

const ALL_ROLES: Role[] = ['STUDENT', 'TEACHER', 'ADMIN'];

export const AdminUsersPage: React.FC = () => {
	const [users, setUsers] = useState<AdminUserView[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Filters & Pagination State
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [debouncedSearch, setDebouncedSearch] = useState<string>('');
	const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');
	const [selectedStatus, setSelectedStatus] = useState<AccountStatus | 'ALL'>('ALL');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [totalItems, setTotalItems] = useState<number>(0);
	const pageSize = 10;

	// Modal States
	const [statusModalUser, setStatusModalUser] = useState<AdminUserView | null>(null);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

	const [roleModalUser, setRoleModalUser] = useState<AdminUserView | null>(null);
	const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
	const [isUpdatingRoles, setIsUpdatingRoles] = useState<boolean>(false);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
			setCurrentPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch Users
	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await userApiServices.getAdminUsers({
				q: debouncedSearch.trim() || undefined,
				role: selectedRole === 'ALL' ? undefined : selectedRole,
				account_status: selectedStatus === 'ALL' ? undefined : selectedStatus,
				page: currentPage,
				size: pageSize
			});
			setUsers(data.items || []);
			setTotalPages(data.total_pages || 1);
			setTotalItems(data.total_items || 0);
		} catch (err: any) {
			const status = err.response?.status;
			if (status === 401) {
				toast.error('Session expired. Please log in again.');
			} else if (status === 403) {
				toast.error('Access denied. Administrator privileges required.');
				setError('You do not have permission to view administrative user data.');
			} else {
				const errorMsg = err.response?.data?.detail || 'Failed to load user list. Please try again.';
				toast.error(errorMsg);
			}
		} finally {
			setIsLoading(false);
		}
	}, [debouncedSearch, selectedRole, selectedStatus, currentPage]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Handle Status Toggle (Ban / Unban)
	const handleStatusConfirm = async () => {
		if (!statusModalUser) return;
		const nextStatus: AccountStatus = statusModalUser.account_status === 'BANNED' ? 'ACTIVE' : 'BANNED';

		setIsUpdatingStatus(true);
		try {
			await userApiServices.updateUserStatus(statusModalUser.id, nextStatus as 'ACTIVE' | 'BANNED');
			toast.success(`User #${statusModalUser.id} (${statusModalUser.full_name}) status updated to ${nextStatus}.`);
			setStatusModalUser(null);
			fetchUsers();
		} catch (err: any) {
			const status = err.response?.status;
			if (status === 401) {
				toast.error('Session expired. Please log in again.');
			} else if (status === 403) {
				toast.error('Forbidden. Cannot update user status.');
			} else if (status === 404) {
				toast.error('Target user not found.');
			} else {
				toast.error(err.response?.data?.detail || 'Failed to update user status.');
			}
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	// Open Role Modal
	const openRoleModal = (user: AdminUserView) => {
		setRoleModalUser(user);
		setSelectedRoles(user.roles ? user.roles.map((r) => r.role) : []);
	};

	// Toggle Role Selection in Modal
	const toggleRole = (role: Role) => {
		setSelectedRoles((prev) =>
			prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
		);
	};

	// Save Roles
	const handleRoleSave = async () => {
		if (!roleModalUser) return;
		if (selectedRoles.length === 0) {
			toast.error('A user must have at least one role assigned.');
			return;
		}

		setIsUpdatingRoles(true);
		try {
			await userApiServices.updateUserRoles(roleModalUser.id, selectedRoles);
			toast.success(`Roles updated successfully for ${roleModalUser.full_name}.`);
			setRoleModalUser(null);
			fetchUsers();
		} catch (err: any) {
			const status = err.response?.status;
			if (status === 401) {
				toast.error('Session expired. Please log in again.');
			} else if (status === 403) {
				toast.error('Forbidden. Cannot update user roles.');
			} else if (status === 404) {
				toast.error('Target user not found.');
			} else if (status === 422) {
				toast.error('Invalid role assignment payload.');
			} else {
				toast.error(err.response?.data?.detail || 'Failed to update user roles.');
			}
		} finally {
			setIsUpdatingRoles(false);
		}
	};

	// Reset Filters
	const handleResetFilters = () => {
		setSearchQuery('');
		setSelectedRole('ALL');
		setSelectedStatus('ALL');
		setCurrentPage(1);
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			{/* 1. Hero Breadcrumb Banner */}
			<div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
				<h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
					User Management
				</h1>
				<div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
					<Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">
						Home
					</Link>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<span className="text-zinc-900 font-semibold">Admin Panel</span>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<span className="text-zinc-900 font-semibold">User Directory</span>
				</div>
			</div>

			{/* 2. Main Container */}
			<div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start flex-1">
				{/* Admin Sidebar */}
				<AdminSidebar />

				{/* Main User Table Section */}
				<div className="flex-1 w-full flex flex-col gap-6">
					{/* Header Controls Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-5">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
							<div>
								<h2 className="text-xl font-bold text-zinc-900">Registered Users</h2>
								<p className="text-xs text-neutral-500 mt-0.5">
									Search, filter, update statuses, and manage system roles.
								</p>
							</div>

							<div className="flex items-center gap-2">
								<span className="px-3 py-1 bg-indigo-50 text-indigo-900 text-xs font-bold rounded-full border border-indigo-100">
									Total Users: {totalItems}
								</span>
								<button
									onClick={() => fetchUsers()}
									disabled={isLoading}
									className="p-2 hover:bg-slate-100 rounded-xl text-neutral-600 transition-colors cursor-pointer disabled:opacity-50"
									title="Refresh table"
								>
									<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
								</button>
							</div>
						</div>

						{/* Filters Row */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
							{/* Search input */}
							<div className="md:col-span-5 relative">
								<Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search name, email, or username..."
									className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-900/20 focus:outline-none"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery('')}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-zinc-900 cursor-pointer"
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</div>

							{/* Role Filter */}
							<div className="md:col-span-3">
								<select
									value={selectedRole}
									onChange={(e) => {
										setSelectedRole(e.target.value as Role | 'ALL');
										setCurrentPage(1);
									}}
									className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-indigo-900/20 focus:outline-none cursor-pointer"
								>
									<option value="ALL">All Roles</option>
									<option value="STUDENT">Student</option>
									<option value="TEACHER">Teacher</option>
									<option value="ADMIN">Admin</option>
								</select>
							</div>

							{/* Status Filter */}
							<div className="md:col-span-3">
								<select
									value={selectedStatus}
									onChange={(e) => {
										setSelectedStatus(e.target.value as AccountStatus | 'ALL');
										setCurrentPage(1);
									}}
									className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-indigo-900/20 focus:outline-none cursor-pointer"
								>
									<option value="ALL">All Statuses</option>
									<option value="ACTIVE">Active</option>
									<option value="BANNED">Banned</option>
									<option value="UNVERIFIED">Unverified</option>
								</select>
							</div>

							{/* Reset Button */}
							<div className="md:col-span-1 flex items-center">
								{(searchQuery || selectedRole !== 'ALL' || selectedStatus !== 'ALL') && (
									<button
										onClick={handleResetFilters}
										className="w-full py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200 text-center"
										title="Reset filters"
									>
										Clear
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Error Alert */}
					{error && (
						<div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-medium">
							<AlertCircle className="w-5 h-5 shrink-0" />
							<span className="flex-1">{error}</span>
							<button
								onClick={fetchUsers}
								className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
							>
								Retry
							</button>
						</div>
					)}

					{/* Users Table Container */}
					<div className="w-full bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
										<th className="py-3.5 px-5">ID</th>
										<th className="py-3.5 px-5">User</th>
										<th className="py-3.5 px-5">Roles</th>
										<th className="py-3.5 px-5">Status</th>
										<th className="py-3.5 px-5">Capabilities</th>
										<th className="py-3.5 px-5 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 text-sm">
									{isLoading ? (
										<tr>
											<td colSpan={6} className="py-12 text-center text-neutral-400">
												<div className="flex flex-col items-center justify-center gap-2">
													<Loader2 className="w-6 h-6 animate-spin text-indigo-900" />
													<span className="text-xs font-medium">Loading user data...</span>
												</div>
											</td>
										</tr>
									) : users.length === 0 ? (
										<tr>
											<td colSpan={6} className="py-12 text-center">
												<div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
													<Search className="w-8 h-8 text-neutral-300" />
													<span className="font-semibold text-zinc-800">No users found</span>
													<span className="text-xs text-neutral-400">
														Try adjusting your search query or filter settings.
													</span>
												</div>
											</td>
										</tr>
									) : (
										users.map((user) => (
											<tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
												{/* ID */}
												<td className="py-4 px-5 font-mono text-xs font-semibold text-neutral-500">
													#{user.id}
												</td>

												{/* User Info */}
												<td className="py-4 px-5">
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center text-sm shrink-0 uppercase border border-indigo-200">
															{user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
														</div>
														<div className="flex flex-col">
															<span className="font-bold text-zinc-900 leading-tight">
																{user.full_name || 'N/A'}
															</span>
															<span className="text-xs text-neutral-500 font-medium">
																{user.email}
															</span>
														</div>
													</div>
												</td>

												{/* Roles */}
												<td className="py-4 px-5">
													<div className="flex flex-wrap gap-1">
														{user.roles && user.roles.length > 0 ? (
															user.roles.map((r, idx) => (
																<span
																	key={idx}
																	className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${
																		r.role === 'ADMIN'
																			? 'bg-purple-100 text-purple-800 border border-purple-200'
																			: r.role === 'TEACHER'
																			? 'bg-blue-100 text-blue-800 border border-blue-200'
																			: 'bg-slate-100 text-slate-700 border border-slate-200'
																	}`}
																>
																	{r.role}
																</span>
															))
														) : (
															<span className="text-xs text-neutral-400 italic">No roles</span>
														)}
													</div>
												</td>

												{/* Account Status */}
												<td className="py-4 px-5">
													<span
														className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${
															user.account_status === 'ACTIVE'
																? 'bg-emerald-50 text-emerald-700 border-emerald-300'
																: user.account_status === 'BANNED'
																? 'bg-rose-50 text-rose-700 border-rose-300'
																: 'bg-amber-50 text-amber-700 border-amber-300'
														}`}
													>
														{user.account_status}
													</span>
												</td>

												{/* Capabilities */}
												<td className="py-4 px-5">
													<div className="flex flex-col gap-0.5 text-xs">
														<span className="text-[11px] font-medium text-neutral-600">
															Learn: {user.capabilities?.can_learn ? '✓' : '✗'} | Teach: {user.capabilities?.can_teach ? '✓' : '✗'}
														</span>
														<span className="text-[11px] font-medium text-neutral-600">
															Manage Users: {user.capabilities?.can_manage_users ? '✓' : '✗'}
														</span>
													</div>
												</td>

												{/* Actions */}
												<td className="py-4 px-5 text-right">
													<div className="flex items-center justify-end gap-2">
														{/* Roles button */}
														<button
															onClick={() => openRoleModal(user)}
															className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
															title="Assign / Edit Roles"
														>
															<Shield className="w-3.5 h-3.5 text-indigo-900" />
															<span>Roles</span>
														</button>

														{/* Ban / Unban button */}
														{user.account_status === 'BANNED' ? (
															<button
																onClick={() => setStatusModalUser(user)}
																className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200"
																title="Unban Account"
															>
																<UserCheck className="w-3.5 h-3.5" />
																<span>Unban</span>
															</button>
														) : (
															<button
																onClick={() => setStatusModalUser(user)}
																className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-rose-200"
																title="Ban Account"
															>
																<UserX className="w-3.5 h-3.5" />
																<span>Ban</span>
															</button>
														)}
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination Controls Footer */}
						{!isLoading && totalPages > 1 && (
							<div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
								<span className="text-xs text-neutral-500 font-medium">
									Page <strong className="text-zinc-800">{currentPage}</strong> of{' '}
									<strong className="text-zinc-800">{totalPages}</strong>
								</span>

								<div className="flex items-center gap-2">
									<button
										onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
										disabled={currentPage === 1}
										className="p-2 rounded-xl bg-white border border-slate-200 text-zinc-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
									>
										<ChevronLeft className="w-4 h-4" />
									</button>

									<div className="flex items-center gap-1">
										{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
											<button
												key={pageNum}
												onClick={() => setCurrentPage(pageNum)}
												className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
													currentPage === pageNum
														? 'bg-indigo-900 text-white shadow-xs'
														: 'bg-white border border-slate-200 text-zinc-700 hover:bg-slate-100'
												}`}
											>
												{pageNum}
											</button>
										))}
									</div>

									<button
										onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
										disabled={currentPage === totalPages}
										className="p-2 rounded-xl bg-white border border-slate-200 text-zinc-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
									>
										<ChevronRight className="w-4 h-4" />
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ── Status Modal (Ban / Unban Confirmation) ── */}
			{statusModalUser && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
					<div className="max-w-md w-full bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xl flex flex-col gap-5">
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
									statusModalUser.account_status === 'BANNED'
										? 'bg-emerald-100 text-emerald-800'
										: 'bg-rose-100 text-rose-800'
								}`}
							>
								{statusModalUser.account_status === 'BANNED' ? (
									<UserCheck className="w-5 h-5" />
								) : (
									<ShieldAlert className="w-5 h-5" />
								)}
							</div>
							<div>
								<h3 className="text-lg font-bold text-zinc-900">
									{statusModalUser.account_status === 'BANNED' ? 'Unban Account' : 'Ban Account'}
								</h3>
								<p className="text-xs text-neutral-500">
									Target User: <strong className="text-zinc-800">#{statusModalUser.id} {statusModalUser.full_name}</strong>
								</p>
							</div>
						</div>

						<p className="text-sm text-neutral-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
							{statusModalUser.account_status === 'BANNED'
								? `Are you sure you want to restore active access for ${statusModalUser.full_name}? The user will be able to log in again.`
								: `Are you sure you want to BAN ${statusModalUser.full_name}? Banned users will be prohibited from authenticating and accessing platform resources.`}
						</p>

						<div className="flex justify-end gap-3 pt-2">
							<button
								onClick={() => setStatusModalUser(null)}
								disabled={isUpdatingStatus}
								className="px-5 py-2.5 rounded-xl border border-slate-200 text-zinc-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={handleStatusConfirm}
								disabled={isUpdatingStatus}
								className={`px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 ${
									statusModalUser.account_status === 'BANNED'
										? 'bg-emerald-600 hover:bg-emerald-700'
										: 'bg-rose-600 hover:bg-rose-700'
								}`}
							>
								{isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin" />}
								<span>
									{statusModalUser.account_status === 'BANNED' ? 'Confirm Unban' : 'Confirm Ban'}
								</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ── Role Assignment Modal ── */}
			{roleModalUser && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
					<div className="max-w-md w-full bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xl flex flex-col gap-5">
						<div className="flex justify-between items-center border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2">
								<Shield className="w-5 h-5 text-indigo-900" />
								<h3 className="text-lg font-bold text-zinc-900">Manage User Roles</h3>
							</div>
							<button
								onClick={() => setRoleModalUser(null)}
								className="text-neutral-400 hover:text-zinc-900 transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="flex flex-col gap-1">
							<span className="text-xs text-neutral-500 font-medium">
								Editing roles for: <strong className="text-zinc-800">{roleModalUser.full_name}</strong> ({roleModalUser.email})
							</span>
						</div>

						{/* Role Selection Checkboxes */}
						<div className="flex flex-col gap-3 my-1">
							{ALL_ROLES.map((role) => {
								const isSelected = selectedRoles.includes(role);
								return (
									<label
										key={role}
										onClick={() => toggleRole(role)}
										className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											isSelected
												? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-bold'
												: 'bg-slate-50 border-slate-200 text-zinc-700 hover:bg-slate-100'
										}`}
									>
										<div className="flex items-center gap-3">
											<div
												className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
													isSelected
														? 'bg-indigo-900 border-indigo-900 text-white'
														: 'border-slate-300 bg-white'
												}`}
											>
												{isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
											</div>
											<span className="text-sm">{role}</span>
										</div>

										<span className="text-xs font-normal text-neutral-500">
											{role === 'ADMIN'
												? 'Full System Access'
												: role === 'TEACHER'
												? 'Can create & publish courses'
												: 'Can enroll & submit code'}
										</span>
									</label>
								);
							})}
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<button
								onClick={() => setRoleModalUser(null)}
								disabled={isUpdatingRoles}
								className="px-5 py-2.5 rounded-xl border border-slate-200 text-zinc-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={handleRoleSave}
								disabled={isUpdatingRoles}
								className="px-6 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
							>
								{isUpdatingRoles && <Loader2 className="w-4 h-4 animate-spin" />}
								<span>Save Changes</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminUsersPage;
