import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Send,
  Search,
  Check,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Terminal,
  MessageSquare,
  Clock,
  FileQuestion,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCourseStore } from '@/features/courses/model/useCourseStore';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

interface RawLessonContent {
  quizDescription?: string;
  quizQuestions?: Array<{ points?: number }>;
  problemDifficulty?: string;
  problemTags?: string[];
  problemStatement?: string;
  problemConstraints?: string;
  problemSlug?: string;
}

interface LessonItem {
  id: string;
  title: string;
  type: 'Reading' | 'Quiz' | 'Problem';
  path: string;
  isCompleted: boolean;
  isActive: boolean;
  rawContent?: RawLessonContent;
}

interface CommentMessage {
  id: number;
  sender: string;
  role: 'Instructor' | 'Student';
  avatarInitials: string;
  text: string;
  timeAgo: string;
  likes: number;
}

const INITIAL_LESSONS: LessonItem[] = [
  { id: '1', title: 'Hash tables from scratch', type: 'Reading', path: '/learn/dsa-module-2', isCompleted: true, isActive: false },
  { id: '2', title: 'Collision strategies', type: 'Reading', path: '/learn/dsa-module-2', isCompleted: true, isActive: false },
  { id: '3', title: 'Two-pointer patterns', type: 'Reading', path: '/learn/dsa-module-2', isCompleted: false, isActive: true },
  { id: '4', title: 'Two-pointer practice problem', type: 'Problem', path: '/classroom/lesson/problem-preview', isCompleted: false, isActive: false },
  { id: '5', title: 'Lesson review & quiz', type: 'Quiz', path: '/quiz/quiz-control-flow-01/preview', isCompleted: false, isActive: false }
];

const INITIAL_COMMENTS: CommentMessage[] = [
  {
    id: 1,
    sender: 'Thu Ha',
    role: 'Instructor',
    avatarInitials: 'TH',
    text: 'Please review the opposing pointers template before tackling the practice problem set.',
    timeAgo: '2 hours ago',
    likes: 5
  },
  {
    id: 2,
    sender: 'Bao Anh',
    role: 'Student',
    avatarInitials: 'BA',
    text: 'Is the sliding window template available on the resources tab?',
    timeAgo: '1 hour ago',
    likes: 2
  },
  {
    id: 3,
    sender: 'Thu Ha',
    role: 'Instructor',
    avatarInitials: 'TH',
    text: 'Yes! Navigate to Resources -> templates.py to download it.',
    timeAgo: '30 mins ago',
    likes: 4
  }
];

