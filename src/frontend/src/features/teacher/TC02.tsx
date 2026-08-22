import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { FigmaHeader } from '../courses/components/FigmaHeader';
import { FigmaFooter } from '../courses/components/FigmaFooter';
import {
  LayoutDashboard,
  User,
  BookOpen,
  DollarSign,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Pencil,
  GraduationCap,
  Briefcase,
  Globe,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Phone,
  Tag,
  X,
  Check,
  Wallet,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TeacherProfile {
  avatarUrl: string;
  headline: string;
  expertiseTags: string[];
  yearsOfExperience: number;
  educationEntries: EducationEntry[];
  experienceEntries: ExperienceEntry[];
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  email: string;
  phone: string;
}

interface EducationEntry {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

interface ExperienceEntry {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Mock data — replace with API response when teacher profile service is ready
// Fields map exactly to teacher_profile table; no teacher_register fields exposed
// ---------------------------------------------------------------------------
const MOCK_PROFILE: TeacherProfile = {
  avatarUrl: 'https://placehold.co/96x96',
  headline: 'Senior Software Engineer & Coding Instructor',
  expertiseTags: ['Python', 'React', 'TypeScript', 'Algorithms', 'System Design'],
  yearsOfExperience: 8,
  educationEntries: [
    { id: 1, degree: 'B.Sc. Computer Science', institution: 'Hanoi University of Science and Technology', year: '2012 – 2016' },
    { id: 2, degree: 'M.Sc. Software Engineering', institution: 'Vietnam National University', year: '2016 – 2018' },
  ],
  experienceEntries: [
    { id: 1, title: 'Senior Software Engineer', company: 'TechCorp Vietnam', duration: '2018 – 2022', description: 'Built scalable microservices and mentored junior developers.' },
    { id: 2, title: 'Coding Instructor', company: 'Dreams LMS', duration: '2022 – Present', description: 'Teaching Python, algorithms and system design to 8 000+ enrolled students.' },
  ],
  githubUrl: 'https://github.com/edythe-andrew',
  linkedinUrl: 'https://linkedin.com/in/edythe-andrew',
  websiteUrl: 'https://edytheandrew.dev',
  email: 'teacher@example.com',
  phone: '+1 123 456 7890',
};

// ---------------------------------------------------------------------------
// Sidebar nav item
// ---------------------------------------------------------------------------
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={
      active
        ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF4667] font-semibold bg-rose-50/60 text-sm'
        : 'flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-[#FF4667] hover:bg-slate-50 transition-all text-sm'
    }
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// ---------------------------------------------------------------------------
// Profile field row — label + value, with optional edit affordance
// ---------------------------------------------------------------------------
interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <span className='text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide'>{label}</span>
    <span className='text-[14px] text-[#111827] font-medium break-words'>{value || '—'}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Education / Experience row
// ---------------------------------------------------------------------------
interface EducationRowProps {
  entry: EducationEntry;
}

const EducationRow: React.FC<EducationRowProps> = ({ entry }) => (
  <div className='flex items-start gap-3 py-3 border-b border-gray-100 last:border-0'>
    <div className='w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0'>
      <GraduationCap className='w-4 h-4 text-[#392C7D]' />
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-[14px] font-semibold text-[#111827]'>{entry.degree}</p>
      <p className='text-[13px] text-[#374151]'>{entry.institution}</p>
      <p className='text-[12px] text-[#6B7280] mt-0.5'>{entry.year}</p>
    </div>
  </div>
);

interface ExperienceRowProps {
  entry: ExperienceEntry;
}

const ExperienceRow: React.FC<ExperienceRowProps> = ({ entry }) => (
  <div className='flex items-start gap-3 py-3 border-b border-gray-100 last:border-0'>
    <div className='w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0'>
      <Briefcase className='w-4 h-4 text-[#FF4667]' />
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-[14px] font-semibold text-[#111827]'>{entry.title}</p>
      <p className='text-[13px] text-[#374151]'>{entry.company} · {entry.duration}</p>
      <p className='text-[13px] text-[#6B7280] mt-1'>{entry.description}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// TC02 — Teacher Profile Page
// ---------------------------------------------------------------------------
export const TeacherProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile>(MOCK_PROFILE);
  const [draft, setDraft] = useState<TeacherProfile>(MOCK_PROFILE);

  const displayName = user?.fullName || 'Edythe Andrew';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditToggle = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  const handleDraftChange = (field: keyof TeacherProfile, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass = 'w-full px-3 py-2 text-[14px] text-[#111827] border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] focus:ring-1 focus:ring-[#392C7D]/20 transition-all bg-white';

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-start items-center'>
      <div className='w-full max-w-[1892px] bg-white shadow-2xl rounded-3xl border border-neutral-100 overflow-hidden flex flex-col'>
        <FigmaHeader />

        {/* Page title banner */}
        <div className='w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1'>
          <h1 className='text-[36px] font-extrabold text-white tracking-tight'>My Profile</h1>
          <p className='text-[13px] font-medium text-white/70'>Home &rsaquo; My Profile</p>
        </div>

        {/* Profile hero banner */}
        <div className='w-full max-w-[1296px] mx-auto px-4 pt-8'>
          <div className='w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex items-center justify-between text-white shadow-sm'>
            <div className='flex items-center gap-6 relative z-10'>
              <img
                className='w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white'
                src={profile.avatarUrl}
                alt={displayName}
              />
              <div className='flex flex-col gap-1'>
                <h2 className='text-2xl font-bold text-white tracking-tight'>{displayName}</h2>
                <p className='text-neutral-200 text-sm font-medium'>{profile.headline}</p>
              </div>
            </div>
            <div className='flex gap-4 relative z-10'>
              <button className='px-5 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-all cursor-pointer'>
                Become a Student
              </button>
              <button
                onClick={() => navigate('/teacher/dashboard')}
                className='px-5 py-2.5 bg-[#FF4667] text-white text-sm font-semibold rounded-full hover:bg-[#e03d5b] transition-all cursor-pointer'
              >
                Teacher Dashboard
              </button>
            </div>
            <div className='absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none' />
            <div className='absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none' />
          </div>
        </div>

        {/* Body */}
        <div className='w-full max-w-[1296px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start'>

          {/* Sidebar */}
          <div className='w-full lg:w-72 shrink-0'>
            <div className='w-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm'>
              <div className='flex flex-col gap-4'>
                <h3 className='text-xs font-bold text-[#111827] uppercase tracking-wider'>Main Menu</h3>
                <div className='flex flex-col gap-2'>
                  <NavItem to='/teacher/dashboard' icon={<LayoutDashboard className='w-4 h-4' />} label='Dashboard' />
                  <NavItem to='/teacher/profile' icon={<User className='w-4 h-4' />} label='My Profile' active />
                  <NavItem to='/teacher/course-builder' icon={<BookOpen className='w-4 h-4' />} label='My Courses' />
                  <NavItem to='/teacher/course-enrollment' icon={<BookOpen className='w-4 h-4' />} label='Course Enrollment' />
                  <NavItem to='/teacher/students' icon={<Users className='w-4 h-4' />} label='Students' />
                  <NavItem to='/teacher/earnings' icon={<DollarSign className='w-4 h-4' />} label='Earnings' />
                  <NavItem to='/teacher/wallet' icon={<Wallet className='w-4 h-4' />} label='Payout & Wallet' />
                  <NavItem to='/teacher/messages' icon={<MessageSquare className='w-4 h-4' />} label='Messages' />
                </div>
              </div>
              <div className='border-t border-gray-100 pt-6 flex flex-col gap-4'>
                <h3 className='text-xs font-bold text-[#111827] uppercase tracking-wider'>Account Settings</h3>
                <div className='flex flex-col gap-2'>
                  <NavItem to='/teacher/settings' icon={<Settings className='w-4 h-4' />} label='Settings' />
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-rose-500 hover:bg-rose-50/50 transition-all text-sm text-left w-full cursor-pointer'
                  >
                    <LogOut className='w-4 h-4 text-rose-500' />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className='flex-1 w-full flex flex-col gap-6'>

            {/* Profile detail card */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                <h2 className='text-[20px] font-bold text-[#392C7D]'>My Profile</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditToggle}
                    aria-label='Edit profile'
                    className='flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 hover:text-[#392C7D] hover:border-indigo-200 transition-all cursor-pointer'
                  >
                    <Pencil className='w-3.5 h-3.5' />
                    Edit
                  </button>
                ) : (
                  <div className='flex gap-2'>
                    <button
                      onClick={handleCancel}
                      aria-label='Cancel editing'
                      className='flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer'
                    >
                      <X className='w-3.5 h-3.5' />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      aria-label='Save profile'
                      className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#392C7D] text-white text-[14px] font-semibold hover:bg-[#2d2263] transition-all cursor-pointer'
                    >
                      <Check className='w-3.5 h-3.5' />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className='px-6 py-6 flex flex-col gap-6'>
                {/* Identity grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5'>
                  <ProfileField label='Full Name' value={displayName} />
                  <ProfileField label='Headline' value={isEditing ? '' : profile.headline} />
                  {isEditing && (
                    <div className='sm:col-start-2 -mt-4'>
                      <input
                        type='text'
                        value={draft.headline}
                        onChange={(e) => handleDraftChange('headline', e.target.value)}
                        placeholder='e.g. Senior Software Engineer & Instructor'
                        className={inputClass}
                        aria-label='Headline'
                      />
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <Mail className='w-4 h-4 text-[#6B7280] shrink-0' />
                    <ProfileField label='Email' value={isEditing ? '' : profile.email} />
                  </div>
                  {isEditing && (
                    <input
                      type='email'
                      value={draft.email}
                      onChange={(e) => handleDraftChange('email', e.target.value)}
                      placeholder='contact@example.com'
                      className={inputClass}
                      aria-label='Email'
                    />
                  )}
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-[#6B7280] shrink-0' />
                    <ProfileField label='Phone' value={isEditing ? '' : profile.phone} />
                  </div>
                  {isEditing && (
                    <input
                      type='tel'
                      value={draft.phone}
                      onChange={(e) => handleDraftChange('phone', e.target.value)}
                      placeholder='+1 123 456 7890'
                      className={inputClass}
                      aria-label='Phone'
                    />
                  )}
                  <ProfileField label='Years of Experience' value={profile.yearsOfExperience + " years"} />
                </div>

                {/* Bio */}
                <div className='flex flex-col gap-2'>
                  <span className='text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide'>Bio</span>
                  {isEditing ? (
                    <textarea
                      value={draft.headline}
                      onChange={(e) => handleDraftChange('headline', e.target.value)}
                      rows={3}
                      placeholder='Tell students about yourself...'
                      className={`${inputClass} resize-none`}
                      aria-label='Bio'
                    />
                  ) : (
                    <p className='text-[14px] text-[#374151] leading-relaxed'>
                      {profile.headline}
                    </p>
                  )}
                </div>

                {/* Expertise tags */}
                <div className='flex flex-col gap-2'>
                  <span className='text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide flex items-center gap-1.5'>
                    <Tag className='w-3 h-3' /> Expertise
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {profile.expertiseTags.map((tag) => (
                      <span
                        key={tag}
                        className='px-3 py-1 bg-indigo-50 text-[#392C7D] text-[12px] font-semibold rounded-full border border-indigo-100'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External links */}
                <div className='flex flex-col gap-3'>
                  <span className='text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide'>Links</span>
                  <div className='flex flex-wrap gap-3'>
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} target='_blank' rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#374151] hover:border-[#392C7D] hover:text-[#392C7D] transition-all'
                      >
                        <LinkIcon className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} target='_blank' rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#374151] hover:border-[#392C7D] hover:text-[#392C7D] transition-all'
                      >
                        <LinkIcon className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {profile.websiteUrl && (
                      <a href={profile.websiteUrl} target='_blank' rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#374151] hover:border-[#392C7D] hover:text-[#392C7D] transition-all'
                      >
                        <Globe className='w-4 h-4' />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                <h2 className='text-[16px] font-bold text-[#111827] flex items-center gap-2'>
                  <GraduationCap className='w-5 h-5 text-[#392C7D]' />
                  Education
                </h2>
              </div>
              <div className='px-6 py-2'>
                {profile.educationEntries.map((entry) => (
                  <EducationRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                <h2 className='text-[16px] font-bold text-[#111827] flex items-center gap-2'>
                  <Briefcase className='w-5 h-5 text-[#FF4667]' />
                  Experience
                </h2>
              </div>
              <div className='px-6 py-2'>
                {profile.experienceEntries.map((entry) => (
                  <ExperienceRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>

          </div>
        </div>

        <FigmaFooter />
      </div>
    </div>
  );
};

export default TeacherProfilePage;
