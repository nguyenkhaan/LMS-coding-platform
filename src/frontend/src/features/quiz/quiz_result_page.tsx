import React from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RotateCcw,
} from 'lucide-react';

const MOCK_QUIZ_QUESTIONS = [
	{
		id: 1,
		text: 'What does the following program print?',
		codeBlock: `for i in range(3):\n    print(i)`,
		options: [
			{ id: 'a', text: '0 1 2' },
			{ id: 'b', text: '1 2 3' },
			{ id: 'c', text: '0 1 2 3' },
			{ id: 'd', text: 'Error' },
		],
	},
	{
		id: 2,
		text: 'Which keyword is used to exit a loop early in Python?',
		codeBlock: undefined,
		options: [
			{ id: 'a', text: 'exit' },
			{ id: 'b', text: 'break' },
			{ id: 'c', text: 'continue' },
			{ id: 'd', text: 'return' },
		],
	},
	{
		id: 3,
		text: 'What is the output of the following snippet?',
		codeBlock: `x = 5\nif x > 3:\n    print("big")\nelse:\n    print("small")`,
		options: [
			{ id: 'a', text: 'small' },
			{ id: 'b', text: 'big' },
			{ id: 'c', text: 'None' },
			{ id: 'd', text: 'Error' },
		],
	},
	{
		id: 4,
		text: 'What does `continue` do inside a loop?',
		codeBlock: undefined,
		options: [
			{ id: 'a', text: 'Stops the loop' },
			{ id: 'b', text: 'Skips the rest of the current iteration and continues with the next' },
			{ id: 'c', text: 'Restarts the loop from the beginning' },
			{ id: 'd', text: 'Causes a syntax error' },
		],
	},
	{
		id: 5,
		text: 'What is the range of values produced by range(2, 8, 2)?',
		codeBlock: undefined,
		options: [
			{ id: 'a', text: '2, 4, 6, 8' },
			{ id: 'b', text: '2, 4, 6' },
			{ id: 'c', text: '0, 2, 4, 6' },
			{ id: 'd', text: '2, 8' },
		],
	},
	{
		id: 6,
		text: 'Which of the following is a valid Python while loop?',
		codeBlock: undefined,
		options: [
			{ id: 'a', text: 'while x > 0 do:' },
			{ id: 'b', text: 'while (x > 0):' },
			{ id: 'c', text: 'while x > 0:' },
			{ id: 'd', text: 'loop while x > 0:' },
		],
	},
	{
		id: 7,
		text: 'What will this code print?',
		codeBlock: `for i in range(5):\n    if i == 3:\n        break\n    print(i)`,
		options: [
			{ id: 'a', text: '0 1 2 3' },
			{ id: 'b', text: '0 1 2' },
			{ id: 'c', text: '0 1 2 4' },
			{ id: 'd', text: '1 2 3' },
		],
	},
	{
		id: 8,
		text: 'What is the result of evaluating `not True or False`?',
		codeBlock: undefined,
		options: [
			{ id: 'a', text: 'True' },
			{ id: 'b', text: 'False' },
			{ id: 'c', text: 'None' },
			{ id: 'd', text: 'Error' },
		],
	},
	{
		id: 9,
		text: 'Which statement correctly uses an elif clause?',
		codeBlock: undefined,
		options: [
			{ id: 'a', text: 'if x > 0: ... else if x < 0:' },
			{ id: 'b', text: 'if x > 0: ... elseif x < 0:' },
			{ id: 'c', text: 'if x > 0: ... elif x < 0:' },
			{ id: 'd', text: 'if x > 0: ... else: if x < 0:' },
		],
	},
	{
		id: 10,
		text: 'What will the following loop print?',
		codeBlock: `i = 0\nwhile i < 3:\n    print(i)\n    i += 1`,
		options: [
			{ id: 'a', text: '1 2 3' },
			{ id: 'b', text: '0 1 2' },
			{ id: 'c', text: '0 1 2 3' },
			{ id: 'd', text: 'Infinite loop' },
		],
	},
];

