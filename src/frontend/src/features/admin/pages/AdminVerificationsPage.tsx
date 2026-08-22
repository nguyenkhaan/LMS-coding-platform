import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Search,
  FileText,
  Download,
  ExternalLink,
  LogOut,
  UserCheck
} from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  applied: string;
  expertise: string[];
  status: 'Pending' | 'Review' | 'Approved' | 'Rejected';
  bio: string;
  experience: string;
}

const APPLICANTS: Applicant[] = [
  {
    id: 'TR-0001',
    name: 'Edythe Andrew',
    initials: 'EA',
    email: 'edythe@example.com',
    phone: '+1 123 456 7890',
    applied: '16 Jan 2024',
    expertise: ['Programming', 'Algorithms', 'Data Structures'],
    status: 'Pending',
    bio: 'Experienced software engineer with 8 years in backend development, specialising in scalable systems and algorithm design. Passionate about teaching and mentoring junior developers.',
    experience: 'Previously a lead engineer at TechCorp Inc. (2016-2023). Has been teaching programming workshops since 2019 and has a proven track record of student success.'
  },
  {
    id: 'TR-0002',
    name: 'Ronald Richard',
    initials: 'RR',
    email: 'ronald@example.com',
    phone: '+1 987 654 3210',
    applied: '18 Jan 2024',
    expertise: ['React', 'TypeScript', 'UI Engineering'],
    status: 'Pending',
    bio: 'Frontend specialist with expertise in React ecosystem. Contributed to multiple open-source projects and enjoys sharing knowledge through workshops.',
    experience: 'Senior frontend engineer at DesignHub (2018-2024). Teaches React fundamentals online with over 5,000 students enrolled.'
  },
  {
    id: 'TR-0003',
    name: 'Jenny Wilson',
    initials: 'JW',
    email: 'jenny@example.com',
    phone: '+1 555 000 1234',
    applied: '20 Jan 2024',
    expertise: ['Machine Learning', 'Python', 'Data Science'],
    status: 'Review',
    bio: 'Data scientist and ML researcher with a PhD in Computer Science. Writes extensively about machine learning applications in education.',
    experience: 'Research scientist at DataLab (2020-present). Adjunct professor teaching machine learning at State University.'
  }
];

const STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-amber-50 border border-amber-300 text-amber-800',
  Review: 'bg-indigo-50 border border-indigo-200 text-indigo-900',
  Approved: 'bg-emerald-50 border border-emerald-300 text-emerald-800',
  Rejected: 'bg-rose-50 border border-rose-300 text-rose-700'
};

const CHECKLIST_LABELS = [
  'Email verified',
  'Phone verified',
  'ID document reviewed',
  'Background check',
  'Profile complete'
];
const INITIAL_CHECKLIST = [true, true, false, false, false];

export function AdminVerificationsPage() {
  const [selectedId, setSelectedId] = useState<string>(APPLICANTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [checklist, setChecklist] = useState<boolean[]>(INITIAL_CHECKLIST);

  const selected = APPLICANTS.find((a) => a.id === selectedId) ?? APPLICANTS[0];
  const filteredApplicants = APPLICANTS.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function toggleCheck(i: number) {
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="w-full flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="self-stretch px-6 lg:px-20 py-14 bg-gradient-to-br from-indigo-900 to-indigo-500 flex flex-col justify-center items-center gap-3 text-center border-b border-neutral-200/60">
        <h1 className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">Identity &amp; Teacher Review</h1>
        <div className="opacity-80 text-white text-xs sm:text-sm font-medium flex items-center gap-2">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <span>&gt;</span>
          <Link to="/admin/dashboard" className="hover:underline">Admin</Link>
          <span>&gt;</span>
          <span>Teacher Registration Review</span>
        </div>
      </div>

      {/* 2. SUBHEADER CONTROLS */}
      <div className="self-stretch bg-white border-b border-neutral-200 px-6 lg:px-20 py-4 shadow-xs">
        <div className="max-w-[1608px] w-full mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-zinc-900 text-lg font-bold">Request #{selected.id}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[selected.status]}`}>
              {selected.status}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-2xs">
              <Check size={14} /> Approve Request
            </button>
            <button className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-2xs">
              <X size={14} /> Reject
            </button>
            <button className="flex items-center gap-1.5 border border-neutral-300 bg-white hover:bg-slate-50 text-zinc-700 rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-2xs">
              <RefreshCw size={14} /> Request Changes
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN BODY (2 Columns) */}
      <div className="max-w-[1608px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row justify-start items-start gap-6">
        
        {/* Left Queue Panel */}
        <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <h2 className="text-zinc-900 text-base font-semibold mb-3">Pending Requests</h2>
          
          {/* Search Queue */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search applicant…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900"
            />
          </div>

          <div className="space-y-2">
            {filteredApplicants.map((a) => {
              const isSel = a.id === selectedId;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSel
                      ? 'bg-indigo-50 border-indigo-900 ring-1 ring-indigo-900 shadow-2xs'
                      : 'bg-white border-neutral-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-900 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0">
                      {a.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{a.name}</p>
                      <p className="text-xs text-neutral-400 font-mono">{a.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${STATUS_BADGE[a.status]}`}>
                    {a.status}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Applicant Info Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <h3 className="text-zinc-900 text-base font-semibold">Applicant Profile</h3>
              <span className="text-xs text-neutral-400">Applied: {selected.applied}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-neutral-500 text-xs block">Full Name</span>
                <span className="font-semibold text-zinc-900">{selected.name}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-xs block">Email Address</span>
                <span className="font-semibold text-zinc-900">{selected.email}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-xs block">Phone Number</span>
                <span className="font-semibold text-zinc-900">{selected.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-xs block">Requested Expertise</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selected.expertise.map((exp, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 rounded-md text-zinc-700 text-xs font-medium">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column: Identity Docs & Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Identity Docs */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <h3 className="text-zinc-900 text-base font-semibold">Identity Documentation (CCCD)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-32 bg-slate-50 border border-neutral-200 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                  <FileText className="w-8 h-8 text-indigo-900 mb-1" />
                  <span className="text-xs font-semibold text-zinc-800">Front ID Card</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Uploaded</span>
                </div>
                <div className="h-32 bg-slate-50 border border-neutral-200 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                  <FileText className="w-8 h-8 text-indigo-900 mb-1" />
                  <span className="text-xs font-semibold text-zinc-800">Back ID Card</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Uploaded</span>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <h3 className="text-zinc-900 text-base font-semibold">Verification Checklist</h3>
              <div className="space-y-2.5">
                {CHECKLIST_LABELS.map((label, idx) => (
                  <label
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className="flex items-center gap-3 text-sm text-zinc-800 cursor-pointer select-none"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      checklist[idx] ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-neutral-300'
                    }`}>
                      {checklist[idx] && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Additional Info / Bio */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h3 className="text-zinc-900 text-base font-semibold">Bio &amp; Professional Experience</h3>
            <p className="text-neutral-700 text-sm leading-relaxed">{selected.bio}</p>
            <p className="text-neutral-600 text-xs leading-relaxed">{selected.experience}</p>
          </div>

        </div>

      </div>

    </div>
  );
}
