import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  BookOpen,
  Clock,
  Check,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface Instructor {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  lessonCount: string;
  duration: string;
  image: string;
  category: string;
  level: string;
  priceType: 'free' | 'paid';
  price: number;
}

const INSTRUCTORS_DATA: Instructor[] = [
  {
    id: 1,
    name: 'Rolands Granger',
    role: 'Developer',
    rating: 4.9,
    reviewCount: 200,
    lessonCount: '12+ Lesson',
    duration: '169hr 20min',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    category: 'Backend',
    level: 'Advanced',
    priceType: 'paid',
    price: 49
  },
  {
    id: 2,
    name: 'Lisa Lopez',
    role: 'Finance',
    rating: 4.4,
    reviewCount: 130,
    lessonCount: '22+ Lesson',
    duration: '15hr 06min',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    category: 'General',
    level: 'Intermediate',
    priceType: 'free',
    price: 0
  },
  {
    id: 3,
    name: 'Charles Ruiz',
    role: 'Cloud Engineer',
    rating: 4.5,
    reviewCount: 120,
    lessonCount: '16+ Lesson',
    duration: '2hr 25min',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    category: 'IT & Software',
    level: 'Advanced',
    priceType: 'paid',
    price: 89
  },
  {
    id: 4,
    name: 'Rogerina Grogan',
    role: 'Vocational',
    rating: 4.6,
    reviewCount: 180,
    lessonCount: '06+ Lesson',
    duration: '19hr 30min',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    category: 'Technology',
    level: 'Beginner',
    priceType: 'free',
    price: 0
  },
  {
    id: 5,
    name: 'Ivana Tow',
    role: 'Corporate Trainer',
    rating: 4.2,
    reviewCount: 210,
    lessonCount: '25+ Lesson',
    duration: '4hr 20min',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    category: 'General',
    level: 'Intermediate',
    priceType: 'paid',
    price: 35
  },
  {
    id: 6,
    name: 'Kevin Leonard',
    role: 'Developer',
    rating: 4.5,
    reviewCount: 140,
    lessonCount: '11+ Lesson',
    duration: '7hr 10min',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    category: 'Frontend',
    level: 'Intermediate',
    priceType: 'paid',
    price: 59
  },
  {
    id: 7,
    name: 'David Rocco',
    role: 'Sports Coach',
    rating: 4.1,
    reviewCount: 170,
    lessonCount: '04+ Lesson',
    duration: '1hr 30min',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    category: 'General',
    level: 'Beginner',
    priceType: 'free',
    price: 0
  },
  {
    id: 8,
    name: 'Jeanette Dulaney',
    role: 'Technical Trainer',
    rating: 4.7,
    reviewCount: 220,
    lessonCount: '08+ Lesson',
    duration: '4hr 35min',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80',
    category: 'Programming Language',
    level: 'Expert',
    priceType: 'paid',
    price: 99
  },
  {
    id: 9,
    name: 'Debran Andrew',
    role: 'Health and Wellness',
    rating: 4.3,
    reviewCount: 190,
    lessonCount: '10+ Lesson',
    duration: '2hr 56min',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    category: 'General',
    level: 'Beginner',
    priceType: 'free',
    price: 0
  }
];

