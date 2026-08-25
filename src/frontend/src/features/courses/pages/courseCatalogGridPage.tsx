import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, ChevronDown } from 'lucide-react';
import { CourseCatalogHero } from '../components/courseCatalogHero.tsx';
import { CourseCatalogFilters } from '../components/courseCatalogFilters.tsx';
import { CourseCatalogCard } from '../components/courseCatalogCard.tsx';
import { PaginationControls } from '../components/paginationControls.tsx';
import { CourseCatalogItem } from '../model/courseCatalogItem.ts';

// 20 Mock Courses based on Figma Catalog contents
const MOCK_COURSES: Omit<CourseCatalogItem, 'id'>[] = [
	{
		title: "Python Foundations for Problem Solving",
		category: "Programming",
		level: "Beginner",
		description: "Syntax, data structures and 120 guided judge problems.",
		lessons: 42,
		duration: "18h",
		enrolled: 12480,
		rating: 4.8,
		instructor: "Lê Quang Huy",
		price: 49
	},
	{
		title: "Data Structures & Algorithms Interview Prep",
		category: "Interview",
		level: "Intermediate",
		description: "Patterns, complexity analysis and 200 timed challenges.",
		lessons: 68,
		duration: "32h",
		enrolled: 8930,
		rating: 4.9,
		instructor: "Nguyễn Thu Hà",
		price: 89
	},
	{
		title: "Production React & State Management",
		category: "Frontend",
		level: "Intermediate",
		description: "Vite, Tailwind, Redux Toolkit, and performance tuning.",
		lessons: 54,
		duration: "24h",
		enrolled: 7210,
		rating: 4.8,
		instructor: "Jenny Wilson",
		price: 59
	},
	{
		title: "System Design for Backend Engineers",
		category: "Backend",
		level: "Advanced",
		description: "Scalability, caching, queues and real interview case studies.",
		lessons: 36,
		duration: "22h",
		enrolled: 4210,
		rating: 4.9,
		instructor: "Phạm Anh Khoa",
		price: 99
	},
	{
		title: "SQL Mastery with Real Datasets",
		category: "Data",
		level: "Beginner",
		description: "Joins, window functions and query tuning on live databases.",
		lessons: 30,
		duration: "14h",
		enrolled: 9740,
		rating: 4.6,
		instructor: "Đỗ Thanh Mai",
		price: 39
	},
	{
		title: "Python Web Development with Django",
		category: "Backend",
		level: "Intermediate",
		description: "Build robust REST APIs and scalable web architectures.",
		lessons: 48,
		duration: "20h",
		enrolled: 5120,
		rating: 4.7,
		instructor: "Lê Quang Huy",
		price: 69
	},
	{
		title: "Advanced React Patterns & Performance",
		category: "Frontend",
		level: "Advanced",
		description: "Custom hooks, code-splitting, and rendering profiling.",
		lessons: 40,
		duration: "16h",
		enrolled: 3840,
		rating: 4.9,
		instructor: "Jenny Wilson",
		price: 79
	},
	{
		title: "Data Structures & Algorithms - Part II",
		category: "Interview",
		level: "Advanced",
		description: "Graphs, dynamic programming, and advanced tree structures.",
		lessons: 60,
		duration: "28h",
		enrolled: 6200,
		rating: 4.9,
		instructor: "Nguyễn Thu Hà",
		price: 99
	}
];

const ALL_COURSES: CourseCatalogItem[] = Array.from({ length: 20 }, (_, idx) => {
	const template = MOCK_COURSES[idx % MOCK_COURSES.length];
	return {
		...template,
		id: idx + 1,
		title: idx >= MOCK_COURSES.length ? `${template.title} (Vol. ${Math.floor(idx / MOCK_COURSES.length) + 1})` : template.title
	};
});

export const CourseCatalogGridPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const queryParam = searchParams.get('q') || '';
	const [search, setSearch] = useState<string>(queryParam);

	useEffect(() => {
		setSearch(queryParam);
		setCurrentPage(1);
	}, [queryParam]);

	const handleSearch = (val: string) => {
		setSearch(val);
		setSearchParams(val ? { q: val } : {}, { replace: true });
	};

	const [selectedCats, setSelectedCats] = useState<string[]>([]);
	const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
	
	const [favs, setFavs] = useState<Set<number>>(() => {
		const initialFavs = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		return new Set(initialFavs);
	});

	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 9;

	const toggleCat = (cat: string) => {
		setSelectedCats((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		);
		setCurrentPage(1);
	};

	const toggleLevel = (lvl: string) => {
		setSelectedLevels((prev) =>
			prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
		);
		setCurrentPage(1);
	};

	const toggleFav = (id: number) => {
		setFavs((prev) => {
			const copy = new Set(prev);
			if (copy.has(id)) {
				copy.delete(id);
			} else {
				copy.add(id);
			}
			return copy;
		});
	};

	const resetFilters = () => {
		setSearch('');
		setSelectedCats([]);
		setSelectedLevels([]);
		setCurrentPage(1);
	};

	const filteredCourses = useMemo(() => {
		return ALL_COURSES.filter((course) => {
			const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
			const matchesCat = selectedCats.length === 0 || selectedCats.includes(course.category);
			const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
			return matchesSearch && matchesCat && matchesLevel;
		});
	}, [search, selectedCats, selectedLevels]);

	const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));

	const paginatedCourses = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredCourses.slice(start, start + pageSize);
	}, [filteredCourses, currentPage, pageSize]);

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			<CourseCatalogHero />

			{/* Main Core Catalog Section */}
			<div className="w-full max-w-[1340px] mx-auto px-6 py-8 flex flex-col justify-start items-start gap-6">
				{/* Toolbar Header info */}
				<div className="w-full flex justify-between items-center border-b border-slate-100 pb-4">
					<div className="flex flex-col gap-1">
						<h2 className="text-[#392C7D] text-lg font-bold">Courses</h2>
						<span className="text-neutral-500 text-xs">
							{filteredCourses.length} courses matching your selection
						</span>
					</div>
					<div className="text-xs text-neutral-400 font-semibold flex items-center gap-1 cursor-pointer hover:text-zinc-900 transition-colors">
						<span>Sort: Most popular</span>
						<ChevronDown className="w-3.5 h-3.5" />
					</div>
				</div>

				{/* Sidebar & Course Grid Layout */}
				<div className="w-full flex flex-col md:flex-row items-start gap-8 mt-2">
					{/* Left: Filter Sidebar */}
					<CourseCatalogFilters
						search={search}
						setSearch={handleSearch}
						selectedCats={selectedCats}
						toggleCat={toggleCat}
						selectedLevels={selectedLevels}
						toggleLevel={toggleLevel}
						resetFilters={resetFilters}
					/>

					{/* Right: Cards List Grid */}
					<div className="flex-1 w-full">
						{paginatedCourses.length === 0 ? (
							<div className="w-full h-80 flex flex-col justify-center items-center text-center p-8 bg-slate-50 rounded-2xl border border-neutral-200/50">
								<BookOpen className="w-12 h-12 text-[#392C7D]/30 mb-3" />
								<h4 className="text-[#392C7D] text-base font-bold">No courses found</h4>
								<p className="text-neutral-500 text-xs mt-1">Try resetting filters to discover courses.</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
								{paginatedCourses.map((course) => (
									<CourseCatalogCard
										key={course.id}
										course={course}
										isFav={favs.has(course.id)}
										toggleFav={toggleFav}
									/>
								))}
							</div>
						)}
						
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							setCurrentPage={setCurrentPage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
