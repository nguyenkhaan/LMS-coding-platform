import { useAuthStore } from '@/stores/useAuthStore';
import { NotificationDropdown } from '@/features/notification/components/NotificationDropdown';
import { GraduationCap, ShieldCheck, LogOut, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  MapPin,
  Phone,
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  Play,
  CheckCircle2,
  Clock,
  Zap,
  Code2,
  Terminal,
  Check,
  RotateCcw,
  Sparkles,
  XCircle
} from 'lucide-react';

interface TestCase {
  id: number;
  nums: string;
  target: string;
  expected: string;
}

const TEST_CASES: TestCase[] = [
  { id: 1, nums: '[2, 7, 11, 15]', target: '9', expected: '[0, 1]' },
  { id: 2, nums: '[3, 2, 4]', target: '6', expected: '[1, 2]' },
  { id: 3, nums: '[3, 3]', target: '6', expected: '[0, 1]' }
];

const CODE_TEMPLATES: Record<string, { ext: string; monacoLang: string; code: string }> = {
  'Python 3': {
    ext: 'solution.py',
    monacoLang: 'python',
    code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
`
  },
  'C++ 20': {
    ext: 'solution.cpp',
    monacoLang: 'cpp',
    code: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`
  },
  'JavaScript': {
    ext: 'solution.js',
    monacoLang: 'javascript',
    code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
};`
  },
  'Java 17': {
    ext: 'Solution.java',
    monacoLang: 'java',
    code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`
  }
};

