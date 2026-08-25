import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizOption {
	id: string;
	text: string;
}

interface QuizQuestionPanelProps {
	questionNumber: number;
	questionText: string;
	codeBlock?: string;
	options: QuizOption[];
	selectedOptionId: string | null;
	onSelectOption: (optionId: string) => void;
	onPrevious: () => void;
	onNext: () => void;
	isFirst: boolean;
	isLast: boolean;
}

export const QuizQuestionPanel: React.FC<QuizQuestionPanelProps> = ({
	questionNumber,
	questionText,
	codeBlock,
	options,
	selectedOptionId,
	onSelectOption,
	onPrevious,
	onNext,
	isFirst,
	isLast,
}) => {
	return (
		<div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
			{/* Question prompt */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-full">
						Question {questionNumber}
					</span>
				</div>
				<p className="text-[16px] font-semibold text-[#111827] leading-relaxed">{questionText}</p>
			</div>

			{/* Code block */}
			{codeBlock && (
				<div className="relative">
					<pre className="bg-[#1e1e2e] text-[#cdd6f4] text-[13px] font-mono leading-relaxed rounded-xl p-4 overflow-x-auto whitespace-pre">
						<code>{codeBlock}</code>
					</pre>
				</div>
			)}

			{/* Answer options */}
			<fieldset className="flex flex-col gap-3" aria-label="Answer options">
				<legend className="sr-only">Select your answer</legend>
				{options.map((option) => {
					const isSelected = selectedOptionId === option.id;
					return (
						<label
							key={option.id}
							className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
								isSelected
									? 'border-[#392C7D] bg-indigo-50/60'
									: 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
							}`}
						>
							<span
								className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
									isSelected ? 'border-[#392C7D]' : 'border-gray-300'
								}`}
								aria-hidden="true"
							>
								{isSelected && (
									<span className="w-2.5 h-2.5 rounded-full bg-[#392C7D]" />
								)}
							</span>
							<input
								type="radio"
								name="quiz-option"
								value={option.id}
								checked={isSelected}
								onChange={() => onSelectOption(option.id)}
								className="sr-only"
							/>
							<span className={`text-[14px] font-medium leading-snug ${isSelected ? 'text-[#392C7D]' : 'text-[#374151]'}`}>
								{option.text}
							</span>
						</label>
					);
				})}
			</fieldset>

			{/* Navigation buttons */}
			<div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
				<button
					onClick={onPrevious}
					disabled={isFirst}
					aria-label="Previous question"
					className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
				>
					<ChevronLeft className="w-4 h-4" />
					Previous
				</button>
				<button
					onClick={onNext}
					disabled={isLast}
					aria-label="Next question"
					className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#392C7D] text-white text-[14px] font-semibold hover:bg-[#2d2263] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
				>
					Next
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};
