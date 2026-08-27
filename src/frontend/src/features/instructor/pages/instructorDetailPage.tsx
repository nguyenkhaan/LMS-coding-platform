import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, BookOpen, Users, Mail, Globe, ChevronLeft, ChevronRight, Briefcase, Share2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export const InstructorDetailPage: React.FC = () => {
	const { instructorId } = useParams<{ instructorId: string }>();
	void instructorId;
	const { isAuthenticated } = useAuthStore();
	const [isReadMore, setIsReadMore] = useState(false);
	const [messageText, setMessageText] = useState('');
	const [courseSlideIndex, setCourseSlideIndex] = useState(0);

	// Mock courses taught by instructor
	const instructorCourses = [
		{
			id: 1,
			slug: 'ui-ux-design-degree',
			title: 'Information About UI/UX Design Degree',
			instructor: 'David Benitez',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
			category: 'Design',
			rating: 4.9,
			reviews: 200,
			price: 120,
			thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80'
		},
		{
			id: 2,
			slug: 'wordpress-for-beginners',
			title: 'Wordpress for Beginners - Master Wordpress Quickly',
			instructor: 'Ana Reyes',
			avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
			category: 'Wordpress',
			rating: 4.4,
			reviews: 160,
			price: 140,
			thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80'
		},
		{
			id: 3,
			slug: 'sketch-from-a-to-z',
			title: 'Sketch from A to Z (2024): Become an app designer',
			instructor: 'Andrew Pirtle',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
			category: 'Design',
			rating: 4.6,
			reviews: 170,
			price: 160,
			thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
		}
	];

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAuthenticated) {
			toast.error('Please log in to send a direct message to this instructor.');
			return;
		}
		if (!messageText.trim()) return;
		toast.success('Message sent to instructor successfully!');
		setMessageText('');
	};

	const handleOpenWebsite = () => {
		window.open('https://github.com', '_blank', 'noopener,noreferrer');
	};

	const handleShareProfile = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			toast.success('Instructor profile link copied to clipboard!');
		} else {
			toast.success('Profile URL: ' + window.location.href);
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
			
			{/* 1. Hero Breadcrumb Banner (Figma Signature Pastel Gradient) */}
			<div className="w-full py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
				<h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
					Instructor Detail
				</h1>
				<div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
					<Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">
						Home
					</Link>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<Link to="/instructors" className="text-neutral-500 hover:text-zinc-900 transition-colors">
						Instructors
					</Link>
					<span className="text-neutral-400 font-normal">&gt;</span>
					<span className="text-zinc-900 font-semibold">Instructor Detail</span>
				</div>
			</div>

			{/* 2. Main Body (Centered max-w-[1340px]) */}
			<div className="max-w-[1340px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start flex-1">
				
				{/* Left Column (Main detailed profile sections) */}
				<div className="flex-1 w-full flex flex-col gap-6">
					
					{/* Header Profile Card */}
					<div className="w-full p-6 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6 relative shadow-xs">
						{/* Avatar image container */}
						<div className="w-full md:w-52 h-44 rounded-xl overflow-hidden shrink-0 relative bg-slate-200">
							<img
								src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
								alt="Rolands Granger"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Profile Details */}
						<div className="flex-1 flex flex-col justify-between gap-4">
							<div className="flex flex-col gap-2">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
									<h2 className="text-xl lg:text-2xl font-bold text-zinc-900 tracking-tight">
										Rolands Granger
									</h2>
									<div className="flex items-center gap-2">
										<span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
											Developer
										</span>
										<div className="flex items-center gap-1 text-xs font-bold text-amber-500">
											<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
											<span>4.9</span>
											<span className="text-neutral-400 font-normal">(200 Reviews)</span>
										</div>
									</div>
								</div>

								<p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
									I am a web developer with a vast array of knowledge in many different front end and back end languages, responsive frameworks, databases, and best code practices.
								</p>
							</div>

							{/* Stats & Social links row */}
							<div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
								<div className="flex items-center gap-5 text-xs font-medium text-neutral-600">
									<div className="flex items-center gap-1.5">
										<BookOpen className="w-4 h-4 text-rose-500" />
										<span>12+ Lessons</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Users className="w-4 h-4 text-rose-500" />
										<span>50 Students</span>
									</div>
								</div>

								<div className="flex items-center gap-2 text-indigo-900">
									<button
										onClick={handleOpenWebsite}
										className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-indigo-50 transition-colors cursor-pointer"
										title="Website"
									>
										<Globe className="w-3.5 h-3.5" />
									</button>
									<button
										onClick={handleShareProfile}
										className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-indigo-50 transition-colors cursor-pointer"
										title="Share profile"
									>
										<Share2 className="w-3.5 h-3.5" />
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* About Me Section */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col gap-3">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
							About Me
						</h3>
						<p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
							Very well thought out and articulate communication. Clear milestones, deadlines and fast work. Patience. Infinite patience. No shortcuts. Even if the client is being careless. Some quick example text to build on the card title and bulk the card&apos;s content Moltin gives you platform.
							{isReadMore && (
								<span>
									{' '}Passionate about coaching next-generation software engineers with clean code methodologies, modern cloud deployment workflows, and deep algorithms mastery.
								</span>
							)}
						</p>
						<button
							onClick={() => setIsReadMore(!isReadMore)}
							className="text-xs font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer w-fit"
						>
							{isReadMore ? 'Read Less' : 'Read More'}
						</button>
					</div>

					{/* Education Section */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col gap-4">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
							Education
						</h3>
						<div className="flex flex-col gap-4 pl-2">
							{/* Item 1 */}
							<div className="flex items-start gap-4 relative">
								<div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-1" />
								<div className="flex flex-col">
									<h4 className="text-sm font-semibold text-zinc-900">
										BCA - Bachelor of Computer Applications
									</h4>
									<span className="text-xs text-neutral-500">
										International University - (2004 - 2010)
									</span>
								</div>
							</div>

							{/* Item 2 */}
							<div className="flex items-start gap-4 relative">
								<div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-1" />
								<div className="flex flex-col">
									<h4 className="text-sm font-semibold text-zinc-900">
										MCA - Master of Computer Application
									</h4>
									<span className="text-xs text-neutral-500">
										International University - (2010 - 2012)
									</span>
								</div>
							</div>

							{/* Item 3 */}
							<div className="flex items-start gap-4 relative">
								<div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-1" />
								<div className="flex flex-col">
									<h4 className="text-sm font-semibold text-zinc-900">
										Design Communication Visual
									</h4>
									<span className="text-xs text-neutral-500">
										International University - (2012 - 2015)
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Experience Section */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col gap-4">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-100 pb-2">
							Experience
						</h3>
						<div className="flex flex-col gap-4">
							{/* Exp 1 */}
							<div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
								<div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-zinc-800 shrink-0">
									<Briefcase className="w-4 h-4 text-indigo-900" />
								</div>
								<div className="flex flex-col">
									<h4 className="text-sm font-semibold text-zinc-900">
										Web Design &amp; Development Team Leader
									</h4>
									<span className="text-xs text-neutral-500">
										Creative Agency - (2013 - 2016)
									</span>
								</div>
							</div>

							{/* Exp 2 */}
							<div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
								<div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-zinc-800 shrink-0">
									<Briefcase className="w-4 h-4 text-indigo-900" />
								</div>
								<div className="flex flex-col">
									<h4 className="text-sm font-semibold text-zinc-900">
										Project Manager
									</h4>
									<span className="text-xs text-neutral-500">
										Jobcy Technology Pvt.Ltd - (Present)
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Courses Taught by Instructor */}
					<div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col gap-5">
						<div className="flex justify-between items-center border-b border-slate-100 pb-3">
							<h3 className="text-lg font-bold text-zinc-900">
								Courses ({instructorCourses.length})
							</h3>
							<div className="flex items-center gap-1">
								<button
									onClick={() => setCourseSlideIndex((prev) => Math.max(0, prev - 1))}
									disabled={courseSlideIndex === 0}
									className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
									title="Previous courses"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>
								<button
									onClick={() => setCourseSlideIndex((prev) => Math.min(instructorCourses.length - 2, prev + 1))}
									disabled={courseSlideIndex >= Math.max(0, instructorCourses.length - 2)}
									className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
									title="Next courses"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Course Cards Grid (Render sliced courses based on courseSlideIndex) */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{instructorCourses.slice(courseSlideIndex, courseSlideIndex + 2).map((course) => (
								<div
									key={course.id}
									className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
								>
									<div className="relative h-36 bg-slate-100 overflow-hidden">
										<img
											src={course.thumbnail}
											alt={course.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md">
											{course.category}
										</span>
									</div>

									<div className="p-4 flex-1 flex flex-col justify-between gap-3">
										<div className="flex flex-col gap-1.5">
											<div className="flex items-center justify-between text-xs text-neutral-500">
												<span>{course.instructor}</span>
												<div className="flex items-center gap-1 text-amber-500 font-bold">
													<Star className="w-3 h-3 fill-amber-400 text-amber-400" />
													<span>{course.rating}</span>
													<span className="text-neutral-400 font-normal">({course.reviews})</span>
												</div>
											</div>
											<h4 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-900 transition-colors line-clamp-2 leading-snug">
												{course.title}
											</h4>
										</div>

										<div className="pt-3 border-t border-slate-100 flex items-center justify-between">
											<span className="text-base font-bold text-rose-500">
												${course.price}
											</span>
											<Link
												to={`/courses/${course.slug}`}
												className="px-3 py-1 bg-zinc-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
											>
												View Course
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

				</div>

				{/* Right Column (Sidebar ~380px) */}
				<div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
					
					{/* Contact Details Card (PII removed: no personal phone/address) */}
					<div className="w-full p-6 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
						<h3 className="text-lg font-bold text-zinc-900 border-b border-slate-200/80 pb-3">
							Contact Information
						</h3>

						<div className="flex flex-col gap-4">
							{/* Email */}
							<div className="flex items-center gap-3.5">
								<div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center shrink-0 shadow-xs">
									<Mail className="w-4 h-4" />
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-neutral-400 font-medium">Email</span>
									<span className="text-xs sm:text-sm font-semibold text-zinc-900 break-all">
										instructor@example.com
									</span>
								</div>
							</div>

							{/* Website */}
							<div className="flex items-center gap-3.5">
								<div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center shrink-0 shadow-xs">
									<Globe className="w-4 h-4" />
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-neutral-400 font-medium">Website</span>
									<a
										href="https://github.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs sm:text-sm font-semibold text-indigo-900 hover:underline break-all"
									>
										instructor.dev
									</a>
								</div>
							</div>
						</div>

						{/* Direct Message Box */}
						<form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-200/80 flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-zinc-800">Send Direct Message</span>
								<span className="text-[11px] text-neutral-400">{messageText.length}/500</span>
							</div>
							<textarea
								rows={3}
								maxLength={500}
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								placeholder="Write your question or request here..."
								className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-zinc-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-900/20 focus:outline-none resize-none"
							/>
							<button
								type="submit"
								className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
							>
								<Send className="w-3.5 h-3.5" />
								<span>Send Message</span>
							</button>
						</form>
					</div>

				</div>

			</div>

		</div>
	);
};
