import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	Download,
	RotateCcw,
	CheckCircle2,
	AlertTriangle,
	Clock,
	Check,
	TrendingUp,
	Award,
	Bot,
	MessageSquare,
	BarChart3,
	Radar
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface CompetencyDetail {
	name: string;
	score: number;
	level: string;
	colorClass: string;
	barGradient: string;
	badgeBg: string;
	badgeText: string;
}

const COMPETENCY_DATA: CompetencyDetail[] = [
	{
		name: 'Communication',
		score: 88,
		level: 'Strong',
		colorClass: 'text-emerald-700',
		barGradient: 'bg-gradient-to-r from-emerald-500 to-teal-400',
		badgeBg: 'bg-emerald-50 border-emerald-200',
		badgeText: 'text-emerald-700'
	},
	{
		name: 'Problem Solving',
		score: 82,
		level: 'Strong',
		colorClass: 'text-emerald-700',
		barGradient: 'bg-gradient-to-r from-emerald-500 to-teal-400',
		badgeBg: 'bg-emerald-50 border-emerald-200',
		badgeText: 'text-emerald-700'
	},
	{
		name: 'System Design',
		score: 74,
		level: 'Solid',
		colorClass: 'text-indigo-900',
		barGradient: 'bg-gradient-to-r from-indigo-600 to-sky-500',
		badgeBg: 'bg-indigo-50 border-indigo-200',
		badgeText: 'text-indigo-900'
	},
	{
		name: 'Code Quality',
		score: 69,
		level: 'Moderate',
		colorClass: 'text-amber-700',
		barGradient: 'bg-gradient-to-r from-amber-500 to-orange-400',
		badgeBg: 'bg-amber-50 border-amber-200',
		badgeText: 'text-amber-800'
	},
	{
		name: 'Trade-offs',
		score: 61,
		level: 'Focus',
		colorClass: 'text-orange-700',
		barGradient: 'bg-gradient-to-r from-orange-500 to-rose-500',
		badgeBg: 'bg-orange-50 border-orange-200',
		badgeText: 'text-orange-800'
	}
];

const SCORE_TRENDS = [
	{ label: 'Mock #1', score: 56, date: '10 Jul', isCurrent: false },
	{ label: 'Mock #2', score: 64, date: '18 Jul', isCurrent: false },
	{ label: 'Mock #3', score: 68, date: '25 Jul', isCurrent: false },
	{ label: 'Mock #4', score: 71, date: '01 Aug', isCurrent: false },
	{ label: 'Session #5', score: 75, date: 'Today', isCurrent: true }
];

const KEY_STRENGTH_POINTS = [
	'Clarified requirements and boundary constraints before designing in all 5 questions.',
	'Accurate asymptotic complexity analysis (O(N) time, O(1) space) with no prompting required.',
	'Clean, readable pseudo-code structure crafted comfortably under time pressure.'
];

const KEY_IMPROVE_POINTS = [
	'Discuss failure modes, network partitions, and graceful degradation paths explicitly.',
	'Quantify engineering trade-offs (cost vs latency vs consistency) with concrete numbers.',
	'Dry-run your solution aloud with edge cases before declaring it finalized.'
];

// ─── Circular Score Ring (Hero Element) ───────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
	const r = 48;
	const circumference = 2 * Math.PI * r;
	const filled = (score / 100) * circumference;

	return (
		<svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
			<circle
				cx="60"
				cy="60"
				r={r}
				fill="none"
				stroke="rgba(255,255,255,0.15)"
				strokeWidth="7"
			/>
			<circle
				cx="60"
				cy="60"
				r={r}
				fill="none"
				stroke="#38BDF8"
				strokeWidth="7"
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={circumference - filled}
				className="transition-all duration-700"
			/>
		</svg>
	);
}

// ─── 5-Axis Spiderweb Radar Chart (Fits comfortably in 2-column card) ─────────

