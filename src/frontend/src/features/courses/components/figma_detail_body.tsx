import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export const FigmaDetailBody: React.FC = () => {
	const [activeFaq, setActiveFaq] = useState<number | null>(null);

	const toggleFaq = (idx: number) => {
		setActiveFaq(prev => prev === idx ? null : idx);
	};

	const learnPoints = [
		"Write clean, idiomatic code reviewed by mentors",
		"Solve 120+ judge problems with instant feedback",
		"Analyse time and space complexity confidently",
		"Build a capstone project for your portfolio",
		"Practice live coding under interview conditions",
		"Earn a verifiable completion certificate"
	];

	const techStack = ["Python", "VS Code", "Git", "GitHub", "Pytest"];
	const prerequisites = ["Basic computer skills", "No prior Python knowledge required", "A laptop with internet connection"];
	
	const targetAudience = [
		{ emoji: "🎓", title: "Beginners", desc: "Start from the very first line of code" },
		{ emoji: "💻", title: "CS Students", desc: "Turn theory into shipped projects" },
		{ emoji: "🚀", title: "Career Switchers", desc: "A structured path to your first role" },
		{ emoji: "👨‍💼", title: "Junior Developers", desc: "Level up code quality and interviews" }
	];

	const skills = ["Python", "Algorithms", "Problem Solving", "Debugging", "Data Structures", "Software Engineering", "Testing", "Git Workflow"];

	const roadmap = [
		{ step: 1, title: "Introduction", desc: "Tooling, environment, how to practise" },
		{ step: 2, title: "Python Basics", desc: "Types, control flow, collections" },
		{ step: 3, title: "Functions", desc: "Scope, purity, composition, modules" },
		{ step: 4, title: "Object-Oriented Programming", desc: "Classes, protocols, design" },
		{ step: 5, title: "Algorithms", desc: "Complexity, recursion, sorting, graphs" },
		{ step: 6, title: "Mini Projects", desc: "CLI tools, scraper, REST API" },
		{ step: 7, title: "Final Capstone Project", desc: "Ship, test and review a full app" }
	];

	const faqs = [
		{ q: "How long is this course?", a: "The course is self-paced with 42 on-demand lessons. Typically takes students 4-6 weeks to complete." },
		{ q: "Do I receive a certificate?", a: "Yes, upon successfully solving the capstone challenge and passing code reviews, you receive a verifiable PDF certificate." },
		{ q: "Can beginners join?", a: "Absolutely. We start from variable definitions and progress to advanced object-oriented design step-by-step." },
		{ q: "Do the coding exercises run in the browser?", a: "Yes! The classroom environment is fully integrated with a web IDE and real-time judge compiler." }
	];

	return (
		<div className="w-[940px] flex flex-col gap-8">
			{/* What you'll learn */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">What you will learn</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{learnPoints.map((pt, idx) => (
						<div key={idx} className="flex items-start gap-2 text-sm text-neutral-700 font-normal">
							<div className="size-5 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mt-0.5">
								<Check className="w-3.5 h-3.5 text-emerald-600" />
							</div>
							<span>{pt}</span>
						</div>
					))}
				</div>
			</div>

			{/* Tech stack & Prerequisites grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Tech stack */}
				<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
					<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Tech stack</h2>
					<div className="flex flex-wrap gap-2.5">
						{techStack.map((tech, idx) => (
							<span key={idx} className="px-4 py-1.5 bg-[#392C7D]/5 text-[#392C7D] text-sm font-semibold rounded-full border border-[#392C7D]/10">
								{tech}
							</span>
						))}
					</div>
				</div>
				{/* Prerequisites */}
				<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
					<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Prerequisites</h2>
					<ul className="flex flex-col gap-2.5 list-disc pl-5 text-sm text-neutral-700 font-normal">
						{prerequisites.map((prereq, idx) => (
							<li key={idx}>{prereq}</li>
						))}
					</ul>
				</div>
			</div>

			{/* Who is this course for */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Who this course is for</h2>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{targetAudience.map((audience, idx) => (
						<div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-2">
							<span className="text-2xl">{audience.emoji}</span>
							<h3 className="text-zinc-900 text-sm font-semibold">{audience.title}</h3>
							<p className="text-neutral-500 text-xs leading-normal">{audience.desc}</p>
						</div>
					))}
				</div>
			</div>

			{/* Skills gained */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Skills you'll gain</h2>
				<div className="flex flex-wrap gap-2">
					{skills.map((skill, idx) => (
						<span key={idx} className="px-3.5 py-1 bg-[#FF4667]/5 text-[#FF4667] text-xs font-semibold rounded-full border border-[#FF4667]/15">
							{skill}
						</span>
					))}
				</div>
			</div>

			{/* Learning roadmap */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Learning roadmap</h2>
				<div className="flex flex-col gap-4 pl-2 pt-2">
					{roadmap.map((road, idx) => (
						<div key={idx} className="flex gap-4 relative">
							{idx < roadmap.length - 1 && (
								<div className="w-0.5 bg-slate-100 absolute bottom-0 top-8 left-5 -z-10" />
							)}
							<div className="w-10 h-10 rounded-full bg-[#392C7D]/10 flex items-center justify-center border border-[#392C7D]/20">
								<span className="text-[#392C7D] font-bold text-sm">{road.step}</span>
							</div>
							<div className="flex flex-col justify-center">
								<span className="text-zinc-900 text-sm font-semibold">{road.title}</span>
								<span className="text-neutral-500 text-xs mt-0.5">{road.desc}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Frequently asked questions */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Frequently asked questions</h2>
				<div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
					{faqs.map((faq, idx) => {
						const isOpen = activeFaq === idx;
						return (
							<div key={idx} className="flex flex-col">
								<button 
									onClick={() => toggleFaq(idx)}
									className="px-5 py-4 w-full flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors cursor-pointer"
								>
									<span className="text-zinc-900 text-sm font-semibold">{faq.q}</span>
									{isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
								</button>
								{isOpen && (
									<div className="px-5 pb-4 pt-1 bg-slate-50/50 text-neutral-500 text-xs leading-relaxed border-t border-slate-50">
										{faq.a}
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
