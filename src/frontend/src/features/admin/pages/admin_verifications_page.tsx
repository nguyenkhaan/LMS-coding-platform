import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	ShieldCheck,
	CheckCircle2,
	XCircle,
	FileText,
	Download,
	ExternalLink,
	Eye,
	Clock,
	AlertCircle,
	Check,
	ChevronRight,
	BookOpen,
	Users,
	Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminSidebar } from '../components/admin_sidebar';

interface TeacherApplicant {
	id: string;
	applicationId: string;
	fullName: string;
	dob: string;
	idNumber: string;
	bio: string;
	status: 'PENDING REVIEW' | 'APPROVED' | 'REJECTED';
	motivation: string;
	idFrontUrl: string;
	idBackUrl: string;
	selfieUrl: string;
	educationDoc: string;
	cvDoc: string;
	timeline: {
		date: string;
		title: string;
		badge: string;
		badgeType: 'green' | 'orange';
		description: string;
	}[];
}

const MOCK_APPLICANTS: TeacherApplicant[] = [
	{
		id: '1',
		applicationId: 'TR-2025-00124',
		fullName: 'Minh Tran',
		dob: '12/05/1992',
		idNumber: '1234567890',
		bio: 'Senior Backend Engineer with 8 years of experience. Passionate about teaching clean architecture and scalable systems.',
		status: 'PENDING REVIEW',
		motivation: 'I want to share my knowledge with the next generation of developers. I believe that teaching is the best way to learn, and I have a structured approach to explaining complex concepts.',
		idFrontUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
		idBackUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
		selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
		educationDoc: 'Bachelor_Degree_Certificate.pdf',
		cvDoc: 'Minh_Tran_Resume.pdf',
		timeline: [
			{
				date: '12 Oct 2025',
				title: 'Application Submitted',
				badge: 'NEW',
				badgeType: 'green',
				description: 'Application received and queued for manual verification.'
			},
			{
				date: '14 Oct 2025',
				title: 'Initial Review',
				badge: 'PENDING',
				badgeType: 'orange',
				description: 'Documents verified. Awaiting final admin approval.'
			}
		]
	},
	{
		id: '2',
		applicationId: 'TR-2025-00125',
		fullName: 'Edythe Andrew',
		dob: '24/08/1994',
		idNumber: '0987654321',
		bio: 'Fullstack Architect with microservices expertise. Enjoys building open source tooling and coaching engineers.',
		status: 'PENDING REVIEW',
		motivation: 'Building practical hands-on curricula that directly help students pass technical interviews and land high-paying engineering roles.',
		idFrontUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
		idBackUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
		selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
		educationDoc: 'Master_Computer_Science.pdf',
		cvDoc: 'Edythe_Andrew_CV.pdf',
		timeline: [
			{
				date: '15 Oct 2025',
				title: 'Application Submitted',
				badge: 'NEW',
				badgeType: 'green',
				description: 'Application submitted with certified degree certificates.'
			}
		]
	}
];

