import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/modal';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Info,
  Camera,
  GraduationCap,
  Lock,
  Edit3,
  XCircle,
  RefreshCw,
  Trash2,
  Plus,
  X,
  Globe,
  Code2,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { Role } from '@/features/auth/model/auth';

export type TeacherApplicationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface UploadedFileState {
  file: File | null;
  previewUrl: string;
  name: string;
  size: string;
}

export function BecomeTeacherPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  // Confirmation modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmingResubmit, setIsConfirmingResubmit] = useState(false);

  // Track all created object URLs to clean up on unmount or file replacement
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const createTrackedObjectURL = (file: File) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    return url;
  };

  const revokeTrackedObjectURL = (url: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current.delete(url);
    }
  };

  React.useEffect(() => {
    const activeUrls = objectUrlsRef.current;
    return () => {
      // Revoke all created object URLs when component unmounts
      activeUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      activeUrls.clear();
    };
  }, []);

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    handleStateChange('PENDING');
    if (isConfirmingResubmit) {
      toast.success('Updated application resubmitted for verification!');
    } else {
      toast.success('Application submitted successfully for Admin Review!');
    }
  };

  // State Machine Status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const initialStatus: TeacherApplicationStatus = user?.teacherProfile?.status || 
    (user?.roles.includes('TEACHER') ? 'APPROVED' : 'DRAFT');
  const [status, setStatus] = useState<TeacherApplicationStatus>(initialStatus);
  
  // Admin review note (visible in REJECTED state)
  const [reviewNote] = useState<string>(
    'Ảnh chụp selfie cầm CCCD bị mờ, không nhìn rõ số định danh cá nhân. Vui lòng chụp lại ảnh rõ nét trong điều kiện đủ sáng.'
  );

  const handleStateChange = (newStatus: TeacherApplicationStatus) => {
    setStatus(newStatus);
    if (user) {
      const updatedRoles: Role[] = newStatus === 'APPROVED' 
        ? (user.roles.includes('TEACHER') ? user.roles : [...user.roles, 'TEACHER' as Role])
        : user.roles.filter(r => r !== 'TEACHER');
      
      setUser({
        ...user,
        roles: updatedRoles,
        teacherProfile: {
          verified: newStatus === 'APPROVED',
          status: newStatus as 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
        }
      });
    }
  };

  // Core Form State (100% matched with teacher_registered table)
  const [formData, setFormData] = useState({
    displayName: user?.fullName || 'Minh Trần',
    headline: 'Senior Software Engineer & Distributed Systems Instructor',
    legalFullName: user?.fullName || 'Trần Quang Minh',
    dateOfBirth: '1998-05-15',
    identityNumber: '001200014589',
    bio: 'Hơn 6 năm kinh nghiệm phát triển hệ thống backend phân tán và microservices với Go, Java và Python. Đam mê chia sẻ kiến thức thuật toán và kiến trúc hệ thống.',
    expertiseTags: ['Python', 'Golang', 'Algorithms', 'System Design', 'React'],
    newTagInput: '',
    yearsOfExperience: '6',
    educationEntries: 'Đại học Bách Khoa Hà Nội - Cử nhân Khoa học Máy tính (2016 - 2020)',
    teachingExperience: '2 năm trợ giảng và giảng dạy các khóa học cấu trúc dữ liệu cho hơn 800 học viên.',
    motivation: 'Mong muốn xây dựng các khóa học chất lượng cao, thực chiến về thuật toán và kiến trúc phần mềm cho cộng đồng lập trình viên Việt Nam trên nền tảng CodeDreams.',
    githubUrl: 'https://github.com/minhtran-dev',
    linkedinUrl: 'https://linkedin.com/in/minhtran-engineer',
    websiteUrl: 'https://minhtran.tech',
    agreeTerms: true
  });

  // Real File Uploads State
  const [files, setFiles] = useState<{
    identityFront: UploadedFileState | null;
    identityBack: UploadedFileState | null;
    selfieWithId: UploadedFileState | null;
    educationEvidence: UploadedFileState | null;
    cv: UploadedFileState | null;
  }>({
    identityFront: {
      file: null,
      previewUrl: 'https://placehold.co/600x400/png?text=CCCD+Mat+Truoc',
      name: 'cccd_front_scan.jpg',
      size: '2.4 MB'
    },
    identityBack: {
      file: null,
      previewUrl: 'https://placehold.co/600x400/png?text=CCCD+Mat+Sau',
      name: 'cccd_back_scan.jpg',
      size: '2.1 MB'
    },
    selfieWithId: null,
    educationEvidence: null,
    cv: {
      file: null,
      previewUrl: '',
      name: 'CV_TranQuangMinh_Senior_Backend.pdf',
      size: '1.2 MB'
    }
  });

  // Hidden File Input Refs
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const idSelfieRef = useRef<HTMLInputElement>(null);
  const eduDocRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  // Field change handler
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Expertise Tags handlers
  const handleAddTag = () => {
    if (formData.newTagInput.trim() && !formData.expertiseTags.includes(formData.newTagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        expertiseTags: [...prev.expertiseTags, prev.newTagInput.trim()],
        newTagInput: ''
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      expertiseTags: prev.expertiseTags.filter((t) => t !== tag)
    }));
  };

  // Real File Upload Handler
  const handleFileUpload = (
    key: keyof typeof files,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Check MIME type / file extension
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const hasValidMime = allowedMimes.includes(selectedFile.type);
    const hasValidExt = /\.(pdf|docx?|jpe?g|png|webp)$/i.test(selectedFile.name);

    if (!hasValidMime && !hasValidExt) {
      toast.error('Invalid file format. Allowed formats: PDF, DOC/DOCX, PNG, JPG, WEBP.');
      return;
    }

    // Check size <= 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const preview = createTrackedObjectURL(selectedFile);
    const sizeStr = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';

    setFiles((prev) => {
      const prevFile = prev[key];
      if (prevFile && prevFile.previewUrl) {
        revokeTrackedObjectURL(prevFile.previewUrl);
      }
      return {
        ...prev,
        [key]: {
          file: selectedFile,
          previewUrl: preview,
          name: selectedFile.name,
          size: sizeStr
        }
      };
    });

    toast.success(`Uploaded ${selectedFile.name}`);
  };

  const handleRemoveFile = (key: keyof typeof files, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) => {
      const prevFile = prev[key];
      if (prevFile && prevFile.previewUrl) {
        revokeTrackedObjectURL(prevFile.previewUrl);
      }
      return { ...prev, [key]: null };
    });
    toast.info('File removed.');
  };

  // Check Whitelist Field Editability:
  // - In DRAFT / REJECTED: All fields editable.
  // - In PENDING: All fields LOCKED (read-only).
  // - In APPROVED: Only Whitelist fields (display_name, headline, bio, expertiseTags, yearsOfExp, social links, teachingExp) are editable. Identity is LOCKED.
  const isFieldEditable = (isSensitiveIdentity: boolean = false) => {
    if (status === 'DRAFT' || status === 'REJECTED') return true;
    if (status === 'PENDING') return false;
    if (status === 'APPROVED') return !isSensitiveIdentity;
    return false;
  };

  // Validation Gate: Check if all non-optional fields are filled
  const isFormValid = () => {
    const {
      displayName,
      headline,
      legalFullName,
      dateOfBirth,
      identityNumber,
      bio,
      expertiseTags,
      yearsOfExperience,
      educationEntries,
      teachingExperience,
      motivation,
      agreeTerms
    } = formData;

    const hasRequiredText =
      Boolean(displayName.trim()) &&
      Boolean(headline.trim()) &&
      Boolean(legalFullName.trim()) &&
      Boolean(dateOfBirth.trim()) &&
      Boolean(identityNumber.trim()) &&
      Boolean(bio.trim()) &&
      expertiseTags.length > 0 &&
      Boolean(yearsOfExperience.trim()) &&
      Boolean(educationEntries.trim()) &&
      Boolean(teachingExperience.trim()) &&
      Boolean(motivation.trim()) &&
      agreeTerms === true;

    const hasRequiredFiles =
      Boolean(files.identityFront) &&
      Boolean(files.identityBack) &&
      Boolean(files.selfieWithId) &&
      Boolean(files.educationEvidence) &&
      Boolean(files.cv);

    return hasRequiredText && hasRequiredFiles;
  };

  const missingRequirements: string[] = [];
  if (!formData.displayName) missingRequirements.push('Display name');
  if (!formData.headline) missingRequirements.push('Headline');
  if (!formData.legalFullName) missingRequirements.push('Legal full name');
  if (!formData.dateOfBirth) missingRequirements.push('Date of birth');
  if (!formData.identityNumber) missingRequirements.push('Identity number (CCCD)');
  if (!formData.bio) missingRequirements.push('Bio');
  if (formData.expertiseTags.length === 0) missingRequirements.push('At least 1 expertise tag');
  if (!formData.yearsOfExperience) missingRequirements.push('Years of experience');
  if (!formData.educationEntries) missingRequirements.push('Education entries');
  if (!formData.teachingExperience) missingRequirements.push('Teaching experience');
  if (!formData.motivation) missingRequirements.push('Motivation');
  if (!files.identityFront) missingRequirements.push('ID Front Photo');
  if (!files.identityBack) missingRequirements.push('ID Back Photo');
  if (!files.selfieWithId) missingRequirements.push('Selfie holding ID');
  if (!files.educationEvidence) missingRequirements.push('Education Evidence Document');
  if (!files.cv) missingRequirements.push('CV / Resume');
  if (!formData.agreeTerms) missingRequirements.push('Accept Instructor Agreement Terms');

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please complete all required fields and documents before submitting.');
      return;
    }
    setIsConfirmingResubmit(false);
    setIsConfirmModalOpen(true);
  };

  const handleSaveDraft = () => {
    toast.success('Application draft saved locally.');
  };

  const handleResubmit = () => {
    if (!isFormValid()) {
      toast.error('Please resolve all missing/rejected items before resubmitting.');
      return;
    }
    setIsConfirmingResubmit(true);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 font-['Inter'] antialiased flex flex-col justify-start items-start">
      
      {/* 1. STATE PREVIEW & SWITCHER BAR (For paired testing of all 4 states) */}
      <div className="w-full bg-slate-900 text-white px-6 py-2.5 flex flex-wrap justify-between items-center text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">⚡ State Preview Switcher:</span>
          <span className="text-slate-400">Test different application lifecycle states:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'] as TeacherApplicationStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStateChange(s)}
              className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                status === s
                  ? s === 'APPROVED'
                    ? 'bg-emerald-500 text-white'
                    : s === 'REJECTED'
                    ? 'bg-rose-500 text-white'
                    : s === 'PENDING'
                    ? 'bg-amber-500 text-white'
                    : 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2. HERO TITLE BANNER (bg-gradient-to-r from-red-50 via-sky-50 to-blue-100) */}
      <div className="self-stretch px-6 lg:px-20 py-10 bg-gradient-to-r from-red-50 via-sky-50 to-blue-100 border-b border-slate-200 flex flex-col justify-center items-center gap-1.5 text-center">
        <h1 className="text-zinc-900 text-3xl lg:text-4xl font-extrabold tracking-tight">Become a Teacher</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600">
          <Link to="/dashboard" className="text-neutral-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <span className="text-neutral-400 font-normal">&gt;</span>
          <span className="text-zinc-900 font-semibold">Teacher Application</span>
        </div>
      </div>

      {/* 3. MAIN APPLICATION CONTENT (max-w-[1400px]) */}
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-8 flex flex-col gap-7">
        
        {/* STATUS BANNER BASED ON LIFECYCLE STATE */}
        
        {/* STATE: REJECTED BANNER */}
        {status === 'REJECTED' && (
          <div className="w-full p-6 bg-rose-50 border-2 border-rose-300 rounded-3xl flex flex-col sm:flex-row items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-rose-900 text-lg font-bold">Application Requires Changes (Rejected)</h3>
                <span className="px-3 py-1 bg-rose-200 text-rose-800 text-xs font-bold rounded-full">Action Required</span>
              </div>
              <p className="text-rose-700 text-sm font-medium">
                Admin Reviewer Note: <span className="font-normal italic text-rose-950">"{reviewNote}"</span>
              </p>
              <p className="text-rose-600 text-xs mt-1">
                You have been granted edit permissions. Please update the requested fields or re-upload documents, then click <strong>"Resubmit Application"</strong> below.
              </p>
            </div>
          </div>
        )}

        {/* STATE: PENDING BANNER */}
        {status === 'PENDING' && (
          <div className="w-full p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl flex flex-col sm:flex-row items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-amber-950 text-lg font-bold">Application Under Review (Pending)</h3>
                <span className="px-3 py-1 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">Locked</span>
              </div>
              <p className="text-amber-800 text-sm">
                Your application has been received and is currently being evaluated by our Compliance &amp; Verification Team.
              </p>
              <span className="text-amber-700 text-xs font-medium">
                🔒 All form fields and documents are locked during verification to ensure audit integrity. Typical review time is 24-48 hours.
              </span>
            </div>
          </div>
        )}

        {/* STATE: APPROVED BANNER */}
        {status === 'APPROVED' && (
          <div className="w-full p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-emerald-950 text-lg font-bold">🎉 Application Approved - Verified Instructor!</h3>
                <p className="text-emerald-800 text-sm">
                  Congratulations! Your teacher registration is fully verified. You can now publish courses and host mentor sessions.
                </p>
                <span className="text-emerald-700 text-xs">
                  ℹ️ Whitelist policy active: You may update public profile fields (Bio, Tags, Social Links). Legal identity records remain securely locked.
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Go to Teacher Dashboard</span>
            </button>
          </div>
        )}

        {/* STEPPER PROGRESS BAR */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3.5">
            <span className={`px-3.5 py-1.5 rounded-lg text-sm font-bold ${
              status === 'DRAFT'
                ? 'bg-indigo-100 text-indigo-900'
                : status === 'PENDING'
                ? 'bg-amber-100 text-amber-800'
                : status === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {status}
            </span>
            <span className="text-neutral-600 text-sm font-normal">
              {status === 'DRAFT'
                ? 'Not submitted yet - only you can see this.'
                : status === 'PENDING'
                ? 'Submitted on 3 Aug 2026 - Waiting for review.'
                : status === 'APPROVED'
                ? 'Approved on 4 Aug 2026 - Verified Instructor role active.'
                : 'Changes requested - Edit and resubmit.'}
            </span>
          </div>

          {/* Stepper Steps (1 Draft -> 2 Pending -> 3 Approved -> 4 Rejected) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold ${
              status === 'DRAFT' ? 'bg-indigo-900 text-white shadow-xs' : 'bg-slate-100 text-neutral-500'
            }`}>
              <span>1</span>
              <span>Draft</span>
            </div>
            <div className="w-8 sm:w-11 h-px bg-neutral-200" />

            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold ${
              status === 'PENDING' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-neutral-500'
            }`}>
              <span>2</span>
              <span>Pending</span>
            </div>
            <div className="w-8 sm:w-11 h-px bg-neutral-200" />

            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold ${
              status === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-neutral-500'
            }`}>
              <span>3</span>
              <span>Approved</span>
            </div>
            <div className="w-8 sm:w-11 h-px bg-neutral-200" />

            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold ${
              status === 'REJECTED' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-neutral-500'
            }`}>
              <span>4</span>
              <span>Rejected</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: PUBLIC INSTRUCTOR PROFILE (Whitelist Editable in Approved) */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold tracking-tight">Public Instructor Profile</h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">Information displayed to prospective students on course pages</p>
            </div>
            {status === 'APPROVED' && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editable (Whitelist)</span>
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Display Name + Headline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                  <span>Display name *</span>
                  {!isFieldEditable(false) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                </label>
                <input
                  type="text"
                  disabled={!isFieldEditable(false)}
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50"
                  placeholder="Minh Trần"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                  <span>Professional Headline *</span>
                  {!isFieldEditable(false) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                </label>
                <input
                  type="text"
                  disabled={!isFieldEditable(false)}
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50"
                  placeholder="e.g. Senior Software Engineer & Distributed Systems Instructor"
                />
              </div>
            </div>

            {/* Expertise Tags + Years of Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-800 text-sm font-semibold">Expertise Tags * (At least 1 tag)</label>
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-neutral-200 bg-slate-50/50 min-h-[48px] items-center">
                  {formData.expertiseTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-indigo-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      {tag}
                      {isFieldEditable(false) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-300 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {isFieldEditable(false) && (
                    <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                      <input
                        type="text"
                        value={formData.newTagInput}
                        onChange={(e) => handleInputChange('newTagInput', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag..."
                        className="text-xs bg-transparent border-none outline-none text-zinc-900 w-full"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="p-1 bg-indigo-100 text-indigo-900 rounded-md hover:bg-indigo-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                  <span>Years of Industry Experience *</span>
                  {!isFieldEditable(false) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                </label>
                <input
                  type="number"
                  disabled={!isFieldEditable(false)}
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                <span>Instructor Bio *</span>
                {!isFieldEditable(false) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </label>
              <textarea
                rows={3}
                disabled={!isFieldEditable(false)}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full p-3.5 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50 resize-none"
                placeholder="Tell students about your experience and teaching style."
              />
            </div>

            {/* Social Profile Links (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-600 text-xs font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-zinc-800" />
                  <span>GitHub URL (Optional)</span>
                </label>
                <input
                  type="url"
                  disabled={!isFieldEditable(false)}
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 disabled:bg-slate-100 text-zinc-900 text-xs bg-slate-50/50"
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-600 text-xs font-semibold flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>LinkedIn URL (Optional)</span>
                </label>
                <input
                  type="url"
                  disabled={!isFieldEditable(false)}
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 disabled:bg-slate-100 text-zinc-900 text-xs bg-slate-50/50"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-600 text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Portfolio Website (Optional)</span>
                </label>
                <input
                  type="url"
                  disabled={!isFieldEditable(false)}
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 disabled:bg-slate-100 text-zinc-900 text-xs bg-slate-50/50"
                  placeholder="https://portfolio.dev"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SENSITIVE PERSONAL & LEGAL IDENTITY (LOCKED in Approved) */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold tracking-tight">Legal Personal Information</h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">Used exclusively for identity compliance, tax reporting, and payout verification</p>
            </div>
            {status === 'APPROVED' && (
              <span className="px-3 py-1 bg-slate-100 text-neutral-600 text-xs font-semibold rounded-full border border-neutral-200 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Identity Locked</span>
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Legal Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                <span>Legal full name (As in CCCD/Passport) *</span>
                {!isFieldEditable(true) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </label>
              <input
                type="text"
                disabled={!isFieldEditable(true)}
                value={formData.legalFullName}
                onChange={(e) => handleInputChange('legalFullName', e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50"
                placeholder="Trần Quang Minh"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                <span>Date of birth *</span>
                {!isFieldEditable(true) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </label>
              <input
                type="date"
                disabled={!isFieldEditable(true)}
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50"
              />
            </div>

            {/* Identity Number */}
            <div className="flex flex-col gap-2">
              <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
                <span>Identity number (CCCD/Passport) *</span>
                {!isFieldEditable(true) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              </label>
              <input
                type="text"
                disabled={!isFieldEditable(true)}
                value={formData.identityNumber}
                onChange={(e) => handleInputChange('identityNumber', e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50 font-mono"
                placeholder="12-digit CCCD or Passport number"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: REAL IDENTITY DOCUMENT UPLOADS */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold tracking-tight">Identity Verification Documents</h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">Clear photos of your government-issued ID and selfie holding ID (JPG/PNG max 5MB)</p>
            </div>
            {!isFieldEditable(true) && (
              <span className="px-3 py-1 bg-slate-100 text-neutral-600 text-xs font-semibold rounded-full border border-neutral-200 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Files Locked</span>
              </span>
            )}
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={idFrontRef}
            onChange={(e) => handleFileUpload('identityFront', e)}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={!isFieldEditable(true)}
            className="hidden"
          />
          <input
            type="file"
            ref={idBackRef}
            onChange={(e) => handleFileUpload('identityBack', e)}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={!isFieldEditable(true)}
            className="hidden"
          />
          <input
            type="file"
            ref={idSelfieRef}
            onChange={(e) => handleFileUpload('selfieWithId', e)}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={!isFieldEditable(true)}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: ID Front */}
            <div
              role="button"
              tabIndex={isFieldEditable(true) ? 0 : -1}
              aria-label="Upload National ID Front"
              onClick={() => isFieldEditable(true) && idFrontRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isFieldEditable(true)) {
                  e.preventDefault();
                  idFrontRef.current?.click();
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-between text-center gap-3 transition-all ${
                files.identityFront
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-slate-50 border-neutral-300 hover:border-indigo-500 hover:bg-indigo-50/20'
              } ${isFieldEditable(true) ? 'cursor-pointer focus:ring-2 focus:ring-indigo-900/20 focus:outline-none' : 'cursor-default opacity-85'}`}
            >
              {files.identityFront && files.identityFront.previewUrl ? (
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-neutral-200 shadow-2xs">
                  <img
                    src={files.identityFront.previewUrl}
                    alt="ID Front Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h4 className="text-zinc-900 text-sm font-bold">National ID - Front *</h4>
                <span className="text-neutral-400 text-xs">
                  {files.identityFront ? `${files.identityFront.name} (${files.identityFront.size})` : 'PNG, JPG or WEBP · max 5 MB'}
                </span>
              </div>

              {files.identityFront ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                  {isFieldEditable(true) && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFile('identityFront', e)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-full cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isFieldEditable(true)}
                  className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-950"
                >
                  Upload Front
                </button>
              )}
            </div>

            {/* Card 2: ID Back */}
            <div
              role="button"
              tabIndex={isFieldEditable(true) ? 0 : -1}
              aria-label="Upload National ID Back"
              onClick={() => isFieldEditable(true) && idBackRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isFieldEditable(true)) {
                  e.preventDefault();
                  idBackRef.current?.click();
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-between text-center gap-3 transition-all ${
                files.identityBack
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-slate-50 border-neutral-300 hover:border-indigo-500 hover:bg-indigo-50/20'
              } ${isFieldEditable(true) ? 'cursor-pointer focus:ring-2 focus:ring-indigo-900/20 focus:outline-none' : 'cursor-default opacity-85'}`}
            >
              {files.identityBack && files.identityBack.previewUrl ? (
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-neutral-200 shadow-2xs">
                  <img
                    src={files.identityBack.previewUrl}
                    alt="ID Back Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h4 className="text-zinc-900 text-sm font-bold">National ID - Back *</h4>
                <span className="text-neutral-400 text-xs">
                  {files.identityBack ? `${files.identityBack.name} (${files.identityBack.size})` : 'PNG, JPG or WEBP · max 5 MB'}
                </span>
              </div>

              {files.identityBack ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                  {isFieldEditable(true) && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFile('identityBack', e)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-full cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isFieldEditable(true)}
                  className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-950"
                >
                  Upload Back
                </button>
              )}
            </div>

            {/* Card 3: Selfie holding ID */}
            <div
              role="button"
              tabIndex={isFieldEditable(true) ? 0 : -1}
              aria-label="Upload Selfie Holding ID"
              onClick={() => isFieldEditable(true) && idSelfieRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isFieldEditable(true)) {
                  e.preventDefault();
                  idSelfieRef.current?.click();
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-between text-center gap-3 transition-all ${
                files.selfieWithId
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-slate-50 border-neutral-300 hover:border-indigo-500 hover:bg-indigo-50/20'
              } ${isFieldEditable(true) ? 'cursor-pointer focus:ring-2 focus:ring-indigo-900/20 focus:outline-none' : 'cursor-default opacity-85'}`}
            >
              {files.selfieWithId && files.selfieWithId.previewUrl ? (
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-neutral-200 shadow-2xs">
                  <img
                    src={files.selfieWithId.previewUrl}
                    alt="Selfie Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center shadow-2xs">
                  <Camera className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h4 className="text-zinc-900 text-sm font-bold">Selfie Holding ID *</h4>
                <span className="text-neutral-400 text-xs">
                  {files.selfieWithId ? `${files.selfieWithId.name} (${files.selfieWithId.size})` : 'Face & ID clearly readable'}
                </span>
              </div>

              {files.selfieWithId ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                  {isFieldEditable(true) && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFile('selfieWithId', e)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-full cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isFieldEditable(true)}
                  className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-950"
                >
                  Upload Selfie
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: EDUCATION & CV DOCUMENTS */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold tracking-tight">Education &amp; Professional Credentials</h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">Degrees, certifications, and updated resume (PDF/DOCX max 5MB)</p>
          </div>

          {/* Education Entries Text */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
              <span>Education Degrees &amp; Certifications *</span>
              {!isFieldEditable(false) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
            </label>
            <textarea
              rows={2}
              disabled={!isFieldEditable(false)}
              value={formData.educationEntries}
              onChange={(e) => handleInputChange('educationEntries', e.target.value)}
              className="w-full p-3.5 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50 resize-none"
              placeholder="e.g. University Name, Degree Title, Graduation Year, Professional Certs (AWS, Google Cloud...)"
            />
          </div>

          {/* Teaching Experience Text */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-800 text-sm font-semibold flex items-center justify-between">
              <span>Teaching &amp; Mentorship Experience *</span>
              {!isFieldEditable(false) && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
            </label>
            <textarea
              rows={2}
              disabled={!isFieldEditable(false)}
              value={formData.teachingExperience}
              onChange={(e) => handleInputChange('teachingExperience', e.target.value)}
              className="w-full p-3.5 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50 resize-none"
              placeholder="Describe prior teaching, mentoring, workshop hosting, or curriculum development experience."
            />
          </div>

          {/* Hidden File Inputs for Docs */}
          <input
            type="file"
            ref={eduDocRef}
            onChange={(e) => handleFileUpload('educationEvidence', e)}
            accept=".pdf, image/jpeg, image/jpg, image/png, image/webp"
            disabled={!isFieldEditable(false)}
            className="hidden"
          />
          <input
            type="file"
            ref={cvRef}
            onChange={(e) => handleFileUpload('cv', e)}
            accept=".pdf, .docx, .doc"
            disabled={!isFieldEditable(false)}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Education Evidence File */}
            <div
              role="button"
              tabIndex={isFieldEditable(false) ? 0 : -1}
              aria-label="Upload Education Evidence Document"
              onClick={() => isFieldEditable(false) && eduDocRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isFieldEditable(false)) {
                  e.preventDefault();
                  eduDocRef.current?.click();
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-between text-center gap-3 transition-all ${
                files.educationEvidence
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-slate-50 border-neutral-300 hover:border-indigo-500 hover:bg-indigo-50/20'
              } ${isFieldEditable(false) ? 'cursor-pointer focus:ring-2 focus:ring-indigo-900/20 focus:outline-none' : 'cursor-default opacity-85'}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center shadow-2xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-zinc-900 text-sm font-bold">Education Evidence Document *</h4>
                <span className="text-neutral-400 text-xs">
                  {files.educationEvidence ? `${files.educationEvidence.name} (${files.educationEvidence.size})` : 'Degree / Diploma / Cert (PDF or JPG)'}
                </span>
              </div>

              {files.educationEvidence ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                  {isFieldEditable(false) && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFile('educationEvidence', e)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-full cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isFieldEditable(false)}
                  className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-950"
                >
                  Upload Evidence
                </button>
              )}
            </div>

            {/* CV / Resume File */}
            <div
              role="button"
              tabIndex={isFieldEditable(false) ? 0 : -1}
              aria-label="Upload Curriculum Vitae Resume"
              onClick={() => isFieldEditable(false) && cvRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isFieldEditable(false)) {
                  e.preventDefault();
                  cvRef.current?.click();
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-between text-center gap-3 transition-all ${
                files.cv
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-slate-50 border-neutral-300 hover:border-indigo-500 hover:bg-indigo-50/20'
              } ${isFieldEditable(false) ? 'cursor-pointer focus:ring-2 focus:ring-indigo-900/20 focus:outline-none' : 'cursor-default opacity-85'}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-zinc-900 text-sm font-bold">Curriculum Vitae (CV) / Resume *</h4>
                <span className="text-neutral-400 text-xs">
                  {files.cv ? `${files.cv.name} (${files.cv.size})` : 'PDF or DOCX · max 5 MB'}
                </span>
              </div>

              {files.cv ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                  {isFieldEditable(false) && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFile('cv', e)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isFieldEditable(false)}
                  className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-950"
                >
                  Upload Resume
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: MOTIVATION */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold tracking-tight">Motivation</h2>
          <textarea
            rows={3}
            disabled={!isFieldEditable(false)}
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            className="w-full p-4 rounded-xl border border-neutral-200 disabled:bg-slate-100 disabled:text-neutral-500 focus:border-indigo-900 focus:outline-none text-zinc-900 text-sm font-medium bg-slate-50/50 resize-none"
            placeholder="Why do you want to teach on CodeDreams?"
          />
        </div>

        {/* SECTION 6: CONFIRMATION & ACTION BUTTONS */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-6">
          <label className="flex items-start gap-3.5 cursor-pointer">
            <input
              type="checkbox"
              disabled={!isFieldEditable(false)}
              checked={formData.agreeTerms}
              onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-neutral-300 text-indigo-900 focus:ring-indigo-900 cursor-pointer"
            />
            <span className="text-neutral-600 text-sm leading-relaxed">
              I confirm the information is accurate and accept the CodeDreams Instructor Agreement and revenue share terms.
            </span>
          </label>

          {/* Missing Requirements Checklist (when form not yet ready) */}
          {missingRequirements.length > 0 && status !== 'APPROVED' && status !== 'PENDING' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-neutral-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Please complete the following required items before submitting ({missingRequirements.length} remaining):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingRequirements.map((item) => (
                  <span key={item} className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[11px] font-medium">
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons based on status */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* DRAFT STATE ACTIONS */}
            {status === 'DRAFT' && (
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-zinc-800 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    isFormValid()
                      ? 'bg-indigo-900 hover:bg-indigo-950 text-white cursor-pointer'
                      : 'bg-indigo-900/40 text-white/70 cursor-not-allowed'
                  }`}
                >
                  Submit application
                </button>
              </>
            )}

            {/* PENDING STATE ACTIONS */}
            {status === 'PENDING' && (
              <div className="flex items-center gap-3 text-neutral-500 text-sm font-medium">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Application is locked while under review.</span>
              </div>
            )}

            {/* REJECTED STATE ACTIONS: RESUBMIT */}
            {status === 'REJECTED' && (
              <button
                type="button"
                onClick={handleResubmit}
                disabled={!isFormValid()}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
                  isFormValid()
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                    : 'bg-rose-600/40 text-white/70 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resubmit application</span>
              </button>
            )}

            {/* APPROVED STATE ACTIONS */}
            {status === 'APPROVED' && (
              <button
                type="button"
                onClick={() => toast.success('Profile changes saved successfully.')}
                className="px-8 py-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Save Profile Updates
              </button>
            )}

          </div>
        </div>

        {/* SECTION 7: AUDIT REVIEW HISTORY */}
        <div className="w-full p-6 sm:p-7 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-5">
          <div>
            <h2 className="text-zinc-900 text-xl font-bold tracking-tight">Application &amp; review history</h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">A record of every step in your application lifecycle</p>
          </div>

          <div className="flex flex-col gap-3">
            
            {/* Step 1: Drafted */}
            <div className="flex items-start gap-4 p-3 bg-slate-50/70 rounded-xl border border-neutral-100">
              <div className="w-3.5 h-3.5 mt-1 rounded-full bg-indigo-900 shrink-0" />
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <h4 className="text-zinc-900 text-sm font-bold">Application drafted</h4>
                  <span className="text-neutral-500 text-xs">by Student ({formData.legalFullName})</span>
                </div>
                <span className="text-neutral-500 text-xs font-mono">3 Aug 2026, 09:10</span>
              </div>
            </div>

            {/* Step 2: Submitted / Pending */}
            {(status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED') && (
              <div className="flex items-start gap-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div className="w-3.5 h-3.5 mt-1 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h4 className="text-zinc-900 text-sm font-bold">Application submitted for verification</h4>
                    <span className="text-neutral-500 text-xs">Automated check passed · Queued for Admin review</span>
                  </div>
                  <span className="text-neutral-500 text-xs font-mono">3 Aug 2026, 10:15</span>
                </div>
              </div>
            )}

            {/* Step 3: Rejected Note (if rejected) */}
            {status === 'REJECTED' && (
              <div className="flex items-start gap-4 p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <div className="w-3.5 h-3.5 mt-1 rounded-full bg-rose-600 shrink-0" />
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h4 className="text-rose-900 text-sm font-bold">Verification Rejected</h4>
                    <span className="text-rose-700 text-xs font-medium">Reason: {reviewNote}</span>
                  </div>
                  <span className="text-neutral-500 text-xs font-mono">4 Aug 2026, 14:20</span>
                </div>
              </div>
            )}

            {/* Step 3: Approved (if approved) */}
            {status === 'APPROVED' && (
              <div className="flex items-start gap-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <div className="w-3.5 h-3.5 mt-1 rounded-full bg-emerald-600 shrink-0" />
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h4 className="text-emerald-950 text-sm font-bold">Application Approved</h4>
                    <span className="text-emerald-700 text-xs font-medium">Verified by Admin Compliance · Teacher role enabled</span>
                  </div>
                  <span className="text-neutral-500 text-xs font-mono">4 Aug 2026, 15:45</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* SECTION 8: PRIVACY NOTICE */}
        <div className="w-full p-4 bg-slate-100 rounded-2xl border border-neutral-200 flex items-center gap-3.5 text-neutral-600 text-xs sm:text-sm">
          <Info className="w-5 h-5 text-neutral-500 shrink-0" />
          <p className="leading-relaxed">
            Identity documents are stored securely and only used for verification - reviewers never see raw file content in public audit logs.
          </p>
        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Xác nhận gửi thông tin"
        footer={
          <>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-250 text-sm font-semibold text-text-secondary hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Yes, Submit
            </button>
          </>
        }
      >
        <p className="text-sm text-neutral-600 leading-relaxed font-medium">
          Thông tin của bạn sẽ bị khóa cho đến khi Admin Review xong. Hãy kiểm tra kỹ thông tin trước khi gửi.
        </p>
      </Modal>

    </div>
  );
}