export function OJWorkspacePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { problemSlug } = useParams<{ problemSlug: string }>();

  // State
  const [selectedLang, setSelectedLang] = useState<string>('Python 3');
  const [code, setCode] = useState<string>(CODE_TEMPLATES['Python 3'].code);
  const [leftTab, setLeftTab] = useState<'Description' | 'Solutions' | 'Submissions' | 'Discussion'>('Description');
  const [bottomTab, setBottomTab] = useState<'Test Cases' | 'Output' | 'Console'>('Test Cases');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  
  // Custom case inputs
  const [caseInputs, setCaseInputs] = useState(TEST_CASES);
  const [customConsoleInput, setCustomConsoleInput] = useState('nums = [2,7,11,15]\ntarget = 9');

  // Execution & Verdict State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    status: 'ACCEPTED' | 'WRONG_ANSWER' | null;
    output: string;
    runtime: string;
    memory: string;
    passedCases: number;
    totalCases: number;
  } | null>(null);

  // Timer: 15 mins 32 secs = 932s
  const [timeLeft, setTimeLeft] = useState<number>(932);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(CODE_TEMPLATES[lang].code);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setBottomTab('Output');
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'ACCEPTED',
        output: '[0, 1]',
        runtime: '48 ms',
        memory: '14.2 MB',
        passedCases: 3,
        totalCases: 3
      });
    }, 1000);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setBottomTab('Output');
    setTimeout(() => {
      setIsSubmitting(false);
      setExecutionResult({
        status: 'ACCEPTED',
        output: '[0, 1]',
        runtime: '42 ms (faster than 88.4%)',
        memory: '13.9 MB (less than 92.1%)',
        passedCases: 3,
        totalCases: 3
      });
    }, 1500);
  };

  const currentTemplate = CODE_TEMPLATES[selectedLang];
  const activeCase = caseInputs[selectedCaseIndex];

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. TOP UTILITY BAR (bg-blue-950) */}
      <div className="w-full bg-blue-950 py-3 shrink-0">
        <div className="max-w-[1340px] w-full mx-auto px-6 flex justify-between items-center text-xs text-white">
          <div className="flex justify-start items-center gap-6">
            <div className="flex justify-start items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-white/80" />
              <span className="opacity-90 font-normal">1442 Crosswind Drive Madisonville</span>
            </div>
            <div className="hidden sm:flex justify-start items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-white/80" />
              <span className="opacity-90 font-normal">+1 45887 77874</span>
            </div>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="flex justify-start items-center gap-1 cursor-pointer">
              <span className="opacity-90 font-normal">English</span>
              <ChevronDown className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="flex justify-start items-center gap-1 cursor-pointer">
              <span className="opacity-90 font-normal">USD</span>
              <ChevronDown className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="hidden md:flex justify-start items-center gap-3 text-white/80">
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">f</span>
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">𝕏</span>
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">in</span>
              <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-[10px] cursor-pointer hover:text-white">yt</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="self-stretch py-3.5 bg-white border-b border-slate-100 flex flex-col justify-center items-center">
        <div className="max-w-[1340px] w-full mx-auto px-6 h-14 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-900 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-950">
              Skill<span className="text-rose-500">Boost</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex justify-start items-center gap-8">
            
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="text-sm font-medium text-zinc-900 hover:text-indigo-900 transition-colors"
            >
              Dashboard
            </Link>

            {/* Courses */}
            <Link
              to="/courses"
              className="text-sm font-medium text-zinc-900 hover:text-indigo-900 transition-colors"
            >
              Courses
            </Link>

            {/* Instructors */}
            <Link
              to="/instructors"
              className="text-sm font-medium text-zinc-900 hover:text-indigo-900 transition-colors"
            >
              Instructors
            </Link>

            {/* Practice (OJ) - ACTIVE with Dropdown */}
            <div className="relative group py-2">
              <Link
                to="/practice"
                className="flex items-center gap-1 text-sm font-semibold text-indigo-900 transition-colors"
              >
                <span>Practice (OJ)</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-900 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Practice Dropdown Menu */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 flex flex-col gap-1">
                  <Link
                    to="/practice"
                    className="p-2.5 rounded-xl hover:bg-indigo-50/70 flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 block">Problem List</span>
                      <span className="text-xs text-neutral-400">Explore 100+ coding challenges</span>
                    </div>
                  </Link>

                  <Link
                    to="/submissions"
                    className="p-2.5 rounded-xl hover:bg-indigo-50/70 flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 block">Submission History</span>
                      <span className="text-xs text-neutral-400">Review past verdicts, code &amp; stats</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Interview */}
            <Link
              to="/interview"
              className="text-sm font-medium text-zinc-900 hover:text-indigo-900 transition-colors"
            >
              AI Interview
            </Link>
          </nav>

          {/* Actions (Search + Notifications + User Profile) */}
          <div className="flex justify-start items-center gap-3">
            <button className="p-2.5 rounded-[40px] border border-neutral-200 hover:bg-slate-50 transition-colors cursor-pointer" title="Search">
              <Search className="w-4 h-4 text-gray-700" />
            </button>

            {/* Notification Center */}
            <NotificationDropdown />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                {user.roles.includes('TEACHER') && (
                  <Link
                    to="/teacher/dashboard"
                    className="px-3.5 py-1.5 rounded-[40px] border border-indigo-900 text-indigo-900 text-xs font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Teacher Portal
                  </Link>
                )}
                {user.roles.includes('ADMIN') && (
                  <Link
                    to="/admin/verifications"
                    className="px-3.5 py-1.5 rounded-[40px] border border-emerald-600 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-[40px] flex items-center gap-1.5 text-zinc-900 text-sm font-medium transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-800" />
                  {user.fullName || user.email.split('@')[0]}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-[40px] hover:bg-rose-50 text-neutral-500 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-[40px] flex items-center gap-1.5 text-zinc-900 text-sm font-medium transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-800" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-[40px] text-white text-sm font-medium transition-colors shadow-sm shadow-rose-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO / PAGE TITLE BANNER (bg-gradient-to-r from-indigo-900 to-indigo-950) */}
      <div className="self-stretch h-20 px-6 lg:px-10 py-4 bg-gradient-to-r from-indigo-900 to-indigo-950 flex justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1">
          <h1 className="text-white text-2xl font-bold tracking-tight">Online Judge</h1>
          <div className="text-slate-300 text-xs font-normal flex items-center gap-1.5">
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
            <span className="text-slate-400 font-normal">&gt;</span>
            <Link to="/practice" className="text-slate-300 hover:text-white transition-colors">Practice</Link>
            <span className="text-slate-400 font-normal">&gt;</span>
            <span className="text-white font-semibold">
              {problemSlug
                ? problemSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : 'Add Two Numbers'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-green-500/10 rounded border border-green-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">Success Rate: 48.2%</span>
          </div>
          <div className="px-2.5 py-1 bg-white/10 rounded border border-white/20 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-white text-xs font-semibold">150 XP</span>
          </div>
        </div>
      </div>

      {/* 4. ACTION / CONTROL BAR */}
      <div className="self-stretch h-14 px-6 lg:px-10 py-3 bg-white border-b border-neutral-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-4 py-1.5 bg-white rounded-md border border-neutral-300 text-zinc-900 text-sm font-medium appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-900/20"
            >
              {Object.keys(CODE_TEMPLATES).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className="px-4 py-1.5 bg-white hover:bg-slate-50 rounded-md border border-indigo-900 text-indigo-900 text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-900 text-indigo-900" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>

            <button
              onClick={handleSubmitCode}
              disabled={isRunning || isSubmitting}
              className="px-5 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-md text-white text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm shadow-rose-500/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              {isSubmitting ? 'Judging...' : 'Submit Code'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" />
            <span className="text-rose-500 text-base font-bold font-mono tracking-wide">
              {formatTimer(timeLeft)}
            </span>
          </div>

          {/* Difficulty Tag */}
          <div className="px-3 py-1 bg-yellow-50 rounded-xl border border-amber-400 flex items-center">
            <span className="text-amber-800 text-xs font-bold">Medium</span>
          </div>
        </div>
      </div>

      {/* 5. MAIN SPLIT WORKSPACE BODY */}
      <div className="self-stretch flex-1 p-4 bg-slate-100 flex flex-col lg:flex-row justify-start items-start gap-4">
        
        {/* LEFT COLUMN: Problem Panel */}
        <div className="w-full lg:w-1/2 self-stretch bg-white rounded-xl border border-neutral-200 flex flex-col justify-start items-start overflow-hidden shadow-sm">
          
          {/* Tab Bar */}
          <div className="self-stretch h-11 bg-slate-50 border-b border-neutral-200 flex items-center">
            {(['Description', 'Solutions', 'Submissions', 'Discussion'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`self-stretch px-5 flex items-center text-sm font-medium transition-colors cursor-pointer ${
                  leftTab === tab
                    ? 'bg-white border-b-2 border-rose-500 text-zinc-900 font-semibold'
                    : 'text-neutral-500 hover:text-zinc-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-start gap-5 overflow-y-auto max-h-[calc(100vh-280px)]">
            {leftTab === 'Description' && (
              <>
                {/* Title + Badge */}
                <div className="self-stretch flex justify-between items-center gap-3">
                  <h2 className="text-zinc-900 text-xl font-bold font-['Inter']">1. Two Sum</h2>
                  <div className="px-2 py-0.5 bg-yellow-50 rounded-md border border-amber-300">
                    <span className="text-amber-800 text-xs font-bold">Medium</span>
                  </div>
                </div>

                {/* Topic Tags */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-xl text-zinc-600 text-xs font-medium">
                    Array
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-xl text-zinc-600 text-xs font-medium">
                    Hash Table
                  </span>
                </div>

                {/* Problem Description Text */}
                <div className="text-neutral-600 text-sm font-normal leading-relaxed">
                  Given an array of integers <code className="bg-slate-100 px-1 py-0.5 rounded text-zinc-800 text-xs font-mono">nums</code> and an integer <code className="bg-slate-100 px-1 py-0.5 rounded text-zinc-800 text-xs font-mono">target</code>, return indices of the two numbers such that they add up to target.
                  <br /><br />
                  You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                </div>

                {/* Example 1 */}
                <div className="self-stretch flex flex-col gap-2">
                  <span className="text-zinc-900 text-sm font-bold">Example 1:</span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-neutral-200 flex flex-col gap-1 font-mono text-xs text-zinc-900">
                    <div><span className="font-bold">Input: </span>nums = [2,7,11,15], target = 9</div>
                    <div><span className="font-bold">Output: </span>[0,1]</div>
                    <div><span className="font-bold">Explanation: </span>Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                  </div>
                </div>

                {/* Example 2 */}
                <div className="self-stretch flex flex-col gap-2">
                  <span className="text-zinc-900 text-sm font-bold">Example 2:</span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-neutral-200 flex flex-col gap-1 font-mono text-xs text-zinc-900">
                    <div><span className="font-bold">Input: </span>nums = [3,2,4], target = 6</div>
                    <div><span className="font-bold">Output: </span>[1,2]</div>
                  </div>
                </div>

                {/* Constraints */}
                <div className="self-stretch flex flex-col gap-2">
                  <span className="text-zinc-900 text-sm font-bold">Constraints:</span>
                  <div className="flex flex-col gap-1.5 text-neutral-600 text-xs font-mono">
                    <div>• 2 &lt;= nums.length &lt;= 10^4</div>
                    <div>• -10^9 &lt;= nums[i] &lt;= 10^9</div>
                    <div>• -10^9 &lt;= target &lt;= 10^9</div>
                    <div>• Only one valid answer exists.</div>
                  </div>
                </div>
              </>
            )}

            {leftTab === 'Solutions' && (
              <div className="space-y-4 text-sm text-neutral-700">
                <h3 className="font-bold text-base text-zinc-900">Approach 1: One-pass Hash Table (Optimal)</h3>
                <p>We can iterate through the array and store each element in a hash map with its index. For each element, we check if <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">target - nums[i]</code> already exists in the map.</p>
                <div className="p-3 bg-slate-50 rounded-lg border border-neutral-200 font-mono text-xs">
                  <p><strong>Time Complexity:</strong> O(n)</p>
                  <p><strong>Space Complexity:</strong> O(n)</p>
                </div>
              </div>
            )}

            {leftTab === 'Submissions' && (
              <div className="space-y-3 w-full">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-green-700 font-bold text-sm">Accepted</span>
                    <p className="text-xs text-neutral-500">Python 3 · 42ms · 13.9MB</p>
                  </div>
                  <span className="text-xs text-neutral-400">2 minutes ago</span>
                </div>
              </div>
            )}

            {leftTab === 'Discussion' && (
              <div className="text-neutral-500 text-sm italic">
                No discussion threads yet. Be the first to start a discussion!
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor + Test Cases Panel */}
        <div className="w-full lg:w-1/2 self-stretch flex flex-col gap-4">
          
          {/* Top: Monaco Code Editor */}
          <div className="self-stretch flex-1 min-h-[380px] bg-zinc-900 rounded-xl border border-gray-800 flex flex-col overflow-hidden shadow-sm">
            {/* Editor File Tab */}
            <div className="h-10 px-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white text-xs font-semibold">{currentTemplate.ext}</span>
              </div>
              <button 
                onClick={() => setCode(CODE_TEMPLATES[selectedLang].code)}
                className="text-neutral-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                title="Reset to initial template"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Monaco Editor Component */}
            <div className="flex-1 min-h-[320px]">
              <Editor
                height="100%"
                language={currentTemplate.monacoLang}
                value={code}
                theme="vs-dark"
                onChange={(val) => setCode(val ?? '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 4,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: 'all',
                  fontFamily: "'Cousine', 'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  lineNumbers: 'on',
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                }}
              />
            </div>
          </div>

          {/* Bottom: Test Cases / Output / Console Panel */}
          <div className="self-stretch h-72 bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden shadow-sm">
            
            {/* Bottom Tab Bar */}
            <div className="h-10 px-4 bg-slate-50 border-b border-neutral-200 flex items-center">
              {(['Test Cases', 'Output', 'Console'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab)}
                  className={`self-stretch px-4 flex items-center text-xs font-medium transition-colors cursor-pointer ${
                    bottomTab === tab
                      ? 'border-b-2 border-rose-500 text-zinc-900 font-semibold'
                      : 'text-neutral-500 hover:text-zinc-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Bottom Content Area */}
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
              
              {/* TAB 1: Test Cases */}
              {bottomTab === 'Test Cases' && (
                <>
                  {/* Case selection buttons */}
                  <div className="flex items-center gap-2">
                    {caseInputs.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCaseIndex(idx)}
                        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                          selectedCaseIndex === idx
                            ? 'bg-indigo-900 text-white font-semibold shadow-sm'
                            : 'bg-slate-100 text-zinc-600 border border-neutral-300 hover:bg-slate-200'
                        }`}
                      >
                        Case {c.id}
                      </button>
                    ))}
                  </div>

                  {/* Case inputs details */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-neutral-500 text-xs font-semibold">nums =</label>
                      <div className="p-2 bg-slate-100 rounded-md border border-neutral-300 text-zinc-900 text-xs font-mono">
                        {activeCase.nums}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-neutral-500 text-xs font-semibold">target =</label>
                      <div className="p-2 bg-slate-100 rounded-md border border-neutral-300 text-zinc-900 text-xs font-mono">
                        {activeCase.target}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: Output & Verdict */}
              {bottomTab === 'Output' && (
                <div className="space-y-3 font-mono text-xs">
                  {isRunning || isSubmitting ? (
                    <div className="flex items-center gap-2 text-indigo-900 py-4 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                      <span>{isRunning ? 'Running test cases on judge worker...' : 'Submitting solution to evaluator...'}</span>
                    </div>
                  ) : executionResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-bold text-sm">Accepted</span>
                        <span className="text-neutral-400 text-xs">({executionResult.passedCases}/{executionResult.totalCases} test cases passed)</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-neutral-200 space-y-1">
                        <div><span className="text-neutral-500">Your Output: </span><span className="text-zinc-900 font-semibold">{executionResult.output}</span></div>
                        <div><span className="text-neutral-500">Expected: </span><span className="text-zinc-900 font-semibold">[0, 1]</span></div>
                        <div><span className="text-neutral-500">Runtime: </span><span className="text-zinc-900">{executionResult.runtime}</span></div>
                        <div><span className="text-neutral-500">Memory: </span><span className="text-zinc-900">{executionResult.memory}</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-neutral-400 py-4 italic">
                      Click "Run Code" or "Submit Code" to see execution results.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Console / Custom Input */}
              {bottomTab === 'Console' && (
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-500 text-xs font-semibold">Custom Stdin:</label>
                  <textarea
                    value={customConsoleInput}
                    onChange={(e) => setCustomConsoleInput(e.target.value)}
                    placeholder="Enter custom input..."
                    className="flex-1 w-full p-2 bg-slate-50 rounded-md border border-neutral-300 font-mono text-xs text-zinc-900 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-900"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
