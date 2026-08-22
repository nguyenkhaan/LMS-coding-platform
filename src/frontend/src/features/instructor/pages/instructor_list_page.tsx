import React, { useState, useMemo } from 'react';
import {
	Search,
	Star,
	SlidersHorizontal,
	LayoutGrid,
	List as ListIcon,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Heart,
	BookOpen,
	Clock,
	Users,
	Mail,
	MapPin,
	Phone,
	ArrowRight,
	Check,
	RotateCcw
} from 'lucide-react';

// ============================================================================
// Types & Interfaces
// ============================================================================
export interface Instructor {
	id: number;
	name: string;
	role: string;
	bio: string;
	rating: number;
	reviewCount: number;
	lessonCount: number;
	duration: string;
	studentCount: number;
	tags: string[];
	avatar: string;
	category: string;
	level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	priceType: 'Free' | 'Paid';
	price: number;
	isFavorite?: boolean;
}

// ============================================================================
// Mock Data (Đầy đủ theo thiết kế Figma)
// ============================================================================
const MOCK_INSTRUCTORS: Instructor[] = [
	{
		id: 1,
		name: 'Rolands Granger',
		role: 'Developer',
		bio: 'I am a web developer with a vast array of knowledge in many different front end and back end languages, responsive frameworks, databases, and best code practices.',
		rating: 4.9,
		reviewCount: 200,
		lessonCount: 12,
		duration: '169hr 20min',
		studentCount: 50,
		tags: ['Web Design', 'Development', 'Re-Design'],
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
		category: 'Backend',
		level: 'Advanced',
		priceType: 'Paid',
		price: 49,
		isFavorite: false
	},
	{
		id: 2,
		name: 'Lisa Lopez',
		role: 'Finance',
		bio: 'I am a web developer with a vast array of knowledge in many different front end technologies, financial systems and algorithms.',
		rating: 4.4,
		reviewCount: 130,
		lessonCount: 22,
		duration: '15hr 06min',
		studentCount: 22,
		tags: ['Web Design', 'Development'],
		avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
		category: 'General',
		level: 'Intermediate',
		priceType: 'Free',
		price: 0,
		isFavorite: true
	},
	{
		id: 3,
		name: 'Charles Ruiz',
		role: 'Cloud Engineer',
		bio: 'I am a web developer with a vast array of knowledge in many different cloud infrastructure platforms and distributed systems.',
		rating: 4.5,
		reviewCount: 120,
		lessonCount: 16,
		duration: '2hr 25min',
		studentCount: 10,
		tags: ['Web Design'],
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
		category: 'IT & Software',
		level: 'Advanced',
		priceType: 'Paid',
		price: 89,
		isFavorite: false
	},
	{
		id: 4,
		name: 'Rogerina Grogan',
		role: 'Vocational',
		bio: 'I am a web developer with a vast array of knowledge in many different vocational training systems and hands-on skill building.',
		rating: 4.6,
		reviewCount: 180,
		lessonCount: 6,
		duration: '19hr 30min',
		studentCount: 50,
		tags: ['Web Design', 'Development'],
		avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
		category: 'Technology',
		level: 'Beginner',
		priceType: 'Free',
		price: 0,
		isFavorite: false
	},
	{
		id: 5,
		name: 'Ivana Tow',
		role: 'Corporate Trainer',
		bio: 'I am a web developer with a vast array of knowledge in enterprise systems, agile methodologies, and leadership.',
		rating: 4.2,
		reviewCount: 210,
		lessonCount: 25,
		duration: '4hr 20min',
		studentCount: 50,
		tags: ['Web Design', 'Development'],
		avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
		category: 'General',
		level: 'Expert',
		priceType: 'Paid',
		price: 65,
		isFavorite: false
	},
	{
		id: 6,
		name: 'Kevin Leonard',
		role: 'Developer',
		bio: 'Fullstack specialist focusing on TypeScript, scalable microservices, system architecture, and clean patterns.',
		rating: 4.5,
		reviewCount: 140,
		lessonCount: 11,
		duration: '7hr 10min',
		studentCount: 21,
		tags: ['Web Design', 'Development', 'Re-Design'],
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
		category: 'Programming Language',
		level: 'Intermediate',
		priceType: 'Paid',
		price: 55,
		isFavorite: false
	},
	{
		id: 7,
		name: 'Jeanette Dulaney',
		role: 'Technical Trainer',
		bio: 'Experienced educator providing structured deep-dives into modern web architectures and real-world coding projects.',
		rating: 4.7,
		reviewCount: 220,
		lessonCount: 12,
		duration: '9hr 30min',
		studentCount: 32,
		tags: ['Web Design', 'Development'],
		avatar: 'https://images.unsplash.com/photo-1534751516642-a171edfe5c63?w=600&auto=format&fit=crop&q=80',
		category: 'Frontend',
		level: 'Beginner',
		priceType: 'Paid',
		price: 45,
		isFavorite: false
	}
];

