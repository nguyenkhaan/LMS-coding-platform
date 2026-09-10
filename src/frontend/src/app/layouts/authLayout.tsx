import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout min-h-screen w-full flex bg-slate-50 font-['Inter'] antialiased">
      {/* LEFT COLUMN: Figma Visual Design Illustration (Shared on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-rose-50 via-purple-50 to-indigo-50 border-r border-neutral-200/60 p-12 flex-col justify-between items-center relative overflow-hidden min-h-screen select-none">
        
        {/* Top: SkillBoost logo */}
        <div className="self-start flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-indigo-950 tracking-tight">
            SkillBoost
          </span>
        </div>

        {/* Center: Figma Illustration Artboard (Cleaned & Responsive) */}
        <div className="relative w-[480px] h-[360px] flex items-center justify-center">
          {/* Decorative shapes representing a desk/monitor/learner workspace */}
          <div className="absolute w-[240px] h-[180px] bg-indigo-900/10 rounded-3xl blur-2xl -top-8 -left-8" />
          <div className="absolute w-[180px] h-[180px] bg-rose-500/10 rounded-full blur-2xl -bottom-8 -right-8" />
          
          <div className="w-full h-full bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 flex flex-col gap-4 relative z-10">
            {/* Mock Editor Window */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[11px] text-neutral-400 font-mono ml-2">learn_two_pointers.py</span>
            </div>
            <pre className="font-mono text-xs text-neutral-700 leading-relaxed overflow-hidden">
              <code>{`def solve(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr = arr[left] + arr[right]
        if curr == target:
            return left, right
        elif curr < target:
            left += 1
        else:
            right -= 1
    return -1, -1`}</code>
            </pre>
            <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-neutral-500">
              <span>SkillBoost Online Judge</span>
              <span className="text-green-600 font-bold">100% Passed</span>
            </div>
          </div>
        </div>

        {/* Bottom: Welcome Text */}
        <div className="max-w-[480px] text-center flex flex-col gap-3 relative z-10">
          <h2 className="text-zinc-900 text-3xl font-extrabold leading-tight">
            Welcome to <span className="text-indigo-900">SkillBoost</span> Courses.
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.
          </p>
          <div className="flex justify-center gap-1.5 pt-2">
            <div className="w-10 h-2 bg-indigo-900 rounded-full" />
            <div className="w-2 h-2 bg-neutral-200 rounded-full" />
            <div className="w-2 h-2 bg-neutral-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Auth Forms Router Outlet */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white w-full lg:w-1/2 min-h-screen">
        <div className="w-full max-w-[400px] flex flex-col gap-8">
          {/* Header Link back */}
          <div className="flex justify-between items-center">
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[15px] text-indigo-950 tracking-tight">
                SkillBoost
              </span>
            </div>
            <Link to="/" className="text-indigo-900 hover:underline text-sm font-semibold ml-auto transition-colors">
              Back to Catalog
            </Link>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
