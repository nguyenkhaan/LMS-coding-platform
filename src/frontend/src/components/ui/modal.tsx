import React, { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { X } from 'lucide-react';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	description?: React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	description,
	children,
	footer,
	maxWidth = 'md'
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) onClose();
		};
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeyDown);
		}
		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const maxSizes = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl'
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
				onClick={onClose}
			/>
			<div
				className={cn(
					'relative w-full rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200',
					maxSizes[maxWidth]
				)}
			>
				<div className="flex items-start justify-between gap-4 mb-4">
					<div>
						{title && <h3 className="text-lg font-bold text-[hsl(var(--text-primary))]">{title}</h3>}
						{description && <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">{description}</p>}
					</div>
					<button
						onClick={onClose}
						className="rounded-lg p-1 text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--bg-muted))] hover:text-[hsl(var(--text-primary))] transition-colors cursor-pointer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="py-2 text-sm text-[hsl(var(--text-primary))]">{children}</div>

				{footer && <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[hsl(var(--border-color))]">{footer}</div>}
			</div>
		</div>
	);
};
