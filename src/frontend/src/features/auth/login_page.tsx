import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Code2, ShieldCheck, GraduationCap, User, ArrowRight, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('admin@skillboost.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('ADMIN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const mockUser = {
      id: selectedRole === 'ADMIN' ? 'usr-admin-01' : selectedRole === 'TEACHER' ? 'usr-teach-01' : 'usr-stud-01',
      email: email,
      fullName: selectedRole === 'ADMIN' ? 'Admin Moderator' : selectedRole === 'TEACHER' ? 'Alex Teacher' : 'Minh Tran',
      roles: [selectedRole],
      teacherProfile: selectedRole === 'TEACHER' ? { status: 'APPROVED' as const, verified: true } : undefined
    };

    setAuth(mockUser, 'mock-jwt-token-12345');
    toast.success(`Welcome ${mockUser.fullName}! Signed in as ${selectedRole}.`);

    // Direct redirection based on Role
    if (selectedRole === 'ADMIN') {
      navigate('/admin/verifications');
    } else if (selectedRole === 'TEACHER') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-neutral-200 shadow-xl flex flex-col gap-6 my-10 font-['Inter']">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
          <Code2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Sign In to SkillBoost</h2>
        <p className="text-xs text-neutral-500">Choose a role demo or enter your platform credentials</p>
      </div>

      {/* Role Switcher Demo Pills */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => { setSelectedRole('ADMIN'); setEmail('admin@skillboost.com'); }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'ADMIN' ? 'bg-indigo-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('TEACHER'); setEmail('teacher@skillboost.com'); }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'TEACHER' ? 'bg-indigo-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Teacher
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('STUDENT'); setEmail('student@skillboost.com'); }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'STUDENT' ? 'bg-indigo-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Student
        </button>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Sign In as {selectedRole}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
