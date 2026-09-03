import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, Calendar, Eye, X, FileCode, Copy, Check, Cpu, Database, Layers, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { GuestAuthPrompt } from '@/components/common/guestAuthPrompt';

export interface TestCaseResult {
  id: number;
  status: 'Passed' | 'Failed' | 'TLE';
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtime: string;
  memory: string;
}

export interface SubmissionItem {
  id: string;
  submittedAt: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  language: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error';
  runtime: string;
  memory: string;
  score: number;
  codeSnippet: string;
  testCases: TestCaseResult[];
}

const MOCK_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'SUB-9842',
    submittedAt: '2026-08-04 09:12',
    problemId: 'OJ-204',
    problemTitle: 'Longest Substring Without Repeating Characters',
    problemSlug: 'longest-substring-without-repeating-characters',
    language: 'Python 3',
    verdict: 'Accepted',
    runtime: '48 ms',
    memory: '16.4 MB',
    score: 100,
    codeSnippet: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = max_len = 0
        
        for right, char in enumerate(s):
            if char in char_map and char_map[char] >= left:
                left = char_map[char] + 1
            char_map[char] = right
            max_len = max(max_len, right - left + 1)
            
        return max_len

# Time Complexity: O(N)
# Space Complexity: O(min(m, n))`,
    testCases: [
      { id: 1, status: 'Passed', input: 's = "abcabcbb"', expectedOutput: '3', actualOutput: '3', runtime: '14 ms', memory: '16.2 MB' },
      { id: 2, status: 'Passed', input: 's = "bbbbb"', expectedOutput: '1', actualOutput: '1', runtime: '12 ms', memory: '16.3 MB' },
      { id: 3, status: 'Passed', input: 's = "pwwkew"', expectedOutput: '3', actualOutput: '3', runtime: '22 ms', memory: '16.4 MB' }
    ]
  },
  {
    id: 'SUB-9810',
    submittedAt: '2026-08-03 21:40',
    problemId: 'OJ-231',
    problemTitle: 'Course Schedule',
    problemSlug: 'course-schedule',
    language: 'C++ 17',
    verdict: 'Wrong Answer',
    runtime: '12 ms',
    memory: '6.2 MB',
    score: 40,
    codeSnippet: `#include <vector>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<int> inDegree(numCourses, 0);
        // Incomplete cycle detection logic
        return prerequisites.size() < numCourses;
    }
};`,
    testCases: [
      { id: 1, status: 'Passed', input: 'numCourses = 2, prerequisites = [[1,0]]', expectedOutput: 'true', actualOutput: 'true', runtime: '4 ms', memory: '6.1 MB' },
      { id: 2, status: 'Failed', input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', expectedOutput: 'false', actualOutput: 'true', runtime: '8 ms', memory: '6.2 MB' }
    ]
  },
  {
    id: 'SUB-9788',
    submittedAt: '2026-08-02 15:05',
    problemId: 'OJ-310',
    problemTitle: 'Median of Two Sorted Arrays',
    problemSlug: 'median-of-two-sorted-arrays',
    language: 'Java 17',
    verdict: 'Time Limit Exceeded',
    runtime: '—',
    memory: '—',
    score: 0,
    codeSnippet: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Naive bubble sort causing O(N^2) TLE
        int[] merged = new int[nums1.length + nums2.length];
        for (int i = 0; i < nums1.length; i++) merged[i] = nums1[i];
        for (int j = 0; j < nums2.length; j++) merged[nums1.length + j] = nums2[j];
        
        for (int i = 0; i < merged.length; i++) {
            for (int j = i + 1; j < merged.length; j++) {
                if (merged[i] > merged[j]) {
                    int tmp = merged[i];
                    merged[i] = merged[j];
                    merged[j] = tmp;
                }
            }
        }
        int mid = merged.length / 2;
        return merged.length % 2 == 0 ? (merged[mid - 1] + merged[mid]) / 2.0 : merged[mid];
    }
}`,
    testCases: [
      { id: 1, status: 'TLE', input: 'nums1 = [1,3], nums2 = [2]', expectedOutput: '2.00000', actualOutput: 'Time Limit Exceeded (> 2000ms)', runtime: '> 2000 ms', memory: '—' }
    ]
  },
  {
    id: 'SUB-9750',
    submittedAt: '2026-08-01 18:22',
    problemId: 'OJ-001',
    problemTitle: 'Two Sum',
    problemSlug: 'two-sum',
    language: 'Python 3',
    verdict: 'Accepted',
    runtime: '42 ms',
    memory: '14.2 MB',
    score: 100,
    codeSnippet: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []`,
    testCases: [
      { id: 1, status: 'Passed', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', actualOutput: '[0,1]', runtime: '12 ms', memory: '14.0 MB' },
      { id: 2, status: 'Passed', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', actualOutput: '[1,2]', runtime: '14 ms', memory: '14.1 MB' },
      { id: 3, status: 'Passed', input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]', actualOutput: '[0,1]', runtime: '16 ms', memory: '14.2 MB' }
    ]
  },
  {
    id: 'SUB-9712',
    submittedAt: '2026-07-29 11:15',
    problemId: 'OJ-004',
    problemTitle: 'Merge Intervals',
    problemSlug: 'merge-intervals',
    language: 'C++ 17',
    verdict: 'Accepted',
    runtime: '24 ms',
    memory: '11.8 MB',
    score: 100,
    codeSnippet: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged = {intervals[0]};
        for (int i = 1; i < intervals.size(); ++i) {
            if (intervals[i][0] <= merged.back()[1]) {
                merged.back()[1] = max(merged.back()[1], intervals[i][1]);
            } else {
                merged.push_back(intervals[i]);
            }
        }
        return merged;
    }
};`,
    testCases: [
      { id: 1, status: 'Passed', input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', actualOutput: '[[1,6],[8,10],[15,18]]', runtime: '10 ms', memory: '11.6 MB' },
      { id: 2, status: 'Passed', input: 'intervals = [[1,4],[4,5]]', expectedOutput: '[[1,5]]', actualOutput: '[[1,5]]', runtime: '14 ms', memory: '11.8 MB' }
    ]
  },
  {
    id: 'SUB-9680',
    submittedAt: '2026-07-28 14:02',
    problemId: 'OJ-005',
    problemTitle: 'Valid Parentheses',
    problemSlug: 'valid-parentheses',
    language: 'Python 3',
    verdict: 'Accepted',
    runtime: '38 ms',
    memory: '13.1 MB',
    score: 100,
    codeSnippet: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
    testCases: [
      { id: 1, status: 'Passed', input: 's = "()"', expectedOutput: 'true', actualOutput: 'true', runtime: '10 ms', memory: '13.0 MB' },
      { id: 2, status: 'Passed', input: 's = "()[]{}"', expectedOutput: 'true', actualOutput: 'true', runtime: '12 ms', memory: '13.0 MB' },
      { id: 3, status: 'Passed', input: 's = "(]"', expectedOutput: 'false', actualOutput: 'false', runtime: '16 ms', memory: '13.1 MB' }
    ]
  },
  {
    id: 'SUB-9655',
    submittedAt: '2026-07-25 10:50',
    problemId: 'OJ-007',
    problemTitle: 'Trapping Rain Water',
    problemSlug: 'trapping-rain-water',
    language: 'Python 3',
    verdict: 'Wrong Answer',
    runtime: '18 ms',
    memory: '15.0 MB',
    score: 20,
    codeSnippet: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Initial incorrect two-pointer bound
        return sum(height) // 2`,
    testCases: [
      { id: 1, status: 'Failed', input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', actualOutput: '6 (Lucky match)', runtime: '8 ms', memory: '14.9 MB' },
      { id: 2, status: 'Failed', input: 'height = [4,2,0,3,2,5]', expectedOutput: '9', actualOutput: '8', runtime: '10 ms', memory: '15.0 MB' }
    ]
  }
];

