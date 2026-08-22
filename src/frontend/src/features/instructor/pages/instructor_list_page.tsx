import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
	RotateCcw,
	Check
} from 'lucide-react';

export interface Instructor {
	id: number;
	name: string;
	role: string;
	bio: string;
	rating: number;
	reviewCount: number;
	lessonCount: number;
	duration: string;
	durationHours: number;
	studentCount: number;
	tags: string[];
	avatar: string;
	category: string;
	level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	priceType: 'Free' | 'Paid';
	price: number;
	isFavorite?: boolean;
}

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
		durationHours: 169,
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
		durationHours: 15,
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
		durationHours: 2.4,
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
		name: 'Jenny Wilson',
		role: 'Frontend Instructor',
		bio: 'Specialized in React, Vue, UI Engineering and building high performance design systems from scratch.',
		rating: 4.8,
		reviewCount: 245,
		lessonCount: 30,
		duration: '24hr 40min',
		durationHours: 24.6,
		studentCount: 68,
		tags: ['React', 'TypeScript', 'Frontend'],
		avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
		category: 'Frontend',
		level: 'Intermediate',
		priceType: 'Paid',
		price: 59,
		isFavorite: false
	},
	{
		id: 5,
		name: 'Ronald Richard',
		role: 'Algorithm Expert',
		bio: 'Competitive programmer and senior tutor mentoring 1,000+ candidates for FAANG & Big Tech tech interviews.',
		rating: 4.9,
		reviewCount: 310,
		lessonCount: 45,
		duration: '32hr 15min',
		durationHours: 32.2,
		studentCount: 110,
		tags: ['Algorithms', 'Data Structures', 'Python'],
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
		category: 'Algorithms',
		level: 'Expert',
		priceType: 'Paid',
		price: 79,
		isFavorite: true
	},
	{
		id: 6,
		name: 'Edythe Andrew',
		role: 'Fullstack Architect',
		bio: 'Microservices architect focusing on Spring Boot, Go, Kubernetes, event-driven streaming and cloud infrastructure.',
		rating: 4.7,
		reviewCount: 180,
		lessonCount: 18,
		duration: '5hr 50min',
		durationHours: 5.8,
		studentCount: 42,
		tags: ['Fullstack', 'DevOps', 'Docker'],
		avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
		category: 'Backend',
		level: 'Advanced',
		priceType: 'Paid',
		price: 69,
		isFavorite: false
	}
];

