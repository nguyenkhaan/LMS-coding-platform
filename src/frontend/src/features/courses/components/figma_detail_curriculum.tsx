import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronUp, PlayCircle, HelpCircle, FileText, Lock } from 'lucide-react';

interface ContentItem {
	id: number;
	type: 'THEORY' | 'PROBLEM' | 'QUIZ';
	title: string;
}

interface LessonItem {
	id: number;
	title: string;
	contents: ContentItem[];
	locked?: boolean;
}

interface SectionItem {
	id: number;
	title: string;
	lessonCount: number;
	lessons: LessonItem[];
}

export const FigmaDetailCurriculum: React.FC = () => {
	const sections: SectionItem[] = [
		{
			id: 1,
			title: "1. Introduction to Programming & Python",
			lessonCount: 4,
			lessons: [
				{
					id: 101,
					title: "Lesson 1: Tooling & Environment Setup",
					contents: [{ id: 1001, type: "THEORY", title: "Python Installation Guide" }]
				},
				{
					id: 102,
					title: "Lesson 2: Input and Output Statements",
					contents: [{ id: 1002, type: "PROBLEM", title: "Greeting User Challenge" }]
				},
				{
					id: 103,
					title: "Lesson 3: Variables & Arithmetic Operators",
					contents: [{ id: 1003, type: "PROBLEM", title: "Circle Area Calculator" }]
				},
				{
					id: 104,
					title: "Lesson 4: Core Types & Variables Quiz",
					contents: [{ id: 1004, type: "QUIZ", title: "Syllabus Section 1 Review" }]
				}
			]
		},
		{
			id: 2,
			title: "2. Control Flow & Conditions",
			lessonCount: 4,
			lessons: [
				{
					id: 201,
					title: "Lesson 1: Conditional Branching (If-Else)",
					contents: [{ id: 2001, type: "THEORY", title: "Logical Operators & Truth Tables" }],
					locked: true
				},
				{
					id: 202,
					title: "Lesson 2: Simple Loops (While Loops)",
					contents: [{ id: 2002, type: "PROBLEM", title: "Count to N Challenge" }],
					locked: true
				},
				{
					id: 203,
					title: "Lesson 3: Iteration Lists (For Loops)",
					contents: [{ id: 2003, type: "PROBLEM", title: "Sum of Odd Numbers" }],
					locked: true
				},
				{
					id: 204,
					title: "Lesson 4: Section Quiz: Control Flow",
					contents: [{ id: 2004, type: "QUIZ", title: "Control Flow Mastery test" }],
					locked: true
				}
			]
		},
		{
			id: 3,
			title: "3. Collections & Data Structures",
			lessonCount: 3,
			lessons: [
				{
					id: 301,
					title: "Lesson 1: Python Lists & Methods",
					contents: [{ id: 3001, type: "PROBLEM", title: "Find Array Max" }],
					locked: true
				},
				{
					id: 302,
					title: "Lesson 2: Dictionaries & Sets",
					contents: [{ id: 3002, type: "PROBLEM", title: "Unique Words Counter" }],
					locked: true
				},
				{
					id: 303,
					title: "Lesson 3: Tuple Immutability & Use Cases",
					contents: [{ id: 3003, type: "THEORY", title: "When to use lists vs tuples" }],
					locked: true
				}
			]
		}
	];

	const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true });

	const toggleSection = (id: number) => {
		setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<div className="w-full flex flex-col gap-6">
			<div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
					<BookOpen className="w-5 h-5 text-[#392C7D]" />
					Course Syllabus
				</h2>
				
				<div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
					{sections.map((section, idx) => {
						const isSecExpanded = expanded[section.id] ?? false;
						return (
							<div key={section.id} className="flex flex-col">
								{/* Header button */}
								<button 
									onClick={() => toggleSection(section.id)}
									className="px-5 py-4 w-full flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors cursor-pointer border-none"
								>
									<div className="flex items-center gap-3">
										<span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-neutral-500">
											{idx + 1}
										</span>
										<span className="text-zinc-900 text-sm font-semibold">{section.title}</span>
									</div>
									<div className="flex items-center gap-3 text-neutral-400 text-xs font-medium">
										<span>{section.lessonCount} lessons</span>
										{isSecExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
									</div>
								</button>

								{/* Content block */}
								{isSecExpanded && (
									<div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
										{section.lessons.map((lesson) => (
											<div key={lesson.id} className="pl-4 border-l border-slate-200 relative flex flex-col gap-2">
												<div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
												<div className="flex items-center justify-between gap-4">
													<h4 className="text-zinc-900 text-xs font-semibold">{lesson.title}</h4>
													{lesson.locked && (
														<span className="px-2 py-0.5 bg-neutral-200 text-neutral-500 text-[10px] font-semibold rounded-md flex items-center gap-1">
															<Lock className="w-2.5 h-2.5" />
															Locked
														</span>
													)}
												</div>

												{/* Contents list */}
												<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
													{lesson.contents.map((content) => {
														if (content.type === 'QUIZ') {
															return (
																<Link
																	key={content.id}
																	to="/quiz/quiz-control-flow-01/preview"
																	className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-xs font-semibold text-amber-900 transition-colors cursor-pointer group shadow-xs"
																>
																	<div className="flex items-center gap-2">
																		<HelpCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
																		<span>{content.title}</span>
																	</div>
																	<span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold uppercase tracking-wider">
																		Start Quiz &rarr;
																	</span>
																</Link>
															);
														}
														if (content.type === 'PROBLEM') {
															return (
																<Link
																	key={content.id}
																	to="/practice/two-sum"
																	className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-100 bg-white hover:bg-indigo-50/70 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer group shadow-xs"
																>
																	<div className="flex items-center gap-2">
																		<PlayCircle className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
																		<span>{content.title}</span>
																	</div>
																	<span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 font-bold uppercase tracking-wider">
																		Solve &rarr;
																	</span>
																</Link>
															);
														}
														return (
															<Link
																key={content.id}
																to="/learn/python-foundations"
																className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer group shadow-xs"
															>
																<div className="flex items-center gap-2">
																	<FileText className="w-4 h-4 text-slate-500" />
																	<span>{content.title}</span>
																</div>
																<span className="text-[10px] text-neutral-400 font-normal">
																	Read
																</span>
															</Link>
														);
													})}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
