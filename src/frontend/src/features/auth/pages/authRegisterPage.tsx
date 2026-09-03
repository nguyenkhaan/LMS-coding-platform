import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation
  const validateForm = () => {
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return false;
    }
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
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
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

      toast.success('Mã OTP xác minh tài khoản đã được gửi đến mail. Vui lòng kiểm tra hòm thư của bạn.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-sm text-neutral-500">
          Sign up to begin your learning journey on SkillBoost.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-600">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-xs font-semibold text-neutral-700">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              id="fullName"
              type="text"
              placeholder="Ronald Richard"
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* Email */}
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
              maxLength={100}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-neutral-700">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              maxLength={128}
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-neutral-700">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              maxLength={128}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-10 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-full text-sm font-bold shadow-sm shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-500 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-rose-500 hover:underline font-bold">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
