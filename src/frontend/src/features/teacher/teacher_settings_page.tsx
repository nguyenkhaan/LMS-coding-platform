import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { FigmaHeader } from '../courses/components/figma_header';
import { FigmaFooter } from '../courses/components/figma_footer';
import { TeacherSidebar } from './components/teacher_sidebar';
import { toast } from 'sonner';
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Globe,
  Save,
  XCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface TeacherProfile {
  avatarUrl: string;
  headline: string;
  expertiseTags: string[];
  yearsOfExperience: number;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  email: string;
  phone: string;
}

const DEFAULT_PROFILE: TeacherProfile = {
  avatarUrl: 'https://placehold.co/96x96',
  headline: 'Senior Software Engineer & Coding Instructor',
  expertiseTags: ['Python', 'React', 'TypeScript', 'Algorithms', 'System Design'],
  yearsOfExperience: 8,
  githubUrl: 'https://github.com/edythe-andrew',
  linkedinUrl: 'https://linkedin.com/in/edythe-andrew',
  websiteUrl: 'https://edytheandrew.dev',
  email: 'teacher@example.com',
  phone: '+1 123 456 7890',
};

export const TeacherSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const displayName = user?.fullName || 'Teacher Account';

  const [profile, setProfile] = useState<TeacherProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('teacher_profile_settings');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse teacher profile', e);
      }
    }
  }, []);

  const handleChange = (field: keyof TeacherProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddExpertise = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && expertiseInput.trim()) {
      e.preventDefault();
      const tag = expertiseInput.trim();
      if (!profile.expertiseTags.includes(tag)) {
        setProfile(prev => ({
          ...prev,
          expertiseTags: [...prev.expertiseTags, tag]
        }));
      }
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (tagToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      expertiseTags: prev.expertiseTags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('teacher_profile_settings', JSON.stringify(profile));
      setLoading(false);
      toast.success('Teacher settings updated successfully!');
    }, 800);
  };

  const handleCancel = () => {
    const stored = localStorage.getItem('teacher_profile_settings');
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      setProfile(DEFAULT_PROFILE);
    }
    toast.info('Changes discarded');
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm text-[#111827] border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] focus:ring-1 focus:ring-[#392C7D]/20 transition-all bg-white font-medium';

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      {/* 1. HEADER */}
      <FigmaHeader />

      {/* 2. PAGE TITLE BANNER */}
      <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1 shrink-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-extrabold">Teacher Settings</h1>
        <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Settings</p>
      </div>

      {/* 3. PROFILE HERO BANNER */}
      <div className="w-full max-w-[1340px] mx-auto px-4 pt-8">
        <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-white shadow-sm">
          <div className="flex items-center gap-6 relative z-10">
            <img
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white"
              src={profile.avatarUrl}
              alt={displayName}
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
              <span className="text-neutral-200 text-sm font-medium">Instructor Studio</span>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="px-5 py-2.5 bg-[#FF4667] text-white text-sm font-semibold rounded-full hover:bg-[#e03d5b] transition-all cursor-pointer shadow-sm"
            >
              Teacher Dashboard
            </button>
          </div>
          <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
        </div>
      </div>

      {/* 4. MAIN WORKSPACE CONTENT */}
      <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start flex-1">
        {/* Left sidebar navigation */}
        <TeacherSidebar activePath="/teacher/settings" />

        {/* Right workspace details */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="border-b border-gray-150 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#392C7D]" />
              <h3 className="text-base font-bold text-[#111827]">Edit Teacher Profile Details</h3>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Primary Details Section */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-[#392C7D] uppercase tracking-wider">Professional Info</h4>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#374151]">Headline / Short Bio</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Email (Public Address)</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Phone Contact</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Years of Teaching Experience</label>
                  <input
                    type="number"
                    value={profile.yearsOfExperience}
                    onChange={(e) => handleChange('yearsOfExperience', Number(e.target.value))}
                    className={inputClass}
                    min={0}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Expertise Tags (Press Enter to add)</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Docker, Vue, Java"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyDown={handleAddExpertise}
                      className={inputClass}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {profile.expertiseTags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[#FF4667] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          onClick={() => handleRemoveExpertise(tag)}
                        >
                          {tag}
                          <span className="font-normal text-[10px] text-neutral-400 hover:text-rose-600">&times;</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Links Section */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-[#392C7D] uppercase tracking-wider">Optional Social Links</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={profile.githubUrl}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    className={inputClass}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={profile.linkedinUrl}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    className={inputClass}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#374151]">Personal Website</label>
                  <input
                    type="url"
                    value={profile.websiteUrl}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Form actions */}
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
                className="px-6 py-2.5 bg-[#392C7D] text-white rounded-xl text-sm font-semibold hover:bg-[#392C7D]/95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* 5. FOOTER */}
      <FigmaFooter />
    </div>
  );
};

export default TeacherSettingsPage;
