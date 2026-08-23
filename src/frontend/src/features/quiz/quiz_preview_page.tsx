import React from 'react';
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  Clock,
  FileQuestion,
  CheckCircle2,
  Lock,
  PlayCircle,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useCourseStore } from '@/stores/useCourseStore';

// ---------------------------------------------------------------------------
// Mock data — replace with API response when quiz service is ready
// ---------------------------------------------------------------------------
const MOCK_QUIZ_PREVIEW = {
  id: 'control-flow-01',
  title: 'Control Flow',
  questionCount: 10,
  timeLimitMinutes: 20,
  passingScorePercent: 70,
  questionTypes: ['Multiple choice', 'Code reading'],
  instructions:
    'Read each question carefully and select the best answer. You must answer every question before submitting. Once you submit you cannot change your answers.',
  sampleQuestion: {
    text: 'What does the following program print?',
    codeBlock: 'for i in range(3):\n    print(i)',
    options: ['0 1 2', '1 2 3', '0 1 2 3', 'Error'],
  },
};

const MOCK_COURSE_CONTENT = [
  { id: 1, title: 'Introduction', completed: true, type: 'lesson' },
  { id: 2, title: 'Variables & Types', completed: true, type: 'lesson' },
  { id: 3, title: 'Control Flow', completed: false, type: 'quiz', active: true },
  { id: 4, title: 'Functions', completed: false, type: 'lesson' },
  { id: 5, title: 'Practice Problems', completed: false, type: 'lesson' },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CourseContentRailProps {
  courseSlug: string;
  activeLessonId?: string;
}

const CourseContentRail: React.FC<CourseContentRailProps> = ({ courseSlug, activeLessonId }) => {
  const { courses } = useCourseStore();
  const currentCourse = courses.find((c) => c.slug === courseSlug || c.id === courseSlug);
  const navigate = useNavigate();

  if (!currentCourse) {
    return (
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-slate-50">
            <h2 className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">
              Course Content
            </h2>
          </div>
          <nav aria-label="Course lessons">
            {MOCK_COURSE_CONTENT.map((item) => {
              const isActive = item.active;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${
                    isActive
                      ? 'bg-indigo-50/70 border-l-2 border-l-[#392C7D]'
                      : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                  }`}
                >
                  <span className="shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : item.active ? (
                      <PlayCircle className="w-4 h-4 text-[#392C7D]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                  </span>
                  <span
                    className={`text-[13px] leading-snug ${
                      isActive
                        ? 'font-semibold text-[#392C7D]'
                        : item.completed
                        ? 'font-medium text-[#374151]'
                        : 'font-normal text-[#6B7280]'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    );
  }

  const items: any[] = [];
  currentCourse.sections.forEach((sec) => {
    sec.lessons.forEach((les) => {
      const hasQuiz = les.contents.some(c => c.content_type === 'Quiz');
      items.push({
        id: les.id,
        title: les.title,
        type: hasQuiz ? 'quiz' : 'lesson',
        completed: false,
        active: les.id === activeLessonId
      });
    });
  });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-slate-50 bg-[#392C7D]/5">
          <h2 className="text-[12px] font-bold text-[#392C7D] uppercase tracking-wider truncate">
            {currentCourse.title}
          </h2>
        </div>
        <nav aria-label="Course lessons">
          {items.map((item) => {
            const isActive = item.active;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'quiz') {
                    navigate(`/quiz/${item.id}/preview`, {
                      state: { courseSlug, lessonId: item.id }
                    });
                  } else {
                    navigate(`/learn/${courseSlug}`);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/70 border-l-2 border-l-[#392C7D]'
                    : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                }`}
              >
                <span className="shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isActive ? (
                    <PlayCircle className="w-4 h-4 text-[#392C7D]" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                </span>
                <span
                  className={`text-[13px] leading-snug truncate ${
                    isActive
                      ? 'font-semibold text-[#392C7D] font-bold'
                      : 'font-normal text-[#374151]'
                  }`}
                >
                  {item.title}
                </span>
                {item.type === 'quiz' && (
                  <span className="ml-auto text-[11px] font-semibold text-[#FF4667] bg-rose-50 px-1.5 py-0.5 rounded-full shrink-0">
                    Quiz
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

interface QuizMetaChipProps {
  icon: React.ReactNode;
  label: string;
}

const QuizMetaChip: React.FC<QuizMetaChipProps> = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-full text-[13px] font-medium text-[#374151]">
    {icon}
    {label}
  </div>
);

interface SampleQuestionPreviewProps {
  question: typeof MOCK_QUIZ_PREVIEW.sampleQuestion;
}

const SampleQuestionPreview: React.FC<SampleQuestionPreviewProps> = ({ question }) => (
  <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider bg-white border border-gray-200 px-2 py-0.5 rounded-full">
        Sample Question
      </span>
    </div>
    <p className="text-[15px] font-semibold text-[#111827] leading-relaxed">{question.text}</p>
    {question.codeBlock && (
      <pre className="bg-[#1e1e2e] text-[#cdd6f4] text-[13px] font-mono leading-relaxed rounded-xl p-4 overflow-x-auto whitespace-pre">
        <code>{question.codeBlock}</code>
      </pre>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {question.options.map((opt, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-[#374151]"
        >
          <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" aria-hidden="true" />
          {opt}
        </div>
      ))}
    </div>
    <p className="text-[12px] text-[#6B7280] italic">
      * This is a preview only. You cannot answer questions until the quiz starts.
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// QUIZ02 — Quiz Preview Page
// ---------------------------------------------------------------------------
export const QuizPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const courseSlug = searchParams.get('courseSlug') || location.state?.courseSlug || 'python-foundations-for-problem-solving';
  const lessonId = searchParams.get('lessonId') || location.state?.lessonId || quizId;

  React.useEffect(() => {
    navigate(`/learn/${courseSlug}?lessonId=${lessonId}`, { replace: true });
  }, [navigate, courseSlug, lessonId]);

  return null;
};

export default QuizPreviewPage;
