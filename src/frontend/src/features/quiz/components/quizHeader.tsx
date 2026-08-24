import React from 'react';
import { Code2, LogOut, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizHeaderProps {
	quizTitle: string;
	currentQuestion: number;
	totalQuestions: number;
	timeRemaining: number;
	onExit: () => void;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
	quizTitle,
	currentQuestion,
	totalQuestions,
	timeRemaining,
	onExit,
}) => {
	const isWarning = timeRemaining <= 120;

	return (
		<header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
			<div className="w-full max-w-[1296px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 min-w-0">
					<Link to="/" className="flex items-center gap-2 shrink-0">
						<div className="w-9 h-9 rounded-xl bg-indigo-900 flex items-center justify-center text-white shadow-sm">
							<Code2 className="w-5 h-5" />
						</div>
						<span className="hidden sm:inline font-bold text-xl tracking-tight text-indigo-950">
							Skill<span className="text-rose-500">Boost</span>
						</span>
					</Link>
					<div className="hidden sm:flex flex-col leading-tight min-w-0">
						<span className="text-[13px] font-medium text-[#6B7280] truncate">Quiz</span>
						<h1 className="text-[16px] font-semibold text-[#111827] truncate">{quizTitle}</h1>
					</div>
					<span className="sm:hidden text-[15px] font-semibold text-[#111827] truncate">{quizTitle}</span>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<span className="text-[13px] font-medium text-[#374151]">
						Question{' '}
						<span className="font-bold text-[#392C7D]">{currentQuestion}</span>
						{' '}of{' '}
						<span className="font-bold text-[#392C7D]">{totalQuestions}</span>
					</span>
				</div>
				<div className="flex items-center gap-3 shrink-0">
					<div
						className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[14px] font-semibold border transition-colors ${
							isWarning
								? 'bg-red-50 border-red-200 text-[#FF4667]'
								: 'bg-slate-50 border-slate-200 text-[#374151]'
						}`}
						aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
					>
						<Clock className={`w-3.5 h-3.5 ${isWarning ? 'text-[#FF4667]' : 'text-[#6B7280]'}`} />
						{formatTime(timeRemaining)}
					</div>
					<button
						onClick={onExit}
						aria-label="Exit quiz"
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-semibold text-[#374151] hover:bg-slate-50 hover:text-[#FF4667] hover:border-rose-200 transition-all cursor-pointer"
					>
						<LogOut className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">Exit</span>
					</button>
				</div>
			</div>
		</header>
	);
};
