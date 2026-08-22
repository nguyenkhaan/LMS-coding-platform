import { useAuthStore } from '@/stores/useAuthStore';
import { NotificationDropdown } from '@/features/notification/components/notification_dropdown';
import { GraduationCap, ShieldCheck, LogOut, FileText } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
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

interface ProblemDetail {
  id: number;
  codeId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  difficultyColor: string;
  difficultyBorder: string;
  successRate: string;
  xp: number;
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: TestCase[];
  starterCodes: Record<string, { ext: string; monacoLang: string; code: string }>;
}

const PROBLEMS_DATABASE: Record<string, ProblemDetail> = {
  'add-two-number': {
    id: 2,
    codeId: 'OJ-002',
    title: '2. Add Two Numbers',
    difficulty: 'Medium',
    difficultyColor: 'bg-amber-50 text-amber-800 border-amber-300',
    difficultyBorder: 'border-amber-400',
    successRate: '52.4%',
    xp: 200,
    tags: ['Linked List', 'Math', 'Recursion'],
    description:
      'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]'
      },
      {
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '[8,9,9,9,0,0,0,1]'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ],
    testCases: [
      { id: 1, nums: 'l1 = [2,4,3]', target: 'l2 = [5,6,4]', expected: '[7,0,8]' },
      { id: 2, nums: 'l1 = [0]', target: 'l2 = [0]', expected: '[0]' },
      { id: 3, nums: 'l1 = [9,9,9,9,9,9,9]', target: 'l2 = [9,9,9,9]', expected: '[8,9,9,9,0,0,0,1]' }
    ],
    starterCodes: {
      'Python 3': {
        ext: 'solution.py',
        monacoLang: 'python',
        code: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\nclass Solution:\n    def addTwoNumbers(self, l1, l2):\n        dummy = ListNode(0)\n        curr = dummy\n        carry = 0\n        \n        while l1 or l2 or carry:\n            val1 = l1.val if l1 else 0\n            val2 = l2.val if l2 else 0\n            \n            total = val1 + val2 + carry\n            carry = total // 10\n            curr.next = ListNode(total % 10)\n            curr = curr.next\n            \n            if l1: l1 = l1.next\n            if l2: l2 = l2.next\n            \n        return dummy.next\n"
      },
      'JavaScript': {
        ext: 'solution.js',
        monacoLang: 'javascript',
        code: "/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    let dummy = new ListNode(0);\n    let curr = dummy;\n    let carry = 0;\n    \n    while (l1 !== null || l2 !== null || carry > 0) {\n        let sum = carry;\n        if (l1 !== null) {\n            sum += l1.val;\n            l1 = l1.next;\n        }\n        if (l2 !== null) {\n            sum += l2.val;\n            l2 = l2.next;\n        }\n        carry = Math.floor(sum / 10);\n        curr.next = new ListNode(sum % 10);\n        curr = curr.next;\n    }\n    \n    return dummy.next;\n};"
      },
      'C++ 20': {
        ext: 'solution.cpp',
        monacoLang: 'cpp',
        code: "class Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        ListNode dummy(0);\n        ListNode* tail = &dummy;\n        int carry = 0;\n        \n        while (l1 || l2 || carry) {\n            int sum = carry;\n            if (l1) { sum += l1->val; l1 = l1->next; }\n            if (l2) { sum += l2->val; l2 = l2->next; }\n            carry = sum / 10;\n            tail->next = new ListNode(sum % 10);\n            tail = tail->next;\n        }\n        \n        return dummy.next;\n    }\n};"
      },
      'Java 17': {
        ext: 'Solution.java',
        monacoLang: 'java',
        code: "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        int carry = 0;\n        \n        while (l1 != null || l2 != null || carry != 0) {\n            int sum = carry;\n            if (l1 != null) {\n                sum += l1.val;\n                l1 = l1.next;\n            }\n            if (l2 != null) {\n                sum += l2.val;\n                l2 = l2.next;\n            }\n            carry = sum / 10;\n            curr.next = new ListNode(sum % 10);\n            curr = curr.next;\n        }\n        \n        return dummy.next;\n    }\n}"
      }
    }
  },
  'two-sum': {
    id: 1,
    codeId: 'OJ-001',
    title: '1. Two Sum',
    difficulty: 'Easy',
    difficultyColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    difficultyBorder: 'border-emerald-400',
    successRate: '68.2%',
    xp: 100,
    tags: ['Array', 'Hash Table'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      { id: 1, nums: '[2, 7, 11, 15]', target: '9', expected: '[0, 1]' },
      { id: 2, nums: '[3, 2, 4]', target: '6', expected: '[1, 2]' },
      { id: 3, nums: '[3, 3]', target: '6', expected: '[0, 1]' }
    ],
    starterCodes: {
      'Python 3': {
        ext: 'solution.py',
        monacoLang: 'python',
        code: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        seen = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i\n        return []\n"
      },
      'C++ 20': {
        ext: 'solution.cpp',
        monacoLang: 'cpp',
        code: "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};"
      },
      'JavaScript': {
        ext: 'solution.js',
        monacoLang: 'javascript',
        code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (seen.has(complement)) {\n            return [seen.get(complement), i];\n        }\n        seen.set(nums[i], i);\n    }\n    return [];\n};"
      },
      'Java 17': {
        ext: 'Solution.java',
        monacoLang: 'java',
        code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{seen.get(complement), i};\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}"
      }
    }
  }
};

