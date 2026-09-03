import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	hint?: string;
	showCounter?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{ className, label, error, hint, id, showCounter = true, maxLength, value, defaultValue, ...props },
		ref
	) => {
		const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
		const currentVal = value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : '';
		const currentLength = currentVal.length;

		return (
			<div className="w-full space-y-1.5">
				{(label || (showCounter && maxLength !== undefined)) && (
					<div className="flex justify-between items-center text-xs font-semibold text-[hsl(var(--text-primary))]">
						{label ? <label htmlFor={textareaId}>{label}</label> : <span />}
						{showCounter && maxLength !== undefined && (
							<span className="text-[11px] font-medium text-[hsl(var(--text-muted))]">
								{currentLength} / {maxLength}
							</span>
						)}
					</div>
				)}
				<textarea
					id={textareaId}
					ref={ref}
					maxLength={maxLength}
					value={value}
					defaultValue={defaultValue}
					className={cn(
						'w-full px-3.5 py-2.5 text-sm rounded-xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-indigo))] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[90px]',
						error && 'border-[hsl(var(--color-status-error))] focus:ring-[hsl(var(--color-status-error))]',
						className
					)}
					{...props}
				/>
				{error && <p className="text-xs text-[hsl(var(--color-status-error))] font-medium">{error}</p>}
				{!error && hint && <p className="text-xs text-[hsl(var(--text-muted))]">{hint}</p>}
			</div>
		);
	}
);

Textarea.displayName = 'Textarea';
