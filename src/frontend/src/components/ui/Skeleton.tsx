import React from 'react';
import { cn } from '@/utils/cn';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
	return (
		<div
			className={cn(
				'animate-pulse rounded-xl bg-[hsl(var(--bg-muted))]',
				className
			)}
			{...props}
		/>
	);
};
