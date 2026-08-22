import React from 'react';

export const FigmaFooter: React.FC = () => {
	return (
		<div className="w-full bg-[#392C7D] flex flex-col justify-start items-start mt-12">
			<div className="w-full max-w-[1296px] mx-auto px-4 md:px-0 py-16 flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/10 text-white/70">
				<div className="flex flex-col gap-5 max-w-sm">
					<div className="text-white text-2xl font-bold">Dreams LMS</div>
					<p className="text-sm leading-6">Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</p>
				</div>
				<div className="flex flex-col gap-4">
					<h3 className="text-white text-lg font-bold">For Instructor</h3>
					<div className="flex flex-col gap-2 text-sm">
						<span>Search Mentors</span>
						<span>Login</span>
						<span>Register</span>
						<span>Students Dashboard</span>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<h3 className="text-white text-lg font-bold">For Student</h3>
					<div className="flex flex-col gap-2 text-sm">
						<span>Appointments</span>
						<span>Chat</span>
						<span>Login</span>
						<span>Register</span>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<h3 className="text-white text-lg font-bold">Contact</h3>
					<div className="flex flex-col gap-2 text-sm">
						<span>dreamslms@example.com</span>
						<span>+19 123-456-7890</span>
						<span>3556 Beech Street, San Francisco</span>
					</div>
				</div>
			</div>
			<div className="w-full max-w-[1296px] mx-auto px-4 md:px-0 py-6 flex flex-col md:flex-row justify-between items-center text-white/50 text-sm gap-4">
				<span>© 2026 DreamsLMS. All rights reserved.</span>
				<div className="flex gap-4">
					<span>Terms & Conditions</span>
					<span>Privacy Policy</span>
				</div>
			</div>
		</div>
	);
};
