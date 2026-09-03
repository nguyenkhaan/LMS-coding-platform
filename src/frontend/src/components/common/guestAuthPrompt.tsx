import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, LucideIcon } from 'lucide-react';

interface GuestAuthPromptProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  redirectPath?: string;
  loginButtonText?: string;
  registerButtonText?: string;
}

export const GuestAuthPrompt: React.FC<GuestAuthPromptProps> = ({
  icon: Icon = Lock,
  title,
  description,
  redirectPath,
  loginButtonText = 'Log In',
  registerButtonText = 'Create Account',
}) => {
  return (
    <div className="w-full flex justify-center items-center py-6 sm:py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-sm p-10 sm:p-14 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 flex items-center justify-center shadow-2xs">
          <Icon className="w-8 h-8 text-indigo-900" />
        </div>

        <div className="max-w-md flex flex-col gap-2">
          <h2 className="text-zinc-900 text-2xl font-extrabold tracking-tight">
            {title}
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            to="/login"
            state={redirectPath ? { from: { pathname: redirectPath } } : undefined}
            className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>{loginButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-neutral-200 text-zinc-700 text-sm font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            {registerButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};