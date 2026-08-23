import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Heart,
  Bot,
  Settings,
  LogOut,
  CheckCircle2,
  Edit3,
  Mail,
  Phone,
  Calendar,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { StudentSidebar } from '../components/student_sidebar';
import { StudentHeroCard } from '../components/student_hero_card';

export function StudentProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: 'Ronald',
    lastName: 'Richard',
    registrationDate: '16 Jan 2024, 11:15 AM',
    userName: 'studentdemo',
    phoneNumber: '90154-91036',
    email: 'studentdemo@example.com',
    gender: 'Male',
    dob: '16 Jan 2000',
    age: '24',
    bio: "Hello! I'm Ronald Richard. I'm passionate about developing innovative software solutions, analyzing classic literature. I aspire to become a software developer, work as an editor. In my free time, I enjoy coding, reading, hiking etc."
  });

  return (
    <div className="w-full min-h-screen bg-slate-100 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. HERO TITLE BANNER (bg-gradient-to-r from-red-50 via-sky-50 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">My Profile</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">My Profile</span>
        </div>
      </div>

      {/* 2. PROFILE HERO CARD */}
      <StudentHeroCard displayName={user?.fullName || (profileData.firstName + ' ' + profileData.lastName)} />

      {/* 3. MAIN WORKSPACE (2 Columns: Left Menu Sidebar + Right Profile Details Card) */}
      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row justify-start items-start gap-8">
        
        {/* LEFT SIDEBAR MENU */}
        <StudentSidebar activePath="/student/profile" />

        {/* RIGHT MAIN WORKSPACE: PROFILE INFORMATION CARD */}
        <div className="flex-1 w-full min-w-0 bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Card Header Row with Edit Icon */}
          <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-zinc-900 text-xl font-bold tracking-tight">My Profile</h2>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-zinc-700 rounded-full transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">{isEditing ? 'Done' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Profile Details Field Grid (Exact 3-Column layout from Figma) */}
          <div className="flex flex-col gap-6">
            
            {/* ROW 1: First Name / Last Name / Registration Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">First Name</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.firstName}</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">Last Name</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.lastName}</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">Registration Date</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.registrationDate}</span>
              </div>
            </div>

            {/* ROW 2: User Name / Phone Number / Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">User Name</span>
                <span className="text-neutral-600 text-sm font-medium font-mono">{profileData.userName}</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">Phone Number</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.phoneNumber}</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">Email</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.email}</span>
              </div>
            </div>

            {/* ROW 3: Gender / DOB / Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">Gender</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.gender}</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">DOB</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.dob}</span>
              </div>

              <div className="flex flex-col gap-1 p-3.5 bg-slate-50/70 rounded-xl border border-neutral-100">
                <span className="text-zinc-900 text-sm font-semibold">Age</span>
                <span className="text-neutral-600 text-sm font-medium">{profileData.age}</span>
              </div>
            </div>

            {/* ROW 4: Bio (Full Width) */}
            <div className="flex flex-col gap-2 p-4 bg-slate-50/70 rounded-xl border border-neutral-100">
              <span className="text-zinc-900 text-sm font-semibold">Bio</span>
              <p className="text-neutral-600 text-sm font-normal leading-relaxed">
                {profileData.bio}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
