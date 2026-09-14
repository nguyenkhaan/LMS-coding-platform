import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useThemeStore } from '@/hooks/context/useThemeStore';
import { StudentSidebar } from '../components/studentSidebar.tsx';
import { StudentHeroCard } from '../components/studentHeroCard.tsx';
import { toast } from 'sonner';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Eye,
  Bell,
  ShieldCheck,
  Mail,
  Lock,
  Info,
  AlertCircle
} from 'lucide-react';
import { authApiServices, userApiServices } from '@/services/api/client';

interface StudentProfile {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  bio: string;
  gender: string;
  dob: string;
  age: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const DEFAULT_PROFILE: StudentProfile = {
  firstName: 'Ronald',
  lastName: 'Richard',
  address: '',
  phoneNumber: '90154-91036',
  bio: "Hello! I'm Ronald Richard. I'm passionate about developing innovative software solutions, analyzing classic literature. I aspire to become a software developer, work as an editor. In my free time, I enjoy coding, reading, hiking etc.",
  gender: 'Male',
  dob: '16 Jan 2000',
  age: '24',
  theme: 'light',
  emailNotifications: true,
  smsNotifications: false,
};

export const StudentSettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const currentTheme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const [profile, setProfile] = useState<StudentProfile>({
    ...DEFAULT_PROFILE,
    theme: currentTheme
  });
  const [loading, setLoading] = useState(false);

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailErrorMsg(null);
    setEmailSuccessMsg(null);

    if (!newEmail.trim()) {
      setEmailErrorMsg('New email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setEmailErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!currentPassword) {
      setEmailErrorMsg('Current password is required to verify your request.');
      return;
    }

    setChangingEmail(true);
    try {
      const res = await authApiServices.changeEmail(newEmail.trim(), currentPassword);
      setEmailSuccessMsg(res.message || 'Confirmation link sent to your new email address. Please check your inbox.');
      toast.success('Email change request sent! Please check your new email inbox to confirm.');
      setNewEmail('');
      setCurrentPassword('');
    } catch (err: unknown) {
      let msg = 'Failed to request email change. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const status = (err as { response?: { status?: number } }).response?.status;
        const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
        if (status === 401) {
          msg = 'Your session has expired. Please sign in again.';
        } else if (status === 409) {
          msg = 'This email is already in use.';
        } else if (typeof detail === 'string') {
          msg = detail;
        }
      }
      setEmailErrorMsg(msg);
      toast.error(msg);
    } finally {
      setChangingEmail(false);
    }
  };

  // Load from backend & localStorage on mount
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const studentData = await userApiServices.getStudentProfile();
        if (isMounted && studentData) {
          const names = (studentData.full_name || '').split(' ');
          const firstName = names[0] || '';
          const lastName = names.slice(1).join(' ') || '';
          setProfile(prev => ({
            ...prev,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            address: studentData.address || prev.address || '',
            bio: studentData.bio || prev.bio || '',
            theme: currentTheme
          }));
        }
      } catch {
        const stored = localStorage.getItem('student_profile_settings');
        if (stored && isMounted) {
          try {
            const parsed = JSON.parse(stored);
            setProfile({ ...parsed, theme: currentTheme });
          } catch (e) {
            console.error('Failed to parse student profile settings', e);
          }
        }
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [currentTheme]);

  const handleChange = (field: keyof StudentProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    handleChange('theme', newTheme);
    setTheme(newTheme);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();

      // 1. Update personal info (full_name, address)
      await userApiServices.updatePersonalInformation({
        full_name: fullName,
        address: profile.address
      });

      // 2. Update student profile (bio)
      await userApiServices.updateStudentProfile({
        bio: profile.bio
      });

      // 3. Update global Zustand store user state if logged in
      if (user) {
        setUser({
          ...user,
          fullName: fullName
        });
      }

      localStorage.setItem('student_profile_settings', JSON.stringify(profile));
      setTheme(profile.theme);
      toast.success('Profile settings updated successfully!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to update profile settings.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const stored = localStorage.getItem('student_profile_settings');
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      setProfile(DEFAULT_PROFILE);
    }
    toast.info('Changes discarded');
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm text-text-primary border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white font-medium';

  return (
    <div className="w-full min-h-screen bg-slate-50 font-['Inter'] antialiased flex flex-col justify-start items-start">
      {/* 1. HERO TITLE BANNER */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center shrink-0">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Account Settings</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Settings</span>
        </div>
      </div>

      {/* 2. PROFILE HERO CARD */}
      <StudentHeroCard displayName={user?.fullName || (profile.firstName + ' ' + profile.lastName)} />

      {/* 3. MAIN WORKSPACE */}
      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row justify-start items-start gap-8 flex-1 w-full">
        {/* Left Menu Sidebar */}
        <StudentSidebar activePath="/student/settings" />

        {/* Right workspace details */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="border-b border-gray-150 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">Edit Profile Settings</h3>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Profile fields */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Personal Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">Phone Contact</label>
                  <input
                    type="text"
                    value={profile.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">Date of Birth</label>
                  <input
                    type="text"
                    value={profile.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">Age</label>
                  <input
                    type="text"
                    value={profile.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary">Bio / Summary</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Display preferences & Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme Preferences */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Display Preferences
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={profile.theme === 'light'}
                      onChange={() => handleThemeChange('light')}
                      className="accent-primary"
                    />
                    Light Theme
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={profile.theme === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                      className="accent-primary"
                    />
                    Dark Theme
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h4>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      className="rounded-sm accent-primary"
                    />
                    Receive email progress reports
                  </label>
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.smsNotifications}
                      onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                      className="rounded-sm accent-primary"
                    />
                    Receive SMS alerts for deadlines
                  </label>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Account Security - Change Email */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Account Security — Change Email
              </h4>

              <p className="text-xs text-text-secondary">
                Current Account Email:{' '}
                <strong className="text-text-primary font-semibold">
                  {user?.email || profile.firstName.toLowerCase() + '@example.com'}
                </strong>
              </p>

              {emailSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-semibold">{emailSuccessMsg}</p>
                    <p className="mt-1 text-emerald-600">
                      Your current email address will remain active until you click the confirmation link sent to your new email.
                    </p>
                  </div>
                </div>
              )}

              {emailErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{emailErrorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">
                    New Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      placeholder="new.email@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      disabled={changingEmail}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={changingEmail}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEmailChangeSubmit}
                  disabled={changingEmail}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {changingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Confirmation...</span>
                    </>
                  ) : (
                    <span>Request Email Change</span>
                  )}
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-gray-250 text-sm font-semibold text-text-secondary hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
