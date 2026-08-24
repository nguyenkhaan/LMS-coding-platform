import React, { useState, useEffect, useCallback } from 'react';
import { Search, RotateCcw, AlertCircle, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/empty_state';
import { CourseCard } from '../components/course_card';
import { courseApi } from '../services/courseApi';
import { CourseItem, PriceType } from '@/types/course';

export const CourseCatalogPage: React.FC = () => {
	const [courses, setCourses] = useState<CourseItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Search & Filters State
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
	const [priceFilter, setPriceFilter] = useState<PriceType | 'all'>('all');

	// Pagination State
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const pageSize = 8; // 8 items per page works beautifully in a 4-column grid

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
			setCurrentPage(1); // Reset to page 1 on search change
		}, 400);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch courses catalog from API
	const loadCourses = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await courseApi.fetchCourseCatalog({
				page: currentPage,
				size: pageSize,
				q: debouncedSearchQuery,
				price_type: priceFilter === 'all' ? undefined : priceFilter
			});
			setCourses(data.items);
			setTotalPages(data.total_pages);
		} catch (err) {
			console.error('Lỗi khi tải danh sách khóa học:', err);
			setError('Không thể tải danh sách khóa học. Vui lòng kiểm tra lại kết nối mạng.');
		} finally {
			setLoading(false);
		}
	}, [currentPage, debouncedSearchQuery, priceFilter]);

	useEffect(() => {
		loadCourses();
	}, [loadCourses]);

	// Reset all filters
	const handleResetFilters = () => {
		setSearchQuery('');
		setDebouncedSearchQuery('');
		setPriceFilter('all');
		setCurrentPage(1);
	};

	const handlePriceFilterChange = (filter: PriceType | 'all') => {
		setPriceFilter(filter);
		setCurrentPage(1); // Reset to page 1 on filter change
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-[70vh]">
			{/* Catalog Header Banner */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[hsl(var(--border-color))]">
				<div className="space-y-1.5">
					<h1 className="text-3xl lg:text-4xl font-extrabold text-[hsl(var(--text-primary))] tracking-tight">
						Khám phá Khóa học
					</h1>
					<p className="text-sm font-medium text-[hsl(var(--text-secondary))] max-w-xl">
						Nâng cao kỹ năng lập trình của bạn với các khóa học thực tế chuẩn công nghiệp từ các chuyên gia hàng đầu.
					</p>
				</div>

				{/* Search Input Box */}
				<div className="w-full md:max-w-md">
					<Input
						placeholder="Tìm kiếm khóa học hoặc từ khóa..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						iconPrefix={<Search className="w-4 h-4 text-slate-400" />}
						className="shadow-xs"
					/>
				</div>
			</div>

			{/* Filters & Actions Panel */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[hsl(var(--bg-card))] p-4 rounded-2xl border border-[hsl(var(--border-color))] shadow-xs">
				{/* Filter Tabs */}
				<div className="flex flex-wrap gap-1.5">
					<button
						onClick={() => handlePriceFilterChange('all')}
						className={`px-4 py-1.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
							priceFilter === 'all'
								? 'bg-[hsl(var(--color-brand-indigo))] text-white border-transparent'
								: 'bg-transparent border-[hsl(var(--border-color))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-muted))]'
						}`}
					>
						Tất cả khóa học
					</button>
					<button
						onClick={() => handlePriceFilterChange('paid')}
						className={`px-4 py-1.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
							priceFilter === 'paid'
								? 'bg-[hsl(var(--color-brand-indigo))] text-white border-transparent'
								: 'bg-transparent border-[hsl(var(--border-color))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-muted))]'
						}`}
					>
						Trả phí
					</button>
					<button
						onClick={() => handlePriceFilterChange('free')}
						className={`px-4 py-1.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
							priceFilter === 'free'
								? 'bg-[hsl(var(--color-brand-indigo))] text-white border-transparent'
								: 'bg-transparent border-[hsl(var(--border-color))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-muted))]'
						}`}
					>
						Miễn phí
					</button>
				</div>

				{/* Active filters status & reset */}
				{(debouncedSearchQuery || priceFilter !== 'all') && (
					<Button
						variant="ghost"
						size="sm"
						icon={<RotateCcw className="w-3.5 h-3.5" />}
						onClick={handleResetFilters}
						className="text-sm"
					>
						Đặt lại bộ lọc
					</Button>
				)}
			</div>

			{/* Main Grid Content Area */}
			{error ? (
				<div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4">
					<AlertCircle className="w-12 h-12 text-[hsl(var(--color-status-error))]" />
					<h3 className="text-lg font-bold text-[hsl(var(--text-primary))]">Đã xảy ra lỗi</h3>
					<p className="text-sm text-[hsl(var(--text-secondary))] max-w-md">{error}</p>
					<Button variant="primary" size="sm" onClick={loadCourses}>
						Thử lại
					</Button>
				</div>
			) : loading ? (
				/* Grid of Skeletons */
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{Array.from({ length: pageSize }).map((_, idx) => (
						<div key={idx} className="flex flex-col h-full overflow-hidden border border-[hsl(var(--border-color))] rounded-2xl bg-[hsl(var(--bg-card))] p-0 space-y-4">
							<Skeleton className="aspect-video w-full rounded-t-2xl rounded-b-none" />
							<div className="p-5 space-y-3 flex-1 flex flex-col">
								<div className="flex justify-between">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-4 w-1/12" />
								</div>
								<Skeleton className="h-6 w-3/4" />
								<div className="flex gap-1.5">
									<Skeleton className="h-5 w-12" />
									<Skeleton className="h-5 w-16" />
								</div>
								<div className="flex-1 min-h-[20px]" />
								<div className="flex justify-between items-center pt-4 border-t border-[hsl(var(--border-color))]">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-4 w-1/4" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : courses.length === 0 ? (
				/* Empty State */
				<EmptyState
					icon={<BookOpen className="w-12 h-12 text-[hsl(var(--text-muted))]" />}
					title="Không tìm thấy khóa học nào"
					description={
						debouncedSearchQuery || priceFilter !== 'all'
							? 'Vui lòng thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các bộ lọc.'
							: 'Hiện chưa có khóa học nào hoạt động trên hệ thống.'
					}
					actionLabel={debouncedSearchQuery || priceFilter !== 'all' ? 'Xóa bộ lọc' : undefined}
					onAction={debouncedSearchQuery || priceFilter !== 'all' ? handleResetFilters : undefined}
					className="py-16"
				/>
			) : (
				/* Actual Courses Grid */
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{courses.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			)}

			{/* Pagination Controls */}
			{!loading && !error && totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 pt-8 border-t border-[hsl(var(--border-color))]">
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					>
						Trước
					</Button>

					{Array.from({ length: totalPages }).map((_, idx) => {
						const pageNum = idx + 1;
						return (
							<button
								key={pageNum}
								onClick={() => setCurrentPage(pageNum)}
								className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
									currentPage === pageNum
										? 'bg-[hsl(var(--color-brand-indigo))] text-white border-transparent'
										: 'bg-transparent border-[hsl(var(--border-color))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-muted))]'
								}`}
							>
								{pageNum}
							</button>
						);
					})}

					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === totalPages}
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
					>
						Sau
					</Button>
				</div>
			)}
		</div>
	);
};
