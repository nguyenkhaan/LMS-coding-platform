import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { QuizHeader } from '../components/quizHeader.tsx';
import { QuizQuestionPanel } from '../components/quizQuestionPanel.tsx';
import { QuizNavigator } from '../components/quizNavigator.tsx';
import { QuizSubmitModal } from '../components/quizSubmitModal.tsx';

// ---------------------------------------------------------------------------
// Static mock data — replace with API data when the quiz service is ready
// ---------------------------------------------------------------------------
const MOCK_QUIZ = {
	id: 'quiz-control-flow-01',
	title: 'Control Flow',
	durationSeconds: 14 * 60 + 32, // 14:32
	questions: [
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
	],
};

// ---------------------------------------------------------------------------
// QUIZ01 — Quiz Attempt Page
// ---------------------------------------------------------------------------
export const QuizAttemptPage: React.FC = () => {
	const navigate = useNavigate();
	const { quizId } = useParams<{ quizId: string }>();
	const location = useLocation();
	const courseSlug = location.state?.courseSlug;
	const lessonId = location.state?.lessonId;

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> optionId
	const [timeRemaining, setTimeRemaining] = useState(MOCK_QUIZ.durationSeconds);
	const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

	const totalQuestions = MOCK_QUIZ.questions.length;
	const currentQuestion = MOCK_QUIZ.questions[currentQuestionIndex];
	const answeredSet = new Set(
		Object.keys(answers).map((k) => Number(k))
	);

	// Countdown timer
	useEffect(() => {
		if (timeRemaining <= 0) {
			toast.warning('Time is up! Submitting quiz automatically.');
			handleFinalSubmit();
			return;
		}
		const id = setInterval(() => {
			setTimeRemaining((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(id);
	}, [timeRemaining]);

	const handleSelectOption = useCallback(
		(optionId: string) => {
			setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
		},
		[currentQuestion.id]
	);

	const handleNext = useCallback(() => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex((i) => i + 1);
		}
	}, [currentQuestionIndex, totalQuestions]);

	const handlePrevious = useCallback(() => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((i) => i - 1);
		}
	}, [currentQuestionIndex]);

	const handleJump = useCallback((qNum: number) => {
		setCurrentQuestionIndex(qNum - 1);
	}, []);

	const handleSaveAndExit = useCallback(() => {
		toast.success('Progress saved. You can resume this quiz later.');
		navigate(-1);
	}, [navigate]);

	const handleSubmitRequest = useCallback(() => {
		setIsSubmitModalOpen(true);
	}, []);

	const handleFinalSubmit = useCallback(() => {
		setIsSubmitModalOpen(false);
		toast.success(`Quiz submitted!`);
		const targetQuizId = quizId || 'quiz-control-flow-01';
		navigate(`/quiz/${targetQuizId}/result`, {
			state: {
				answers,
				courseSlug,
				lessonId
			}
		});
	}, [answers, quizId, navigate, courseSlug, lessonId]);

	const handleExit = useCallback(() => {
		if (answeredSet.size > 0) {
			toast.info('Your progress has been saved.');
		}
		navigate('/courses-overview/python-foundations');
	}, [answeredSet.size, navigate]);

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<QuizHeader
				quizTitle={MOCK_QUIZ.title}
				currentQuestion={currentQuestionIndex + 1}
				totalQuestions={totalQuestions}
				timeRemaining={timeRemaining}
				onExit={handleExit}
			/>

			{/* Mobile: question grid above content */}
			<div className="lg:hidden w-full max-w-[1296px] mx-auto px-4 pt-4">
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
					<div className="grid grid-cols-10 gap-1.5">
						{MOCK_QUIZ.questions.map((_, i) => {
							const qNum = i + 1;
							const isCurrent = qNum === currentQuestionIndex + 1;
							const isAnswered = answeredSet.has(MOCK_QUIZ.questions[i].id);
							let cls = 'w-full aspect-square rounded-lg text-[12px] font-semibold flex items-center justify-center border transition-all cursor-pointer ';
							if (isCurrent) cls += 'bg-[#392C7D] text-white border-[#392C7D]';
							else if (isAnswered) cls += 'bg-emerald-50 text-emerald-700 border-emerald-200';
							else cls += 'bg-slate-50 text-[#374151] border-gray-200';
							return (
								<button
									key={qNum}
									onClick={() => handleJump(qNum)}
									aria-label={`Question ${qNum}`}
									aria-current={isCurrent ? 'true' : undefined}
									className={cls}
								>
									{qNum}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Main content */}
			<main className="w-full max-w-[1296px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 flex-1">
				{/* Question panel */}
				<QuizQuestionPanel
					questionNumber={currentQuestionIndex + 1}
					questionText={currentQuestion.text}
					codeBlock={currentQuestion.codeBlock}
					options={currentQuestion.options}
					selectedOptionId={answers[currentQuestion.id] ?? null}
					onSelectOption={handleSelectOption}
					onPrevious={handlePrevious}
					onNext={handleNext}
					isFirst={currentQuestionIndex === 0}
					isLast={currentQuestionIndex === totalQuestions - 1}
				/>

				{/* Navigator sidebar — desktop only */}
				<div className="hidden lg:flex">
					<QuizNavigator
						totalQuestions={totalQuestions}
						currentQuestion={currentQuestionIndex + 1}
						answeredSet={answeredSet}
						onJump={handleJump}
						onSaveAndExit={handleSaveAndExit}
						onSubmit={handleSubmitRequest}
					/>
				</div>
			</main>

			{/* Mobile bottom actions */}
			<div className="lg:hidden w-full max-w-[1296px] mx-auto px-4 pb-6">
				<div className="flex gap-3">
					<button
						onClick={handleSaveAndExit}
						className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer"
					>
						Save and exit
					</button>
					<button
						onClick={handleSubmitRequest}
						className="flex-1 py-3 rounded-xl bg-[#FF4667] text-white text-[14px] font-semibold hover:bg-[#e03d5b] transition-all cursor-pointer"
					>
						Submit quiz
					</button>
				</div>
			</div>

			<QuizSubmitModal
				isOpen={isSubmitModalOpen}
				answeredCount={answeredSet.size}
				totalQuestions={totalQuestions}
				onConfirm={handleFinalSubmit}
				onCancel={() => setIsSubmitModalOpen(false)}
			/>
		</div>
	);
};

export default QuizAttemptPage;
