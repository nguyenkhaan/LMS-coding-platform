import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, GraduationCap, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

interface StudentHeroCardProps {
  /** User's display name override (falls back to auth store user name) */
  displayName?: string;
}

/**
 * StudentHeroCard — shared profile hero banner used on every Student page.
 *
 * Renders:
 *  - User avatar with online indicator
 *  - Full name + verified badge
 *  - "Become a Teacher" CTA (hidden for users who are already teachers)
 *  - "Teacher Dashboard" debug shortcut (always visible for dev convenience)
 */
export const StudentHeroCard: React.FC<StudentHeroCardProps> = ({ displayName }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const name = displayName || user?.fullName || 'Ronald Richard';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isTeacher = user?.roles.includes('TEACHER');

  return (
    <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 pt-8">
      <div className="w-full rounded-2xl bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

        {/* Decorative ambient circles */}
        <div className="absolute -right-20 -top-40 w-96 h-96 rounded-full border-[60px] border-white/5 pointer-events-none" />
        <div className="absolute right-60 -bottom-20 w-80 h-80 rounded-full border-[40px] border-white/5 pointer-events-none" />

        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-950 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold font-mono select-none">
              {initials}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                {name}
              </h2>
              <CheckCircle2 className="w-5 h-5 text-sky-300 shrink-0" />
            </div>
            <span className="text-neutral-200 text-sm font-medium">Student</span>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-3 relative z-10 self-stretch sm:self-auto justify-end flex-wrap">

          {/* Become a Teacher — hidden once user is already a teacher */}
          {!isTeacher && (
            <button
              type="button"
              onClick={() => navigate('/become-teacher')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-zinc-900 rounded-[40px] text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Become a Teacher</span>
            </button>
          )}

          {/* Teacher Dashboard — temporary dev shortcut, always visible */}
          <button
            type="button"
            onClick={() => navigate('/teacher/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-[40px] text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-rose-500/20"
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Teacher Dashboard</span>
          </button>

        </div>
      </div>
    </div>
  );
};
