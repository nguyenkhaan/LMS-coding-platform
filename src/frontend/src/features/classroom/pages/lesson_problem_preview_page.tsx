import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	ChevronRight,
	ChevronLeft,
	ChevronDown,
	ChevronUp,
	CheckCircle2,
	Circle,
	PlayCircle,
	FileText,
	HelpCircle,
	Code2,
	Clock,
	Copy,
	Check,
	ThumbsUp,
	MessageSquare,
	Terminal,
	Bookmark,
	Sparkles,
	BookOpen,
	ArrowLeft,
	ArrowRight,
	Lock
} from 'lucide-react';
import { toast } from 'sonner';

export const LessonProblemPreviewPage: React.FC = () => {
	const navigate = useNavigate();
	const { courseSlug, problemSlug } = useParams<{ courseSlug?: string; problemSlug?: string }>();

	const [copiedInput1, setCopiedInput1] = useState(false);
	const [copiedOutput1, setCopiedOutput1] = useState(false);
	const [copiedInput2, setCopiedInput2] = useState(false);
	const [copiedOutput2, setCopiedOutput2] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [upvotes, setUpvotes] = useState<Record<string, number>>({ 'c1': 24, 'c2': 11 });
	const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
		'sec-1': false,
		'sec-2': true,
		'sec-3': false,
		'sec-4': false
	});

	const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
		navigator.clipboard.writeText(text);
		setter(true);
		toast.success('Copied to clipboard!');
		setTimeout(() => setter(false), 2000);
	};

	const toggleSection = (id: string) => {
		setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleUpvote = (id: string) => {
		if (hasUpvoted[id]) {
			setUpvotes(prev => ({ ...prev, [id]: prev[id] - 1 }));
			setHasUpvoted(prev => ({ ...prev, [id]: false }));
		} else {
			setUpvotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
			setHasUpvoted(prev => ({ ...prev, [id]: true }));
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			
			{/* 1. Hero Breadcrumb Banner (Figma Signature Pastel Gradient) */}
			<div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
				<h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
					Lesson Preview
				</h1>
				<div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
					<Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">
						Dashboard
					</Link>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<Link to="/courses" className="text-neutral-500 hover:text-zinc-900 transition-colors">
						Classroom
					</Link>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<span className="text-zinc-900 font-semibold">C++ Basics · Sum of Two Numbers</span>
				</div>
			</div>

			{/* Sub-header Toolbar Breadcrumb */}
			<div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
				<div className="max-w-[1340px] w-full mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
						<Link to="/classroom/workspace" className="hover:text-indigo-900 transition-colors">
							Classroom
						</Link>
						<span>&gt;</span>
						<span className="text-neutral-700">C++ Basics</span>
						<span>&gt;</span>
						<span className="font-bold text-indigo-950">Sum of Two Numbers</span>
					</div>

					<div className="flex items-center gap-4 text-xs font-mono">
						<span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
							/classroom/lesson/problem-preview
						</span>
						<span className="font-semibold text-emerald-600">
							35% complete (9/26 lessons)
						</span>
					</div>
				</div>
			</div>

			{/* 2. Main Workspace Layout: Left Rail + Center Content + Right Sidebar */}
			<div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start flex-1">
				
				{/* Left Course Navigation Rail (w-full lg:w-72) */}
				<div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
					<div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
						{/* Course title & progress header */}
						<div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<h3 className="font-bold text-base text-zinc-900">C++ Basics</h3>
								<span className="text-xs font-mono font-semibold text-indigo-900">35%</span>
							</div>
							<span className="text-xs text-neutral-500 font-mono">9/26 lessons</span>
							<div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
								<div className="h-full bg-indigo-900 rounded-full" style={{ width: '35%' }} />
							</div>
						</div>

						{/* Sections list */}
						<div className="divide-y divide-slate-100">
							{/* Section 1 */}
							<div>
								<button
									onClick={() => toggleSection('sec-1')}
									className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-neutral-600 hover:bg-slate-50 uppercase tracking-wider cursor-pointer border-none bg-transparent"
								>
									<span>1 — Getting Started</span>
									{expandedSections['sec-1'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
								</button>
								{expandedSections['sec-1'] && (
									<div className="px-3 pb-3 flex flex-col gap-1 text-xs">
										<div className="p-2 rounded-lg text-neutral-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
											<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
											<span>Environment Setup</span>
										</div>
									</div>
								)}
							</div>

							{/* Section 2 (Active) */}
							<div>
								<button
									onClick={() => toggleSection('sec-2')}
									className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-indigo-900 bg-indigo-50/40 uppercase tracking-wider cursor-pointer border-none"
								>
									<span>2 — Variables &amp; Types</span>
									{expandedSections['sec-2'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
								</button>
								{expandedSections['sec-2'] && (
									<div className="p-2 flex flex-col gap-1 text-xs">
										<div className="p-2.5 rounded-xl text-neutral-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer">
											<div className="flex items-center gap-2">
												<FileText className="w-3.5 h-3.5 text-slate-400" />
												<span>Variables and Data Types</span>
											</div>
											<span className="text-[10px] text-neutral-400 font-mono">8 min read</span>
										</div>

										<div className="p-2.5 rounded-xl text-neutral-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer">
											<div className="flex items-center gap-2">
												<FileText className="w-3.5 h-3.5 text-slate-400" />
												<span>For Loops Explained</span>
											</div>
											<span className="text-[10px] text-neutral-400 font-mono">14 min</span>
										</div>

										<Link
											to="/quiz/quiz-control-flow-01/preview"
											className="p-2.5 rounded-xl text-amber-900 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 flex items-center justify-between cursor-pointer transition-colors"
										>
											<div className="flex items-center gap-2">
												<HelpCircle className="w-3.5 h-3.5 text-amber-600" />
												<span className="font-semibold">Quiz: Control Flow</span>
											</div>
											<span className="text-[10px] text-amber-700 font-mono">10 min</span>
										</Link>

										<div className="p-2.5 rounded-xl bg-indigo-900 text-white font-bold flex items-center justify-between shadow-xs">
											<div className="flex items-center gap-2">
												<Code2 className="w-3.5 h-3.5 text-rose-400" />
												<span>Sum of Two Numbers</span>
											</div>
											<span className="text-[10px] text-indigo-200 font-mono">20 min</span>
										</div>
									</div>
								)}
							</div>

							{/* Section 3 */}
							<div>
								<button
									onClick={() => toggleSection('sec-3')}
									className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-neutral-600 hover:bg-slate-50 uppercase tracking-wider cursor-pointer border-none bg-transparent"
								>
									<span>3 — Control Flow</span>
									{expandedSections['sec-3'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
								</button>
							</div>

							{/* Section 4 */}
							<div>
								<button
									onClick={() => toggleSection('sec-4')}
									className="w-full p-3.5 flex justify-between items-center text-left text-xs font-bold text-neutral-600 hover:bg-slate-50 uppercase tracking-wider cursor-pointer border-none bg-transparent"
								>
									<span>4 — Functions &amp; Arrays</span>
									{expandedSections['sec-4'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Center Main Problem Statement Panel */}
				<div className="flex-1 w-full flex flex-col gap-6">
					
					{/* Header Tags & Title Card */}
					<div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-4">
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
								Input/Output
							</span>
							<span className="ml-auto text-xs text-neutral-400 font-mono">
								72.4% acceptance
							</span>
						</div>

						<h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 tracking-tight">
							Sum of Two Numbers
						</h2>

						<p className="text-sm text-neutral-700 leading-relaxed">
							Given two integers <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-900 font-bold">a</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-900 font-bold">b</code>, read them from standard input and print their sum. The sum may not fit in a standard 32-bit signed integer, so choose your data type accordingly.
						</p>

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
									A single line containing two space-separated integers <code className="font-mono text-indigo-900">a</code> and <code className="font-mono text-indigo-900">b</code>.
								</p>
							</div>

							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
								<span className="text-xs font-bold text-zinc-900">Output Format</span>
								<p className="text-xs text-neutral-600 leading-relaxed">
									A single line containing one integer: the sum of <code className="font-mono text-indigo-900">a</code> and <code className="font-mono text-indigo-900">b</code>.
								</p>
							</div>
						</div>

						{/* Example 1 */}
						<div className="flex flex-col gap-2">
							<span className="text-sm font-bold text-zinc-900">Example 1</span>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Input */}
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

								{/* Output */}
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
								{/* Input */}
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

								{/* Output */}
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
					</div>

					{/* Discussion Section */}
					<div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-5">
						<div className="flex justify-between items-center border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2">
								<MessageSquare className="w-4 h-4 text-indigo-900" />
								<h3 className="font-bold text-base text-zinc-900">Discussion (2)</h3>
							</div>
							<button className="text-xs font-bold text-indigo-900 hover:underline cursor-pointer">
								View all comments
							</button>
						</div>

						<div className="flex flex-col gap-4">
							{/* Comment 1 */}
							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<div className="w-8 h-8 rounded-full bg-indigo-900 text-white font-bold text-xs flex items-center justify-center">
											PR
										</div>
										<div className="flex flex-col">
											<span className="text-xs font-bold text-zinc-900">Priya R.</span>
											<span className="text-[10px] text-neutral-400 font-mono">3 days ago</span>
										</div>
									</div>
									<button
										onClick={() => toggleUpvote('c1')}
										className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
											hasUpvoted['c1']
												? 'bg-indigo-900 text-white border-indigo-900'
												: 'bg-white text-zinc-700 border-slate-200 hover:bg-slate-100'
										}`}
									>
										<ThumbsUp className="w-3 h-3" />
										<span>{upvotes['c1']}</span>
									</button>
								</div>
								<p className="text-xs text-neutral-700 leading-relaxed">
									Use <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">long long</code> for the sum calculation in C++ — standard <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">int</code> overflows on edge boundary testcases and leads to a silent Wrong Answer.
								</p>
							</div>

							{/* Comment 2 */}
							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
											DO
										</div>
										<div className="flex flex-col">
											<span className="text-xs font-bold text-zinc-900">David O.</span>
											<span className="text-[10px] text-neutral-400 font-mono">1 week ago</span>
										</div>
									</div>
									<button
										onClick={() => toggleUpvote('c2')}
										className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
											hasUpvoted['c2']
												? 'bg-indigo-900 text-white border-indigo-900'
												: 'bg-white text-zinc-700 border-slate-200 hover:bg-slate-100'
										}`}
									>
										<ThumbsUp className="w-3 h-3" />
										<span>{upvotes['c2']}</span>
									</button>
								</div>
								<p className="text-xs text-neutral-700 leading-relaxed">
									Watch out for reading input with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">cin</code> when the line has trailing whitespace or newline characters.
								</p>
							</div>
						</div>
					</div>

					{/* Keep the Momentum Banner */}
					<div className="p-5 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
						<div className="flex flex-col gap-1">
							<h4 className="font-bold text-base">Keep the momentum!</h4>
							<p className="text-xs text-slate-200">
								Solve this challenge to unlock Module 3 — Control Flow &amp; Advanced Branching.
							</p>
						</div>
						<button
							onClick={() => navigate('/practice/two-sum')}
							className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer shadow-sm"
						>
							Open Online Judge &rarr;
						</button>
					</div>

					{/* Bottom Lesson Navigation Bar */}
					<div className="pt-2 flex flex-wrap items-center justify-between gap-3">
						<Link
							to="/quiz/quiz-control-flow-01/preview"
							className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-neutral-200 rounded-xl text-xs font-semibold text-zinc-800 flex items-center gap-2 shadow-xs transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
							<span>Previous: Quiz: Control Flow</span>
						</Link>

						<button
							onClick={() => {
								setIsCompleted(!isCompleted);
								toast.success(isCompleted ? 'Marked as uncompleted' : 'Lesson marked as completed!');
							}}
							className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
								isCompleted
									? 'bg-emerald-600 text-white shadow-xs'
									: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
							}`}
						>
							<CheckCircle2 className="w-4 h-4" />
							<span>{isCompleted ? 'Completed' : 'Mark as completed'}</span>
						</button>

						<button
							onClick={() => toast.info('Next lesson: Conditionals & Branching.')}
							className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
						>
							<span>Next: Conditionals</span>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>

				</div>

				{/* Right Sidebar (Judge Limits & Coding Workspace Launcher ~360px) */}
				<div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
					
					{/* Judge Limits Card */}
					<div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-5">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Terminal className="w-4 h-4 text-indigo-900" />
							<h3 className="font-bold text-base text-zinc-900">Judge limits</h3>
						</div>

						<div className="divide-y divide-slate-100 text-xs">
							<div className="py-2.5 flex justify-between items-center">
								<span className="text-neutral-500">Time limit</span>
								<span className="font-mono font-bold text-zinc-900">1.0 s</span>
							</div>
							<div className="py-2.5 flex justify-between items-center">
								<span className="text-neutral-500">Memory limit</span>
								<span className="font-mono font-bold text-zinc-900">256 MB</span>
							</div>
							<div className="py-2.5 flex justify-between items-center">
								<span className="text-neutral-500">Languages</span>
								<span className="font-mono font-semibold text-zinc-900">C++, Python, Java, Go</span>
							</div>
							<div className="py-2.5 flex justify-between items-center">
								<span className="text-neutral-500">Last submitted</span>
								<span className="font-mono text-neutral-600">2 days ago</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="pt-2 flex flex-col gap-3">
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

						<div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-neutral-400 font-mono">
							<Clock className="w-3.5 h-3.5" />
							<span>Average solve time: 14 min</span>
						</div>
					</div>

				</div>

			</div>

		</div>
	);
};