function RadarChart() {
	const viewBoxWidth = 380;
	const viewBoxHeight = 300;
	const cx = viewBoxWidth / 2; // 190
	const cy = viewBoxHeight / 2 + 2; // 152
	const R = 85;
	const N = COMPETENCY_DATA.length;
	const rings = [0.25, 0.5, 0.75, 1.0];

	const pt = (i: number, ratio: number) => {
		const a = (2 * Math.PI * i) / N - Math.PI / 2;
		return { x: cx + R * ratio * Math.cos(a), y: cy + R * ratio * Math.sin(a) };
	};

	const scorePoly = COMPETENCY_DATA.map((d, i) => {
		const { x, y } = pt(i, d.score / 100);
		return `${x},${y}`;
	}).join(' ');

	const labelConfigs = [
		{ textAnchor: 'middle', dominantBaseline: 'auto', dx: 0, dy: -13 }, // 0: Top (Communication)
		{ textAnchor: 'start', dominantBaseline: 'middle', dx: 14, dy: -2 }, // 1: Top-Right (Problem Solving)
		{ textAnchor: 'start', dominantBaseline: 'middle', dx: 14, dy: 6 }, // 2: Bottom-Right (System Design)
		{ textAnchor: 'end', dominantBaseline: 'middle', dx: -14, dy: 6 }, // 3: Bottom-Left (Code Quality)
		{ textAnchor: 'end', dominantBaseline: 'middle', dx: -14, dy: -2 } // 4: Top-Left (Trade-offs)
	];

	return (
		<div className="mx-auto flex w-full max-w-[340px] items-center justify-center">
			<svg
				viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
				className="h-auto w-full overflow-visible select-none"
			>
				{/* Background Grid Rings */}
				{rings.map((r, ri) => {
					const pts = Array.from({ length: N }, (_, i) => {
						const { x, y } = pt(i, r);
						return `${x},${y}`;
					}).join(' ');
					return (
						<polygon
							key={ri}
							points={pts}
							fill="none"
							stroke="#E2E8F0"
							strokeWidth={ri === rings.length - 1 ? 1.5 : 1}
							strokeDasharray={ri < rings.length - 1 ? '3 3' : undefined}
						/>
					);
				})}

				{/* Ring Value Markers (25 / 50 / 75) */}
				{[25, 50, 75].map((v) => {
					const { y } = pt(0, v / 100);
					return (
						<text
							key={v}
							x={cx + 6}
							y={y + 1}
							fontSize="9"
							fill="#94A3B8"
							fontWeight="600"
							textAnchor="start"
							dominantBaseline="middle"
						>
							{v}%
						</text>
					);
				})}

				{/* 5 Axis Radial Spokes */}
				{Array.from({ length: N }, (_, i) => {
					const { x, y } = pt(i, 1);
					return (
						<line
							key={i}
							x1={cx}
							y1={cy}
							x2={x}
							y2={y}
							stroke="#CBD5E1"
							strokeWidth="1.1"
						/>
					);
				})}

				{/* Filled Candidate Score Spider Polygon */}
				<polygon
					points={scorePoly}
					fill="rgba(57, 44, 125, 0.2)"
					stroke="#392C7D"
					strokeWidth="2.5"
					strokeLinejoin="round"
				/>

				{/* Point Dots on Spiderweb */}
				{COMPETENCY_DATA.map((d, i) => {
					const { x, y } = pt(i, d.score / 100);
					return (
						<circle
							key={i}
							cx={x}
							cy={y}
							r="4.5"
							fill="#392C7D"
							stroke="white"
							strokeWidth="2"
						/>
					);
				})}

				{/* Labels with Scores */}
				{COMPETENCY_DATA.map((d, i) => {
					const { x, y } = pt(i, 1.0);
					const cfg = labelConfigs[i];
					return (
						<g key={i}>
							<text
								x={x + cfg.dx}
								y={y + cfg.dy}
								textAnchor={cfg.textAnchor as any}
								dominantBaseline={cfg.dominantBaseline as any}
								fontSize="11"
								fontWeight="700"
								fill="#1E293B"
								className="font-sans"
							>
								{d.name}
							</text>
							<text
								x={x + cfg.dx}
								y={y + cfg.dy + (i === 0 ? -12 : 12)}
								textAnchor={cfg.textAnchor as any}
								dominantBaseline={cfg.dominantBaseline as any}
								fontSize="10"
								fontWeight="700"
								fill="#392C7D"
								className="font-mono"
							>
								{d.score}%
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
}

// ─── Bar Chart (High-Contrast Past Mock Sessions) ─────────────────────────────

function VibrantBarChart() {
	const maxH = 110;
	return (
		<div className="flex items-end justify-between gap-4 px-3 pt-3">
			{SCORE_TRENDS.map((item, i) => {
				const isNow = item.isCurrent;
				const h = (item.score / 100) * maxH;
				return (
					<div key={i} className="group flex flex-1 flex-col items-center gap-2">
						{/* Score Label */}
						<span
							className={`font-mono text-xs font-extrabold transition-transform group-hover:-translate-y-0.5 ${
								isNow ? 'text-indigo-950' : 'text-indigo-700'
							}`}
						>
							{item.score}%
						</span>

						{/* Tube Bar */}
						<div
							className="flex w-full items-end justify-center"
							style={{ height: `${maxH}px` }}
						>
							<div
								className={`w-full max-w-[38px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
									isNow
										? 'bg-gradient-to-t from-indigo-900 via-indigo-950 to-indigo-800 shadow-md ring-2 ring-indigo-900/30'
										: 'border-t border-indigo-400 bg-gradient-to-t from-indigo-400 via-indigo-300 to-indigo-200 shadow-xs'
								}`}
								style={{ height: `${h}px` }}
							/>
						</div>

						{/* Session Label & Date */}
						<div className="flex flex-col items-center text-center">
							<span
								className={`truncate text-xs font-bold ${isNow ? 'text-indigo-950 underline decoration-indigo-500 underline-offset-2' : 'text-slate-700'}`}
							>
								{item.label}
							</span>
							<span className="text-[10px] font-medium text-slate-400">
								{item.date}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function InterviewReportPage() {
	const navigate = useNavigate();
	const { sessionId } = useParams<{ sessionId: string }>();

	return (
		<div className="min-h-screen w-full bg-slate-100 font-['Inter'] antialiased">
			{/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
			<div className="w-full border-b border-indigo-900/60 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xs">
				<div className="mx-auto flex max-w-[1560px] flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center lg:px-12">
					{/* Left: Breadcrumbs, Title & Metadata */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2 text-xs font-medium text-slate-400">
							<Link to="/" className="transition-colors hover:text-white">
								Home
							</Link>
							<span>&gt;</span>
							<Link to="/interview" className="transition-colors hover:text-white">
								AI Interview
							</Link>
							<span>&gt;</span>
							<span className="font-semibold text-slate-200">Evaluation Report</span>
						</div>

						<div>
							<div className="mb-0.5 text-[11px] font-bold tracking-wider text-indigo-300 uppercase">
								Session #{sessionId || '001'} · System Design Track
							</div>
							<h1 className="text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
								Interview Evaluation Report
							</h1>
							<p className="mt-1 text-xs text-slate-400 sm:text-sm">
								Candidate: <strong className="text-slate-200">Minh Trần</strong>{' '}
								&nbsp;·&nbsp; Mid-level Backend &nbsp;·&nbsp; Completed Aug 22, 2026
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-3 pt-1">
							<button
								onClick={() => window.print()}
								className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-white/20"
							>
								<Download className="h-3.5 w-3.5 text-sky-400" />
								<span>Export PDF</span>
							</button>
							<button
								onClick={() => navigate('/interview')}
								className="flex cursor-pointer items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition-colors hover:bg-rose-600"
							>
								<RotateCcw className="h-3.5 w-3.5" />
								<span>Retake Interview</span>
							</button>
						</div>
					</div>

					{/* Right: Circular Score Ring Badge */}
					<div className="relative flex shrink-0 items-center justify-center self-center sm:self-auto">
						<ScoreRing score={75} />
						<div className="absolute inset-0 flex flex-col items-center justify-center">
							<span className="font-mono text-3xl leading-none font-black text-white">
								75
							</span>
							<span className="mt-0.5 text-[11px] font-medium text-slate-300">
								/ 100
							</span>
						</div>
						<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3.5 py-0.5 text-[10px] font-bold whitespace-nowrap text-white shadow-xs">
							Hire-lean · mid-level
						</div>
					</div>
				</div>
			</div>

			{/* ── MAIN CONTENT CONTAINER ───────────────────────────────────────────── */}
			<div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-6 py-8 lg:px-12">
				{/* 1. TOP KPI METRICS ROW (4 Cards) */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{
							icon: <Award className="h-5 w-5 text-indigo-900" />,
							bg: 'bg-violet-50',
							value: '75 / 100',
							label: 'Overall score',
							sub: 'Hire-lean verdict',
							subColor: 'text-indigo-900'
						},
						{
							icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
							bg: 'bg-emerald-50',
							value: '5 / 5',
							label: 'Questions answered',
							sub: '100% completion rate',
							subColor: 'text-emerald-600'
						},
						{
							icon: <Clock className="h-5 w-5 text-sky-600" />,
							bg: 'bg-sky-50',
							value: '1m 48s',
							label: 'Avg. response time',
							sub: 'Prompt & structured',
							subColor: 'text-sky-600'
						},
						{
							icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
							bg: 'bg-orange-50',
							value: '2',
							label: 'Flagged knowledge gaps',
							sub: 'Trade-offs, failure modes',
							subColor: 'text-orange-500'
						}
					].map((kpi, i) => (
						<div
							key={i}
							className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs"
						>
							<div
								className={`h-11 w-11 rounded-xl ${kpi.bg} flex shrink-0 items-center justify-center`}
							>
								{kpi.icon}
							</div>
							<div className="min-w-0">
								<div className="truncate text-xs font-medium text-slate-400">
									{kpi.label}
								</div>
								<div className="mt-0.5 font-mono text-xl leading-tight font-bold text-slate-900">
									{kpi.value}
								</div>
								<div
									className={`text-xs font-semibold ${kpi.subColor} mt-0.5 truncate`}
								>
									{kpi.sub}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* 2. ANALYTICS ROW: RADAR + COLORFUL PERCENTAGE TUBES IN THE SAME CARD (Left: 7 Cols) & SCORE TREND (Right: 5 Cols) */}
				<div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
					{/* CARD 1 (7 Cols): RADAR CHART ON LEFT & 5 COLOR-CODED PERCENTAGE TUBES ON RIGHT */}
					<div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs xl:col-span-7">
						<div>
							{/* Header with Color-Coded Legend */}
							<div className="flex flex-col justify-between gap-2 border-b border-neutral-100 px-6 py-4 sm:flex-row sm:items-center">
								<div className="flex items-center gap-2.5">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900">
										<Radar className="h-4 w-4" />
									</div>
									<div>
										<h3 className="text-base font-bold text-slate-800">
											Competency Breakdown &amp; Strengths
										</h3>
										<p className="text-xs text-slate-400">
											Evaluated against mid-level backend engineering rubric
										</p>
									</div>
								</div>

								{/* Compact Color Legend */}
								<div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
									<span className="flex items-center gap-1">
										<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{' '}
										&ge;80%
									</span>
									<span className="flex items-center gap-1">
										<span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />{' '}
										70-79%
									</span>
									<span className="flex items-center gap-1">
										<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />{' '}
										60-69%
									</span>
									<span className="flex items-center gap-1">
										<span className="h-2.5 w-2.5 rounded-full bg-orange-500" />{' '}
										&lt;65%
									</span>
								</div>
							</div>

							{/* Main Card Content: Radar Chart on Left, 5 Colorful Percentage Tubes on Right */}
							<div className="flex flex-col items-center gap-6 p-6 lg:flex-row lg:gap-8">
								{/* Left part: Radar Chart */}
								<div className="flex w-full shrink-0 items-center justify-center lg:w-[320px]">
									<RadarChart />
								</div>

								{/* Right part: 5 Colorful Achievement Percentage Tubes */}
								<div className="flex w-full flex-1 flex-col justify-center space-y-4">
									{COMPETENCY_DATA.map((item, idx) => (
										<div key={idx} className="flex flex-col gap-1.5">
											{/* Name, Badge & Percentage */}
											<div className="flex items-center justify-between text-xs">
												<div className="flex items-center gap-2">
													<span className="font-bold text-slate-800">
														{item.name}
													</span>
													<span
														className={`py-0.2 rounded-full border px-2 text-[10px] font-semibold ${item.badgeBg} ${item.badgeText}`}
													>
														{item.level}
													</span>
												</div>
												<span
													className={`font-mono text-xs font-extrabold ${item.colorClass}`}
												>
													{item.score}%
												</span>
											</div>

											{/* Ống phần trăm màu sắc (Green / Blue / Yellow / Red depending on achievement) */}
											<div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/80 p-0.5 shadow-inner">
												<div
													className={`h-full rounded-full shadow-xs transition-all duration-700 ${item.barGradient}`}
													style={{ width: `${item.score}%` }}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Bottom summary bar */}
						<div className="flex items-center justify-between border-t border-neutral-100 bg-slate-50 px-6 py-3 text-xs text-slate-600">
							<span>
								Passing Rubric Baseline: <strong>60%</strong>
							</span>
							<span className="font-bold text-indigo-900">
								Overall Competency Index: <strong>74.8%</strong>
							</span>
						</div>
					</div>

					{/* CARD 2 (5 Cols): SCORE TREND BAR CHART + AI COACH VERDICT */}
					<div className="flex flex-col gap-6 xl:col-span-5">
						{/* Score Progression Trend */}
						<div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
							<div>
								<div className="flex items-center justify-between border-b border-neutral-100 pb-3">
									<div className="flex items-center gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900">
											<BarChart3 className="h-4 w-4" />
										</div>
										<div>
											<h3 className="text-base font-bold text-slate-800">
												Score Progression Trend
											</h3>
											<p className="text-xs text-slate-400">
												Performance across 5 mock sessions
											</p>
										</div>
									</div>
									<div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
										<TrendingUp className="h-3.5 w-3.5" />
										+19 pts growth
									</div>
								</div>

								{/* Vibrant Bar Chart */}
								<div className="pt-3 pb-2">
									<VibrantBarChart />
								</div>
							</div>

							<div className="mt-3 flex justify-between border-t border-neutral-100 px-2 pt-2 text-xs font-medium text-slate-500">
								<span>
									Starting Baseline: &nbsp;
									<strong className="text-slate-800">56%</strong>
								</span>
								<span className="font-bold text-emerald-700">
									Current Session: &nbsp;75% &nbsp;(Top 22%)
								</span>
							</div>
						</div>

						{/* AI Coach Core Takeaway */}
						<div className="flex items-start gap-3.5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-5 text-white shadow-sm">
							<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
								<Bot className="h-4 w-4 text-white" />
							</div>
							<div className="flex flex-col">
								<span className="mb-1 text-xs font-bold text-white">
									AI Interviewer Core Takeaway
								</span>
								<p className="text-xs leading-relaxed text-indigo-200">
									Strong architecture and crisp requirement clarification. Highest
									leverage improvement: proactively discuss{' '}
									<em>failure modes and quantify cost/latency trade-offs</em>{' '}
									before declaring designs finished.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* 3. QUALITATIVE ACTIONABLE FEEDBACK: Key Strengths vs Areas to Improve ─── */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Key Strengths */}
					<div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
						<div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
								<CheckCircle2 className="h-4 w-4 text-emerald-700" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-800">
									Key Strengths Demonstrated
								</h3>
								<p className="text-xs text-slate-400">
									Positive technical behaviors noted by evaluator
								</p>
							</div>
						</div>

						<div className="space-y-3.5">
							{KEY_STRENGTH_POINTS.map((s, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
										<Check className="h-3 w-3 stroke-[3] text-emerald-700" />
									</div>
									<p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
										{s}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Areas to Improve */}
					<div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
						<div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
								<AlertTriangle className="h-4 w-4 text-amber-700" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-800">
									High-Leverage Growth Areas
								</h3>
								<p className="text-xs text-slate-400">
									Priority focus points for your next session
								</p>
							</div>
						</div>

						<div className="space-y-3.5">
							{KEY_IMPROVE_POINTS.map((imp, i) => (
								<div key={i} className="flex items-start gap-3">
									<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800">
										!
									</div>
									<p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
										{imp}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* 4. FULL COACH EVALUATION NARRATIVE (Full-Width Editorial Card) ──────── */}
				<div className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
					<div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
							<MessageSquare className="h-4 w-4 text-indigo-900" />
						</div>
						<div>
							<h3 className="text-base font-bold text-slate-800">
								Comprehensive Coach Evaluation
							</h3>
							<p className="text-xs text-slate-400">
								In-depth architectural critique and actionable recommendation
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 text-xs leading-relaxed text-slate-700 sm:text-sm md:grid-cols-2">
						<div className="space-y-2.5 rounded-xl border border-neutral-100 bg-slate-50/70 p-5">
							<span className="block text-xs font-bold tracking-wide text-indigo-900 text-slate-900 uppercase">
								1. Structure &amp; Problem Solving
							</span>
							<p>
								Communication and structure were consistently strong across the
								session. Every question began with explicit requirement
								clarification and closed with asymptotic complexity analysis.
							</p>
							<p>
								The token-bucket rate limiter architecture was cleanly articulated,
								and handling cross-region replication lag was well-reasoned up to
								the partition scenario.
							</p>
						</div>

						<div className="space-y-2.5 rounded-xl border border-neutral-100 bg-slate-50/70 p-5">
							<span className="block text-xs font-bold tracking-wide text-amber-700 text-slate-900 uppercase">
								2. Gaps &amp; Next-Step Recommendation
							</span>
							<p>
								The primary missed opportunity was stopping before discussing
								failure modes. Senior interviewers look for candidates who
								voluntarily explore what happens during regional network partitions
								or cache evictions.
							</p>
							<p>
								<strong>Recommendation:</strong> In your next mock session, reserve
								the last 2 minutes of each design problem specifically for trade-off
								quantification and failure mitigation.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
