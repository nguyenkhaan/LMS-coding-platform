import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
	iconPrefix?: React.ReactNode;
	iconSuffix?: React.ReactNode;
	showCounter?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ className, label, error, hint, iconPrefix, iconSuffix, id, showCounter, maxLength, value, defaultValue, ...props },
		ref
	) => {
		const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
		const currentVal = value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : '';
		const currentLength = currentVal.length;

		return (
			<div className="w-full space-y-1.5">
				{(label || (showCounter && maxLength !== undefined)) && (
					<div className="flex justify-between items-center text-xs font-semibold text-text-primary">
						{label ? <label htmlFor={inputId}>{label}</label> : <span />}
						{showCounter && maxLength !== undefined && (
							<span className="text-[11px] font-medium text-[hsl(var(--text-muted))]">
								{currentLength} / {maxLength}
							</span>
						)}
					</div>
				)}
				<div className="relative flex items-center">
					{iconPrefix && (
						<span className="absolute left-3 text-text-secondary pointer-events-none">
							{iconPrefix}
						</span>
					)}
					<input
						id={inputId}
						ref={ref}
						maxLength={maxLength}
						value={value}
						defaultValue={defaultValue}
						className={cn(
							'w-full px-3.5 py-2 text-sm rounded-xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-indigo))] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
							iconPrefix && 'pl-9',
							iconSuffix && 'pr-9',
							error && 'border-[hsl(var(--color-status-error))] focus:ring-[hsl(var(--color-status-error))]',
							className
						)}
						{...props}
					/>
					{iconSuffix && (
						<span className="absolute right-3 text-[hsl(var(--text-muted))]">
							{iconSuffix}
						</span>
					)}
				</div>
				{error && <p className="text-xs text-[hsl(var(--color-status-error))] font-medium">{error}</p>}
				{!error && hint && <p className="text-xs text-[hsl(var(--text-muted))]">{hint}</p>}
			</div>
		);
	}
);

Input.displayName = 'input';