const CATEGORIES = [
	{ name: 'Backend', count: 3 },
	{ name: 'CSS', count: 2 },
	{ name: 'Frontend', count: 2 },
	{ name: 'General', count: 2 },
	{ name: 'IT & Software', count: 2 },
	{ name: 'Photography', count: 2 },
	{ name: 'Programming Language', count: 3 },
	{ name: 'Technology', count: 2 }
];

const INSTRUCTOR_NAMES = [
	{ name: 'Keny White', count: 10 },
	{ name: 'Hinata Hyuga', count: 5 },
	{ name: 'John Doe', count: 3 },
	{ name: 'Nicole Brown', count: 1 }
];

const LEVELS = [
	{ name: 'Beginner', count: 10 },
	{ name: 'Intermediate', count: 5 },
	{ name: 'Advanced', count: 21 },
	{ name: 'Expert', count: 3 }
];

// ============================================================================
// Main Component
// ============================================================================
export const InstructorListPage: React.FC = () => {
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
	const [selectedPriceType, setSelectedPriceType] = useState<string>('All');
	const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<number>(69850);
	const [sortBy, setSortBy] = useState('Newly Published');
	const [currentPage, setCurrentPage] = useState(1);
	const [favorites, setFavorites] = useState<Record<number, boolean>>({ 2: true });

	const toggleFavorite = (id: number) => {
		setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setSelectedCategories([]);
		setSelectedInstructors([]);
		setSelectedPriceType('All');
		setSelectedLevels([]);
		setPriceRange(69850);
		setCurrentPage(1);
	};

	// Lọc dữ liệu
	const filteredInstructors = useMemo(() => {
		return MOCK_INSTRUCTORS.filter((inst) => {
			// Search
			if (
				searchTerm &&
				!inst.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!inst.role.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false;
			}
			// Category
			if (selectedCategories.length > 0 && !selectedCategories.includes(inst.category)) {
				return false;
			}
			// Price Type
			if (selectedPriceType !== 'All' && inst.priceType !== selectedPriceType) {
				return false;
			}
			// Level
			if (selectedLevels.length > 0 && !selectedLevels.includes(inst.level)) {
				return false;
			}
			return true;
		});
	}, [searchTerm, selectedCategories, selectedPriceType, selectedLevels]);

	const itemsPerPage = 5;
	const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage) || 1;
	const paginatedInstructors = filteredInstructors.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
			{/* 1. Header / Top Navigation Bar */}
			<Header />

			{/* 2. Hero Breadcrumb Banner */}
			<div className="bg-gradient-to-r from-red-100 via-sky-100 to-blue-100 px-4 py-10">
				<div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center">
					<h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
						Instructor List
					</h1>
					<div className="flex items-center gap-2 text-sm">
						<span className="cursor-pointer text-zinc-700 transition-colors hover:text-rose-500">
							Home
						</span>
						<span className="inline-block h-1.5 w-2.5 rounded-full bg-rose-500" />
						<span className="font-medium text-zinc-500">Instructor List</span>
					</div>
				</div>
			</div>

			{/* 3. Main Content Area */}
			<div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
				{/* Toolbar (Filters count, Grid/List toggle, Sort, Search) */}
				<div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center">
					<div className="flex items-center justify-between gap-6 md:justify-start">
						<div className="flex items-center gap-2 text-lg font-bold text-zinc-900">
							<SlidersHorizontal className="h-5 w-5" />
							<span>Filters</span>
						</div>
						<button
							onClick={handleClearFilters}
							className="cursor-pointer text-sm font-medium text-rose-600 underline transition-colors hover:text-rose-700"
						>
							Clear all
						</button>
					</div>

					<div className="flex flex-1 flex-wrap items-center justify-between gap-3 md:justify-end">
						<span className="text-sm font-medium text-zinc-600">
							Showing 1–{paginatedInstructors.length} of {filteredInstructors.length}{' '}
							results
						</span>

						{/* View Mode Toggle */}
						<div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-xs">
							<button
								onClick={() => setViewMode('grid')}
								className={`cursor-pointer rounded-md p-2 transition-colors ${
									viewMode === 'grid'
										? 'bg-rose-500 text-white'
										: 'text-zinc-600 hover:bg-slate-100'
								}`}
								title="Grid View"
							>
								<LayoutGrid className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={`cursor-pointer rounded-md p-2 transition-colors ${
									viewMode === 'list'
										? 'bg-rose-500 text-white'
										: 'text-zinc-600 hover:bg-slate-100'
								}`}
								title="List View"
							>
								<ListIcon className="h-4 w-4" />
							</button>
						</div>

						{/* Sort Dropdown */}
						<div className="relative">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-sm font-medium text-zinc-800 shadow-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
							>
								<option value="Newly Published">Newly Published</option>
								<option value="Highest Rated">Highest Rated</option>
								<option value="Most Popular">Most Popular</option>
							</select>
							<ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
						</div>

						{/* Search Input */}
						<div className="relative w-full sm:w-64">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
							<input
								type="text"
								placeholder="Search instructors..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-zinc-800 placeholder-zinc-400 shadow-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
							/>
						</div>
					</div>
				</div>

				{/* Layout Grid: Sidebar + List Content */}
				<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
					{/* Left Filter Sidebar */}
					<div className="space-y-6 lg:col-span-1">
						{/* Categories */}
						<FilterCard title="Categories">
							{CATEGORIES.map((cat) => (
								<label
									key={cat.name}
									className="flex cursor-pointer items-center justify-between text-sm text-zinc-600 select-none hover:text-zinc-900"
								>
									<div className="flex items-center gap-2.5">
										<input
											type="checkbox"
											checked={selectedCategories.includes(cat.name)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedCategories([
														...selectedCategories,
														cat.name
													]);
												} else {
													setSelectedCategories(
														selectedCategories.filter(
															(c) => c !== cat.name
														)
													);
												}
											}}
											className="h-4 w-4 cursor-pointer rounded border-gray-300 text-rose-500 focus:ring-rose-500"
										/>
										<span>{cat.name}</span>
									</div>
									<span className="text-xs text-zinc-400">({cat.count})</span>
								</label>
							))}
							<button className="pt-1 text-left text-xs font-semibold text-rose-600 hover:underline">
								See More
							</button>
						</FilterCard>

						{/* Instructors */}
						<FilterCard title="Instructors">
							{INSTRUCTOR_NAMES.map((inst) => (
								<label
									key={inst.name}
									className="flex cursor-pointer items-center justify-between text-sm text-zinc-600 select-none hover:text-zinc-900"
								>
									<div className="flex items-center gap-2.5">
										<input
											type="checkbox"
											checked={selectedInstructors.includes(inst.name)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedInstructors([
														...selectedInstructors,
														inst.name
													]);
												} else {
													setSelectedInstructors(
														selectedInstructors.filter(
															(i) => i !== inst.name
														)
													);
												}
											}}
											className="h-4 w-4 cursor-pointer rounded border-gray-300 text-rose-500 focus:ring-rose-500"
										/>
										<span>{inst.name}</span>
									</div>
									<span className="text-xs text-zinc-400">({inst.count})</span>
								</label>
							))}
							<button className="pt-1 text-left text-xs font-semibold text-rose-600 hover:underline">
								See More
							</button>
						</FilterCard>

						{/* Price Type */}
						<FilterCard title="Price">
							{['All', 'Free', 'Paid'].map((type) => (
								<label
									key={type}
									className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600 select-none hover:text-zinc-900"
								>
									<input
										type="radio"
										name="priceType"
										checked={selectedPriceType === type}
										onChange={() => setSelectedPriceType(type)}
										className="h-4 w-4 cursor-pointer border-gray-300 text-rose-500 focus:ring-rose-500"
									/>
									<span>{type}</span>
								</label>
							))}
						</FilterCard>

						{/* Price Range Slider */}
						<FilterCard title="Range">
							<div className="space-y-3">
								<input
									type="range"
									min="0"
									max="100000"
									step="500"
									value={priceRange}
									onChange={(e) => setPriceRange(Number(e.target.value))}
									className="w-full cursor-pointer accent-rose-500"
								/>
								<div className="flex items-center justify-between text-xs font-medium text-zinc-600">
									<span>$0</span>
									<span>${priceRange.toLocaleString()}</span>
								</div>
							</div>
						</FilterCard>

						{/* Level */}
						<FilterCard title="Level">
							{LEVELS.map((lvl) => (
								<label
									key={lvl.name}
									className="flex cursor-pointer items-center justify-between text-sm text-zinc-600 select-none hover:text-zinc-900"
								>
									<div className="flex items-center gap-2.5">
										<input
											type="checkbox"
											checked={selectedLevels.includes(lvl.name)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedLevels([
														...selectedLevels,
														lvl.name
													]);
												} else {
													setSelectedLevels(
														selectedLevels.filter((l) => l !== lvl.name)
													);
												}
											}}
											className="h-4 w-4 cursor-pointer rounded border-gray-300 text-rose-500 focus:ring-rose-500"
										/>
										<span>{lvl.name}</span>
									</div>
									<span className="text-xs text-zinc-400">({lvl.count})</span>
								</label>
							))}
						</FilterCard>
					</div>

					{/* Right Instructor List / Grid */}
					<div className="space-y-6 lg:col-span-3">
						{paginatedInstructors.length === 0 ? (
							<div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
									<Search className="h-6 w-6" />
								</div>
								<h3 className="text-lg font-bold text-zinc-900">
									No instructors found
								</h3>
								<p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
									Try adjusting your filters or search keywords to find what you
									are looking for.
								</p>
								<button
									onClick={handleClearFilters}
									className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
								>
									<RotateCcw className="h-4 w-4" /> Reset Filters
								</button>
							</div>
						) : viewMode === 'list' ? (
							/* List View */
							<div className="space-y-4">
								{paginatedInstructors.map((inst) => (
									<InstructorListCard
										key={inst.id}
										instructor={inst}
										isFavorite={!!favorites[inst.id]}
										onToggleFavorite={() => toggleFavorite(inst.id)}
									/>
								))}
							</div>
						) : (
							/* Grid View */
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								{paginatedInstructors.map((inst) => (
									<InstructorGridCard
										key={inst.id}
										instructor={inst}
										isFavorite={!!favorites[inst.id]}
										onToggleFavorite={() => toggleFavorite(inst.id)}
									/>
								))}
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between border-t border-gray-200 pt-6">
								<span className="text-sm font-medium text-zinc-500">
									Page {currentPage} of {totalPages}
								</span>
								<div className="flex items-center gap-2">
									<button
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-zinc-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
									>
										<ChevronLeft className="h-4 w-4" />
									</button>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(page) => (
											<button
												key={page}
												onClick={() => setCurrentPage(page)}
												className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
													currentPage === page
														? 'bg-rose-500 text-white shadow-xs'
														: 'border border-gray-200 bg-white text-zinc-600 hover:bg-slate-100'
												}`}
											>
												{page}
											</button>
										)
									)}
									<button
										onClick={() =>
											setCurrentPage((p) => Math.min(totalPages, p + 1))
										}
										disabled={currentPage === totalPages}
										className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-zinc-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
									>
										<ChevronRight className="h-4 w-4" />
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 4. Footer */}
			<Footer />
		</div>
	);
};

// ============================================================================
// Subcomponents
// ============================================================================

const FilterCard: React.FC<{ title: string; children: React.ReactNode }> = ({
	title,
	children
}) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
			<div
				className="mb-4 flex cursor-pointer items-center justify-between"
				onClick={() => setIsOpen(!isOpen)}
			>
				<h3 className="text-base font-bold text-zinc-900">{title}</h3>
				<ChevronDown
					className={`h-4 w-4 text-zinc-500 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</div>
			{isOpen && <div className="space-y-3">{children}</div>}
		</div>
	);
};

