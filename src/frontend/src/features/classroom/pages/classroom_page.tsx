import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Send,
  Search,
  Check,
  Code2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface LessonItem {
  id: number;
  title: string;
  type: 'Reading' | 'Quiz' | 'Problem';
  path: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface ChatMessage {
  id: number;
  sender: string;
  role: 'Instructor' | 'Student';
  avatarInitials: string;
  text: string;
}

const INITIAL_LESSONS: LessonItem[] = [
  { id: 1, title: 'Hash tables from scratch', type: 'Reading', path: '/learn/dsa-module-2', isCompleted: true, isActive: false },
  { id: 2, title: 'Collision strategies', type: 'Reading', path: '/learn/dsa-module-2', isCompleted: true, isActive: false },
  { id: 3, title: 'Two-pointer patterns', type: 'Reading', path: '/learn/dsa-module-2', isCompleted: false, isActive: true },
  { id: 4, title: 'Two-pointer practice problem', type: 'Problem', path: '/classroom/lesson/problem-preview', isCompleted: false, isActive: false },
  { id: 5, title: 'Lesson review & quiz', type: 'Quiz', path: '/quiz/quiz-control-flow-01/preview', isCompleted: false, isActive: false }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: 'Thu Ha',
    role: 'Instructor',
    avatarInitials: 'TH',
    text: 'Reminder: please submit problem set B before Friday midnight.'
  },
  {
    id: 2,
    sender: 'Bao Anh',
    role: 'Student',
    avatarInitials: 'BA',
    text: 'Is the sliding window template available on the resources tab?'
  },
  {
    id: 3,
    sender: 'Thu Ha',
    role: 'Instructor',
    avatarInitials: 'TH',
    text: 'Yes! Navigate to Resources -> templates.py to download it.'
  }
];

