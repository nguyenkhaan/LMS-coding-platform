import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, Star, BookOpen, Clock, Heart, ChevronDown, ChevronLeft, ChevronRight, Code2 } from 'lucide-react';
import { toast } from 'sonner';

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  role: string;
  slug: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  rating: number;
  reviewsCount: number;
  lessonsCount: number;
  duration: string;
  price: string;
  isFree: boolean;
  thumbnailColor: string;
}

const COURSES_MOCK: CourseItem[] = [
  {
    id: 'c1',
    title: 'Python Foundations for Problem Solving & Algorithms',
    instructor: 'Rolands Granger',
    role: 'Senior Backend Developer',
    slug: 'python-foundations',
    category: 'Programming Language',
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 200,
    lessonsCount: 12,
    duration: '169hr 20min',
    price: '890.000 ₫',
    isFree: false,
    thumbnailColor: 'from-indigo-900 to-blue-900'
  },
  {
    id: 'c2',
    title: 'Financial Modeling & Quantitative Trading in Python',
    instructor: 'Lisa Lopez',
    role: 'Quant Finance Expert',
    slug: 'financial-modeling',
    category: 'Backend',
    level: 'Intermediate',
    rating: 4.4,
    reviewsCount: 130,
    lessonsCount: 22,
    duration: '15hr 06min',
    price: '1.290.000 ₫',
    isFree: false,
    thumbnailColor: 'from-emerald-900 to-teal-900'
  },
  {
    id: 'c3',
    title: 'Cloud Architecture & Kubernetes Microservices',
    instructor: 'Charles Ruiz',
    role: 'Cloud Solutions Architect',
    slug: 'cloud-architecture',
    category: 'Technology',
    level: 'Advanced',
    rating: 4.5,
    reviewsCount: 120,
    lessonsCount: 16,
    duration: '2hr 25min',
    price: '1.490.000 ₫',
    isFree: false,
    thumbnailColor: 'from-sky-900 to-indigo-900'
  },
  {
    id: 'c4',
    title: 'Modern Full-Stack Development with React & TypeScript',
    instructor: 'Rogerina Grogan',
    role: 'Frontend Specialist',
    slug: 'react-typescript',
    category: 'Frontend',
    level: 'Intermediate',
    rating: 4.6,
    reviewsCount: 180,
    lessonsCount: 6,
    duration: '19hr 30min',
    price: '990.000 ₫',
    isFree: false,
    thumbnailColor: 'from-purple-900 to-indigo-950'
  },
  {
    id: 'c5',
    title: 'Enterprise Software Architecture & Clean Architecture',
    instructor: 'Ivana Tow',
    role: 'Lead Architect',
    slug: 'clean-architecture',
    category: 'IT & Software',
    level: 'Expert',
    rating: 4.2,
    reviewsCount: 210,
    lessonsCount: 25,
    duration: '4hr 20min',
    price: '1.890.000 ₫',
    isFree: false,
    thumbnailColor: 'from-slate-900 to-indigo-900'
  },
  {
    id: 'c6',
    title: 'Data Structures & Algorithms Interview Mastery (OJ)',
    instructor: 'Kevin Leonard',
    role: 'Competitive Programmer',
    slug: 'dsa-interview-prep',
    category: 'Programming Language',
    level: 'Advanced',
    rating: 4.5,
    reviewsCount: 140,
    lessonsCount: 11,
    duration: '7hr 10min',
    price: '1.190.000 ₫',
    isFree: false,
    thumbnailColor: 'from-amber-950 to-indigo-950'
  },
  {
    id: 'c7',
    title: 'Modern CSS & Responsive Design System with Tailwind',
    instructor: 'David Rocco',
    role: 'UI/UX Engineer',
    slug: 'modern-css-design',
    category: 'CSS',
    level: 'Beginner',
    rating: 4.1,
    reviewsCount: 170,
    lessonsCount: 4,
    duration: '1hr 30min',
    price: 'Free',
    isFree: true,
    thumbnailColor: 'from-rose-950 to-indigo-950'
  },
  {
    id: 'c8',
    title: 'DevOps CI/CD Pipelines with Docker & GitHub Actions',
    instructor: 'Jeanette Dulaney',
    role: 'DevOps Lead',
    slug: 'devops-cicd',
    category: 'General',
    level: 'Intermediate',
    rating: 4.7,
    reviewsCount: 220,
    lessonsCount: 8,
    duration: '4hr 35min',
    price: '790.000 ₫',
    isFree: false,
    thumbnailColor: 'from-blue-950 to-cyan-950'
  },
  {
    id: 'c9',
    title: 'High-Performance Web Applications & Web Vitals',
    instructor: 'Debran Andrew',
    role: 'Performance Engineer',
    slug: 'web-performance',
    category: 'Technology',
    level: 'Advanced',
    rating: 4.3,
    reviewsCount: 190,
    lessonsCount: 10,
    duration: '2hr 56min',
    price: 'Free',
    isFree: true,
    thumbnailColor: 'from-teal-950 to-indigo-950'
  }
];