const MOCK_QUIZ_CORRECT_ANSWERS: Record<number, string> = {
	1: 'a',
	2: 'b',
	3: 'b',
	4: 'b',
	5: 'b',
	6: 'c',
	7: 'b',
	8: 'b',
	9: 'c',
	10: 'b',
};

const BACKEND_QUIZ_QUESTIONS = [
	{
		id: 1,
		text: "Python là ngôn ngữ lập trình thuộc loại nào?",
		options: [
			{ id: '1', text: "Ngôn ngữ biên dịch (Compiled)" },
			{ id: '2', text: "Ngôn ngữ thông dịch (Interpreted)" },
			{ id: '3', text: "Ngôn ngữ hợp ngữ (Assembly)" },
			{ id: '4', text: "Ngôn ngữ máy (Machine code)" },
		],
	},
	{
		id: 2,
		text: "Hàm nào dùng để in ra màn hình trong Python?",
		options: [
			{ id: '1', text: "echo()" },
			{ id: '2', text: "console.log()" },
			{ id: '3', text: "print()" },
			{ id: '4', text: "write()" },
		],
	},
	{
		id: 3,
		text: "Kết quả của biểu thức 3 ** 2 trong Python là?",
		options: [
			{ id: '1', text: "9" },
			{ id: '2', text: "6" },
			{ id: '3', text: "32" },
			{ id: '4', text: "Lỗi cú pháp" },
		],
	},
];

const BACKEND_QUIZ_CORRECT_ANSWERS: Record<number, string> = {
	1: '2',
	2: '3',
	3: '1',
};

