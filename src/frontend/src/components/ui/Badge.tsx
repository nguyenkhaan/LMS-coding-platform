import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'success' | 'warning' | 'error' | 'indigo' | 'purple' | 'cyan';
	size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
	children,
	className,
	variant = 'default',
	size = 'sm',
	...props
}) => {
	const variants = {
		default: 'bg-[hsl(var(--bg-muted))] text-[hsl(var(--text-secondary))] border border-[hsl(var(--border-color))]',
		success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
		warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
		error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
		indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
		purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
		cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
	};

	const sizes = {
		sm: 'px-2 py-0.5 text-xs font-medium rounded-md',
		md: 'px-2.5 py-1 text-sm font-medium rounded-lg'
	};

	return (
		<span className={cn('inline-flex items-center gap-1 leading-none', variants[variant], sizes[size], className)} {...props}>
			{children}
		</span>
	);
};
