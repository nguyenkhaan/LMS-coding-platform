import React, { useEffect, useRef } from 'react';
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
	const modalRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		previousActiveElement.current = document.activeElement as HTMLElement | null;
		document.body.style.overflow = 'hidden';

		// Focus first focusable element inside modal, or the modal itself
		const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		if (focusableElements && focusableElements.length > 0) {
			focusableElements[0].focus();
		} else {
			modalRef.current?.focus();
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
				return;
			}

			if (e.key === 'Tab' && modalRef.current) {
				const focusables = modalRef.current.querySelectorAll<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
				if (focusables.length === 0) return;

				const first = focusables[0];
				const last = focusables[focusables.length - 1];

				if (e.shiftKey) {
					if (document.activeElement === first) {
						e.preventDefault();
						last.focus();
					}
				} else {
					if (document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
			if (previousActiveElement.current) {
				previousActiveElement.current.focus();
			}
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
				aria-hidden="true"
			/>
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? 'modal-dialog-title' : undefined}
				tabIndex={-1}
				className={cn(
					'relative w-full rounded-2xl border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 outline-none',
					maxSizes[maxWidth]
				)}
			>
				<div className="flex items-start justify-between gap-4 mb-4">
					<div>
						{title && (
							<h3 id="modal-dialog-title" className="text-lg font-bold text-[hsl(var(--text-primary))]">
								{title}
							</h3>
						)}
						{description && <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">{description}</p>}
					</div>
					<button
						onClick={onClose}
						aria-label="Close dialog"
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
