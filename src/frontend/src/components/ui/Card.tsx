import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
	return (
		<div
			className={cn(
				'rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] p-5 shadow-xs transition-all duration-200',
				hoverable && 'hover:border-slate-400/50 hover:shadow-md cursor-pointer',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};
