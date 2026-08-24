import React from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ClassroomLayout: React.FC = () => {
	const { courseSlug } = useParams<{ courseSlug: string }>();

	return (
		<div className="min-h-screen flex flex-col bg-[hsl(var(--bg-main))] text-[hsl(var(--text-primary))]">
			{/* Top minimalist header */}
			<header className="h-14 px-4 border-b border-[hsl(var(--border-color))] bg-[hsl(var(--bg-card))] flex items-center justify-between shrink-0">
				<div className="flex items-center gap-4">
					<Link to={courseSlug ? `/courses/${courseSlug}` : '/courses'}>
						<Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
							Rời khỏi lớp học
						</Button>
					</Link>
					<div className="h-4 w-px bg-[hsl(var(--border-color))]" />
					<div className="flex items-center gap-2">
						<Code2 className="w-4 h-4 text-[hsl(var(--color-brand-indigo))]" />
						<span className="font-semibold text-sm">Classroom Workspace</span>
					</div>
				</div>
			</header>

			{/* Main Classroom split content */}
			<main className="flex-1 flex min-h-0">
				<Outlet />
			</main>
		</div>
	);
};
