import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface SidebarFiltersProps {
	search: string;
	setSearch: (v: string) => void;
	selectedCats: string[];
	toggleCat: (c: string) => void;
	selectedLevels: string[];
	toggleLevel: (l: string) => void;
	resetFilters: () => void;
}

export const CourseCatalogFilters: React.FC<SidebarFiltersProps> = ({
	search,
	setSearch,
	selectedCats,
	toggleCat,
	selectedLevels,
	toggleLevel,
	resetFilters
}) => {
	const categories = ["Programming", "Interview", "Frontend", "Backend", "Data"];
	const levels = ["Beginner", "Intermediate", "Advanced"];

	return (
		<div className="w-52 p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4">
			<div className="text-primary text-sm font-bold pb-2 border-b border-neutral-100">Filters</div>
			
			{/* Text Search inside sidebar */}
			<div className="flex flex-col gap-1.5">
				<span className="text-zinc-900 text-xs font-semibold">Search Course</span>
				<div className="relative">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Course name..."
						className="w-full pl-8 pr-2 py-1 text-xs border border-neutral-200 rounded-lg focus:outline-primary"
					/>
					<Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
				</div>
			</div>

			{/* Category Checkboxes */}
			<div className="flex flex-col gap-2 pt-2">
				<span className="text-zinc-900 text-xs font-semibold">Category</span>
				{categories.map((cat) => (
					<label key={cat} className="flex items-center gap-2.5 text-xs text-neutral-500 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={selectedCats.includes(cat)}
							onChange={() => toggleCat(cat)}
							className="rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
						/>
						<span>{cat}</span>
					</label>
				))}
			</div>

			{/* Level Checkboxes */}
			<div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
				<span className="text-zinc-900 text-xs font-semibold">Level</span>
				{levels.map((lvl) => (
					<label key={lvl} className="flex items-center gap-2.5 text-xs text-neutral-500 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={selectedLevels.includes(lvl)}
							onChange={() => toggleLevel(lvl)}
							className="rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
						/>
						<span>{lvl}</span>
					</label>
				))}
			</div>

			{/* Reset Filters button */}
			<button
				onClick={resetFilters}
				className="w-full mt-2 py-1.5 bg-primary text-white hover:bg-primary-hover text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
			>
				<RotateCcw className="w-3.5 h-3.5" />
				Reset filters
			</button>
		</div>
	);
};
