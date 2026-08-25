import React from 'react';
import { Award, Briefcase, Globe, Star, Users } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
		<path d="M9 18c-4.51 2-5-2-7-2" />
	</svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect width="4" height="12" x="2" y="9" />
		<circle cx="4" cy="4" r="2" />
	</svg>
);

export const CourseInstructorProfile: React.FC = () => {
	const expertise = ["Python", "FastAPI", "React", "System Design", "Algorithms", "Docker", "Cloud"];
	
	const experiences = [
		{ company: "Google", role: "Senior Software Engineer", period: "2023 — Present", desc: "Platform reliability and developer tooling." },
		{ company: "FPT Software", role: "Backend Developer", period: "2020 — 2023", desc: "Payment services for banking clients." },
		{ company: "Tiki", role: "Software Engineer", period: "2016 — 2020", desc: "Catalog search and inventory APIs." }
	];

	const achievements = [
		{ value: "12,000+", label: "Students taught", emoji: "🏆" },
		{ value: "4.8", label: "Average rating", emoji: "⭐" },
		{ value: "18", label: "Courses published", emoji: "📚" },
		{ value: "10", label: "Years experience", emoji: "💼" }
	];

	const certificates = [
		{ title: "AWS Solutions Architect", issuer: "Amazon Web Services · 2025" },
		{ title: "Professional Cloud Architect", issuer: "Google Cloud · 2024" },
		{ title: "Azure Developer Associate", issuer: "Microsoft Azure · 2023" },
		{ title: "Java SE Programmer", issuer: "Oracle · 2019" }
	];

	return (
		<div className="w-[940px] flex flex-col gap-6">
			{/* Instructor summary information box */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-6">
				<img className="size-20 rounded-full border border-slate-200 object-cover" src="https://placehold.co/120x120" alt="Lê Quang Duy" />
				<div className="flex-1 flex flex-col">
					<h2 className="text-zinc-900 text-xl font-bold">Lê Quang Duy</h2>
					<span className="text-[#392C7D] text-xs font-semibold mt-0.5">Senior Backend Architect & Lead Instructor</span>
					<div className="flex items-center gap-4 mt-2 text-neutral-500 text-xs font-semibold">
						<div className="flex items-center gap-1.5">
							<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
							<span>4.8 Instructor Rating</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Users className="w-4 h-4 text-neutral-400" />
							<span>12,480 Students Taught</span>
						</div>
					</div>
				</div>
			</div>

			{/* Instructor biography / self-introduction text */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Biography</h2>
				<p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
					Experienced software engineer and technical architect with more than a decade of experience building robust systems, scaling search indexing models, and designing secure, distributed payment engines. Passionate about developer tooling, backend optimization, and mentoring students to master coding problems and system architectures.
				</p>
			</div>

			{/* Areas of expertise */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Areas of expertise</h2>
				<div className="flex flex-wrap gap-2.5">
					{expertise.map((exp, idx) => (
						<span key={idx} className="px-4 py-1.5 bg-slate-50 text-neutral-700 text-sm font-semibold rounded-full border border-slate-200/50">
							{exp}
						</span>
					))}
				</div>
			</div>

			{/* Professional experience */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Professional experience</h2>
				<div className="flex flex-col gap-4">
					{experiences.map((exp, idx) => (
						<div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-4 hover:border-slate-300 transition-colors">
							<div className="size-12 rounded-lg bg-[#392C7D]/10 flex items-center justify-center border border-[#392C7D]/20">
								<Briefcase className="w-5 h-5 text-[#392C7D]" />
							</div>
							<div className="flex-1 flex flex-col">
								<div className="flex justify-between items-baseline flex-wrap">
									<h3 className="text-zinc-900 text-sm font-semibold">{exp.company}</h3>
									<span className="text-neutral-400 text-xs font-semibold">{exp.period}</span>
								</div>
								<span className="text-[#392C7D] text-xs font-semibold mt-0.5">{exp.role}</span>
								<p className="text-neutral-500 text-xs mt-1 leading-normal">{exp.desc}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Achievements */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Achievements</h2>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{achievements.map((ach, idx) => (
						<div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-1">
							<span className="text-2xl">{ach.emoji}</span>
							<span className="text-zinc-900 text-base font-bold mt-1">{ach.value}</span>
							<span className="text-neutral-500 text-xs leading-normal">{ach.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* Certificates */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Certificates</h2>
				<div className="flex flex-col gap-3">
					{certificates.map((cert, idx) => (
						<div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
							<div className="size-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
								<Award className="w-5 h-5 text-emerald-600" />
							</div>
							<div className="flex flex-col">
								<span className="text-zinc-900 text-sm font-semibold">{cert.title}</span>
								<span className="text-neutral-500 text-xs mt-0.5">{cert.issuer}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Connect links */}
			<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
				<h2 className="text-zinc-900 text-xl font-bold border-b border-slate-100 pb-3 mb-4">Connect</h2>
				<div className="flex flex-wrap gap-4 items-center">
					<a href="https://github.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-white border border-slate-200 rounded-full flex items-center gap-2 text-xs font-semibold text-zinc-900 hover:bg-slate-50 transition-colors shadow-xs">
						<GithubIcon className="w-4 h-4 text-zinc-850" />
						GitHub
					</a>
					<a href="https://linkedin.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-white border border-slate-200 rounded-full flex items-center gap-2 text-xs font-semibold text-zinc-900 hover:bg-slate-50 transition-colors shadow-xs">
						<LinkedinIcon className="w-4 h-4 text-blue-600" />
						LinkedIn
					</a>
					<a href="https://example.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-white border border-slate-200 rounded-full flex items-center gap-2 text-xs font-semibold text-zinc-900 hover:bg-slate-50 transition-colors shadow-xs">
						<Globe className="w-4 h-4 text-emerald-600" />
						Personal Website
					</a>
					<span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-100 ml-auto">
						Responds within 24h
					</span>
				</div>
			</div>
		</div>
	);
};
