import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center p-4 bg-radial from-[hsl(var(--bg-card))] to-[hsl(var(--bg-main))] text-[hsl(var(--text-primary))]">
			<div className="mb-6 flex items-center gap-2.5">
				<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
					<Code2 className="w-6 h-6" />
				</div>
				<Link to="/" className="font-bold text-2xl tracking-tight bg-gradient-to-r from-[hsl(var(--color-brand-indigo))] to-[hsl(var(--color-brand-purple))] bg-clip-text text-transparent">
					SkillBoost
				</Link>
			</div>

			<div className="w-full max-w-md">
				<Outlet />
			</div>
		</div>
	);
};
