import React from 'react';

export const FigmaHeroBanner: React.FC = () => {
	return (
		<div className="w-full h-40 bg-gradient-to-r from-red-100 via-sky-100 to-blue-100 flex flex-col justify-center items-center">
			<h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">Course Grid</h1>
			<div className="flex items-center gap-2 mt-1 text-sm font-medium text-neutral-500">
				<span>Home</span>
				<span>&gt;</span>
				<span className="text-neutral-500">Course Grid</span>
			</div>
		</div>
	);
};
