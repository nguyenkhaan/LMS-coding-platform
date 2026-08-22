import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { FigmaHeader } from '../courses/components/FigmaHeader';
import { FigmaFooter } from '../courses/components/FigmaFooter';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  BookOpen,
  DollarSign,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  FileText,
  HelpCircle,
  Code2,
  FileImage,
  Upload,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Data Interfaces
interface CourseMetadata {
  title: string;
  field: string;
  description: string;
  price: number;
  thumbnail_url: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

interface LessonContent {
  id: string;
  content_type: 'Reading' | 'Quiz' | 'Code Problem';
  title: string;
  media_url?: string;
}

interface Lesson {
  id: string;
  title: string;
  summary: string;
  position: number;
  contents: LessonContent[];
}

interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

// Default mock values representing existing course models
const DEFAULT_METADATA: CourseMetadata = {
  title: 'Python Foundations for Problem Solving',
  field: 'Programming',
  description: 'Master the fundamental concepts of Python and solve algorithms/data structures problems.',
  price: 49.00,
  thumbnail_url: 'https://placehold.co/360x200',
  status: 'DRAFT'
};

const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'S-01',
    title: 'Foundations & Basics',
    position: 1,
    lessons: [
      {
        id: 'L-01',
        title: 'Introduction & Python Installation',
        summary: 'Setting up local Python IDEs and basic syntax rules.',
        position: 1,
        contents: [
          { id: 'C-01', content_type: 'Reading', title: 'IDE Setup Guide' }
        ]
      },
      {
        id: 'L-02',
        title: 'Variables and Simple Data Types',
        summary: 'Learn about integers, decimals, booleans, and strings.',
        position: 2,
        contents: [
          { id: 'C-02', content_type: 'Quiz', title: 'Data Types Checkpoint Quiz' }
        ]
      }
    ]
  },
  {
    id: 'S-02',
    title: 'Control Flow structures',
    position: 2,
    lessons: [
      {
        id: 'L-03',
        title: 'If-Else Conditional Decisions',
        summary: 'Understanding branch executions based on condition results.',
        position: 1,
        contents: [
          { id: 'C-03', content_type: 'Code Problem', title: 'Find Maximum of Two Numbers' }
        ]
      },
      {
        id: 'L-04',
        title: 'Loops (While & For loops)',
        summary: 'Loop iteration rules and break/continue instructions.',
        position: 2,
        contents: [
          { id: 'C-04', content_type: 'Reading', title: 'Loop Execution Analysis' }
        ]
      }
    ]
  }
];

