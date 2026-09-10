import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface QuizSubmitModalProps {
	isOpen: boolean;
	answeredCount: number;
	totalQuestions: number;
	onConfirm: () => void;
	onCancel: () => void;
}

export const QuizSubmitModal: React.FC<QuizSubmitModalProps> = ({
	isOpen,
	answeredCount,
	totalQuestions,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null;

	const unansweredCount = totalQuestions - answeredCount;
	const allAnswered = unansweredCount === 0;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="submit-modal-title"
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onCancel}
				aria-hidden="true"
			/>

			{/* Modal card */}
			<div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col gap-5">
				{/* Close */}
				<button
					onClick={onCancel}
					aria-label="Cancel submission"
					className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:bg-slate-100 transition-colors cursor-pointer"
				>
					<X className="w-4 h-4" />
				</button>

				{/* Header */}
				<div className="flex flex-col gap-1">
					<h2 id="submit-modal-title" className="text-[20px] font-bold text-zinc-900">
						Submit Quiz
					</h2>
					<p className="text-[14px] text-zinc-700">
						Review your progress before submitting.
					</p>
				</div>

				{/* Stats */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
						<CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
						<div>
							<p className="text-[14px] font-semibold text-emerald-800">
								{answeredCount} of {totalQuestions} answered
							</p>
							<p className="text-[12px] text-emerald-600">Questions with a selected answer</p>
						</div>
					</div>

					{unansweredCount > 0 && (
						<div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
							<AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
							<div>
								<p className="text-[14px] font-semibold text-amber-800">
									{unansweredCount} unanswered
								</p>
								<p className="text-[12px] text-amber-600">Unanswered questions will be marked incorrect</p>
							</div>
						</div>
					)}
				</div>

				{!allAnswered && (
					<p className="text-[13px] text-neutral-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
						You can still go back and answer the remaining {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} before submitting.
					</p>
				)}

				{/* Actions */}
				<div className="flex gap-3 pt-1">
					<button
						onClick={onCancel}
						className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-zinc-700 hover:bg-slate-50 transition-all cursor-pointer"
					>
						Go back
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 py-2.5 rounded-xl bg-accent text-white text-[14px] font-semibold hover:bg-accent-hover transition-all shadow-sm cursor-pointer"
					>
						Submit quiz
					</button>
				</div>
			</div>
		</div>
	);
};