export function InstructorListPage() {
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLessonLengths, setSelectedLessonLengths] = useState<string[]>([]);
  const [selectedPriceType, setSelectedPriceType] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(69850);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<number[]>([2]); // Lisa Lopez favorited in mock

  // Toggle Category Filter
  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Toggle Instructor Name Filter
  const handleToggleLessonLength = (len: string) => {
    setSelectedLessonLengths((prev) =>
      prev.includes(len) ? prev.filter((l) => l !== len) : [...prev, len]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLessonLengths([]);
    setSelectedPriceType('all');
    setSelectedLevel('all');
    setPriceRange(69850);
    toast.info('Filters cleared');
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      toast.success(prev.includes(id) ? 'Removed from favorites' : 'Added to favorites');
      return next;
    });
  };

  // Filtered & Sorted list
  const filteredInstructors = useMemo(() => {
    return INSTRUCTORS_DATA.filter((inst) => {
      // Search
      const matchesSearch =
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(inst.category);

      // Price Type
      const matchesPrice =
        selectedPriceType === 'all' || inst.priceType === selectedPriceType;

      // Level
      const matchesLevel =
        selectedLevel === 'all' || inst.level === selectedLevel;

      // Lesson Length
      let matchesLength = true;
      if (selectedLessonLengths.length > 0) {
        const hours = parseInt(inst.duration) || 0;
        matchesLength = selectedLessonLengths.some((range) => {
          if (range === '0-2 Hours') return hours <= 2;
          if (range === '3-6 Hours') return hours >= 3 && hours <= 6;
          if (range === '7-16 Hours') return hours >= 7 && hours <= 16;
          if (range === '17+ Hours') return hours >= 17;
          return true;
        });
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesLevel && matchesLength;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return b.id - a.id;
    });
  }, [searchQuery, selectedCategories, selectedPriceType, selectedLevel, sortBy]);

  return (
    <div className="w-full min-h-screen bg-slate-50 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. HERO TITLE BANNER (bg-gradient-to-r from-red-50 via-sky-50 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Instructor Grid</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Instructor Grid</span>
        </div>
      </div>

      {/* 2. MAIN CONTAINER (max-w-[1340px]) */}
      <div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex flex-col gap-6">
        
        {/* TOP TOOLBAR & CONTROL BAR */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          
          {/* Filters count + Clear button */}
          <div className="w-80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-zinc-900" />
              <span className="text-zinc-900 text-lg font-bold">Filters</span>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-rose-500 hover:text-rose-600 text-sm font-medium underline transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Right Toolbar: Showing count + View Switcher + Sort + Search */}
          <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
            <span className="text-zinc-900 text-sm font-medium">
              Showing 1-{filteredInstructors.length} of 50 results
            </span>

            <div className="flex flex-wrap items-center gap-3">
              
              {/* View Switchers */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-zinc-700 hover:bg-slate-50'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-zinc-700 hover:bg-slate-50'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 pl-3 pr-8 bg-white rounded-md border border-neutral-200 text-zinc-800 text-xs font-medium focus:border-indigo-900 focus:outline-none cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="newest">Newly Published</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search input */}
              <div className="w-56 h-9 px-3 bg-white rounded-md border border-neutral-200 flex items-center gap-2 shadow-2xs">
                <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search instructors..."
                  className="w-full text-xs text-zinc-800 bg-transparent border-none outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN BODY: SIDEBAR FILTERS (w-80) + INSTRUCTOR CARDS */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-6">
          
          {/* LEFT COLUMN: FILTER SIDEBAR (w-80) */}
          <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
            
            {/* 1. CATEGORIES FILTER CARD */}
            <div className="w-full p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Categories</h3>
                <ChevronDown className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Backend', count: 3 },
                  { name: 'CSS', count: 2 },
                  { name: 'Frontend', count: 2 },
                  { name: 'General', count: 2 },
                  { name: 'IT & Software', count: 2 },
                  { name: 'Photography', count: 2 },
                  { name: 'Programming Language', count: 3 },
                  { name: 'Technology', count: 2 }
                ].map((cat) => (
                  <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleToggleCategory(cat.name)}
                      className="w-4 h-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-neutral-600 text-sm group-hover:text-zinc-900 transition-colors">
                      {cat.name} ({cat.count})
                    </span>
                  </label>
                ))}
                <button
                  type="button"
                  className="text-left text-rose-500 hover:text-rose-600 text-xs font-semibold underline mt-1 cursor-pointer"
                >
                  See More
                </button>
              </div>
            </div>

            {/* 2. LENGTH OF LESSON FILTER CARD */}
            <div className="w-full p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Length of Lesson</h3>
                <ChevronDown className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { id: '0-2 Hours', label: '0-2 Hours (10)' },
                  { id: '3-6 Hours', label: '3-6 Hours (15)' },
                  { id: '7-16 Hours', label: '7-16 Hours (8)' },
                  { id: '17+ Hours', label: '17+ Hours (12)' }
                ].map((len) => (
                  <label key={len.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLessonLengths.includes(len.id)}
                      onChange={() => handleToggleLessonLength(len.id)}
                      className="w-4 h-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-neutral-600 text-sm group-hover:text-zinc-900 transition-colors">
                      {len.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. PRICE FILTER CARD */}
            <div className="w-full p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Price</h3>
                <ChevronDown className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { id: 'all', label: 'All (10)' },
                  { id: 'free', label: 'Free (5)' },
                  { id: 'paid', label: 'Paid (3)' }
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={selectedPriceType === p.id}
                      onChange={() => setSelectedPriceType(p.id as any)}
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-neutral-600 text-sm group-hover:text-zinc-900 transition-colors">
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. RANGE FILTER CARD */}
            <div className="w-full p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Range</h3>
                <ChevronDown className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-600 font-medium">
                  <span>$0</span>
                  <span>${`${priceRange.toLocaleString()}`}</span>
                </div>
              </div>
            </div>

            {/* 5. LEVEL FILTER CARD */}
            <div className="w-full p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-zinc-900 text-base font-bold">Level</h3>
                <ChevronDown className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { id: 'Beginner', label: 'Beginner (10)' },
                  { id: 'Intermediate', label: 'Intermediate (5)' },
                  { id: 'Advanced', label: 'Advanced (21)' },
                  { id: 'Expert', label: 'Expert (3)' }
                ].map((l) => (
                  <label key={l.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLevel === l.id}
                      onChange={() => setSelectedLevel(selectedLevel === l.id ? 'all' : l.id)}
                      className="w-4 h-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-neutral-600 text-sm group-hover:text-zinc-900 transition-colors">
                      {l.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3-COLUMN INSTRUCTOR CARDS GRID */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map((inst) => {
                const isFav = favorites.includes(inst.id);
                return (
                  <div
                    key={inst.id}
                    className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative group"
                  >
                    {/* Instructor Photo Header */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Favorite Heart Badge (top right) */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(inst.id, e)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center absolute top-3 right-3 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        title="Add to Favorite"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'text-rose-500 fill-rose-500' : 'text-neutral-500 hover:text-rose-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col gap-3.5">
                      
                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-neutral-500 text-xs font-normal">
                          <strong className="text-zinc-900 font-semibold">{inst.rating}</strong> ({inst.reviewCount} Reviews)
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-zinc-900 text-base font-bold tracking-tight hover:text-indigo-900 transition-colors cursor-pointer">
                          {inst.name}
                        </h4>
                        <span className="text-neutral-500 text-xs font-normal">
                          {inst.role}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-neutral-200" />

                      {/* Stats: Lessons & Duration */}
                      <div className="flex items-center justify-between text-xs text-neutral-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                          <span>{inst.lessonCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-900" />
                          <span>{inst.duration}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION SECTION */}
            <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-zinc-600 text-sm font-medium">
                Page {currentPage} of 2
              </span>

              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full bg-slate-100 disabled:opacity-50 hover:bg-slate-200 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page 1 (Active rose) */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 1
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 text-zinc-700 hover:bg-slate-200'
                  }`}
                >
                  1
                </button>

                {/* Page 2 */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 2
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 text-zinc-700 hover:bg-slate-200'
                  }`}
                >
                  2
                </button>

                {/* Page 3 */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-zinc-700 hover:bg-slate-200 text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                >
                  3
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
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
