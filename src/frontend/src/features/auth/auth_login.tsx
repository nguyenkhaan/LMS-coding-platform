import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { Role } from '@/types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  // If RoleGuard redirected here with a destination, respect it after login
  const intendedDestination = (location.state as { from?: { pathname?: string } })?.from?.pathname || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation
  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate API response delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const MOCK_ACCOUNTS = {
        'student@gmail.com': {
          password: 'student123',
          roles: ['STUDENT'] as Role[],
          fullName: 'Student Learner',
          dashboard: '/student/dashboard',
          id: 3,
          teacherProfile: undefined,
        },
        'teacher@gmail.com': {
          password: 'teacher123',
          roles: ['STUDENT', 'TEACHER'] as Role[],
          fullName: 'Instructor Minh',
          dashboard: '/teacher/dashboard',
          id: 2,
          teacherProfile: { verified: true, status: 'APPROVED' as const },
        },
        'admin@gmail.com': {
          password: 'admin123',
          roles: ['ADMIN'] as Role[],
          fullName: 'System Administrator',
          dashboard: '/admin/dashboard',
          id: 1,
          teacherProfile: undefined,
        }
      };

      const normalizedEmail = email.trim().toLowerCase();
      const mockAccount = MOCK_ACCOUNTS[normalizedEmail as keyof typeof MOCK_ACCOUNTS];

      if (!mockAccount || mockAccount.password !== password) {
        throw new Error('Invalid email or password.');
      }

      // Update Auth Store
      const authenticatedUser = {
        id: mockAccount.id,
        email: normalizedEmail,
        fullName: mockAccount.fullName,
        roles: mockAccount.roles,
        accountStatus: 'ACTIVE' as const,
        teacherProfile: mockAccount.teacherProfile,
      };
      setAuth(authenticatedUser, 'mock-jwt-access-token', 'mock-jwt-refresh-token');

      toast.success('Successfully signed in!');

      // Determine redirect destination from user roles, honouring any intended destination
      let defaultRedirect = mockAccount.dashboard;
      if (defaultRedirect === '/admin/dashboard') {
        defaultRedirect = '/admin/verifications';
      }
      navigate(intendedDestination || defaultRedirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during sign in. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock social login handlers
  const handleSocialLogin = (platform: string) => {
    toast.info(`Signing in with ${platform} (Mocked)...`);
    setIsLoading(true);
    setTimeout(() => {
      setAuth(
        {
          id: 4,
          email: `social.user@${platform.toLowerCase()}.com`,
          fullName: `Social ${platform} Learner`,
          roles: ['STUDENT'],
          accountStatus: 'ACTIVE',
        },
        'mock-jwt-access-token'
      );
      toast.success(`Successfully signed in with ${platform}!`);
      navigate('/student/dashboard');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Sign into Your Account
        </h1>
        <p className="text-sm text-neutral-500">
          Welcome back to SkillBoost. Sign in to continue learning.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-600">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-neutral-700">
            Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              id="email"
              type="text"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-semibold text-neutral-700">
              Password <span className="text-rose-500">*</span>
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-10 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 disabled:opacity-50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 font-medium text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="rounded border-neutral-300 text-indigo-900 focus:ring-indigo-950"
            />
            <span>Remember Me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-rose-500 hover:underline font-semibold transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-full text-sm font-bold shadow-sm shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Social Login Separator */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-400 font-medium">Or continue with</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.3-.9 2.5l3.22 2.5c1.88-1.73 2.97-4.3 2.97-7.3z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-3.22-2.5c-.9.6-2.05.95-3.48.95-2.68 0-4.95-1.8-5.75-4.22l-3.32 2.57C6.01 21.6 8.79 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M6.25 15.33c-.2-.6-.3-1.25-.3-1.93s.1-1.33.3-1.93l-3.32-2.57C2.1 10.45 1.5 12.16 1.5 14s.6 3.55 1.43 5.07l3.32-2.74z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.2 15.24 0 12 0 8.79 0 6.01 2.4 4.13 6.07l3.32 2.57c.8-2.42 3.07-4.22 5.75-4.22z"
            />
          </svg>
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('Facebook')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>
      </div>

      <div className="text-center text-xs text-neutral-500 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="text-rose-500 hover:underline font-bold">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;