import React from 'react';

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (p: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, setCurrentPage }) => {
	return (
		<div className="w-full flex justify-between items-center text-sm font-medium border-t border-slate-100 pt-6 mt-8">
			<span className="text-neutral-500">Page {currentPage} of {totalPages}</span>
			<div className="flex gap-2">
				{Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i + 1}
						onClick={() => setCurrentPage(i + 1)}
						className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all cursor-pointer ${
							currentPage === i + 1
								? 'bg-[#FF4667] text-white shadow-md shadow-rose-500/20'
								: 'bg-slate-100 hover:bg-slate-200 text-neutral-500'
						}`}
					>
						{i + 1}
					</button>
				))}
			</div>
		</div>
	);
};
