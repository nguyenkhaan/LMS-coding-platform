import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

export const FigmaHeader: React.FC = () => {
	return (
		<div className="w-full relative inline-flex flex-col justify-start items-start">
			{/* Top Bar */}
			<div className="self-stretch px-4 md:px-[160px] py-2 bg-gray-900 flex justify-center items-center gap-2">
				<div className="w-full max-w-[1296px] flex justify-between items-center text-white text-xs font-semibold">
					<div className="flex gap-4">
						<span>1442 Crosswind Drive Madisonville</span>
						<span>+1 45887 77874</span>
					</div>
					<div className="flex gap-4">
						<span>ENG</span>
						<span>USD</span>
					</div>
				</div>
			</div>
			{/* Main Navbar */}
			<div className="self-stretch px-4 md:px-[160px] py-3.5 bg-white border-b border-slate-100 flex justify-center items-center">
				<div className="w-full max-w-[1296px] flex justify-between items-center">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2.5">
						<div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#392C7D] to-purple-600 flex items-center justify-center text-white shadow-md">
							<BookOpen className="w-5 h-5" />
						</div>
						<span className="font-extrabold text-xl tracking-tight text-[#392C7D]">
							Dreams LMS
						</span>
					</Link>
					
					{/* Menu Navigation */}
					<div className="hidden md:flex gap-7 text-sm font-semibold text-zinc-900">
						<Link to="/" className="hover:text-[#FF4667] transition-colors">Home</Link>
						<Link to="/courses" className="text-[#FF4667] font-semibold">Courses</Link>
						<Link to="/practice" className="hover:text-[#FF4667] transition-colors">Classroom</Link>
						<span className="cursor-pointer hover:text-[#FF4667]">Instructors</span>
						<span className="cursor-pointer hover:text-[#FF4667]">Blog</span>
						<span className="cursor-pointer hover:text-[#FF4667]">Contact us</span>
					</div>

					{/* CTAs */}
					<div className="flex gap-4 items-center">
						<div className="flex gap-2">
							<button className="p-2 border border-neutral-200 rounded-full hover:bg-slate-50">
								<Search className="w-4 h-4 text-gray-800" />
							</button>
						</div>
						<div className="flex gap-3">
							<button className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-zinc-900 text-sm font-semibold rounded-full transition-all">
								Sign In
							</button>
							<button className="px-5 py-2 bg-[#FF4667] hover:bg-[#e03d5b] text-white text-sm font-semibold rounded-full transition-all">
								Register
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
