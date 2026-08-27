import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Clock,
	Copy,
	Check,
	ThumbsUp,
	MessageSquare,
	Terminal,
	Bookmark,
	Sparkles,
	ArrowLeft,
	CheckCircle2,
	Circle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export const LessonProblemPreviewPage: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();

	const [copiedInput1, setCopiedInput1] = useState(false);
	const [copiedOutput1, setCopiedOutput1] = useState(false);
	const [copiedInput2, setCopiedInput2] = useState(false);
	const [copiedOutput2, setCopiedOutput2] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [upvotes, setUpvotes] = useState<Record<string, number>>({ 'c1': 24, 'c2': 11 });
	const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});
	const [newDiscussion, setNewDiscussion] = useState('');
	const [commentsList, setCommentsList] = useState([
		{
			id: 'c1',
			author: 'Priya R.',
			initials: 'PR',
			timeAgo: '3 days ago',
			text: 'Use long long for the sum calculation in C++ — standard int overflows on edge boundary testcases.',
			upvotes: 24
		},
		{
			id: 'c2',
			author: 'David O.',
			initials: 'DO',
			timeAgo: '1 week ago',
			text: 'Watch out for reading input with cin when the line has trailing whitespace.',
			upvotes: 11
		}
	]);

	const handleAddDiscussion = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newDiscussion.trim()) return;
		const item = {
			id: `c-${Date.now()}`,
			author: user?.fullName || 'Student Learner',
			initials: user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'SL',
			timeAgo: 'Just now',
			text: newDiscussion.trim(),
			upvotes: 1
		};
		setCommentsList([item, ...commentsList]);
		setNewDiscussion('');
		toast.success('Discussion posted successfully!');
	};

	const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
		navigator.clipboard.writeText(text);
		setter(true);
		toast.success('Copied testcase to clipboard!');
		setTimeout(() => setter(false), 2000);
	};

	const toggleUpvote = (id: string) => {
		if (hasUpvoted[id]) {
			setUpvotes(prev => ({ ...prev, [id]: (prev[id] ?? 0) - 1 }));
			setHasUpvoted(prev => ({ ...prev, [id]: false }));
		} else {
			setUpvotes(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
			setHasUpvoted(prev => ({ ...prev, [id]: true }));
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col justify-start items-start font-['Inter'] antialiased">
			
			{/* 1. HERO BANNER (Synchronized with Classroom & Problem List) */}
			<div className="self-stretch px-6 lg:px-20 py-14 bg-gradient-to-r from-red-100 via-sky-100 to-blue-100 flex flex-col justify-center items-center gap-3 text-center border-b border-neutral-200/60">
				<h1 className="text-zinc-900 text-4xl font-extrabold tracking-tight">Lesson Preview</h1>
				<div className="opacity-80 text-zinc-700 text-sm font-medium flex items-center gap-2">
					<Link to="/dashboard" className="hover:underline">Dashboard</Link>
					<span>&gt;</span>
					<Link to="/courses" className="hover:underline">Courses</Link>
					<span>&gt;</span>
					<Link to="/learn/dsa-module-2" className="hover:underline">Data Structures &amp; Algorithms</Link>
					<span>&gt;</span>
					<span className="text-zinc-900 font-semibold">Problem: Sum of Two Numbers</span>
				</div>
			</div>

			{/* 2. SUBHEADER: SEARCH & STUDENT PROFILE BAR */}
			<div className="self-stretch bg-white/90 border-b border-neutral-200 backdrop-blur-xs px-6 lg:px-20 py-3.5 flex justify-between items-center shadow-xs sticky top-0 z-30">
				<div className="max-w-[1608px] w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
					
					{/* Breadcrumb path label */}
					<div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
						<Link to="/learn/dsa-module-2" className="hover:text-indigo-900 transition-colors">
							DSA Module 2
						</Link>
						<span>&gt;</span>
						<span className="text-neutral-700">Lesson 4</span>
						<span>&gt;</span>
						<span className="font-bold text-indigo-950">Sum of Two Numbers (Two-pointer Practice)</span>
					</div>

					<div className="flex items-center gap-4 text-xs font-mono">
						<span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
							/classroom/lesson/problem-preview
						</span>
						<span className="font-semibold text-emerald-600">
							80% module complete (4/5 lessons)
						</span>
					</div>
				</div>
			</div>

			{/* 3. MAIN WORKSPACE LAYOUT (2-COLUMN SYNCHRONIZED WITH CLASSROOM) */}
			<div className="max-w-[1608px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start flex-1">
				
				{/* LEFT COLUMN: Problem Statement & Examples */}
				<article className="flex-1 w-full bg-white rounded-2xl border border-neutral-200 p-6 lg:p-8 shadow-sm space-y-8">
					
					{/* Problem Badges & Title */}
					<div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
						<div className="flex flex-wrap items-center gap-2.5">
							<span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider border border-rose-200">
								Problem
							</span>
							<span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
								Easy
							</span>
							<span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
								Math
							</span>
							<span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
								Implementation
							</span>
							<span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
								Two Pointers
							</span>
							<span className="ml-auto text-xs text-neutral-400 font-mono">
								72.4% acceptance
							</span>
						</div>

						<h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 tracking-tight">
							Sum of Two Numbers
						</h2>

						<p className="text-sm text-neutral-700 leading-relaxed">
							Given two integers <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-900 font-bold">a</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-900 font-bold">b</code>, read them from standard input and print their sum. The sum may not fit in a standard 32-bit signed integer, so choose your data type accordingly to avoid arithmetic overflow.
						</p>
					</div>

					{/* Constraints */}
					<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
						<span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
							Constraints
						</span>
						<ul className="list-disc list-inside text-xs font-mono text-neutral-600 space-y-1">
							<li>-10<sup>9</sup> &le; a, b &le; 10<sup>9</sup></li>
							<li>Exactly one test line per testcase</li>
							<li>Output must contain no trailing spaces or extra characters</li>
						</ul>
					</div>

					{/* Input & Output Format */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
							<span className="text-xs font-bold text-zinc-900">Input Format</span>
							<p className="text-xs text-neutral-600 leading-relaxed">
								A single line containing two space-separated integers <code className="font-mono text-indigo-900 font-semibold">a</code> and <code className="font-mono text-indigo-900 font-semibold">b</code>.
							</p>
						</div>

						<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
							<span className="text-xs font-bold text-zinc-900">Output Format</span>
							<p className="text-xs text-neutral-600 leading-relaxed">
								A single line containing one integer: the sum of <code className="font-mono text-indigo-900 font-semibold">a</code> and <code className="font-mono text-indigo-900 font-semibold">b</code>.
							</p>
						</div>
					</div>

					{/* Example 1 */}
					<div className="flex flex-col gap-2">
						<span className="text-sm font-bold text-zinc-900">Example 1</span>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
								<div className="px-3.5 py-2 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center text-xs font-mono text-slate-300">
									<span>Input</span>
									<button
										onClick={() => copyToClipboard('3 8', setCopiedInput1)}
										className="flex items-center gap-1 hover:text-white cursor-pointer text-[11px]"
									>
										{copiedInput1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
										<span>{copiedInput1 ? 'Copied' : 'Copy'}</span>
									</button>
								</div>
								<pre className="p-3.5 text-xs font-mono text-amber-300">3 8</pre>
							</div>

							<div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
								<div className="px-3.5 py-2 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center text-xs font-mono text-slate-300">
									<span>Output</span>
									<button
										onClick={() => copyToClipboard('11', setCopiedOutput1)}
										className="flex items-center gap-1 hover:text-white cursor-pointer text-[11px]"
									>
										{copiedOutput1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
										<span>{copiedOutput1 ? 'Copied' : 'Copy'}</span>
									</button>
								</div>
								<pre className="p-3.5 text-xs font-mono text-amber-300">11</pre>
							</div>
						</div>
					</div>

					{/* Example 2 */}
					<div className="flex flex-col gap-2">
						<span className="text-sm font-bold text-zinc-900">Example 2</span>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
								<div className="px-3.5 py-2 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center text-xs font-mono text-slate-300">
									<span>Input</span>
									<button
										onClick={() => copyToClipboard('-1000000000 -1000000000', setCopiedInput2)}
										className="flex items-center gap-1 hover:text-white cursor-pointer text-[11px]"
									>
										{copiedInput2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
										<span>{copiedInput2 ? 'Copied' : 'Copy'}</span>
									</button>
								</div>
								<pre className="p-3.5 text-xs font-mono text-amber-300">-1000000000 -1000000000</pre>
							</div>

							<div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
								<div className="px-3.5 py-2 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center text-xs font-mono text-slate-300">
									<span>Output</span>
									<button
										onClick={() => copyToClipboard('-2000000000', setCopiedOutput2)}
										className="flex items-center gap-1 hover:text-white cursor-pointer text-[11px]"
									>
										{copiedOutput2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
										<span>{copiedOutput2 ? 'Copied' : 'Copy'}</span>
									</button>
								</div>
								<pre className="p-3.5 text-xs font-mono text-amber-300">-2000000000</pre>
							</div>
						</div>
					</div>

					{/* Explanation */}
					<div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start gap-3">
						<Sparkles className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
						<div className="flex flex-col gap-1">
							<span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
								Explanation
							</span>
							<p className="text-xs text-indigo-900 leading-relaxed">
								Example 1 is a direct addition: 3 + 8 = 11. Example 2 sums to -2,000,000,000, which still fits in a 32-bit signed integer, but <code className="font-mono font-bold">a + b</code> near the extreme boundaries might overflow — read into <code className="font-mono font-bold">long long</code> in C++ or 64-bit int to stay completely safe.
							</p>
						</div>
					</div>

					{/* Discussion Section */}
					<div className="space-y-4 pt-4 border-t border-slate-100">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<MessageSquare className="w-4 h-4 text-indigo-900" />
								<h3 className="font-bold text-base text-zinc-900">Discussion ({commentsList.length})</h3>
							</div>
							<span className="text-xs text-neutral-400">Community answers &amp; hints</span>
						</div>

						{/* Add discussion form */}
						<form onSubmit={handleAddDiscussion} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2.5">
							<textarea
								rows={2}
								maxLength={500}
								value={newDiscussion}
								onChange={(e) => setNewDiscussion(e.target.value)}
								placeholder="Have a question or insight? Write here (max 500 chars)..."
								className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 resize-none"
							/>
							<div className="flex justify-between items-center">
								<span className="text-[11px] text-neutral-400">
									{newDiscussion.length}/500
								</span>
								<button
									type="submit"
									disabled={!newDiscussion.trim() || newDiscussion.length > 500}
									className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
								>
									Post Comment
								</button>
							</div>
						</form>

						<div className="flex flex-col gap-3">
							{commentsList.map((c) => (
								<div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2.5">
											<div className="w-7 h-7 rounded-full bg-indigo-900 text-white font-bold text-xs flex items-center justify-center">
												{c.initials}
											</div>
											<div className="flex flex-col">
												<span className="text-xs font-bold text-zinc-900">{c.author}</span>
												<span className="text-[10px] text-neutral-400 font-mono">{c.timeAgo}</span>
											</div>
										</div>
										<button
											onClick={() => toggleUpvote(c.id)}
											className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
												hasUpvoted[c.id]
													? 'bg-indigo-900 text-white border-indigo-900'
													: 'bg-white text-zinc-700 border-slate-200 hover:bg-slate-100'
											}`}
										>
											<ThumbsUp className="w-3 h-3" />
											<span>{upvotes[c.id] ?? c.upvotes}</span>
										</button>
									</div>
									<p className="text-xs text-neutral-700 leading-relaxed">{c.text}</p>
								</div>
							))}
						</div>
					</div>

					{/* Navigation back & forth */}
					<div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
						<Link
							to="/learn/dsa-module-2"
							className="text-neutral-500 hover:text-zinc-900 text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Previous: Two-pointer patterns (Theory)</span>
						</Link>

						<button
							onClick={() => navigate('/practice/two-sum')}
							className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
						>
							<span>Open Coding IDE &rarr;</span>
						</button>
					</div>

				</article>

				{/* RIGHT COLUMN: Course Content List & Judge Limits Sidebar */}
				<aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
					
					{/* Card 1: Course Content List (Synchronized with Module 2) */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex flex-col gap-4">
						<div className="flex justify-between items-center">
							<span className="text-zinc-900 text-base font-semibold font-['Plus_Jakarta_Sans']">Course content</span>
							<span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-[10px]">
								80%
							</span>
						</div>

						{/* Progress bar */}
						<div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
							<div className="h-full bg-indigo-900 rounded-full" style={{ width: '80%' }} />
						</div>

						{/* Synchronized Lesson Items */}
						<div className="flex flex-col gap-2 pt-1 text-xs">
							<Link
								to="/learn/dsa-module-2"
								className="p-3 rounded-xl border border-neutral-200 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
							>
								<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="font-medium text-zinc-800 truncate">Hash tables from scratch</p>
									<span className="text-neutral-400 text-[10px]">Reading</span>
								</div>
							</Link>

							<Link
								to="/learn/dsa-module-2"
								className="p-3 rounded-xl border border-neutral-200 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
							>
								<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="font-medium text-zinc-800 truncate">Collision strategies</p>
									<span className="text-neutral-400 text-[10px]">Reading</span>
								</div>
							</Link>

							<Link
								to="/learn/dsa-module-2"
								className="p-3 rounded-xl border border-neutral-200 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
							>
								<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="font-medium text-zinc-800 truncate">Two-pointer patterns</p>
									<span className="text-neutral-400 text-[10px]">Reading</span>
								</div>
							</Link>

							{/* Active Problem Lesson */}
							<div className="p-3 rounded-xl border bg-indigo-50/80 border-indigo-300 shadow-2xs flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-indigo-900 flex items-center justify-center shrink-0">
									<div className="w-1.5 h-1.5 rounded-full bg-indigo-900" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-bold text-indigo-950 truncate">Two-pointer practice problem</p>
									<span className="text-indigo-700 text-[10px]">Problem</span>
								</div>
								<span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full">
									Now
								</span>
							</div>

							<Link
								to="/quiz/quiz-control-flow-01/preview"
								className="p-3 rounded-xl border border-neutral-200 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
							>
								<Circle className="w-4 h-4 text-neutral-400 shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="font-medium text-zinc-800 truncate">Lesson review &amp; quiz</p>
									<span className="text-neutral-400 text-[10px]">Quiz</span>
								</div>
							</Link>
						</div>
					</div>

					{/* Card 2: Judge Limits & Launcher */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm flex flex-col gap-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Terminal className="w-4 h-4 text-indigo-900" />
							<h3 className="font-bold text-base text-zinc-900">Judge limits</h3>
						</div>

						<div className="divide-y divide-slate-100 text-xs">
							<div className="py-2 flex justify-between items-center">
								<span className="text-neutral-500">Time limit</span>
								<span className="font-mono font-bold text-zinc-900">1.0 s</span>
							</div>
							<div className="py-2 flex justify-between items-center">
								<span className="text-neutral-500">Memory limit</span>
								<span className="font-mono font-bold text-zinc-900">256 MB</span>
							</div>
							<div className="py-2 flex justify-between items-center">
								<span className="text-neutral-500">Languages</span>
								<span className="font-mono font-semibold text-zinc-900">C++, Python, Java, Go</span>
							</div>
							<div className="py-2 flex justify-between items-center">
								<span className="text-neutral-500">Last submitted</span>
								<span className="font-mono text-neutral-600">2 days ago</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="pt-2 flex flex-col gap-2.5">
							<button
								onClick={() => navigate('/practice/two-sum')}
								className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
							>
								<Terminal className="w-4 h-4" />
								<span>Open coding workspace</span>
							</button>

							<button
								onClick={() => {
									setIsSaved(!isSaved);
									toast.success(isSaved ? 'Removed from saved' : 'Saved problem for later!');
								}}
								className={`w-full py-2.5 rounded-xl font-semibold text-xs border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
									isSaved
										? 'bg-rose-50 text-rose-600 border-rose-200'
										: 'bg-white text-zinc-700 border-slate-200 hover:bg-slate-50'
								}`}
							>
								<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
								<span>{isSaved ? 'Saved in bookmarks' : 'Save for later'}</span>
							</button>
						</div>

						<div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-neutral-400 font-mono">
							<Clock className="w-3.5 h-3.5" />
							<span>Average solve time: 14 min</span>
						</div>
					</div>

				</aside>

			</div>

		</div>
	);
};