const InstructorListCard: React.FC<{
	instructor: Instructor;
	isFavorite: boolean;
	onToggleFavorite: () => void;
}> = ({ instructor, isFavorite, onToggleFavorite }) => {
	return (
		<div className="relative flex flex-col items-start gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md md:flex-row md:items-center">
			{/* Avatar & Wishlist Button */}
			<div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-zinc-100 md:w-48">
				<img
					src={instructor.avatar}
					alt={instructor.name}
					className="h-full w-full object-cover"
				/>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onToggleFavorite();
					}}
					className="absolute top-3 left-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-xs backdrop-blur-xs transition-colors hover:text-rose-500"
				>
					<Heart
						className={`h-4 w-4 ${
							isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-600'
						}`}
					/>
				</button>
			</div>

			{/* Details */}
			<div className="flex w-full flex-1 flex-col justify-between gap-3">
				<div>
					<div className="flex items-start justify-between gap-2">
						<div>
							<h3 className="cursor-pointer text-lg font-bold text-zinc-900 transition-colors hover:text-rose-500">
								{instructor.name}
							</h3>
							<p className="text-sm text-zinc-500">{instructor.role}</p>
						</div>
						<div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
							<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
							<span>
								{instructor.rating} ({instructor.reviewCount} Reviews)
							</span>
						</div>
					</div>
					<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
						{instructor.bio}
					</p>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-3">
					<div className="flex items-center gap-5 text-xs font-medium text-zinc-500">
						<span className="flex items-center gap-1.5 text-rose-600">
							<BookOpen className="h-3.5 w-3.5" />
							{instructor.lessonCount}+ Lessons
						</span>
						<span className="flex items-center gap-1.5 text-indigo-900">
							<Clock className="h-3.5 w-3.5" />
							{instructor.duration}
						</span>
						<span className="flex items-center gap-1.5 text-rose-600">
							<Users className="h-3.5 w-3.5" />
							{instructor.studentCount} Students
						</span>
					</div>

					<div className="flex items-center gap-2">
						{instructor.tags.map((tag) => (
							<span
								key={tag}
								className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-zinc-700"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const InstructorGridCard: React.FC<{
	instructor: Instructor;
	isFavorite: boolean;
	onToggleFavorite: () => void;
}> = ({ instructor, isFavorite, onToggleFavorite }) => {
	return (
		<div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
			<div className="relative h-44 w-full overflow-hidden rounded-lg bg-zinc-100">
				<img
					src={instructor.avatar}
					alt={instructor.name}
					className="h-full w-full object-cover"
				/>
				<button
					onClick={onToggleFavorite}
					className="absolute top-3 left-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-xs backdrop-blur-xs transition-colors hover:text-rose-500"
				>
					<Heart
						className={`h-4 w-4 ${
							isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-600'
						}`}
					/>
				</button>
			</div>

			<div>
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-base font-bold text-zinc-900">{instructor.name}</h3>
						<p className="text-xs text-zinc-500">{instructor.role}</p>
					</div>
					<div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
						<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
						<span>{instructor.rating}</span>
					</div>
				</div>
				<p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">
					{instructor.bio}
				</p>
			</div>

			<div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-zinc-500">
				<span>{instructor.lessonCount}+ Lessons</span>
				<span>{instructor.duration}</span>
				<span>{instructor.studentCount} Students</span>
			</div>
		</div>
	);
};

const Header: React.FC = () => {
	return (
		<header className="w-full border-b border-slate-100 bg-white">
			{/* Top bar */}
			<div className="bg-gray-900 px-4 py-2 text-xs text-gray-300">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
					<div className="flex items-center gap-6">
						<span className="flex items-center gap-1.5">
							<MapPin className="h-3.5 w-3.5 text-zinc-400" /> 1442 Crosswind Drive
							Madisonville
						</span>
						<span className="flex items-center gap-1.5">
							<Phone className="h-3.5 w-3.5 text-zinc-400" /> +1 45887 77874
						</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="cursor-pointer hover:text-white">ENG</span>
						<span>|</span>
						<span className="cursor-pointer hover:text-white">USD</span>
					</div>
				</div>
			</div>

			{/* Main Nav */}
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-xl font-bold text-indigo-900">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-900 font-black text-white">
							D
						</div>
						<span>DreamsLMS</span>
					</div>
				</div>

				<nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
					<a href="#" className="transition-colors hover:text-rose-500">
						Home
					</a>
					<a href="#" className="transition-colors hover:text-rose-500">
						Courses
					</a>
					<a href="#" className="font-semibold text-rose-500">
						Instructors
					</a>
					<a href="#" className="transition-colors hover:text-rose-500">
						Pages
					</a>
					<a href="#" className="transition-colors hover:text-rose-500">
						Blog
					</a>
					<a href="#" className="transition-colors hover:text-rose-500">
						Contact us
					</a>
				</nav>

				<div className="flex items-center gap-3">
					<button className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-slate-200">
						Sign In
					</button>
					<button className="rounded-full bg-rose-500 px-4 py-1.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-rose-600">
						Register
					</button>
				</div>
			</div>
		</header>
	);
};

const Footer: React.FC = () => {
	return (
		<footer className="mt-auto border-t border-neutral-200 bg-white">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{/* Col 1 */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-xl font-bold text-indigo-900">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-900 font-black text-white">
								D
							</div>
							<span>DreamsLMS</span>
						</div>
						<p className="text-sm leading-relaxed text-zinc-600">
							Platform designed to help organizations, educators, and learners manage,
							deliver, and track learning activities.
						</p>
					</div>

					{/* Col 2 */}
					<div className="space-y-3">
						<h4 className="text-base font-bold text-zinc-900">For Instructor</h4>
						<ul className="space-y-2 text-sm text-zinc-600">
							<li>
								<a href="#" className="hover:text-rose-500">
									Search Mentors
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Login
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Register
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Booking
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Students Dashboard
								</a>
							</li>
						</ul>
					</div>

					{/* Col 3 */}
					<div className="space-y-3">
						<h4 className="text-base font-bold text-zinc-900">For Student</h4>
						<ul className="space-y-2 text-sm text-zinc-600">
							<li>
								<a href="#" className="hover:text-rose-500">
									Appointments
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Chat
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Login
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Register
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-rose-500">
									Instructor Dashboard
								</a>
							</li>
						</ul>
					</div>

					{/* Col 4 */}
					<div className="space-y-4">
						<h4 className="text-base font-bold text-zinc-900">Newsletter</h4>
						<div className="flex items-center rounded-full border border-gray-200 bg-white p-1 pl-4 shadow-xs">
							<input
								type="email"
								placeholder="Enter your email address"
								className="w-full text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none"
							/>
							<button className="rounded-full bg-indigo-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-800">
								Subscribe
							</button>
						</div>
						<div className="space-y-2 pt-2 text-xs text-zinc-600">
							<p className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-indigo-900" />
								3556 Beech Street, San Francisco, CA 94108
							</p>
							<p className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-rose-500" />
								dreamslms@example.com
							</p>
							<p className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-orange-400" />
								+19 123-456-7890
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="bg-indigo-900 px-4 py-4 text-xs text-white">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
					<span>© 2025 DreamsLMS. All rights reserved.</span>
					<div className="flex items-center gap-4">
						<a href="#" className="hover:underline">
							Terms & Conditions
						</a>
						<span>|</span>
						<a href="#" className="hover:underline">
							Privacy Policy
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default InstructorListPage;
