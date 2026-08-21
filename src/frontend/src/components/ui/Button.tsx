import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg' | 'icon';
	isLoading?: boolean;
	icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'primary', size = 'md', isLoading = false, icon, children, disabled, ...props }, ref) => {
		const baseStyles =
			'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

		const variants = {
			primary:
				'bg-[hsl(var(--color-brand-indigo))] hover:opacity-95 text-white shadow-sm focus:ring-[hsl(var(--color-brand-indigo))]',
			secondary:
				'bg-[hsl(var(--bg-muted))] hover:bg-[hsl(var(--border-color))] text-[hsl(var(--text-primary))] focus:ring-slate-400',
			outline:
				'border border-[hsl(var(--border-color))] bg-transparent hover:bg-[hsl(var(--bg-muted))] text-[hsl(var(--text-primary))] focus:ring-slate-400',
			ghost:
				'bg-transparent hover:bg-[hsl(var(--bg-muted))] text-[hsl(var(--text-primary))] focus:ring-slate-400',
			danger:
				'bg-[hsl(var(--color-status-error))] hover:opacity-90 text-white focus:ring-[hsl(var(--color-status-error))]'
		};

		const sizes = {
			sm: 'px-3 py-1.5 text-xs gap-1.5',
			md: 'px-4 py-2 text-sm gap-2',
			lg: 'px-6 py-3 text-base gap-2.5',
			icon: 'p-2 w-9 h-9'
		};

		return (
			<button
				ref={ref}
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