export function ClassroomPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { courseSlug } = useParams<{ courseSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const backRoute = location.state?.from || `/courses/${courseSlug}`;
  const { courses } = useCourseStore();
  const currentCourse = courses.find(c => c.slug === courseSlug || c.id === courseSlug);
  const activeLessonId = searchParams.get('lessonId');

  const getInitialLessons = (): LessonItem[] => {
    if (!currentCourse) return INITIAL_LESSONS.map(l => ({ ...l, id: String(l.id) }));

    const dynamicLessons: LessonItem[] = [];
    let idx = 1;
    currentCourse.sections.forEach(sec => {
      sec.lessons.forEach(les => {
        if (les.contents.length > 0) {
          les.contents.forEach(content => {
            const isFirst = dynamicLessons.length === 0;
            const isTarget = activeLessonId ? (content.id === activeLessonId || les.id === activeLessonId) : isFirst;
            dynamicLessons.push({
              id: content.id || String(idx++),
              title: content.title,
              type: content.content_type === 'Reading' ? 'Reading' : content.content_type === 'Quiz' ? 'Quiz' : 'Problem',
              path: content.content_type === 'Reading' ? `/learn/${courseSlug}` : content.content_type === 'Quiz' ? `/quiz/${content.id}/preview` : `/classroom/lesson/problem-preview`,
              isCompleted: false,
              isActive: isTarget,
              rawContent: content
            });
          });
        } else {
          const isFirst = dynamicLessons.length === 0;
          const isTarget = activeLessonId ? (les.id === activeLessonId) : isFirst;
          dynamicLessons.push({
            id: les.id,
            title: les.title,
            type: 'Reading',
            path: `/learn/${courseSlug}`,
            isCompleted: false,
            isActive: isTarget,
            rawContent: les as unknown as RawLessonContent
          });
        }
      });
    });

    return dynamicLessons.length > 0 ? dynamicLessons : INITIAL_LESSONS.map(l => ({ ...l, id: String(l.id) }));
  };

  const [lessons, setLessons] = useState<LessonItem[]>(getInitialLessons);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentMessage[]>(INITIAL_COMMENTS);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [courseSearch, setCourseSearch] = useState<string>('');

  useEffect(() => {
    if (activeLessonId) {
      setLessons((prev) =>
        prev.map((l) => ({ ...l, isActive: l.id === activeLessonId }))
      );
    }
  }, [activeLessonId]);

  const activeLesson = lessons.find((l) => l.isActive) || lessons[0] || INITIAL_LESSONS[0]!;
  const courseTitle = currentCourse ? currentCourse.title : "Data Structures & Algorithms";
  const subtitleInfo = currentCourse 
    ? `${currentCourse.field} · ${activeLesson.title}`
    : "Module 2 · Lesson 3 — Two-pointer patterns";

  const activeIndex = lessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;

  const handlePrevClick = () => {
    if (prevLesson) {
      handleSelectLesson(prevLesson);
    }
  };

  const handleNextClick = () => {
    if (nextLesson) {
      handleSelectLesson(nextLesson);
    }
  };

  const handleToggleComplete = () => {
    setIsLessonCompleted(!isLessonCompleted);
    setLessons((prev) =>
      prev.map((l) => (l.id === activeLesson.id ? { ...l, isCompleted: !isLessonCompleted } : l))
    );
    toast.success(isLessonCompleted ? 'Marked as uncompleted' : 'Lesson marked as completed!');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newComment: CommentMessage = {
      id: Date.now(),
      sender: user?.fullName || 'Student Learner',
      role: user?.roles.includes('TEACHER') ? 'Instructor' : 'Student',
      avatarInitials: user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'SL',
      text: inputMsg.trim(),
      timeAgo: 'Just now',
      likes: 0
    };

    setComments((prev) => [...prev, newComment]);
    setInputMsg('');
    toast.success('Comment posted successfully!');
  };

  const handleSelectLesson = (lesson: LessonItem) => {
    setSearchParams({ lessonId: lesson.id });
    setLessons((prev) =>
      prev.map((l) => ({ ...l, isActive: l.id === lesson.id }))
    );
  };

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="self-stretch px-6 lg:px-20 py-14 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 flex flex-col justify-center items-center gap-3 text-center border-b border-neutral-200/60 font-['Inter']">
        <h1 className="text-zinc-900 text-4xl font-extrabold tracking-tight">Workspace</h1>
        <div className="opacity-80 text-zinc-700 text-sm font-medium flex items-center gap-2">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <span>&gt;</span>
          <Link to="/courses" className="hover:underline">Courses</Link>
          <span>&gt;</span>
          <span className="text-zinc-900 font-semibold">{courseTitle}</span>
        </div>
        <button
          onClick={() => navigate(backRoute)}
          className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-900 hover:text-white bg-indigo-50 hover:bg-indigo-900 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Details</span>
        </button>
      </div>

      {/* 2. SUBHEADER: SEARCH & STUDENT PROFILE BAR */}
      <div className="self-stretch bg-oj-surface-alt/90 border-b border-neutral-200 backdrop-blur-xs px-6 lg:px-20 py-3.5 flex justify-between items-center shadow-xs font-['Inter']">
        <div className="max-w-[1608px] w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Search bar */}
          <div className="w-full sm:w-96 px-3.5 py-2 bg-slate-50 rounded-[10px] border border-neutral-200 flex items-center gap-2.5 shadow-2xs">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input maxLength={100}
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search in this course…"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          {/* Student Profile Info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-900 text-xs font-bold font-['Inter']">
                {user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-zinc-900 text-sm font-semibold leading-tight">{user.fullName}</span>
                <span className="text-neutral-400 text-xs font-normal">
                  {user.roles.includes('TEACHER') ? 'Instructor' : user.roles.includes('ADMIN') ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. LESSON TITLE & ACTION BAR */}
      <div className="max-w-[1608px] w-full mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-['Inter']">
        <div className="flex flex-col gap-1">
          <h2 className="text-zinc-900 text-2xl font-bold tracking-tight">{courseTitle}</h2>
          <p className="text-neutral-500 text-sm font-normal">{subtitleInfo}</p>
        </div>

        {/* Complete Lesson Button */}
        <button
          onClick={handleToggleComplete}
          className={`px-4 py-2 rounded-[10px] border text-sm font-medium transition-colors flex items-center gap-2 shadow-2xs cursor-pointer font-['Inter'] ${
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
      <div className="max-w-[1608px] w-full mx-auto px-6 pb-16 flex flex-col lg:flex-row gap-8 items-start font-['Inter']">
        
        {/* LEFT COLUMN: Markdown Course Reading Article (No Video) */}
        <article className="flex-1 w-full bg-white rounded-2xl border border-neutral-200 p-6 lg:p-8 shadow-sm space-y-8 font-['Inter']">
          
          {activeLesson.type === 'Reading' && (
            <>
              {/* Reading Lesson Header Banner */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      {activeLesson.type} Lesson · Theory &amp; Concepts
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {activeLesson.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>15 min read</span>
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
                <p className="text-neutral-600 text-sm leading-relaxed">
                  In sorted arrays, two pointers approach each other from opposing ends. This allows us to make monotonic decisions on whether to increment or decrement based on comparing the current element evaluation against the target metric:
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-neutral-200 text-sm text-neutral-700 space-y-2">
                  <p className="font-semibold text-zinc-900">Standard Initialization:</p>
                  <ul className="list-disc list-inside space-y-1 font-mono text-xs text-indigo-950">
                    <li><code className="text-rose-600 font-bold">left = 0</code> (Points to the beginning index)</li>
                    <li><code className="text-rose-600 font-bold">right = len(arr) - 1</code> (Points to the terminating index)</li>
                    <li>Loop condition: <code className="text-indigo-600 font-bold">while left &lt; right:</code></li>
                  </ul>
                </div>
              </section>

              {/* Section 3: Step-by-Step Decision Logic */}
              <section className="space-y-3">
                <h3 className="text-zinc-900 text-xl font-bold">3. Step-by-Step Traversal Logic</h3>
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm text-neutral-700 space-y-2">
                  <ul className="list-disc list-inside space-y-2 text-xs text-neutral-800">
                    <li className="pl-4">If <code className="font-mono text-indigo-900 font-bold">current_sum == target</code>: Match found! Return the indices immediately.</li>
                    <li className="pl-4">If <code className="font-mono text-indigo-900 font-bold">current_sum &lt; target</code>: The sum is too small; increment <code className="font-mono text-indigo-900 font-bold">left += 1</code> to inspect a larger number.</li>
                    <li className="pl-4">If <code className="font-mono text-indigo-900 font-bold">current_sum &gt; target</code>: The sum is too large; decrement <code className="font-mono text-indigo-900 font-bold">right -= 1</code> to inspect a smaller number.</li>
                  </ul>
                </div>
              </section>

              {/* Section 4: Complexity Analysis */}
              <section className="space-y-2 pt-2 border-t border-neutral-100">
                <h3 className="text-zinc-900 text-lg font-bold">4. Complexity &amp; Resource Evaluation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 bg-profile-surface rounded-xl border border-profile-surface-border shadow-2xs">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Time Complexity</span>
                    <p className="text-indigo-900 font-extrabold text-lg font-mono mt-1">O(N)</p>
                    <p className="text-neutral-600 text-xs mt-1">Each element in the array is evaluated at most once as pointers converge.</p>
                  </div>
                  <div className="p-4 bg-profile-surface rounded-xl border border-profile-surface-border shadow-2xs">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Space Complexity</span>
                    <p className="text-indigo-900 font-extrabold text-lg font-mono mt-1">O(1)</p>
                    <p className="text-neutral-600 text-xs mt-1">Operates in-place utilizing only two constant auxiliary pointer variables.</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeLesson.type === 'Quiz' && (
            <>
              {/* Quiz Lesson Header Banner */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <FileQuestion className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      {activeLesson.type} checkpoint
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {activeLesson.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>20 min limit</span>
                </div>
              </div>

              {/* Quiz details & parameters card */}
              <div className="bg-slate-50 border border-neutral-200 rounded-xl p-5 flex flex-col gap-5">
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {activeLesson.rawContent?.quizDescription || 'Checkpoint test to evaluate your understanding of the material.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">Total Questions</span>
                    <p className="text-zinc-900 font-extrabold text-lg font-mono mt-1">
                      {activeLesson.rawContent?.quizQuestions?.length || 10}
                    </p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">Total Points</span>
                    <p className="text-zinc-900 font-extrabold text-lg font-mono mt-1">
                      {((activeLesson.rawContent as { quizQuestions?: Array<{ points?: number }> })?.quizQuestions || []).reduce((acc: number, q: { points?: number }) => acc + (q.points || 0), 0) || 100}
                    </p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Passing Score</span>
                    <p className="text-emerald-700 font-extrabold text-lg font-mono mt-1">70%</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-lg font-bold">Quiz Instructions</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Read each question carefully and select the best answer. You must answer every question before submitting. Once you submit, you cannot change your answers. Only click "Start Quiz" when you are fully ready to begin the countdown timer.
                </p>
              </div>

              {/* Start Quiz Action */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => {
                    navigate(`/quiz/${activeLesson.id}/attempt`, {
                      state: {
                        courseSlug,
                        lessonId: activeLesson.id
                      }
                    });
                  }}
                  className="px-8 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <FileQuestion className="w-4 h-4" />
                  <span>Start Quiz</span>
                </button>
              </div>
            </>
          )}

          {activeLesson.type === 'Problem' && (
            <>
              {/* Problem Lesson Header Banner */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Practice challenge
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {activeLesson.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Interactive workspace</span>
                </div>
              </div>

              {/* Badges & Statement */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider border border-rose-200">
                    Problem
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    {activeLesson.rawContent?.problemDifficulty || 'Easy'}
                  </span>
                  {(activeLesson.rawContent?.problemTags || ['Math', 'Two Pointers']).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-neutral-600 text-sm leading-relaxed">
                  {activeLesson.rawContent?.problemStatement || 'Given two integers a and b, read them from standard input and print their sum.'}
                </p>
              </div>

              {/* Constraints */}
              {activeLesson.rawContent?.problemConstraints && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Constraints</span>
                  <p className="text-xs font-mono text-neutral-600 leading-normal">
                    {activeLesson.rawContent?.problemConstraints}
                  </p>
                </div>
              )}

              {/* Action Trigger */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => navigate(`/practice/${activeLesson.rawContent?.problemSlug || 'two-sum'}`)}
                  className="px-8 py-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Open Coding Workspace</span>
                </button>
              </div>
            </>
          )}

          {/* Navigation controls footer */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={handlePrevClick}
              disabled={!prevLesson}
              className="text-neutral-500 hover:text-zinc-900 disabled:opacity-40 text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: {prevLesson ? prevLesson.title : 'None'}</span>
            </button>

            <button
              onClick={handleNextClick}
              disabled={!nextLesson}
              className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 disabled:opacity-40 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Next: {nextLesson ? nextLesson.title : 'None'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </article>

        {/* RIGHT COLUMN: Course Content & Comments (320px width) */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0 font-['Inter']">
          
          {/* Card 1: Course Content */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex flex-col gap-4 font-['Inter']">
            <div className="flex justify-between items-center">
              <span className="text-zinc-900 text-base font-semibold font-['Inter']">Course content</span>
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

            {/* Lessons List with Direct Link Support */}
            <div className="flex flex-col gap-2 pt-1 font-['Inter']">
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

          {/* Card 2: Comments (Replaces Cohort Chat, Inter font) */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col overflow-hidden h-[420px] font-['Inter']">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-900" />
                <span className="text-zinc-900 text-base font-semibold font-['Inter']">Comments ({comments.length})</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-xs font-['Inter']">
              {comments.map((msg) => {
                const isInstructor = msg.role === 'Instructor';
                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isInstructor ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-zinc-800 border border-neutral-200'
                    }`}>
                      {msg.avatarInitials}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-zinc-900">{msg.sender}</span>
                          <span className="text-[10px] text-neutral-400">· {msg.role}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">{msg.timeAgo}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-neutral-100 rounded-xl rounded-tl-xs text-neutral-700 text-xs leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendComment} className="p-3.5 border-t border-neutral-200 flex flex-col gap-2 bg-white font-['Inter']">
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-medium">Leave a comment</span>
                <span className="font-mono text-[10px] text-neutral-400">{inputMsg.length}/300</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={300}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask a question or comment..."
                  className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-neutral-200 text-xs text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim() || inputMsg.length > 300}
                  className="h-8 px-3 bg-indigo-900 hover:bg-indigo-950 disabled:opacity-40 text-white rounded-xl flex items-center justify-center gap-1 text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
              <span className="text-[10px] text-neutral-400">
                Note: Maximum 300 characters per message.
              </span>
            </form>
          </div>

        </aside>

      </div>

    </div>
  );
}
