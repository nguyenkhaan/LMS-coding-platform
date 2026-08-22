import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { StudentSidebar } from '../components/student_sidebar';
import { toast } from 'sonner';
import { 
  Settings, 
  User, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  Eye,
  Bell
} from 'lucide-react';

interface StudentProfile {
  firstName: string;
  lastName: string;
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
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('student_profile_settings');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse student profile settings', e);
      }
    }
  }, []);

  const handleChange = (field: keyof StudentProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('student_profile_settings', JSON.stringify(profile));
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 850);
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

  const inputClass = 'w-full px-4 py-2.5 text-sm text-[#111827] border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] focus:ring-1 focus:ring-[#392C7D]/20 transition-all bg-white font-medium';

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
      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 pt-8">
        <div className="w-full rounded-2xl bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="absolute -right-20 -top-40 w-96 h-96 rounded-full border-[60px] border-white/5 pointer-events-none" />
          <div className="absolute right-60 -bottom-20 w-80 h-80 rounded-full border-[40px] border-white/5 pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-950 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold font-mono">
                {profile.firstName.substring(0, 1)}{profile.lastName.substring(0, 1)}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                  {user?.fullName || (profile.firstName + ' ' + profile.lastName)}
                </h2>
                <CheckCircle2 className="w-5 h-5 text-sky-300" />
              </div>
              <span className="text-neutral-200 text-sm font-medium">Student</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 relative z-10 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => navigate('/become-teacher')}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-zinc-900 rounded-[40px] text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Become a Teacher
            </button>
            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-[40px] text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-rose-500/20"
            >
              Teacher Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row justify-start items-start gap-8 flex-1 w-full">
        {/* Left Menu Sidebar */}
        <StudentSidebar activePath="/student/settings" />

        {/* Right workspace details */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="border-b border-gray-150 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#392C7D]" />
              <h3 className="text-base font-bold text-[#111827]">Edit Profile Settings</h3>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Profile fields */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-[#392C7D] uppercase tracking-wider">Personal Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Last Name</label>
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
                  <label className="text-xs font-bold text-[#374151]">Phone Contact</label>
                  <input
                    type="text"
                    value={profile.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Date of Birth</label>
                  <input
                    type="text"
                    value={profile.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Age</label>
                  <input
                    type="text"
                    value={profile.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#374151]">Bio / Summary</label>
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
                <h4 className="text-sm font-bold text-[#392C7D] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Display Preferences
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#374151] cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={profile.theme === 'light'}
                      onChange={() => handleChange('theme', 'light')}
                      className="accent-[#392C7D]"
                    />
                    Light Theme
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#374151] cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={profile.theme === 'dark'}
                      onChange={() => handleChange('theme', 'dark')}
                      className="accent-[#392C7D]"
                    />
                    Dark Theme
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[#392C7D] uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h4>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-[#374151] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      className="rounded-sm accent-[#392C7D]"
                    />
                    Receive email progress reports
                  </label>
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-[#374151] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.smsNotifications}
                      onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                      className="rounded-sm accent-[#392C7D]"
                    />
                    Receive SMS alerts for deadlines
                  </label>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-gray-250 text-sm font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#392C7D] text-white rounded-xl text-sm font-semibold hover:bg-[#392C7D]/95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
