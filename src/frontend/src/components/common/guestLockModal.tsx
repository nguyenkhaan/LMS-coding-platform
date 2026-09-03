import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export interface GuestLockModalProps {
	isOpen: boolean;
	onClose: () => void;
	featureName: string;
	description?: string;
	redirectPath?: string;
}

export const GuestLockModal: React.FC<GuestLockModalProps> = ({
	isOpen,
	onClose,
	featureName,
	description,
	redirectPath = '/practice',
}) => {
	const navigate = useNavigate();

	const defaultDescription =
		featureName === 'AI Mock Interview'
			? 'SkillBoost AI Technical Mock Interview sessions, adaptive question generation, realtime multi-axis score evaluation, and session transcripts are exclusively available to registered members. Please sign in or create an account to start your interview.'
			: 'SkillBoost Online Judge (OJ), problem statements, interactive code workspace, and submission tracking are exclusively available to registered members. Please sign in or create an account to start practicing.';

	return (
		<Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
						<Lock className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-lg font-bold text-zinc-900">Sign In Required for {featureName}</h3>
						<p className="text-xs text-neutral-500">Authentication is required to access protected features</p>
					</div>
				</div>

				<div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-zinc-700 leading-relaxed font-medium">
					{description || defaultDescription}
				</div>

				<div className="flex items-center justify-end gap-2.5 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-zinc-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => {
							onClose();
							navigate('/login', { state: { from: { pathname: redirectPath } } });
						}}
						className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-sm shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
					>
						<span>Sign In to Continue</span>
					</button>
				</div>
			</div>
		</Modal>
	);
};
