import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { Badge } from '@/components/ui/badge';

interface ProblemItem {
  id: number;
  code: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  status: 'Solved' | 'Attempted' | 'Unsolved';
  tags: string[];
}

const MOCK_PROBLEMS: ProblemItem[] = [
  { id: 1, code: 'OJ-001', slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', acceptance: '49.2%', status: 'Solved', tags: ['Array', 'Hash Table'] },
  { id: 2, code: 'OJ-002', slug: 'add-two-numbers', title: 'Add Two Numbers', difficulty: 'Medium', acceptance: '39.7%', status: 'Solved', tags: ['Linked List', 'Math'] },
  { id: 3, code: 'OJ-003', slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '33.8%', status: 'Attempted', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { id: 4, code: 'OJ-004', slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: '35.6%', status: 'Unsolved', tags: ['Array', 'Binary Search', 'Divide and Conquer'] },
  { id: 5, code: 'OJ-005', slug: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', difficulty: 'Medium', acceptance: '32.4%', status: 'Solved', tags: ['String', 'Dynamic Programming'] },
  { id: 6, code: 'OJ-006', slug: 'zigzag-conversion', title: 'Zigzag Conversion', difficulty: 'Medium', acceptance: '44.1%', status: 'Unsolved', tags: ['String'] },
  { id: 7, code: 'OJ-007', slug: 'reverse-integer', title: 'Reverse Integer', difficulty: 'Medium', acceptance: '27.8%', status: 'Attempted', tags: ['Math'] },
  { id: 8, code: 'OJ-008', slug: 'string-to-integer-atoi', title: 'String to Integer (atoi)', difficulty: 'Medium', acceptance: '16.6%', status: 'Unsolved', tags: ['String'] },
  { id: 9, code: 'OJ-009', slug: 'palindrome-number', title: 'Palindrome Number', difficulty: 'Easy', acceptance: '53.1%', status: 'Solved', tags: ['Math'] },
  { id: 10, code: 'OJ-010', slug: 'regular-expression-matching', title: 'Regular Expression Matching', difficulty: 'Hard', acceptance: '28.2%', status: 'Unsolved', tags: ['String', 'Dynamic Programming', 'Recursion'] },
  { id: 11, code: 'OJ-011', slug: 'container-with-most-water', title: 'Container With Most Water', difficulty: 'Medium', acceptance: '54.3%', status: 'Solved', tags: ['Array', 'Two Pointers'] },
  { id: 12, code: 'OJ-012', slug: '3sum', title: '3Sum', difficulty: 'Medium', acceptance: '32.9%', status: 'Unsolved', tags: ['Array', 'Two Pointers'] }
];

export function ProblemListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Attempted' | 'Unsolved'>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtered problems (ready for backend data via useQuery or mock)
  const filteredProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      const matchTag = selectedTag === 'All' || p.tags.includes(selectedTag);
      const effectiveStatus = user ? p.status : 'Unsolved';
      const matchStatus = selectedStatus === 'All' || effectiveStatus === selectedStatus;
      return matchSearch && matchDiff && matchTag && matchStatus;
    });
  }, [searchQuery, selectedDifficulty, selectedTag, selectedStatus, user]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
  const paginatedProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO / PAGE TITLE BANNER (bg-gradient-to-br from-indigo-900 to-indigo-500) */}
      <div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Problem List
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">
            Dashboard
          </Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Problem List</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT & TABLE SECTION */}
      <div className="self-stretch max-w-[1340px] mx-auto w-full px-6 py-8 flex flex-col justify-start items-start gap-8">
        
        {/* Toolbar (Search + Filters) */}
        <div className="self-stretch flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          {/* Search Input */}
          <div className="w-full md:w-96 px-4 py-2.5 bg-white rounded-lg border border-neutral-200 flex items-center gap-2.5 shadow-sm">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search problems..."
              className="flex-1 text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value as 'All' | 'Easy' | 'Medium' | 'Hard');
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 bg-white rounded-lg border border-neutral-200 text-zinc-600 text-sm font-medium appearance-none pr-9 cursor-pointer shadow-sm hover:border-neutral-300 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Tags Filter */}
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 bg-white rounded-lg border border-neutral-200 text-zinc-600 text-sm font-medium appearance-none pr-9 cursor-pointer shadow-sm hover:border-neutral-300 focus:outline-none"
              >
                <option value="All">All Tags</option>
                <option value="Array">Array</option>
                <option value="Hash Table">Hash Table</option>
                <option value="String">String</option>
                <option value="Math">Math</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
                <option value="Two Pointers">Two Pointers</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as 'All' | 'Solved' | 'Attempted' | 'Unsolved');
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 bg-white rounded-lg border border-neutral-200 text-zinc-600 text-sm font-medium appearance-none pr-9 cursor-pointer shadow-sm hover:border-neutral-300 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Unsolved">Unsolved</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Problems Table */}
        <div className="self-stretch bg-white rounded-xl border border-neutral-200 flex flex-col justify-start items-start overflow-hidden shadow-sm">
          
          {/* Table Header */}
          <div className="self-stretch px-6 py-4 bg-oj-surface-alt border-b border-neutral-200 flex items-center text-zinc-900 text-sm font-bold">
            <div className="w-20">#</div>
            <div className="flex-1">Title</div>
            <div className="w-40">Difficulty</div>
            <div className="w-40">Acceptance</div>
            <div className="w-40">Status</div>
          </div>

          {/* Table Body Rows */}
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((prob, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={prob.id}
                  onClick={() => navigate(`/practice/${prob.slug}`)}
                  className={`self-stretch px-6 py-4 border-b border-neutral-100 flex items-center cursor-pointer transition-colors hover:bg-oj-surface-hover ${
                    isEven ? 'bg-oj-surface-alt' : 'bg-oj-surface'
                  }`}
                >
                  {/* ID */}
                  <div className="w-20 text-zinc-600 text-sm font-normal">
                    {prob.id}
                  </div>

                  {/* Title */}
                  <div className="flex-1 pr-4">
                    <span className="text-zinc-900 text-base font-semibold hover:text-indigo-900 transition-colors line-clamp-1">
                      {prob.title}
                    </span>
                  </div>

                   {/* Difficulty Badge */}
                  <div className="w-40 flex items-center">
                    {prob.difficulty === 'Easy' && (
                      <Badge variant="success">Easy</Badge>
                    )}
                    {prob.difficulty === 'Medium' && (
                      <Badge variant="warning">Medium</Badge>
                    )}
                    {prob.difficulty === 'Hard' && (
                      <Badge variant="error">Hard</Badge>
                    )}
                  </div>

                  {/* Acceptance */}
                  <div className="w-40 text-zinc-600 text-sm font-normal">
                    {prob.acceptance}
                  </div>

                  {/* Status */}
                  <div className="w-40 flex items-center">
                    {!user ? (
                      <span className="text-neutral-400 text-sm font-medium">—</span>
                    ) : (
                      <>
                        {prob.status === 'Solved' && (
                          <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Solved</span>
                          </div>
                        )}
                        {prob.status === 'Attempted' && (
                          <div className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Attempted</span>
                          </div>
                        )}
                        {prob.status === 'Unsolved' && (
                          <span className="text-neutral-400 text-sm font-medium">—</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="self-stretch p-12 text-center text-neutral-400 text-sm">
              No problems matched your search and filter criteria.
            </div>
          )}

        </div>

        {/* Pagination Section */}
        <div className="self-stretch flex justify-between items-center pt-2">
          <div className="text-neutral-500 text-sm font-normal">
            Page {currentPage} of {totalPages} ({filteredProblems.length} problems)
          </div>

          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 bg-white rounded-2xl border border-neutral-200 flex justify-center items-center text-neutral-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-2xl text-sm font-medium flex justify-center items-center transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-400 text-white font-bold shadow-sm shadow-red-400/20'
                      : 'bg-white border border-neutral-200 text-zinc-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 bg-white rounded-2xl border border-neutral-200 flex justify-center items-center text-neutral-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