export const QuizResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();

  // Retrieve answers passed from QuizAttemptPage
  const userAnswers: Record<number, string> = location.state?.answers || {};

  const isBackendQuiz = quizId !== 'quiz-control-flow-01' && quizId !== 'control-flow-01' && quizId !== '1';
  const questions = !isBackendQuiz && quizId === '1' ? BACKEND_QUIZ_QUESTIONS : MOCK_QUIZ_QUESTIONS;
  const correctAnswers = !isBackendQuiz && quizId === '1' ? BACKEND_QUIZ_CORRECT_ANSWERS : MOCK_QUIZ_CORRECT_ANSWERS;

  // Calculate results
  let correctCount = 0;
  questions.forEach(q => {
    if (userAnswers[q.id] && String(userAnswers[q.id]) === String(correctAnswers[q.id])) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercent >= 70; // 70% passing threshold

  const handleRetry = () => {
    navigate(`/quiz/${quizId || 'quiz-control-flow-01'}/attempt`);
  };

  const handleBackToCourse = () => {
    navigate('/courses-overview/python-foundations');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter'] antialiased">
      {/* slim header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full max-w-[1296px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#392C7D] to-purple-600 flex items-center justify-center text-white shadow">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline font-extrabold text-[15px] tracking-tight text-[#392C7D]">
                Dreams LMS
              </span>
            </Link>
            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-[13px] text-[#6B7280]">
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/courses" className="hover:text-[#392C7D] transition-colors">
                Courses
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#374151]">Classroom</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-[#392C7D]">Quiz Result</span>
            </nav>
          </div>
          <button
            onClick={handleBackToCourse}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-250 text-[13px] font-semibold text-[#374151] hover:bg-slate-50 hover:text-[#392C7D] hover:border-indigo-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Course</span>
          </button>
        </div>
      </header>

      {/* body */}
      <main className="w-full max-w-[800px] mx-auto px-4 py-8 flex-1 flex flex-col gap-6">
        {/* Score summary panel */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[#FF4667] uppercase tracking-wider">
              Quiz Completed
            </span>
            <h1 className="text-[24px] font-extrabold text-[#111827]">
              {quizId === '1' ? "Kiểm tra kiến thức Python cơ bản" : "Control Flow Quiz Results"}
            </h1>
          </div>

          <div className="relative size-36 flex items-center justify-center">
            {/* simple circular ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="42" 
                className="stroke-slate-100 fill-none" 
                strokeWidth="10" 
              />
              <circle 
                cx="50" cy="50" r="42" 
                className={`fill-none transition-all duration-1000 ${
                  isPassed ? 'stroke-emerald-500' : 'stroke-[#FF4667]'
                }`}
                strokeWidth="10" 
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - scorePercent / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#111827]">{scorePercent}%</span>
              <span className="text-[11px] font-semibold text-neutral-500">Score</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 items-center">
            {isPassed ? (
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-250 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Passed (Required: 70%)
              </span>
            ) : (
              <span className="px-3.5 py-1 bg-rose-50 text-rose-800 text-xs font-semibold rounded-full border border-rose-250 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Failed (Required: 70%)
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="w-full grid grid-cols-3 border-t border-gray-105 pt-6 mt-2 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-[#111827]">{totalQuestions}</span>
              <span className="text-xs text-neutral-500 font-semibold mt-0.5">Total Questions</span>
            </div>
            <div className="flex flex-col items-center border-x border-gray-105">
              <span className="text-xl font-bold text-emerald-600">{correctCount}</span>
              <span className="text-xs text-neutral-500 font-semibold mt-0.5">Correct</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-[#FF4667]">{incorrectCount}</span>
              <span className="text-xs text-neutral-500 font-semibold mt-0.5">Incorrect</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-semibold">
          <button
            onClick={handleBackToCourse}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[#374151] hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            Back to Course
          </button>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#392C7D] text-white text-[14px] hover:bg-[#392C7D]/95 transition-all shadow-sm cursor-pointer w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>
        </div>

        {/* Question by question results */}
        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-lg font-bold text-[#111827] px-1">Question Review</h2>
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const correctAnswer = correctAnswers[q.id];
            const isCorrect = userAnswer && String(userAnswer) === String(correctAnswer);

            return (
              <div 
                key={q.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col gap-4 shadow-sm transition-all ${
                  isCorrect ? 'border-emerald-100 hover:border-emerald-200' : 'border-rose-100 hover:border-rose-250'
                }`}
              >
                {/* question label and status */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider bg-slate-50 border border-gray-200 px-2 py-0.5 rounded-full">
                    Question {idx + 1}
                  </span>
                  {isCorrect ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#FF4667] flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect
                    </span>
                  )}
                </div>

                {/* question text */}
                <p className="text-[15px] font-semibold text-[#111827] leading-relaxed">
                  {q.text}
                </p>

                {/* code block if any */}
                {q.codeBlock && (
                  <pre className="bg-[#1e1e2e] text-[#cdd6f4] text-[13px] font-mono leading-relaxed rounded-xl p-4 overflow-x-auto whitespace-pre">
                    <code>{q.codeBlock}</code>
                  </pre>
                )}

                {/* options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = String(userAnswer) === String(opt.id);
                    const isRight = String(opt.id) === String(correctAnswer);
                    
                    let cardClass = "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[14px] border transition-all ";
                    if (isRight) {
                      cardClass += "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium";
                    } else if (isSelected) {
                      cardClass += "border-rose-500 bg-rose-50/50 text-rose-950 font-medium";
                    } else {
                      cardClass += "border-gray-200 bg-white text-[#374151]";
                    }

                    return (
                      <div key={opt.id} className={cardClass}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isRight 
                            ? 'border-emerald-500 bg-emerald-500 text-white' 
                            : isSelected 
                              ? 'border-rose-500 bg-rose-500 text-white' 
                              : 'border-gray-300'
                        }`}>
                          {isRight ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : isSelected ? (
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : null}
                        </div>
                        {opt.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default QuizResultPage;