export function CourseCatalogPage() {
  const navigate = useNavigate();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>(['Nicole Brown']);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favoriteCourseIds, setFavoriteCourseIds] = useState<string[]>(['c2']);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleInstructor = (inst: string) => {
    setSelectedInstructors((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteCourseIds((prev) => {
      const exists = prev.includes(id);
      toast.success(exists ? 'Removed from favorites' : 'Added to favorites');
      return exists ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedInstructors([]);
    setPriceFilter('all');
    setSelectedLevels([]);
    setSearchQuery('');
    toast.info('Filters reset to default.');
  };

  // Filtered List
  const filteredCourses = COURSES_MOCK.filter((course) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchInst = course.instructor.toLowerCase().includes(q);
      if (!matchTitle && !matchInst) return false;
    }

    if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
      return false;
    }

    if (priceFilter === 'free' && !course.isFree) return false;
    if (priceFilter === 'paid' && course.isFree) return false;

    if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
      return false;
    }

    return true;
  });

  return (
    <div className="w-full min-h-screen bg-slate-100 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. HERO TITLE BANNER (bg-gradient-to-r from-red-50 via-sky-50 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Courses</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Course Catalog</span>
        </div>
      </div>

      {/* 2. MAIN CONTAINER (max-w-[1560px]) */}
      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col gap-6">
        
        {/* TOP CONTROLS ROW */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-neutral-200">
          
          {/* Left: Filter title & Clear button */}
          <div className="w-full lg:w-80 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-zinc-900" />
              <h2 className="text-zinc-900 text-xl font-bold tracking-tight">Filters</h2>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-rose-500 hover:text-rose-600 text-sm font-semibold underline transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Right: Showing results count + View Toggle + Sort dropdown + Search Input */}
          <div className="flex-1 w-full flex flex-wrap justify-between items-center gap-4">
            <span className="text-zinc-700 text-sm font-medium">
              Showing 1-{filteredCourses.length} of {COURSES_MOCK.length} results
            </span>

            <div className="flex flex-wrap items-center gap-3">
              {/* Grid / List View Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200 shadow-2xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-rose-500 text-white' : 'text-zinc-600 hover:bg-slate-100'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-rose-500 text-white' : 'text-zinc-600 hover:bg-slate-100'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort By Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'popular')}
                className="h-9 px-3 rounded-lg border border-neutral-200 bg-white text-zinc-800 text-xs font-medium focus:outline-none focus:border-indigo-900 shadow-2xs cursor-pointer"
              >
                <option value="newest">Newly Published</option>
                <option value="rating">Top Rated (4.5+)</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input maxLength={100}
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 pr-3 w-48 sm:w-60 rounded-lg border border-neutral-200 bg-white text-zinc-900 text-xs focus:outline-none focus:border-indigo-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

        </div>

        {/* 2-COLUMN BODY: Left Filter Sidebar + Right Course Grid */}
        <div className="flex flex-col lg:flex-row justify-start items-start gap-8">
          
          {/* LEFT FILTER SIDEBAR (w-80) */}
          <aside className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
            
            {/* Card 1: Categories */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Categories</h3>
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex flex-col gap-2.5 text-sm text-neutral-600">
                {[
                  { name: 'Backend', count: 3 },
                  { name: 'CSS', count: 2 },
                  { name: 'Frontend', count: 2 },
                  { name: 'General', count: 2 },
                  { name: 'IT & Software', count: 2 },
                  { name: 'Programming Language', count: 3 },
                  { name: 'Technology', count: 2 }
                ].map((item) => (
                  <label
                    key={item.name}
                    className="flex items-center justify-between cursor-pointer hover:text-zinc-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(item.name)}
                        onChange={() => toggleCategory(item.name)}
                        className="w-4 h-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400">({item.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card 2: Instructors */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Instructors</h3>
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex flex-col gap-2.5 text-sm text-neutral-600">
                {[
                  { name: 'Keny White', count: 10 },
                  { name: 'Hinata Hyuga', count: 5 },
                  { name: 'John Doe', count: 3 },
                  { name: 'Nicole Brown', count: 8 }
                ].map((item) => (
                  <label
                    key={item.name}
                    className="flex items-center justify-between cursor-pointer hover:text-zinc-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedInstructors.includes(item.name)}
                        onChange={() => toggleInstructor(item.name)}
                        className="w-4 h-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400">({item.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card 3: Price */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Price</h3>
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex flex-col gap-2.5 text-sm text-neutral-600">
                {[
                  { id: 'all', label: 'All', count: 10 },
                  { id: 'free', label: 'Free', count: 5 },
                  { id: 'paid', label: 'Paid', count: 3 }
                ].map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center justify-between cursor-pointer hover:text-zinc-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={priceFilter === p.id}
                        onChange={() => setPriceFilter(p.id as 'all' | 'free' | 'paid')}
                        className="w-4 h-4 text-rose-500 focus:ring-rose-500 cursor-pointer"
                      />
                      <span>{p.label}</span>
                    </div>
                    <span className="text-xs text-neutral-400">({p.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card 4: Level */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Level</h3>
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex flex-col gap-2.5 text-sm text-neutral-600">
                {[
                  { name: 'Beginner', count: 10 },
                  { name: 'Intermediate', count: 5 },
                  { name: 'Advanced', count: 21 },
                  { name: 'Expert', count: 3 }
                ].map((lvl) => (
                  <label
                    key={lvl.name}
                    className="flex items-center justify-between cursor-pointer hover:text-zinc-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(lvl.name)}
                        onChange={() => toggleLevel(lvl.name)}
                        className="w-4 h-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                      />
                      <span>{lvl.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400">({lvl.count})</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* RIGHT COURSE GRID (flex-1) */}
          <div className="flex-1 w-full flex flex-col gap-8">
            
            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-10 h-10 text-neutral-400 stroke-1" />
                <h3 className="text-zinc-900 text-lg font-bold">No courses match your filter criteria</h3>
                <p className="text-neutral-500 text-sm">Try clearing some filters or searching for different keywords.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-2 px-5 py-2 bg-indigo-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-950 cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.slug}`)}
                    className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between group cursor-pointer relative"
                  >
                    {/* Thumbnail / Card Graphic Banner */}
                    <div className={`h-40 bg-gradient-to-r ${course.thumbnailColor} p-4 flex items-center justify-center relative`}>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                        <Code2 className="w-7 h-7 text-white" />
                      </div>

                      {/* Favorite Heart Icon Button */}
                      <button
                        onClick={(e) => toggleFavorite(course.id, e)}
                        className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer absolute top-3 right-3 ${
                          favoriteCourseIds.includes(course.id) ? 'text-rose-500' : 'text-neutral-400 hover:text-rose-500'
                        }`}
                        title="Favorite"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favoriteCourseIds.includes(course.id) ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>

                      {/* Category Badge */}
                      <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold rounded-md uppercase">
                        {course.category}
                      </span>

                      {/* Price Badge */}
                      <span className={`absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md text-xs font-bold font-mono ${
                        course.isFree ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-900 shadow-xs'
                      }`}>
                        {course.price}
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      
                      <div className="flex flex-col gap-1.5">
                        {/* Rating Row */}
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-zinc-900 font-mono">{course.rating}</span>
                          </div>
                          <span>({course.reviewsCount} Reviews)</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-zinc-900 text-base font-bold line-clamp-2 leading-snug group-hover:text-indigo-950 transition-colors">
                          {course.title}
                        </h3>

                        {/* Instructor & Domain */}
                        <div className="text-xs text-neutral-500 font-medium">
                          <span>{course.instructor}</span> · <span className="text-neutral-400">{course.role}</span>
                        </div>
                      </div>

                      {/* Metadata Row: Lessons count + Duration */}
                      <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                          <span className="font-medium">{course.lessonsCount}+ Lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-900" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="pt-6 border-t border-neutral-200 flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">
                Page {currentPage} of 2
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 1
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 2
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-zinc-700'
                  }`}
                >
                  2
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                  disabled={currentPage === 2}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