export function StudentHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedVerdict, setSelectedVerdict] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Submission Modal State & Active Tab
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [modalTab, setModalTab] = useState<'code' | 'testcases'>('code');
  const [copied, setCopied] = useState(false);

  // Filtering Logic
  const filteredSubmissions = useMemo(() => {
    return MOCK_SUBMISSIONS.filter((sub) => {
      const matchSearch =
        sub.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.problemId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLang = selectedLanguage === 'All' || sub.language.toLowerCase().includes(selectedLanguage.toLowerCase());
      const matchVerdict =
        selectedVerdict === 'All' ||
        (selectedVerdict === 'Accepted' && sub.verdict === 'Accepted') ||
        (selectedVerdict === 'Wrong Answer' && sub.verdict === 'Wrong Answer') ||
        (selectedVerdict === 'TLE' && sub.verdict === 'Time Limit Exceeded');
      const matchDate = !dateFilter || sub.submittedAt.startsWith(dateFilter);

      return matchSearch && matchLang && matchVerdict && matchDate;
    });
  }, [searchQuery, selectedLanguage, selectedVerdict, dateFilter]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage) || 1;
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCopyCode = () => {
    if (!selectedSubmission) return;
    navigator.clipboard.writeText(selectedSubmission.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictBadge = (verdict: SubmissionItem['verdict']) => {
    switch (verdict) {
      case 'Accepted':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-300 text-rose-700 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Wrong Answer
          </span>
        );
      case 'Time Limit Exceeded':
        return (
          <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-300 text-amber-800 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            TLE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-slate-100 border border-neutral-300 text-neutral-600 rounded-[10px] text-xs font-semibold">
            {verdict}
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="self-stretch px-6 lg:px-20 py-14 bg-gradient-to-br from-indigo-900 to-indigo-500 flex flex-col justify-center items-center gap-3 text-center border-b border-neutral-200/60">
        <h1 className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">Submission History</h1>
        <div className="opacity-80 text-white text-xs sm:text-sm font-medium flex items-center gap-2">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <span>&gt;</span>
          <Link to="/practice" className="hover:underline">Practice (OJ)</Link>
          <span>&gt;</span>
          <span>Submission History</span>
        </div>
      </div>

      {/* 2. MAIN SUBMISSION HISTORY CONTENT */}
      <div className="self-stretch max-w-[1810px] mx-auto w-full px-6 lg:px-20 py-12 flex flex-col justify-start items-start gap-8">
        
        {!user ? (
          <GuestAuthPrompt
            title="Log in to view submission history"
            description="You are currently browsing as a guest. Please log in or register an account to view and track your Online Judge submission history."
            redirectPath="/submissions"
            loginButtonText="Log In"
            registerButtonText="Create Account"
          />
        ) : (
          /* Table Container Card */
          <div className="self-stretch bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-start items-start overflow-hidden">
          
          {/* Filter Toolbar Header */}
          <div className="self-stretch p-5 border-b border-neutral-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50">
            
            {/* Search Input */}
            <div className="flex-1 min-w-[240px] px-3.5 py-2 bg-white rounded-[10px] border border-neutral-200 flex items-center gap-2.5 shadow-2xs">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input maxLength={100}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by problem name or ID…"
                className="flex-1 text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Filter Dropdowns & Date Filter */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Language Filter */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                  className="px-3.5 py-2 bg-white rounded-[10px] border border-neutral-200 text-zinc-700 text-sm font-medium appearance-none pr-8 cursor-pointer shadow-2xs hover:border-neutral-300 focus:outline-none"
                >
                  <option value="All">All languages</option>
                  <option value="Python">Python 3</option>
                  <option value="C++">C++ 17</option>
                  <option value="Java">Java 17</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Verdict Filter */}
              <div className="relative">
                <select
                  value={selectedVerdict}
                  onChange={(e) => { setSelectedVerdict(e.target.value); setCurrentPage(1); }}
                  className="px-3.5 py-2 bg-white rounded-[10px] border border-neutral-200 text-zinc-700 text-sm font-medium appearance-none pr-8 cursor-pointer shadow-2xs hover:border-neutral-300 focus:outline-none"
                >
                  <option value="All">All verdicts</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Wrong Answer">Wrong Answer</option>
                  <option value="TLE">Time Limit Exceeded</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Date Input */}
              <div className="px-3 py-2 bg-white rounded-[10px] border border-neutral-200 flex items-center gap-2 shadow-2xs text-sm text-zinc-700">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <input maxLength={100}
                  type="date"
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  className="text-xs sm:text-sm text-zinc-800 bg-transparent focus:outline-none cursor-pointer"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="text-xs text-neutral-400 hover:text-zinc-800"
                    title="Clear date"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Submissions Table Header */}
          <div className="self-stretch px-6 py-3.5 bg-oj-surface-alt border-b border-neutral-200 flex items-center text-zinc-900 text-sm font-bold">
            <div className="w-48 text-neutral-500 font-semibold">Submitted</div>
            <div className="flex-1 text-neutral-500 font-semibold">Problem</div>
            <div className="w-36 text-neutral-500 font-semibold">Language</div>
            <div className="w-48 text-neutral-500 font-semibold">Verdict</div>
            <div className="w-28 text-neutral-500 font-semibold">Runtime</div>
            <div className="w-28 text-neutral-500 font-semibold">Memory</div>
            <div className="w-24 text-right text-neutral-500 font-semibold">Score</div>
            <div className="w-28 text-center text-neutral-500 font-semibold">Action</div>
          </div>

          {/* Submissions Table Rows */}
          {paginatedSubmissions.length > 0 ? (
            paginatedSubmissions.map((sub, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={sub.id}
                  className={`self-stretch px-6 py-4 border-b border-neutral-100 flex items-center transition-colors hover:bg-oj-surface-hover ${
                    isEven ? 'bg-oj-surface-alt' : 'bg-oj-surface'
                  }`}
                >
                  {/* Submitted Date */}
                  <div className="w-48 text-zinc-600 text-xs sm:text-sm font-normal font-mono">
                    {sub.submittedAt}
                  </div>

                  {/* Problem Link */}
                  <div className="flex-1 pr-4">
                    <Link
                      to={`/practice/${sub.problemSlug}`}
                      className="text-indigo-900 hover:underline text-sm font-semibold truncate block"
                    >
                      <span className="font-mono text-xs text-neutral-400 mr-1.5">{sub.problemId}</span>
                      {sub.problemTitle}
                    </Link>
                  </div>

                  {/* Language */}
                  <div className="w-36 text-zinc-700 text-sm font-normal">
                    {sub.language}
                  </div>

                  {/* Verdict Badge */}
                  <div className="w-48 flex items-center">
                    {getVerdictBadge(sub.verdict)}
                  </div>

                  {/* Runtime */}
                  <div className="w-28 text-zinc-600 text-sm font-mono font-normal">
                    {sub.runtime}
                  </div>

                  {/* Memory */}
                  <div className="w-28 text-zinc-600 text-sm font-mono font-normal">
                    {sub.memory}
                  </div>

                  {/* Score */}
                  <div className="w-24 text-right">
                    <span className={`text-sm font-bold font-mono ${
                      sub.score === 100 ? 'text-emerald-700' : sub.score > 0 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {sub.score}
                    </span>
                  </div>

                  {/* View Button */}
                  <div className="w-28 flex justify-center items-center">
                    <button
                      onClick={() => { setSelectedSubmission(sub); setModalTab('code'); }}
                      className="px-3.5 py-1.5 rounded-lg border border-indigo-900 bg-white hover:bg-indigo-900 text-indigo-900 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="self-stretch p-12 text-center text-neutral-400 text-sm">
              No submissions match your search or filter conditions.
            </div>
          )}

          {/* Table Footer / Pagination */}
          <div className="self-stretch px-6 py-4 border-t border-neutral-200 flex justify-between items-center bg-slate-50/30">
            <div className="text-neutral-500 text-xs sm:text-sm font-normal">
              Page {currentPage} of {totalPages} · {filteredSubmissions.length} submissions
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 bg-white rounded-xl border border-neutral-200 flex justify-center items-center text-neutral-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 bg-white rounded-xl border border-neutral-200 flex justify-center items-center text-neutral-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
        )}

      </div>

      {/* 3. EXPANDED PREVIEW MODAL (Larger area, outer padding wrapping the IDE code card) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Main Large Modal Card (max-w-5xl, generous breathing room) */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-5xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header Bar */}
            <div className="px-8 py-5 bg-slate-50/80 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  OJ
                </div>
                <div>
                  <h3 className="text-zinc-900 text-lg font-bold tracking-tight">
                    {selectedSubmission.problemId} · {selectedSubmission.problemTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <span>Submission ID: <strong className="text-zinc-700 font-mono">{selectedSubmission.id}</strong></span>
                    <span>•</span>
                    <span>Submitted at: <strong className="text-zinc-700">{selectedSubmission.submittedAt}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-xl hover:bg-slate-200/80 text-neutral-500 hover:text-zinc-900 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics KPI Bar */}
            <div className="px-8 py-4 bg-white border-b border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-neutral-200/80 flex flex-col gap-1 shadow-2xs">
                <span className="text-neutral-500 font-medium">Verdict</span>
                <div>{getVerdictBadge(selectedSubmission.verdict)}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-neutral-200/80 flex flex-col gap-1 shadow-2xs">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-900" />
                  Runtime
                </span>
                <span className="font-bold text-zinc-900 font-mono text-base">{selectedSubmission.runtime}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-neutral-200/80 flex flex-col gap-1 shadow-2xs">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-900" />
                  Memory
                </span>
                <span className="font-bold text-zinc-900 font-mono text-base">{selectedSubmission.memory}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-neutral-200/80 flex flex-col gap-1 shadow-2xs">
                <span className="text-neutral-500 font-medium">Final Score</span>
                <span className={`font-bold font-mono text-base ${
                  selectedSubmission.score === 100 ? 'text-emerald-700' : selectedSubmission.score > 0 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {selectedSubmission.score} / 100
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-8 border-b border-neutral-200 flex items-center gap-8 bg-slate-50/50 text-sm font-medium">
              <button
                onClick={() => setModalTab('code')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  modalTab === 'code'
                    ? 'border-indigo-900 text-indigo-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-zinc-900'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Submitted Code ({selectedSubmission.language})</span>
              </button>

              <button
                onClick={() => setModalTab('testcases')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  modalTab === 'testcases'
                    ? 'border-indigo-900 text-indigo-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-zinc-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Test Cases Breakdown ({selectedSubmission.testCases.length})</span>
              </button>
            </div>

            {/* PREVIEW CONTAINER BODY (With generous outer padding wrapping inner code card) */}
            <div className="p-8 bg-slate-100/60 min-h-[380px] flex flex-col justify-start">
              
              {/* Tab 1: Padded Code Card */}
              {modalTab === 'code' && (
                <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-800 shadow-lg overflow-hidden flex flex-col">
                  
                  {/* Code Card Top Bar (macOS window style dots + Language + Copy) */}
                  <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-mono text-zinc-400 ml-3">
                        solution.{selectedSubmission.language.startsWith('Python') ? 'py' : selectedSubmission.language.startsWith('C++') ? 'cpp' : 'java'}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied to clipboard' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Code Snippet Scroll Area with Line Numbers */}
                  <div className="p-6 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto max-h-[420px] leading-relaxed bg-zinc-950">
                    <pre className="font-mono">{selectedSubmission.codeSnippet}</pre>
                  </div>
                </div>
              )}

              {/* Tab 2: Padded Test Cases List */}
              {modalTab === 'testcases' && (
                <div className="w-full space-y-4 max-h-[440px] overflow-y-auto pr-1">
                  {selectedSubmission.testCases.map((tc) => (
                    <div
                      key={tc.id}
                      className={`p-5 rounded-2xl border bg-white shadow-sm transition-all ${
                        tc.status === 'Passed'
                          ? 'border-emerald-200'
                          : tc.status === 'TLE'
                          ? 'border-amber-200'
                          : 'border-rose-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900">Test Case #{tc.id}</span>
                          <span className="text-xs text-neutral-400 font-mono">({tc.runtime}, {tc.memory})</span>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          tc.status === 'Passed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : tc.status === 'TLE'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : 'bg-rose-50 text-rose-700 border border-rose-300'
                        }`}>
                          {tc.status}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs font-mono">
                        <div>
                          <span className="text-neutral-400 block font-sans text-[11px] mb-1 font-medium">Input Arguments</span>
                          <code className="bg-slate-50 border border-neutral-200 px-3 py-2 rounded-xl block text-zinc-800">{tc.input}</code>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-neutral-400 block font-sans text-[11px] mb-1 font-medium">Expected Output</span>
                            <code className="bg-emerald-50/60 border border-emerald-200 px-3 py-2 rounded-xl block text-emerald-900">{tc.expectedOutput}</code>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-sans text-[11px] mb-1 font-medium">Your Code Output</span>
                            <code className={`border px-3 py-2 rounded-xl block ${
                              tc.status === 'Passed'
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                : 'bg-rose-50/60 border-rose-200 text-rose-900'
                            }`}>
                              {tc.actualOutput}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Bottom Action Bar */}
            <div className="px-8 py-5 bg-white border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate(`/practice/${selectedSubmission.problemSlug}`)}
                className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Re-solve in Online Judge Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-neutral-300 text-zinc-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