export function ClassroomPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonItem[]>(INITIAL_LESSONS);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [courseSearch, setCourseSearch] = useState<string>('');

  const activeLesson = lessons.find((l) => l.isActive) || lessons[2];

  const handleToggleComplete = () => {
    setIsLessonCompleted(!isLessonCompleted);
    setLessons((prev) =>
      prev.map((l) => (l.id === activeLesson.id ? { ...l, isCompleted: !isLessonCompleted } : l))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: 'Minh Tran',
      role: 'Student',
      avatarInitials: 'MT',
      text: inputMsg.trim()
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleSelectLesson = (lesson: LessonItem) => {
    if (lesson.path && lesson.path !== '/learn/dsa-module-2') {
      navigate(lesson.path);
    } else {
      setLessons((prev) =>
        prev.map((l) => ({ ...l, isActive: l.id === lesson.id }))
      );
    }
  };

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="self-stretch px-6 lg:px-20 py-14 bg-gradient-to-r from-red-100 via-sky-100 to-blue-100 flex flex-col justify-center items-center gap-3 text-center border-b border-neutral-200/60">
        <h1 className="text-zinc-900 text-4xl font-extrabold tracking-tight">Workspace</h1>
        <div className="opacity-80 text-zinc-700 text-sm font-medium flex items-center gap-2">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <span>&gt;</span>
          <Link to="/courses" className="hover:underline">Courses</Link>
          <span>&gt;</span>
          <span className="text-zinc-900 font-semibold">Data Structures &amp; Algorithms</span>
        </div>
      </div>

      {/* 2. SUBHEADER: SEARCH & STUDENT PROFILE BAR */}
      <div className="self-stretch bg-white/90 border-b border-neutral-200 backdrop-blur-xs px-6 lg:px-20 py-3.5 flex justify-between items-center shadow-xs">
        <div className="max-w-[1608px] w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Search bar */}
          <div className="w-full sm:w-96 px-3.5 py-2 bg-slate-50 rounded-[10px] border border-neutral-200 flex items-center gap-2.5 shadow-2xs">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search in this course…"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          {/* Student Profile Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-900 text-xs font-bold font-['Plus_Jakarta_Sans']">
              MT
            </div>
            <div className="flex flex-col text-left">
              <span className="text-zinc-900 text-sm font-semibold leading-tight">Minh Tran</span>
              <span className="text-neutral-400 text-xs font-normal">Student</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LESSON TITLE & ACTION BAR */}
      <div className="max-w-[1608px] w-full mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-zinc-900 text-2xl font-bold tracking-tight">Data Structures &amp; Algorithms</h2>
          <p className="text-neutral-500 text-sm font-normal">Module 2 · Lesson 3 — Two-pointer patterns</p>
        </div>

        {/* Complete Lesson Button */}
        <button
          onClick={handleToggleComplete}
          className={`px-4 py-2 rounded-[10px] border text-sm font-medium transition-colors flex items-center gap-2 shadow-2xs cursor-pointer ${
            isLessonCompleted
              ? 'bg-green-50 border-green-500 text-green-700 font-semibold'
              : 'bg-white border-neutral-300 text-zinc-800 hover:bg-slate-50'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{isLessonCompleted ? 'Completed' : 'Mark lesson complete'}</span>
        </button>
      </div>

      {/* 4. MAIN CONTENT CONTAINER (2-COLUMN) */}
      <div className="max-w-[1608px] w-full mx-auto px-6 pb-16 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Video Player + Markdown Course Article */}
        <article className="flex-1 w-full bg-white rounded-2xl border border-neutral-200 p-6 lg:p-8 shadow-sm space-y-8">
          
          {/* VIDEO / MEDIA PLAYER */}
          <div className="w-full aspect-video bg-zinc-950 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between p-4 relative group">
            {/* Header badges inside video */}
            <div className="flex justify-between items-center z-10">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Lesson 3 of 5
              </span>
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-mono border border-white/10">
                12:35 / 18:40
              </span>
            </div>

            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => toast.info('Playing lesson lecture video...')}
                className="w-16 h-16 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1" />
              </button>
            </div>

            {/* Video Footer Controls Placeholder */}
            <div className="z-10 flex flex-col gap-2">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between items-center text-white/80 text-xs">
                <span>Two-pointer Algorithm Execution Walkthrough</span>
                <span>HD 1080p</span>
              </div>
            </div>
          </div>

          {/* Section 1: Overview */}
          <section className="space-y-4 pt-2">
            <h3 className="text-zinc-900 text-2xl font-bold tracking-tight">1. Theoretical Foundation</h3>
            <p className="text-neutral-600 text-base leading-relaxed">
              The <strong>Two-Pointer Technique</strong> is an essential algorithmic optimization strategy commonly applied to linear data structures such as <em>Arrays</em>, <em>Strings</em>, and <em>Linked Lists</em>. By orchestrating two index pointers that iterate through the collection in a synchronized or opposing manner, we eliminate the need for nested quadratic loops, reducing asymptotic time complexity from <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm text-indigo-900 font-semibold">O(N²)</code> down to <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm text-green-700 font-semibold">O(N)</code>.
            </p>
          </section>

          {/* Section 2: Opposing Pointers Pattern */}
          <section className="space-y-3">
            <h3 className="text-zinc-900 text-xl font-bold">2. Opposing Direction Strategy</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-neutral-200 text-sm text-neutral-700 space-y-2">
              <p className="font-semibold text-zinc-900">Standard Initialization:</p>
              <ul className="list-disc list-inside space-y-1 font-mono text-xs text-indigo-950">
                <li><code className="text-rose-600 font-bold">left = 0</code> (Points to the beginning index)</li>
                <li><code className="text-rose-600 font-bold">right = len(arr) - 1</code> (Points to the terminating index)</li>
                <li>Loop condition: <code className="text-indigo-600 font-bold">while left &lt; right:</code></li>
              </ul>
            </div>
          </section>

          {/* Navigation to Practice Problem */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => toast.info('Navigating to previous lesson.')}
              className="text-neutral-500 hover:text-zinc-900 text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Collision strategies</span>
            </button>

            <button
              onClick={() => navigate('/classroom/lesson/problem-preview')}
              className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Practice Problem: Sum of Two Numbers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </article>

        {/* RIGHT COLUMN: Course Content & Cohort Chat (320px width) */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          
          {/* Card 1: Course Content */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-900 text-base font-semibold font-['Plus_Jakarta_Sans']">Course content</span>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-[10px]">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-900 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Lessons List */}
            <div className="flex flex-col gap-2 pt-1">
              {lessons.map((lesson) => {
                const isSelected = lesson.isActive;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`p-3 rounded-xl border transition-colors flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs'
                        : 'bg-white border-neutral-200 hover:bg-slate-50'
                    }`}
                  >
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isSelected ? (
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-900 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-900" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-950 font-semibold' : 'text-zinc-800'}`}>
                        {lesson.title}
                      </p>
                      <span className="text-xs text-neutral-400">{lesson.type}</span>
                    </div>

                    {lesson.type === 'Problem' && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full border border-rose-200">
                        Solve
                      </span>
                    )}
                    {lesson.type === 'Quiz' && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                        Quiz
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Cohort Chat */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col overflow-hidden h-[420px]">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center gap-2 bg-slate-50/50">
              <span className="text-zinc-900 text-base font-semibold font-['Plus_Jakarta_Sans']">Cohort chat</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-xs">
              {messages.map((msg) => {
                const isInstructor = msg.role === 'Instructor';
                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isInstructor ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-zinc-800 border border-neutral-200'
                    }`}>
                      {msg.avatarInitials}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-900">{msg.sender}</span>
                        <span className="text-[10px] text-neutral-400">· {msg.role}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-neutral-100 rounded-xl rounded-tl-xs text-neutral-700 text-xs leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Message your cohort…"
                className="flex-1 px-3 py-2 bg-slate-50 rounded-[10px] border border-neutral-200 text-xs text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="w-8 h-8 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-[10px] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </aside>

      </div>

    </div>
  );
}
