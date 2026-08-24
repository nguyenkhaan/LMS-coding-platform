import React from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
	id: string;
	label: string;
	icon?: React.ReactNode;
	badge?: string | number;
}

export interface TabsProps {
	tabs: TabItem[];
	activeTab: string;
	onChange: (tabId: string) => void;
	className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
	return (
		<div className={cn('flex items-center gap-2 border-b border-[hsl(var(--border-color))] pb-px', className)}>
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						onClick={() => onChange(tab.id)}
						className={cn(
							'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all cursor-pointer',
							isActive
								? 'border-[hsl(var(--color-brand-indigo))] text-[hsl(var(--color-brand-indigo))] font-semibold'
								: 'border-transparent text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]'
						)}
					>
						{tab.icon}
						<span>{tab.label}</span>
						{tab.badge !== undefined && (
							<span
								className={cn(
									'px-1.5 py-0.5 text-xs rounded-full',
									isActive
										? 'bg-[hsl(var(--color-brand-indigo))]/15 text-[hsl(var(--color-brand-indigo))]'
										: 'bg-[hsl(var(--bg-muted))] text-[hsl(var(--text-muted))]'
								)}
							>
								{tab.badge}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
};