export const AdminVerificationsPage: React.FC = () => {
	const navigate = useNavigate();
	const [applicants, setApplicants] = useState<TeacherApplicant[]>(MOCK_APPLICANTS);
	const [selectedApplicantId, setSelectedApplicantId] = useState<string>(MOCK_APPLICANTS[0].id);
	const [reviewerNote, setReviewerNote] = useState<string>('');
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const currentApplicant = applicants.find((a) => a.id === selectedApplicantId) || applicants[0];

	const handleApprove = () => {
		setApplicants((prev) =>
			prev.map((a) =>
				a.id === currentApplicant.id ? { ...a, status: 'APPROVED' } : a
			)
		);
		toast.success(`Application ${currentApplicant.applicationId} (${currentApplicant.fullName}) has been APPROVED!`);
	};

	const handleReject = () => {
		if (!reviewerNote.trim()) {
			toast.error('Please enter a reviewer note explaining the reason for rejection or changes requested.');
			return;
		}
		setApplicants((prev) =>
			prev.map((a) =>
				a.id === currentApplicant.id ? { ...a, status: 'REJECTED' } : a
			)
		);
		toast.warning(`Application ${currentApplicant.applicationId} marked as REJECTED (Changes requested).`);
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			
			{/* 1. Hero Breadcrumb Banner (Figma Signature Pastel Gradient) */}
			<div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
				<h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
					Teacher Registration Review
				</h1>
				<div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
					<Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">
						Home
					</Link>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<span className="text-zinc-900 font-semibold">Admin Review Dashboard</span>
				</div>
			</div>

			{/* 2. Main Body Container (max-w-[1340px] centered) */}
			<div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start flex-1">
				
				{/* Standardized Left Admin Sidebar with Applicant Queue */}
				<div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
					<AdminSidebar pendingTeachersCount={applicants.filter(a => a.status === 'PENDING REVIEW').length} />

					{/* Applicant Switcher Queue */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
						<span className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-slate-100 pb-2">
							Applicant Queue ({applicants.length})
						</span>

						<div className="flex flex-col gap-2">
							{applicants.map((app) => (
								<button
									key={app.id}
									onClick={() => setSelectedApplicantId(app.id)}
									className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
										selectedApplicantId === app.id
											? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
											: 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-zinc-800'
									}`}
								>
									<div className="flex justify-between items-center">
										<span className="font-bold text-sm">{app.fullName}</span>
										<span
											className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
												app.status === 'APPROVED'
													? 'bg-emerald-500 text-white'
													: app.status === 'REJECTED'
													? 'bg-rose-500 text-white'
													: selectedApplicantId === app.id
													? 'bg-amber-400 text-zinc-900'
													: 'bg-amber-100 text-amber-900'
											}`}
										>
											{app.status === 'PENDING REVIEW' ? 'PENDING' : app.status}
										</span>
									</div>
									<span className={`text-xs ${selectedApplicantId === app.id ? 'text-slate-200' : 'text-neutral-500'}`}>
										ID: {app.applicationId}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Right Main Review Content Panel */}
				<div className="flex-1 w-full flex flex-col gap-6">
					
					{/* 1. Application Status Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex justify-between items-center">
						<div className="flex flex-col gap-1">
							<h2 className="text-xl font-bold text-zinc-900">Application Status</h2>
							<span className="text-sm text-neutral-500 font-medium">
								Application ID: <strong className="text-zinc-800">{currentApplicant.applicationId}</strong>
							</span>
						</div>

						<span
							className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider border ${
								currentApplicant.status === 'APPROVED'
									? 'bg-emerald-50 text-emerald-700 border-emerald-300'
									: currentApplicant.status === 'REJECTED'
									? 'bg-rose-50 text-rose-700 border-rose-300'
									: 'bg-orange-50 text-amber-700 border-amber-400 animate-pulse'
							}`}
						>
							{currentApplicant.status}
						</span>
					</div>

					{/* 2. Applicant Information Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-6">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-3">
							Applicant Information
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex flex-col gap-1">
								<span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
									Legal Full Name
								</span>
								<span className="text-base font-bold text-zinc-900">
									{currentApplicant.fullName}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								<span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
									Date of Birth
								</span>
								<span className="text-base font-bold text-zinc-900">
									{currentApplicant.dob}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								<span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
									Identity Number
								</span>
								<span className="text-base font-bold text-zinc-900">
									{currentApplicant.idNumber}
								</span>
							</div>

							<div className="flex flex-col gap-1">
								<span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
									Bio
								</span>
								<p className="text-sm text-neutral-600 leading-relaxed">
									{currentApplicant.bio}
								</p>
							</div>
						</div>
					</div>

					{/* 3. Identity Documents Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-5">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-3">
							Identity Documents
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
							{/* Identity Front */}
							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between gap-3">
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-zinc-800">Identity Front</span>
									<span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
										VERIFIED
									</span>
								</div>
								<div className="h-32 bg-slate-200 rounded-lg overflow-hidden relative group">
									<img
										src={currentApplicant.idFrontUrl}
										alt="Identity Front"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform"
									/>
								</div>
								<button
									onClick={() => setPreviewImage(currentApplicant.idFrontUrl)}
									className="text-xs font-bold text-indigo-900 underline hover:text-rose-500 cursor-pointer text-left"
								>
									View Document &rarr;
								</button>
							</div>

							{/* Identity Back */}
							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between gap-3">
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-zinc-800">Identity Back</span>
									<span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
										VERIFIED
									</span>
								</div>
								<div className="h-32 bg-slate-200 rounded-lg overflow-hidden relative group">
									<img
										src={currentApplicant.idBackUrl}
										alt="Identity Back"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform"
									/>
								</div>
								<button
									onClick={() => setPreviewImage(currentApplicant.idBackUrl)}
									className="text-xs font-bold text-indigo-900 underline hover:text-rose-500 cursor-pointer text-left"
								>
									View Document &rarr;
								</button>
							</div>

							{/* Selfie with ID */}
							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between gap-3">
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-zinc-800">Selfie with ID</span>
									<span className="px-2 py-0.5 bg-orange-100 text-amber-800 text-[10px] font-bold rounded-full">
										PENDING
									</span>
								</div>
								<div className="h-32 bg-slate-200 rounded-lg overflow-hidden relative group">
									<img
										src={currentApplicant.selfieUrl}
										alt="Selfie with ID"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform"
									/>
								</div>
								<button
									onClick={() => setPreviewImage(currentApplicant.selfieUrl)}
									className="text-xs font-bold text-indigo-900 underline hover:text-rose-500 cursor-pointer text-left"
								>
									View Document &rarr;
								</button>
							</div>
						</div>
					</div>

					{/* 4. Credentials & Documents Attachment Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-4">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-3">
							Documents &amp; Certificates
						</h3>

						<div className="flex flex-col gap-3">
							{/* Doc 1 */}
							<div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0">
										<FileText className="w-5 h-5" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-bold text-zinc-900">Education Evidence</span>
										<span className="text-xs text-neutral-500">{currentApplicant.educationDoc}</span>
									</div>
								</div>

								<button
									onClick={() => toast.success(`Downloading ${currentApplicant.educationDoc}...`)}
									className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-neutral-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
								>
									<Download className="w-3.5 h-3.5" />
									<span>Download</span>
								</button>
							</div>

							{/* Doc 2 */}
							<div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0">
										<FileText className="w-5 h-5" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-bold text-zinc-900">CV / Resume</span>
										<span className="text-xs text-neutral-500">{currentApplicant.cvDoc}</span>
									</div>
								</div>

								<button
									onClick={() => toast.success(`Downloading ${currentApplicant.cvDoc}...`)}
									className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-neutral-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
								>
									<Download className="w-3.5 h-3.5" />
									<span>Download</span>
								</button>
							</div>
						</div>
					</div>

					{/* 5. Motivation Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-3">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
							Motivation
						</h3>
						<p className="text-sm text-neutral-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
							&ldquo;{currentApplicant.motivation}&rdquo;
						</p>
					</div>

					{/* 6. Reviewer Note Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-3">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
							Reviewer Note
						</h3>
						<textarea
							rows={3}
							value={reviewerNote}
							onChange={(e) => setReviewerNote(e.target.value)}
							placeholder="Add your moderation feedback or notes for the applicant here..."
							className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-900/20 focus:outline-none resize-none"
						/>
					</div>

					{/* 7. Review History Timeline Card */}
					<div className="w-full p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col gap-4">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
							Review History
						</h3>

						<div className="flex flex-col gap-4">
							{currentApplicant.timeline.map((item, idx) => (
								<div key={idx} className="flex flex-col sm:flex-row items-start gap-4">
									<span className="w-28 text-xs font-semibold text-neutral-400 shrink-0 sm:pt-2">
										{item.date}
									</span>
									<div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5 shadow-xs">
										<div className="flex justify-between items-center">
											<span className="text-sm font-bold text-zinc-900">{item.title}</span>
											<span
												className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
													item.badgeType === 'green'
														? 'bg-emerald-100 text-emerald-800'
														: 'bg-orange-100 text-amber-800'
												}`}
											>
												{item.badge}
											</span>
										</div>
										<p className="text-xs text-neutral-500 leading-relaxed">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* 8. Decision Action Buttons */}
					<div className="w-full pt-4 flex items-center justify-end gap-4">
						<button
							onClick={handleReject}
							className="px-8 py-3 rounded-2xl border-2 border-rose-500 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors cursor-pointer"
						>
							Reject
						</button>
						<button
							onClick={handleApprove}
							className="px-8 py-3 rounded-2xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
						>
							Approve
						</button>
					</div>

				</div>

			</div>

			{/* Document Image Modal Preview */}
			{previewImage && (
				<div
					onClick={() => setPreviewImage(null)}
					className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-pointer"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="max-w-2xl w-full bg-white rounded-2xl p-4 overflow-hidden relative shadow-2xl"
					>
						<div className="flex justify-between items-center pb-3 border-b border-slate-100">
							<h4 className="font-bold text-zinc-900 text-sm">Document Preview</h4>
							<button
								onClick={() => setPreviewImage(null)}
								className="text-neutral-400 hover:text-zinc-900 text-lg font-bold cursor-pointer"
							>
								✕
							</button>
						</div>
						<div className="mt-3 max-h-[70vh] overflow-auto flex justify-center">
							<img src={previewImage} alt="Document" className="max-w-full rounded-lg" />
						</div>
					</div>
				</div>
			)}

		</div>
	);
};
