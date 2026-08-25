import React from 'react';

interface QuizNavigatorProps {
	totalQuestions: number;
	currentQuestion: number;
	answeredSet: Set<number>;
	onJump: (index: number) => void;
	onSaveAndExit: () => void;
	onSubmit: () => void;
}

export const QuizNavigator: React.FC<QuizNavigatorProps> = ({
	totalQuestions,
	currentQuestion,
	answeredSet,
	onJump,
	onSaveAndExit,
	onSubmit,
}) => {
	const answeredCount = answeredSet.size;
	const unansweredCount = totalQuestions - answeredCount;

	return (
		<aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
			{/* Question navigator grid */}
			<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
				<h2 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide">Question Navigation</h2>

				<div className="grid grid-cols-5 gap-2">
					{Array.from({ length: totalQuestions }, (_, i) => {
						const qNum = i + 1;
						const isCurrent = qNum === currentQuestion;
						const isAnswered = answeredSet.has(qNum);

						let buttonClass =
							'w-9 h-9 rounded-lg text-[13px] font-semibold flex items-center justify-center transition-all cursor-pointer border ';

						if (isCurrent) {
							buttonClass += 'bg-[#392C7D] text-white border-[#392C7D] shadow-sm';
						} else if (isAnswered) {
							buttonClass += 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
						} else {
							buttonClass += 'bg-slate-50 text-[#374151] border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-[#392C7D]';
						}

						return (
							<button
								key={qNum}
								onClick={() => onJump(qNum)}
								aria-label={`Go to question ${qNum}${isAnswered ? ' (answered)' : ''}${isCurrent ? ' (current)' : ''}`}
								aria-current={isCurrent ? 'true' : undefined}
								className={buttonClass}
							>
								{qNum}
							</button>
						);
					})}
				</div>

				{/* Legend */}
				<div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
					<div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
						<span className="w-3 h-3 rounded-sm bg-[#392C7D] inline-block" />
						<span>Current</span>
					</div>
					<div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
						<span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200 inline-block" />
						<span>Answered ({answeredCount})</span>
					</div>
					<div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
						<span className="w-3 h-3 rounded-sm bg-slate-100 border border-gray-200 inline-block" />
						<span>Unanswered ({unansweredCount})</span>
					</div>
				</div>
			</div>

			{/* Action buttons */}
			<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
				<button
					onClick={onSaveAndExit}
					className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-[#374151] hover:border-indigo-200 hover:text-[#392C7D] hover:bg-indigo-50/50 transition-all cursor-pointer"
				>
					Save and exit
				</button>
				<button
					onClick={onSubmit}
					className="w-full py-2.5 rounded-xl bg-[#FF4667] text-white text-[14px] font-semibold hover:bg-[#e03d5b] transition-all shadow-sm cursor-pointer"
				>
					Submit quiz
				</button>
			</div>
		</aside>
	);
};