export const InstructorListPage: React.FC = () => {
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
	const [selectedPriceType, setSelectedPriceType] = useState<string>('All');
	const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<number>(100);
	const [sortBy, setSortBy] = useState('Highest Rated');
	const [currentPage, setCurrentPage] = useState(1);
	const [favorites, setFavorites] = useState<Record<number, boolean>>({ 2: true, 5: true });

	const toggleFavorite = (id: number) => {
		setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setSelectedCategories([]);
		setSelectedDurations([]);
		setSelectedPriceType('All');
		setSelectedLevels([]);
		setPriceRange(100);
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
			// Duration (Length of Lesson)
			if (selectedDurations.length > 0) {
				const matchesDuration = selectedDurations.some((dur) => {
					if (dur === '0-2 Hours') return inst.durationHours <= 2;
					if (dur === '3-6 Hours') return inst.durationHours > 2 && inst.durationHours <= 6;
					if (dur === '7-16 Hours') return inst.durationHours > 6 && inst.durationHours <= 16;
					if (dur === '17+ Hours') return inst.durationHours > 16;
					return true;
				});
				if (!matchesDuration) return false;
			}
			// Price Type
			if (selectedPriceType !== 'All' && inst.priceType !== selectedPriceType) {
				return false;
			}
			// Max Price Slider
			if (inst.price > priceRange) {
				return false;
			}
			// Level
			if (selectedLevels.length > 0 && !selectedLevels.includes(inst.level)) {
				return false;
			}
			return true;
		});
	}, [searchTerm, selectedCategories, selectedDurations, selectedPriceType, priceRange, selectedLevels]);

	const itemsPerPage = 6;
	const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage) || 1;
	const paginatedInstructors = filteredInstructors.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			
			{/* 1. Hero Breadcrumb Banner (Unified style) */}
			<div className="w-full bg-gradient-to-r from-indigo-900 to-indigo-950 py-8">
				<div className="max-w-[1340px] w-full mx-auto px-6 flex justify-between items-center">
					<div className="flex flex-col gap-1">
						<h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
							Instructor Directory
						</h1>
						<div className="flex items-center gap-1.5 text-xs text-slate-300">
							<Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
								Dashboard
							</Link>
							<span className="text-slate-400">&gt;</span>
							<span className="text-white font-semibold">Instructors</span>
						</div>
					</div>
				</div>
			</div>

			{/* 2. Main Core Content Area (max-w-[1340px] centered) */}
			<div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex-1 flex flex-col">
				
				{/* Top Toolbar */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-base font-bold text-zinc-900">
							<SlidersHorizontal className="w-4 h-4 text-indigo-900" />
							<span>Filters</span>
						</div>
						<button
							onClick={handleClearFilters}
							className="text-xs font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer transition-colors"
						>
							Reset all
						</button>
					</div>

					<div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
						<span className="text-xs text-neutral-500 font-medium">
							Showing 1–{paginatedInstructors.length} of {filteredInstructors.length} instructors
						</span>

						{/* Grid / List Switcher */}
						<div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 shadow-xs">
							<button
								onClick={() => setViewMode('grid')}
								className={`p-1.5 rounded-md cursor-pointer transition-colors ${
									viewMode === 'grid'
										? 'bg-rose-500 text-white shadow-xs'
										: 'text-neutral-500 hover:bg-slate-100'
								}`}
								title="Grid View"
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={`p-1.5 rounded-md cursor-pointer transition-colors ${
									viewMode === 'list'
										? 'bg-rose-500 text-white shadow-xs'
										: 'text-neutral-500 hover:bg-slate-100'
								}`}
								title="List View"
							>
								<ListIcon className="w-4 h-4" />
							</button>
						</div>

						{/* Sort Dropdown */}
						<div className="relative">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="appearance-none bg-white border border-neutral-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-zinc-800 shadow-xs focus:ring-2 focus:ring-indigo-900/20 focus:outline-none cursor-pointer"
							>
								<option value="Highest Rated">Sort: Highest Rated</option>
								<option value="Most Popular">Sort: Most Popular</option>
								<option value="Newly Published">Sort: Newly Published</option>
							</select>
							<ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
						</div>

						{/* Search Input */}
						<div className="relative w-full sm:w-56">
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search instructor..."
								className="w-full bg-white border border-neutral-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder:text-neutral-400 shadow-xs focus:ring-2 focus:ring-indigo-900/20 focus:outline-none"
							/>
							<Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
						</div>
					</div>
				</div>

				{/* Main Layout Grid (Left Sidebar Filters + Right Instructors Grid) */}
				<div className="flex flex-col lg:flex-row items-start gap-8 mt-6">
					
					{/* Left: Filter Sidebar */}
					<div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
						
						{/* 1. Filter: Categories */}
						<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
							<h3 className="text-sm font-bold text-zinc-900 border-b border-slate-100 pb-2">
								Categories
							</h3>
							{['Backend', 'Frontend', 'IT & Software', 'Algorithms', 'General'].map((cat) => (
								<label
									key={cat}
									className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-zinc-900 cursor-pointer select-none"
								>
									<input
										type="checkbox"
										checked={selectedCategories.includes(cat)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedCategories([...selectedCategories, cat]);
											} else {
												setSelectedCategories(selectedCategories.filter((c) => c !== cat));
											}
										}}
										className="w-4 h-4 rounded border-neutral-300 text-indigo-900 focus:ring-indigo-900/20 cursor-pointer"
									/>
									<span>{cat}</span>
								</label>
							))}
						</div>

						{/* 2. Filter: Length of Lesson (Replaced instructor names) */}
						<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
							<h3 className="text-sm font-bold text-zinc-900 border-b border-slate-100 pb-2">
								Length of Lesson
							</h3>
							{['0-2 Hours', '3-6 Hours', '7-16 Hours', '17+ Hours'].map((dur) => (
								<label
									key={dur}
									className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-zinc-900 cursor-pointer select-none"
								>
									<input
										type="checkbox"
										checked={selectedDurations.includes(dur)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedDurations([...selectedDurations, dur]);
											} else {
												setSelectedDurations(selectedDurations.filter((d) => d !== dur));
											}
										}}
										className="w-4 h-4 rounded border-neutral-300 text-indigo-900 focus:ring-indigo-900/20 cursor-pointer"
									/>
									<span>{dur}</span>
								</label>
							))}
						</div>

						{/* 3. Filter: Price & Range Slider (Fixed formatted display) */}
						<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
							<h3 className="text-sm font-bold text-zinc-900 border-b border-slate-100 pb-2">
								Price Type
							</h3>
							<div className="flex flex-col gap-2">
								{['All', 'Free', 'Paid'].map((pt) => (
									<label
										key={pt}
										className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-zinc-900 cursor-pointer select-none"
									>
										<input
											type="radio"
											name="priceType"
											checked={selectedPriceType === pt}
											onChange={() => setSelectedPriceType(pt)}
											className="w-4 h-4 text-indigo-900 focus:ring-indigo-900/20 cursor-pointer"
										/>
										<span>{pt === 'All' ? 'All Prices' : pt}</span>
									</label>
								))}
							</div>

							<div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
								<div className="flex justify-between items-center text-xs">
									<span className="font-semibold text-neutral-500">Max Price:</span>
									<span className="font-bold text-indigo-900">${`${priceRange.toLocaleString()}`}</span>
								</div>
								<input
									type="range"
									min={0}
									max={100}
									step={5}
									value={priceRange}
									onChange={(e) => setPriceRange(Number(e.target.value))}
									className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
								/>
								<div className="flex justify-between text-[10px] text-neutral-400">
									<span>$0</span>
									<span>$100</span>
								</div>
							</div>
						</div>

						{/* 4. Filter: Level */}
						<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
							<h3 className="text-sm font-bold text-zinc-900 border-b border-slate-100 pb-2">
								Experience Level
							</h3>
							{['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => (
								<label
									key={lvl}
									className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-zinc-900 cursor-pointer select-none"
								>
									<input
										type="checkbox"
										checked={selectedLevels.includes(lvl)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedLevels([...selectedLevels, lvl]);
											} else {
												setSelectedLevels(selectedLevels.filter((l) => l !== lvl));
											}
										}}
										className="w-4 h-4 rounded border-neutral-300 text-indigo-900 focus:ring-indigo-900/20 cursor-pointer"
									/>
									<span>{lvl}</span>
								</label>
							))}
						</div>

					</div>

					{/* Right: Instructors Grid / List */}
					<div className="flex-1 w-full">
						{paginatedInstructors.length === 0 ? (
							<div className="w-full h-80 flex flex-col justify-center items-center text-center p-8 bg-white rounded-2xl border border-neutral-200">
								<Users className="w-12 h-12 text-indigo-900/30 mb-3" />
								<h4 className="text-indigo-950 text-base font-bold">No instructors found</h4>
								<p className="text-neutral-500 text-xs mt-1">
									Try adjusting your filters or search keywords.
								</p>
								<button
									onClick={handleClearFilters}
									className="mt-4 px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-950 transition-colors"
								>
									Reset Filters
								</button>
							</div>
						) : viewMode === 'grid' ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
								{paginatedInstructors.map((inst) => (
									<div
										key={inst.id}
										className="bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
									>
										{/* Image Container */}
										<div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
											<img
												src={inst.avatar}
												alt={inst.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
											{/* Favorite Heart Button */}
											<button
												onClick={() => toggleFavorite(inst.id)}
												className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 hover:scale-110 transition-transform shadow-sm cursor-pointer"
												title={favorites[inst.id] ? 'Remove from favorites' : 'Add to favorites'}
											>
												<Heart
													className={`w-4 h-4 ${
														favorites[inst.id] ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
													}`}
												/>
											</button>
											{/* Level Badge */}
											<div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide uppercase">
												{inst.level}
											</div>
										</div>

										{/* Content */}
										<div className="p-5 flex-1 flex flex-col justify-between gap-4">
											<div className="flex flex-col gap-1.5">
												<div className="flex items-center justify-between">
													<span className="text-xs font-semibold text-rose-500">{inst.role}</span>
													<div className="flex items-center gap-1 text-xs font-bold text-amber-500">
														<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
														<span>{inst.rating}</span>
														<span className="text-neutral-400 font-normal">({inst.reviewCount})</span>
													</div>
												</div>
												<h4 className="text-base font-bold text-zinc-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
													{inst.name}
												</h4>
												<p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
													{inst.bio}
												</p>
											</div>

											{/* Metadata footer */}
											<div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-neutral-500">
												<div className="flex items-center gap-3">
													<div className="flex items-center gap-1">
														<BookOpen className="w-3.5 h-3.5 text-neutral-400" />
														<span>{inst.lessonCount} Lessons</span>
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-3.5 h-3.5 text-neutral-400" />
														<span>{inst.duration}</span>
													</div>
												</div>
												<span className="font-bold text-sm text-indigo-950">
													{inst.price === 0 ? 'Free' : `$${inst.price}`}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							/* List View */
							<div className="flex flex-col gap-4">
								{paginatedInstructors.map((inst) => (
									<div
										key={inst.id}
										className="bg-white rounded-2xl border border-neutral-200 hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 group"
									>
										<div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
											<img
												src={inst.avatar}
												alt={inst.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform"
											/>
										</div>

										<div className="flex-1 flex flex-col gap-1 min-w-0">
											<div className="flex items-center justify-between">
												<span className="text-xs font-semibold text-rose-500">{inst.role}</span>
												<div className="flex items-center gap-1 text-xs font-bold text-amber-500">
													<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
													<span>{inst.rating}</span>
													<span className="text-neutral-400 font-normal">({inst.reviewCount})</span>
												</div>
											</div>
											<h4 className="text-base font-bold text-zinc-900 group-hover:text-indigo-900 transition-colors">
												{inst.name}
											</h4>
											<p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
												{inst.bio}
											</p>
											<div className="flex items-center gap-4 mt-2 text-xs text-neutral-400 font-medium">
												<span>{inst.lessonCount} Lessons</span>
												<span>•</span>
												<span>{inst.duration}</span>
												<span>•</span>
												<span>{inst.studentCount} Students</span>
											</div>
										</div>

										<div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
											<span className="font-bold text-base text-indigo-950">
												{inst.price === 0 ? 'Free' : `$${inst.price}`}
											</span>
											<button
												onClick={() => toggleFavorite(inst.id)}
												className="p-2 rounded-full border border-neutral-200 hover:bg-slate-50 text-rose-500 cursor-pointer"
											>
												<Heart
													className={`w-4 h-4 ${
														favorites[inst.id] ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
													}`}
												/>
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<div className="mt-8 flex justify-center items-center gap-2">
								<button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`w-9 h-9 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
											currentPage === page
												? 'bg-rose-500 text-white shadow-xs'
												: 'bg-white border border-neutral-200 text-zinc-700 hover:bg-slate-50'
										}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						)}
					</div>

				</div>

			</div>

		</div>
	);
};
