import React from 'react';
import { cn } from '@/lib/cn';
import { Inbox } from 'lucide-react';
import { Button } from './button.tsx';

export interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	icon = <Inbox className="w-12 h-12 text-[hsl(var(--text-muted))]" />,
	title,
	description,
	actionLabel,
	onAction,
	className
}) => {
	return (
		<div className={cn('flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))]/50', className)}>
			<div className="mb-3 p-3 rounded-full bg-[hsl(var(--bg-muted))]">{icon}</div>
			<h4 className="text-base font-semibold text-[hsl(var(--text-primary))]">{title}</h4>
			{description && <p className="text-xs text-[hsl(var(--text-secondary))] max-w-sm mt-1">{description}</p>}
			{actionLabel && onAction && (
				<Button size="sm" variant="outline" className="mt-4" onClick={onAction}>
					{actionLabel}
				</Button>
			)}
		</div>
	);
};