export function OJWorkspacePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { problemSlug } = useParams<{ problemSlug: string }>();

  // Determine problem detail from DB (fallback to two-sum or add-two-number)
  const currentProblem: ProblemDetail = useMemo(() => {
    if (problemSlug && PROBLEMS_DATABASE[problemSlug]) {
      return PROBLEMS_DATABASE[problemSlug];
    }
    return PROBLEMS_DATABASE['add-two-number'] || PROBLEMS_DATABASE['two-sum'];
  }, [problemSlug]);

  // State
  const [selectedLang, setSelectedLang] = useState<string>('Python 3');
  const [code, setCode] = useState<string>(
    currentProblem.starterCodes['Python 3']?.code || ''
  );
  const [leftTab, setLeftTab] = useState<'Description' | 'Solutions' | 'Submissions' | 'Discussion'>('Description');
  const [bottomTab, setBottomTab] = useState<'Test Cases' | 'Output' | 'Console'>('Test Cases');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  
  // Custom case inputs
  const [caseInputs, setCaseInputs] = useState<TestCase[]>(currentProblem.testCases);
  const [customConsoleInput, setCustomConsoleInput] = useState('nums = [2,7,11,15]\ntarget = 9');

  // When problem or language changes, update code and testcases
  useEffect(() => {
    setCaseInputs(currentProblem.testCases);
    setSelectedCaseIndex(0);
    const starter = currentProblem.starterCodes[selectedLang] || currentProblem.starterCodes['Python 3'];
    if (starter) {
      setCode(starter.code);
    }
  }, [currentProblem, selectedLang]);

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
    const starter = currentProblem.starterCodes[lang] || currentProblem.starterCodes['Python 3'];
    if (starter) {
      setCode(starter.code);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setBottomTab('Output');
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'ACCEPTED',
        output: currentProblem.testCases[0]?.expected || '[0, 1]',
        runtime: '48 ms',
        memory: '14.2 MB',
        passedCases: currentProblem.testCases.length,
        totalCases: currentProblem.testCases.length
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
        output: currentProblem.testCases[0]?.expected || '[0, 1]',
        runtime: '42 ms (faster than 88.4%)',
        memory: '13.9 MB (less than 92.1%)',
        passedCases: currentProblem.testCases.length,
        totalCases: currentProblem.testCases.length
      });
    }, 1500);
  };

  const currentTemplate =
    currentProblem.starterCodes[selectedLang] || currentProblem.starterCodes['Python 3'];
  const activeCase = caseInputs[selectedCaseIndex] || caseInputs[0] || {
    id: 1,
    nums: '',
    target: '',
    expected: ''
  };

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
              {currentProblem.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-green-500/10 rounded border border-green-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">Success Rate: {currentProblem.successRate}</span>
          </div>
          <div className="px-2.5 py-1 bg-white/10 rounded border border-white/20 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-white text-xs font-semibold">{currentProblem.xp} XP</span>
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
              {Object.keys(currentProblem.starterCodes).map((lang) => (
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
          <div className={`px-3 py-1 rounded-xl border flex items-center ${currentProblem.difficultyColor}`}>
            <span className="text-xs font-bold">{currentProblem.difficulty}</span>
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
                  <h2 className="text-zinc-900 text-xl font-bold font-['Inter']">{currentProblem.title}</h2>
                  <div className={`px-2 py-0.5 rounded-md border ${currentProblem.difficultyColor}`}>
                    <span className="text-xs font-bold">{currentProblem.difficulty}</span>
                  </div>
                </div>

                {/* Topic Tags */}
                <div className="flex items-center gap-2">
                  {currentProblem.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-slate-100 rounded-xl text-zinc-600 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Problem Description Text */}
                <div className="text-neutral-600 text-sm font-normal leading-relaxed">
                  {currentProblem.description}
                </div>

                {/* Examples */}
                {currentProblem.examples.map((ex, idx) => (
                  <div key={idx} className="self-stretch flex flex-col gap-2">
                    <span className="text-zinc-900 text-sm font-bold">Example {idx + 1}:</span>
                    <div className="p-3 bg-slate-50 rounded-lg border border-neutral-200 flex flex-col gap-1 font-mono text-xs text-zinc-900">
                      <div><span className="font-bold">Input: </span>{ex.input}</div>
                      <div><span className="font-bold">Output: </span>{ex.output}</div>
                      {ex.explanation && (
                        <div><span className="font-bold">Explanation: </span>{ex.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                <div className="self-stretch flex flex-col gap-2">
                  <span className="text-zinc-900 text-sm font-bold">Constraints:</span>
                  <div className="flex flex-col gap-1.5 text-neutral-600 text-xs font-mono">
                    {currentProblem.constraints.map((c, idx) => (
                      <div key={idx}>• {c}</div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {leftTab === 'Solutions' && (
              <div className="space-y-4 text-sm text-neutral-700">
                <h3 className="font-bold text-base text-zinc-900">Approach: Optimal Solution</h3>
                <p>We can iterate through the input elements using an optimal data structure to achieve minimal time complexity.</p>
                <div className="p-3 bg-slate-50 rounded-lg border border-neutral-200 font-mono text-xs">
                  <p><strong>Time Complexity:</strong> O(n)</p>
                  <p><strong>Space Complexity:</strong> O(1) or O(n)</p>
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
                <span className="text-white text-xs font-semibold">{currentTemplate?.ext || 'solution.py'}</span>
              </div>
              <button 
                onClick={() => {
                  const starter = currentProblem.starterCodes[selectedLang] || currentProblem.starterCodes['Python 3'];
                  if (starter) setCode(starter.code);
                }}
                className="text-neutral-400 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
                language={currentTemplate?.monacoLang || 'python'}
                value={code}
                theme="vs-dark"
                onChange={(val) => setCode(val ?? '')}
                loading={<div className="h-full flex items-center justify-center text-xs text-slate-400">Loading code editor...</div>}
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
                      <label className="text-neutral-500 text-xs font-semibold">Input (nums / l1) =</label>
                      <div className="p-2 bg-slate-100 rounded-md border border-neutral-300 text-zinc-900 text-xs font-mono">
                        {activeCase.nums}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-neutral-500 text-xs font-semibold">Target / l2 =</label>
                      <div className="p-2 bg-slate-100 rounded-md border border-neutral-300 text-zinc-900 text-xs font-mono">
                        {activeCase.target}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: Output */}
              {bottomTab === 'Output' && (
                <div className="flex flex-col gap-3">
                  {executionResult ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{executionResult.status}</span>
                        </span>
                        <span className="text-xs text-neutral-500">
                          Runtime: <strong>{executionResult.runtime}</strong> | Memory: <strong>{executionResult.memory}</strong>
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-md border border-neutral-200 font-mono text-xs text-zinc-900 flex flex-col gap-1">
                        <div><span className="font-semibold text-neutral-500">Passed: </span>{executionResult.passedCases} / {executionResult.totalCases} Test Cases</div>
                        <div><span className="font-semibold text-neutral-500">Your Output: </span>{executionResult.output}</div>
                        <div><span className="font-semibold text-neutral-500">Expected: </span>{activeCase.expected}</div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-neutral-400 text-xs">
                      <Terminal className="w-8 h-8 text-neutral-300 mb-2" />
                      <span>Click "Run Code" or "Submit Code" to test your solution</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Console */}
              {bottomTab === 'Console' && (
                <div className="flex flex-col gap-2 h-full">
                  <span className="text-xs font-semibold text-neutral-500">Custom Standard Input (stdin):</span>
                  <textarea
                    value={customConsoleInput}
                    onChange={(e) => setCustomConsoleInput(e.target.value)}
                    className="flex-1 w-full p-2 bg-slate-900 text-green-400 font-mono text-xs rounded-md border border-gray-700 resize-none focus:outline-none"
                    placeholder="Enter custom inputs here..."
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
