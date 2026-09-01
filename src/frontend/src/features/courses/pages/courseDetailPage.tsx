import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
	Star,
	Users,
	ArrowLeft,
	Heart,
	Lock,
	CheckCircle2,
	PlayCircle,
	FileText,
	HelpCircle,
	ChevronDown,
	ChevronUp,
	BookOpen,
	AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useEnrolledCourses } from '../../../hooks/api/useEnrolledCourses.ts';
import { courseApi } from '../api/courseApi.ts';
import { CourseDetailResponse, StudyResponse } from '@/features/courses/model/course';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';

export const CourseDetailPage: React.FC = () => {
	const { courseSlug } = useParams<{ courseSlug: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated } = useAuthStore();
	const { isEnrolled, refetch: refetchEnrollments } = useEnrolledCourses();

	// Course State
	const [course, setCourse] = useState<CourseDetailResponse | null>(null);
	const [studyData, setStudyData] = useState<StudyResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Accordion state: map section ID -> boolean (expanded)
	const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

	// Local Favorite State
	const [isFav, setIsFav] = useState<boolean>(false);

	// CTA Loading
	const [actionLoading, setActionLoading] = useState<boolean>(false);

	// Load all course details
	const loadCourseDetail = useCallback(async () => {
		if (!courseSlug) return;
		setLoading(true);
		setError(null);
		try {
			// 1. Fetch public course detail
			const detail = await courseApi.fetchCourseDetail(courseSlug);
			setCourse(detail);

			// Initialize all sections as expanded by default
			const initialExpanded: Record<number, boolean> = {};
			detail.sections.forEach((sec) => {
				initialExpanded[sec.id] = true;
			});
			setExpandedSections(initialExpanded);

			// 2. Load favorite state from localStorage
			const favs = JSON.parse(localStorage.getItem('fav_courses') || '[]');
			setIsFav(favs.includes(courseSlug));

			// 3. If user is logged in AND enrolled, load the detailed study content (curriculum lessons)
			if (isAuthenticated && isEnrolled(courseSlug)) {
				try {
					const study = await courseApi.fetchStudyContent(courseSlug);
					setStudyData(study);
				} catch (studyErr) {
					console.error('Không thể tải chương trình học chi tiết:', studyErr);
				}
			}
		} catch (err: unknown) {
			console.error('Lỗi khi tải chi tiết khóa học:', err);
			const isNotFound = axios.isAxiosError(err) && err.response?.status === 404;
			setError(
				isNotFound
					? 'Khóa học không tồn tại trên hệ thống.'
					: 'Không thể tải thông tin chi tiết khóa học. Vui lòng kiểm tra lại kết nối mạng.'
			);
		} finally {
			setLoading(false);
		}
	}, [courseSlug, isAuthenticated, isEnrolled]);

	useEffect(() => {
		loadCourseDetail();
	}, [loadCourseDetail]);

	// Toggle section collapse
	const toggleSection = (sectionId: number) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId]
		}));
	};

	// Toggle favorite state
	const handleToggleFavorite = () => {
		if (!courseSlug) return;
		const favs = JSON.parse(localStorage.getItem('fav_courses') || '[]');
		let newFavs: string[];
		if (isFav) {
			newFavs = favs.filter((slug: string) => slug !== courseSlug);
			toast.info('Đã xóa khỏi danh sách yêu thích');
		} else {
			newFavs = [...favs, courseSlug];
			toast.success('Đã thêm vào danh sách yêu thích');
		}
		localStorage.setItem('fav_courses', JSON.stringify(newFavs));
		setIsFav(!isFav);
	};

	const handlePreviewClassroom = () => {
		if (!course) return;

		const hasLessons = course.sections && course.sections.some((sec) => sec.lesson_count > 0);
		if (!hasLessons) {
			toast.error('Không thể xem trước: Khóa học này chưa có bài học nào.');
			return;
		}

		toast.success(`Đang mở chế độ xem trước cho "${course.title}"`);
		navigate(`/learn/${course.slug}`, { state: { from: location.pathname } });
	};

	// Enroll CTA click handler
	const handleEnrollAction = async () => {
		if (!courseSlug || !course) return;

		// Require login first
		if (!isAuthenticated) {
			toast.warning('Vui lòng đăng nhập để tham gia khóa học!');
			navigate('/login');
			return;
		}

		setActionLoading(true);
		try {
			const res = await courseApi.enrollCourse(courseSlug);
			if (res.status === 'enrolled') {
				toast.success('Đăng ký khóa học thành công!');
				await refetchEnrollments();
				// Reload detail to fetch the detailed study content
				loadCourseDetail();
			} else if (res.status === 'pending_payment' && res.checkout_url) {
				toast.info('Đang chuyển hướng đến cổng thanh toán PayOS...');
				// Redirect to backend/PayOS checkout url
				window.location.href = res.checkout_url;
			}
		} catch (err) {
			console.error('Lỗi khi đăng ký khóa học:', err);
			toast.error('Có lỗi xảy ra khi thực hiện đăng ký. Vui lòng thử lại sau.');
		} finally {
			setActionLoading(false);
		}
	};

	const hasEnrolled = course ? isEnrolled(course.slug) : false;
	const isFree = course ? course.price_type === 'free' || course.price === 0 : false;

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
				<Skeleton className="h-6 w-24" />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<Skeleton className="h-10 w-3/4" />
						<div className="flex gap-4">
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-5 w-32" />
						</div>
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-48 w-full" />
					</div>
					<div className="space-y-6">
						<Skeleton className="h-80 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (error || !course) {
		return (
			<div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
				<AlertCircle className="w-16 h-16 mx-auto text-[hsl(var(--color-status-error))]" />
				<h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">Khóa học không khả dụng</h2>
				<p className="text-sm text-[hsl(var(--text-secondary))]">{error || 'Không tìm thấy dữ liệu khóa học.'}</p>
				<Link to="/courses">
					<Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
						Quay lại danh mục
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
			{/* Breadcrumb back navigation */}
			<div>
				<Link to="/courses" className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--color-brand-indigo))] transition-colors">
					<ArrowLeft className="w-4 h-4" />
					<span>Quay lại danh mục</span>
				</Link>
			</div>

			{/* Main Layout Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
				{/* Left Column: Course Main Content */}
				<div className="lg:col-span-2 space-y-8">
					{/* Header information */}
					<div className="space-y-4">
						<div className="flex flex-wrap gap-2">
							<Badge variant="indigo" size="sm" className="uppercase font-semibold tracking-wider">
								{course.field}
							</Badge>
							{course.tags.map((tag) => (
								<Badge key={tag} variant="default" size="sm" className="font-semibold">
									#{tag}
								</Badge>
							))}
						</div>

						<h1 className="text-3xl font-extrabold text-[hsl(var(--text-primary))] tracking-tight sm:text-4xl">
							{course.title}
						</h1>

						<div className="flex flex-wrap items-center gap-6 text-sm text-[hsl(var(--text-secondary))]">
							{course.rating > 0 && (
								<div className="flex items-center gap-1 text-amber-500 font-semibold">
									<Star className="w-4 h-4 fill-current" />
									<span>{course.rating.toFixed(1)} / 5.0</span>
								</div>
							)}
							<div className="flex items-center gap-1">
								<Users className="w-4 h-4 text-slate-400" />
								<span>{course.enrolled_count.toLocaleString()} học viên đã tham gia</span>
							</div>
						</div>
					</div>

					{/* Description section */}
					<Card className="p-6 border border-[hsl(var(--border-color))] space-y-3">
						<h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">Giới thiệu khóa học</h2>
						<p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed whitespace-pre-line">
							{course.description}
						</p>
					</Card>

					{/* Curriculum Accordion */}
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
							<BookOpen className="w-5 h-5 text-[hsl(var(--color-brand-indigo))]" />
							Chương trình học
						</h2>

						<div className="divide-y divide-[hsl(var(--border-color))] border border-[hsl(var(--border-color))] rounded-2xl overflow-hidden bg-[hsl(var(--bg-card))]">
							{course.sections.map((section, sectionIdx) => {
								const isExpanded = expandedSections[section.id] ?? false;

								// Check if we have detailed study content for this section
								const detailedSection = studyData?.sections.find((s) => s.id === section.id);

								return (
									<div key={section.id} className="group">
										{/* Section Header */}
										<button
											onClick={() => toggleSection(section.id)}
											className="w-full flex items-center justify-between p-5 text-left font-semibold text-base bg-[hsl(var(--bg-card))] hover:bg-[hsl(var(--bg-muted))]/40 transition-colors focus:outline-none cursor-pointer"
										>
											<div className="flex items-center gap-3">
												<span className="flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--bg-muted))] text-xs font-semibold text-[hsl(var(--text-secondary))] select-none">
													{sectionIdx + 1}
												</span>
												<span className="text-[hsl(var(--text-primary))]">{section.title}</span>
											</div>
											<div className="flex items-center gap-3 text-[hsl(var(--text-secondary))] text-xs font-semibold">
												<span>{section.lesson_count} bài học</span>
												{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
											</div>
										</button>

										{/* Section Body */}
										{isExpanded && (
											<div className="bg-[hsl(var(--bg-card))] p-5 border-t border-[hsl(var(--border-color))] space-y-4">
												{detailedSection ? (
													/* Enrolled View: Show detailed lessons and contents progress */
													<div className="space-y-4">
														{detailedSection.lessons.map((lesson, lessonIdx) => (
															<div key={lesson.id} className="pl-6 border-l border-[hsl(var(--border-color))] relative space-y-2">
																{/* Bullet indicator */}
																<div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
																
																<div className="flex items-start justify-between gap-4">
																	<h4 className="text-sm font-semibold text-[hsl(var(--text-primary))]">
																		Bài {lessonIdx + 1}: {lesson.title}
																	</h4>
																	{lesson.locked && (
																		<Badge variant="default" className="text-xs font-semibold py-0">
																			<Lock className="w-2.5 h-2.5" /> Khóa
																		</Badge>
																	)}
																</div>

																{/* Lesson Contents */}
																<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
																	{lesson.contents.map((content) => {
																		const getIcon = () => {
																			if (content.content_type === 'QUIZ') return <HelpCircle className="w-3.5 h-3.5 text-orange-500" />;
																			if (content.content_type === 'PROBLEM') return <PlayCircle className="w-3.5 h-3.5 text-cyan-500" />;
																			return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
																		};

																		const getTypeName = () => {
																			if (content.content_type === 'QUIZ') return 'Trắc nghiệm';
																			if (content.content_type === 'PROBLEM') return 'Luyện code';
																			return 'Lý thuyết';
																		};

																		return (
																			<div key={content.id} className="flex items-center justify-between p-2 rounded-xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-muted))]/30 text-xs font-semibold">
																				<div className="flex items-center gap-2">
																					{getIcon()}
																					<span className="font-semibold text-[hsl(var(--text-secondary))]">
																						{getTypeName()}
																					</span>
																				</div>
																				{content.completed ? (
																					<CheckCircle2 className="w-4 h-4 text-emerald-500" />
																				) : (
																					<span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
																				)}
																			</div>
																		);
																	})}
																</div>
															</div>
														))}
													</div>
												) : (
													/* Guest View: Section message */
													<div className="text-center py-4 bg-[hsl(var(--bg-muted))]/30 rounded-xl">
														<p className="text-xs font-semibold text-[hsl(var(--text-secondary))]">
															Đăng ký tham gia khóa học để mở khóa chi tiết các bài giảng và bài tập thực hành.
														</p>
													</div>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* Teacher profile section */}
					<Card className="p-6 border border-[hsl(var(--border-color))] space-y-4">
						<h2 className="text-xl font-bold text-[hsl(var(--text-primary))]">Thông tin giảng viên</h2>
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 text-sm select-none">
								GV
							</div>
							<div className="space-y-1">
								<h3 className="text-base font-semibold text-[hsl(var(--text-primary))]">
									Giảng viên SkillBoost
								</h3>
								<p className="text-xs text-[hsl(var(--text-secondary))]">
									Chuyên gia lập trình và giảng dạy tại SkillBoost. Tốt nghiệp chuyên ngành CNTT từ các trường đại học hàng đầu, có nhiều năm kinh nghiệm làm việc thực tế tại các doanh nghiệp công nghệ lớn.
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Right Column: Sticky Sidebar pricing & CTA */}
				<div className="lg:col-span-1 lg:sticky lg:top-8 space-y-6">
					<Card className="p-6 border border-[hsl(var(--border-color))] shadow-md space-y-6 flex flex-col">
						{/* Course Thumbnail placeholder */}
						<div className="aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] text-white font-bold text-lg flex items-center justify-center select-none text-center px-4">
							{course.title}
						</div>

						{/* Price Display */}
						<div className="space-y-1">
							<p className="text-xs font-semibold text-[hsl(var(--text-secondary))]">Học phí khóa học</p>
							<p className="text-2xl font-extrabold text-[hsl(var(--color-brand-indigo))] dark:text-indigo-400">
								{isFree ? 'Miễn phí' : formatCurrency(course.price, 'USD')}
							</p>
						</div>

						{/* CTA Button */}
						{hasEnrolled ? (
							<Link to={`/learn/${course.slug}`} className="w-full">
								<Button className="w-full" variant="primary" size="md">
									Vào học ngay (Continue Learning)
								</Button>
							</Link>
						) : (
							<div className="flex flex-col gap-2.5 w-full">
								<Button
									className="w-full"
									variant="primary"
									size="md"
									isLoading={actionLoading}
									onClick={handleEnrollAction}
								>
									{isFree ? 'Đăng ký học ngay' : 'Mua khóa học (Checkout)'}
								</Button>
								<Button
									className="w-full bg-sec-blue-bg hover:bg-sec-blue-hover border border-sec-blue-border text-sec-blue-text transition-colors shadow-2xs"
									variant="outline"
									size="md"
									onClick={handlePreviewClassroom}
								>
									Preview Classroom
								</Button>
							</div>
						)}

						{/* Extra actions: favorite toggle */}
						<div className="flex gap-2 justify-center pt-2">
							<Button
								variant={isFav ? 'danger' : 'outline'}
								size="sm"
								icon={<Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />}
								onClick={handleToggleFavorite}
								className="w-full"
							>
								{isFav ? 'Đã yêu thích' : 'Yêu thích'}
							</Button>
						</div>

						{/* Value Checklist */}
						<div className="border-t border-[hsl(var(--border-color))] pt-4 space-y-3">
							<h4 className="text-base font-semibold text-[hsl(var(--text-primary))]">Khóa học này bao gồm:</h4>
							<ul className="text-sm font-normal text-[hsl(var(--text-secondary))] space-y-2 leading-relaxed">
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
									<span>Học trực tuyến mọi lúc mọi nơi</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
									<span>Trình biên dịch và chấm code tự động (Online Judge)</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
									<span>Hỗ trợ bài kiểm tra trắc nghiệm củng cố kiến thức</span>
								</li>
							</ul>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};