// Sidebar NavItem
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={
      active
        ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF4667] font-semibold bg-rose-50/60 text-sm'
        : 'flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-[#FF4667] hover:bg-slate-50 transition-all text-sm'
    }
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const CourseBuilderPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // State Management
  const [metadata, setMetadata] = useState<CourseMetadata>(DEFAULT_METADATA);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'S-01': true,
    'S-02': true
  });

  const displayName = user?.fullName || 'Edythe Andrew';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // ---------------------------------------------------------------------------
  // Reordering Logic (Move Up/Down in State)
  // ---------------------------------------------------------------------------
  const moveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    // Recalculate position indexes
    const updated = newSections.map((s, idx) => ({
      ...s,
      position: idx + 1
    }));
    setSections(updated);
    toast.success('Section order re-arranged locally.');
  };

  const moveLesson = (sectionId: string, lessonIndex: number, direction: 'UP' | 'DOWN') => {
    const targetSection = sections.find(s => s.id === sectionId);
    if (!targetSection) return;

    const targetIdx = direction === 'UP' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIdx < 0 || targetIdx >= targetSection.lessons.length) return;

    const updatedSections = sections.map(sec => {
      if (sec.id === sectionId) {
        const newLessons = [...sec.lessons];
        const temp = newLessons[lessonIndex];
        newLessons[lessonIndex] = newLessons[targetIdx];
        newLessons[targetIdx] = temp;

        const updatedLessons = newLessons.map((l, idx) => ({
          ...l,
          position: idx + 1
        }));
        return { ...sec, lessons: updatedLessons };
      }
      return sec;
    });

    setSections(updatedSections);
    toast.success('Lesson order re-arranged locally.');
  };

  // ---------------------------------------------------------------------------
  // Add / Edit / Delete Handlers
  // ---------------------------------------------------------------------------
  const addSection = () => {
    const title = prompt('Enter Section Title:');
    if (!title) return;

    const newSec: Section = {
      id: `S-${Date.now()}`,
      title,
      position: sections.length + 1,
      lessons: []
    };
    setSections([...sections, newSec]);
    setExpandedSections(prev => ({ ...prev, [newSec.id]: true }));
    toast.success('New section added.');
  };

  const deleteSection = (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all of its lessons?')) return;
    setSections(sections.filter(s => s.id !== sectionId));
    toast.success('Section deleted.');
  };

  const addLesson = (sectionId: string) => {
    const title = prompt('Enter Lesson Title:');
    if (!title) return;

    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        const newL: Lesson = {
          id: `L-${Date.now()}`,
          title,
          summary: 'Newly created lesson summary details.',
          position: sec.lessons.length + 1,
          contents: []
        };
        return {
          ...sec,
          lessons: [...sec.lessons, newL]
        };
      }
      return sec;
    });
    setSections(updated);
    toast.success('Lesson added to section.');
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lessons: sec.lessons.filter(l => l.id !== lessonId)
        };
      }
      return sec;
    });
    setSections(updated);
    toast.success('Lesson deleted.');
  };

  const addContent = (sectionId: string, lessonId: string) => {
    const typeChoice = prompt('Choose content type: 1 for Reading, 2 for Quiz, 3 for Code Problem');
    let typeName: 'Reading' | 'Quiz' | 'Code Problem' = 'Reading';
    if (typeChoice === '2') typeName = 'Quiz';
    if (typeChoice === '3') typeName = 'Code Problem';

    const title = prompt('Enter content title:');
    if (!title) return;

    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        const updatedLessons = sec.lessons.map(les => {
          if (les.id === lessonId) {
            const newC: LessonContent = {
              id: `C-${Date.now()}`,
              content_type: typeName,
              title
            };
            return {
              ...les,
              contents: [...les.contents, newC]
            };
          }
          return les;
        });
        return { ...sec, lessons: updatedLessons };
      }
      return sec;
    });
    setSections(updated);
    toast.success('Content attached to lesson.');
  };

  // Save / Publish Actions
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata.title) {
      toast.error('Course title is required.');
      return;
    }
    setMetadata(prev => ({ ...prev, status: 'DRAFT' }));
    toast.success('Course draft saved successfully.');
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata.title) {
      toast.error('Course title is required.');
      return;
    }
    setMetadata(prev => ({ ...prev, status: 'PENDING_REVIEW' }));
    toast.success('Course submitted for review! Admin approval is pending.');
  };

  const getContentIcon = (type: 'Reading' | 'Quiz' | 'Code Problem') => {
    switch (type) {
      case 'Quiz':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'Code Problem':
        return <Code2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Reading':
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start items-center">
      <div className="w-full max-w-[1892px] bg-white shadow-2xl rounded-3xl border border-neutral-100 overflow-hidden flex flex-col">
        <FigmaHeader />

        {/* Page title banner */}
        <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
          <h1 className="text-[36px] font-extrabold text-white tracking-tight">Course Builder</h1>
          <p className="text-[13px] font-medium text-white/70">Home &rsaquo; Course Curriculum Builder</p>
        </div>

        {/* Profile hero banner */}
        <div className="w-full max-w-[1296px] mx-auto px-4 pt-8">
          <div className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 rounded-2xl overflow-hidden relative p-8 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-6 relative z-10">
              <img
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover bg-white"
                src={avatarUrl}
                alt={displayName}
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{displayName}</h2>
                <p className="text-neutral-200 text-sm font-medium">Teacher</p>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <button className="px-5 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-all cursor-pointer">
                Become a Student
              </button>
              <button
                onClick={() => navigate('/teacher/dashboard')}
                className="px-5 py-2.5 bg-[#FF4667] text-white text-sm font-semibold rounded-full hover:bg-[#e03d5b] transition-all cursor-pointer"
              >
                Teacher Dashboard
              </button>
            </div>
            <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
          </div>
        </div>

        {/* Body content layout */}
        <div className="w-full max-w-[1296px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Main Menu</h3>
                <div className="flex flex-col gap-2">
                  <NavItem to="/teacher/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                  <NavItem to="/teacher/profile" icon={<User className="w-4 h-4" />} label="My Profile" />
                  <NavItem to="/teacher/courses" icon={<BookOpen className="w-4 h-4" />} label="My Courses" active />
                  <NavItem to="/teacher/course-enrollment" icon={<BookOpen className="w-4 h-4" />} label="Course Enrollment" />
                  <NavItem to="/teacher/students" icon={<Users className="w-4 h-4" />} label="Students" />
                  <NavItem to="/teacher/earnings" icon={<DollarSign className="w-4 h-4" />} label="Earnings" />
                  <NavItem to="/teacher/wallet" icon={<Wallet className="w-4 h-4" />} label="Payout & Wallet" />
                  <NavItem to="/teacher/messages" icon={<MessageSquare className="w-4 h-4" />} label="Messages" />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Account Settings</h3>
                <div className="flex flex-col gap-2">
                  <NavItem to="/teacher/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-[#6B7280] hover:text-rose-500 hover:bg-rose-50/50 transition-all text-sm text-left w-full cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-5 gap-6 min-w-0">
            
            {/* Center column: Course Info form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Course Information</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Define core course specifications.</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    metadata.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : metadata.status === 'PENDING_REVIEW'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-50 text-[#6B7280] border border-gray-200'
                  }`}
                >
                  {metadata.status}
                </span>
              </div>

              <form className="flex flex-col gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-title" className="text-[13px] font-semibold text-[#374151]">Course Title</label>
                  <input
                    type="text"
                    id="course-title"
                    value={metadata.title}
                    onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px]"
                  />
                </div>

                {/* Field/Category */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-category" className="text-[13px] font-semibold text-[#374151]">Category</label>
                  <select
                    id="course-category"
                    value={metadata.field}
                    onChange={(e) => setMetadata(prev => ({ ...prev, field: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white cursor-pointer"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Algorithms">Algorithms & DS</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-description" className="text-[13px] font-semibold text-[#374151]">Description</label>
                  <textarea
                    id="course-description"
                    rows={4}
                    value={metadata.description}
                    onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-price" className="text-[13px] font-semibold text-[#374151]">Course Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-[#6B7280] font-semibold">$</span>
                    <input
                      type="number"
                      id="course-price"
                      value={metadata.price}
                      onChange={(e) => setMetadata(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px]"
                    />
                  </div>
                </div>

                {/* Thumbnail upload simulation */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-[#374151]">Course Cover Image</span>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-2 bg-slate-50/50">
                    {metadata.thumbnail_url ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={metadata.thumbnail_url} alt="Cover preview" className="w-48 rounded-xl shadow-sm border border-gray-100" />
                        <button
                          type="button"
                          onClick={() => setMetadata(prev => ({ ...prev, thumbnail_url: '' }))}
                          className="text-[12px] font-bold text-[#FF4667] hover:underline"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-[#392C7D]" />
                        </div>
                        <p className="text-[13px] text-[#374151] font-semibold">Click to upload cover image</p>
                        <p className="text-[11px] text-[#6B7280]">Supports PNG, JPG, JPEG (Max 2MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-100 mt-2">
                  <button
                    onClick={handleSaveDraft}
                    type="button"
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[14px] font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={handlePublishCourse}
                    type="button"
                    className="flex-1 py-2.5 rounded-xl bg-[#FF4667] text-white text-[14px] font-semibold hover:bg-[#e03d5b] transition-all shadow-sm cursor-pointer"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            </div>

            {/* Right column: Curriculum Preview list */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">Curriculum Preview</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Manage lessons and modules.</p>
                </div>
                <button
                  onClick={addSection}
                  className="p-1.5 rounded-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-[#392C7D] transition-all cursor-pointer"
                  title="Add Section"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Sections list block */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[640px] pr-1">
                {sections.map((section, secIdx) => {
                  const isExpanded = expandedSections[section.id];
                  return (
                    <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      {/* Section header banner */}
                      <div className="bg-slate-50 px-4 py-3 flex items-center justify-between gap-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="p-1 rounded-md text-[#6B7280] hover:bg-slate-200 shrink-0 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-[12px] font-extrabold text-[#392C7D] bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
                            {secIdx + 1}
                          </span>
                          <span className="text-[14px] font-bold text-[#111827] truncate">
                            {section.title}
                          </span>
                        </div>
                        
                        {/* Section Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => moveSection(secIdx, 'UP')}
                            disabled={secIdx === 0}
                            className="p-1 rounded-md text-[#6B7280] hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveSection(secIdx, 'DOWN')}
                            disabled={secIdx === sections.length - 1}
                            className="p-1 rounded-md text-[#6B7280] hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => addLesson(section.id)}
                            className="p-1 rounded-md text-indigo-600 hover:bg-indigo-100"
                            title="Add Lesson"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="p-1 rounded-md text-rose-600 hover:bg-rose-100"
                            title="Delete Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Lessons items list */}
                      {isExpanded && (
                        <div className="p-3 bg-white flex flex-col gap-3.5 divide-y divide-gray-100">
                          {section.lessons.map((lesson, lesIdx) => (
                            <div key={lesson.id} className="pt-3 first:pt-0 flex flex-col gap-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                                    <span className="text-[#6B7280]">{secIdx + 1}.{lesIdx + 1}</span>
                                    {lesson.title}
                                  </p>
                                  <p className="text-[11px] text-[#6B7280] mt-0.5 max-w-[200px] truncate">
                                    {lesson.summary}
                                  </p>
                                </div>

                                {/* Lesson Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => moveLesson(section.id, lesIdx, 'UP')}
                                    disabled={lesIdx === 0}
                                    className="p-1 rounded text-[#6B7280] hover:bg-slate-100 disabled:opacity-30"
                                    title="Move Lesson Up"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => moveLesson(section.id, lesIdx, 'DOWN')}
                                    disabled={lesIdx === section.lessons.length - 1}
                                    className="p-1 rounded text-[#6B7280] hover:bg-slate-100 disabled:opacity-30"
                                    title="Move Lesson Down"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => addContent(section.id, lesson.id)}
                                    className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                                    title="Attach Content"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteLesson(section.id, lesson.id)}
                                    className="p-1 rounded text-rose-600 hover:bg-rose-50"
                                    title="Delete Lesson"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Lesson polymorphic contents list */}
                              {lesson.contents.length > 0 && (
                                <div className="pl-6 flex flex-col gap-1.5">
                                  {lesson.contents.map(c => (
                                    <div key={c.id} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#374151] bg-slate-50 border border-gray-100 rounded-lg px-2 py-1">
                                      {getContentIcon(c.content_type)}
                                      <span className="text-[#6B7280] capitalize font-bold shrink-0">{c.content_type}:</span>
                                      <span className="truncate">{c.title}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {section.lessons.length === 0 && (
                            <p className="text-[11px] text-[#6B7280] italic text-center py-2">
                              No lessons created. Click + to add one.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {sections.length === 0 && (
                  <p className="text-[13px] text-[#6B7280] text-center py-8">
                    No curriculum modules set. Click + Add section above to begin.
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        <FigmaFooter />
      </div>
    </div>
  );
};

export default CourseBuilderPage;
