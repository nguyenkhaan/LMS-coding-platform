import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { Pencil, GraduationCap, Briefcase, Globe, Link as LinkIcon, Mail, Phone, Tag, X, Check } from 'lucide-react';

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
// Profile field row — label + value, with optional edit affordance
// ---------------------------------------------------------------------------
interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <span className='text-[12px] font-semibold text-neutral-500 uppercase tracking-wide'>{label}</span>
    <span className='text-[14px] text-zinc-900 font-medium break-words'>{value || '—'}</span>
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
      <GraduationCap className='w-4 h-4 text-primary' />
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-[14px] font-semibold text-zinc-900'>{entry.degree}</p>
      <p className='text-[13px] text-zinc-700'>{entry.institution}</p>
      <p className='text-[12px] text-neutral-500 mt-0.5'>{entry.year}</p>
    </div>
  </div>
);

interface ExperienceRowProps {
  entry: ExperienceEntry;
}

const ExperienceRow: React.FC<ExperienceRowProps> = ({ entry }) => (
  <div className='flex items-start gap-3 py-3 border-b border-gray-100 last:border-0'>
    <div className='w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0'>
      <Briefcase className='w-4 h-4 text-accent' />
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-[14px] font-semibold text-zinc-900'>{entry.title}</p>
      <p className='text-[13px] text-zinc-700'>{entry.company} · {entry.duration}</p>
      <p className='text-[13px] text-neutral-500 mt-1'>{entry.description}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// TC02 — Teacher Profile Page
// ---------------------------------------------------------------------------
export const TeacherProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile>(MOCK_PROFILE);
  const [draft, setDraft] = useState<TeacherProfile>(MOCK_PROFILE);

  const displayName = user?.fullName || 'Edythe Andrew';

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

  const inputClass = 'w-full px-3 py-2 text-[14px] text-zinc-900 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white';

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">

        {/* Page title banner */}
        <div className='w-full bg-gradient-to-r from-primary to-purple-600 py-8 flex flex-col items-center justify-center gap-1'>
          <h1 className='text-2xl lg:text-3xl font-bold text-white tracking-tight'>My Profile</h1>
          <p className='text-[13px] font-medium text-white/70'>Dashboard &rsaquo; My Profile</p>
        </div>

        {/* Profile hero banner */}
        <div className='w-full max-w-[1340px] mx-auto px-4 pt-8'>
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
              <button
                onClick={() => navigate('/dashboard')}
                className='px-5 py-2.5 bg-white text-indigo-900 text-sm font-semibold rounded-full hover:bg-slate-50 transition-all cursor-pointer shadow-sm'
              >
                Switch to Student
              </button>
            </div>
            <div className='absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none' />
            <div className='absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none' />
          </div>
        </div>

        {/* Body */}
        <div className='w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start'>

          {/* Sidebar */}
          {/* Sidebar */}
          <TeacherSidebar activePath="/teacher/profile" />

          {/* Main content */}
          <div className='flex-1 w-full flex flex-col gap-6'>

            {/* Profile detail card */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                <h2 className='text-[20px] font-bold text-primary'>My Profile</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditToggle}
                    aria-label='Edit profile'
                    className='flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[14px] font-semibold text-zinc-700 hover:bg-slate-50 hover:text-primary hover:border-indigo-200 transition-all cursor-pointer'
                  >
                    <Pencil className='w-3.5 h-3.5' />
                    Edit
                  </button>
                ) : (
                  <div className='flex gap-2'>
                    <button
                      onClick={handleCancel}
                      aria-label='Cancel editing'
                      className='flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[14px] font-semibold text-zinc-700 hover:bg-slate-50 transition-all cursor-pointer'
                    >
                      <X className='w-3.5 h-3.5' />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      aria-label='Save profile'
                      className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-[14px] font-semibold hover:bg-primary-hover transition-all cursor-pointer'
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
                      <input maxLength={100}
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
                    <Mail className='w-4 h-4 text-neutral-500 shrink-0' />
                    <ProfileField label='Email' value={isEditing ? '' : profile.email} />
                  </div>
                  {isEditing && (
                    <input maxLength={100}
                      type='email'
                      value={draft.email}
                      onChange={(e) => handleDraftChange('email', e.target.value)}
                      placeholder='contact@example.com'
                      className={inputClass}
                      aria-label='Email'
                    />
                  )}
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-neutral-500 shrink-0' />
                    <ProfileField label='Phone' value={isEditing ? '' : profile.phone} />
                  </div>
                  {isEditing && (
                    <input maxLength={100}
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
                  <span className='text-[12px] font-semibold text-neutral-500 uppercase tracking-wide'>Bio</span>
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
                    <p className='text-[14px] text-zinc-700 leading-relaxed'>
                      {profile.headline}
                    </p>
                  )}
                </div>

                {/* Expertise tags */}
                <div className='flex flex-col gap-2'>
                  <span className='text-[12px] font-semibold text-neutral-500 uppercase tracking-wide flex items-center gap-1.5'>
                    <Tag className='w-3 h-3' /> Expertise
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {profile.expertiseTags.map((tag) => (
                      <span
                        key={tag}
                        className='px-3 py-1 bg-indigo-50 text-primary text-[12px] font-semibold rounded-full border border-indigo-100'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External links */}
                <div className='flex flex-col gap-3'>
                  <span className='text-[12px] font-semibold text-neutral-500 uppercase tracking-wide'>Links</span>
                  <div className='flex flex-wrap gap-3'>
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} target='_blank' rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-zinc-700 hover:border-primary hover:text-primary transition-all'
                      >
                        <LinkIcon className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} target='_blank' rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-zinc-700 hover:border-primary hover:text-primary transition-all'
                      >
                        <LinkIcon className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {profile.websiteUrl && (
                      <a href={profile.websiteUrl} target='_blank' rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-zinc-700 hover:border-primary hover:text-primary transition-all'
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
                <h2 className='text-[16px] font-bold text-zinc-900 flex items-center gap-2'>
                  <GraduationCap className='w-5 h-5 text-primary' />
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
                <h2 className='text-[16px] font-bold text-zinc-900 flex items-center gap-2'>
                  <Briefcase className='w-5 h-5 text-accent' />
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

        </div>
  );
};

export default TeacherProfilePage;
