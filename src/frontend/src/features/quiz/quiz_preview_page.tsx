import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  Clock,
  FileQuestion,
  CheckCircle2,
  Lock,
  PlayCircle,
  ArrowLeft,
} from 'lucide-react';

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
}

const CourseContentRail: React.FC<CourseContentRailProps> = ({ courseSlug }) => {
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
  const quiz = MOCK_QUIZ_PREVIEW;

  const handleStartQuiz = () => {
    navigate(`/quiz/${quizId ?? quiz.id}/attempt`);
  };

  const handleBack = () => {
    navigate('/courses-overview/python-foundations');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Slim top nav */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full max-w-[1296px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: logo + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-2 shrink-0" aria-label="SkillBoost LMS home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#392C7D] to-purple-600 flex items-center justify-center text-white shadow">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline font-extrabold text-[15px] tracking-tight text-[#392C7D]">
                Dreams LMS
              </span>
            </Link>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-[13px] text-[#6B7280]">
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/courses" className="hover:text-[#392C7D] transition-colors">
                Courses
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#374151]">Classroom</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-[#392C7D]">Quiz</span>
            </nav>
          </div>

          {/* Right: back button */}
          <button
            onClick={handleBack}
            aria-label="Back to lesson"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-semibold text-[#374151] hover:bg-slate-50 hover:text-[#392C7D] hover:border-indigo-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      {/* Page body */}
      <main className="w-full max-w-[1296px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 flex-1">
        {/* Left rail: course content */}
        <CourseContentRail courseSlug="python-foundations" />

        {/* Right: quiz preview panel */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Quiz title + meta chips */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold text-[#FF4667] uppercase tracking-wider">
                Quiz
              </span>
              <h1 className="text-[20px] font-bold text-[#111827]">{quiz.title}</h1>
            </div>

            {/* Meta chips row */}
            <div className="flex flex-wrap gap-2">
              <QuizMetaChip
                icon={<FileQuestion className="w-3.5 h-3.5 text-[#392C7D]" />}
                label={`${quiz.questionCount} questions`}
              />
              <QuizMetaChip
                icon={<Clock className="w-3.5 h-3.5 text-[#392C7D]" />}
                label={`${quiz.timeLimitMinutes} minutes`}
              />
              <QuizMetaChip
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                label={`Passing score ${quiz.passingScorePercent}%`}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Question types */}
            <div className="flex flex-col gap-2">
              <h2 className="text-[13px] font-bold text-[#374151] uppercase tracking-wide">
                Question Types
              </h2>
              <div className="flex flex-wrap gap-2">
                {quiz.questionTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-indigo-50 text-[#392C7D] text-[12px] font-semibold rounded-full border border-indigo-100"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-2">
              <h2 className="text-[13px] font-bold text-[#374151] uppercase tracking-wide">
                Instructions
              </h2>
              <p className="text-[14px] text-[#374151] leading-relaxed">{quiz.instructions}</p>
            </div>
          </div>

          {/* Sample question preview */}
          <SampleQuestionPreview question={quiz.sampleQuestion} />

          {/* Action bar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to lesson
            </button>
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF4667] text-white text-[14px] font-semibold hover:bg-[#e03d5b] transition-all shadow-sm cursor-pointer w-full sm:w-auto justify-center"
            >
              <PlayCircle className="w-4 h-4" />
              Start quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPreviewPage;
