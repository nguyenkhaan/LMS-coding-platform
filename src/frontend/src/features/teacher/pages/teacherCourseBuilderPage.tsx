import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { useCourseStore } from '@/features/courses/model/useCourseStore';
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  FileText,
  HelpCircle,
  Code2,
  Upload,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Data Interfaces
interface CourseMetadata {
  title: string;
  slug: string;
  field: string;
  description: string;
  price: number;
  thumbnail_url: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
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
  slug: 'python-foundations-for-problem-solving',
  field: 'Programming',
  description: 'Master the fundamental concepts of Python and solve algorithms/data structures problems.',
  price: 49.00,
  thumbnail_url: 'https://placehold.co/360x200',
  status: 'DRAFT'
};



export const CourseBuilderPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, updateCourse } = useCourseStore();

  const activeCourse = courses.find(c => c.id === courseId) || courses[0];

  // State Management
  const [metadata, setMetadata] = useState<CourseMetadata>(DEFAULT_METADATA);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const thumbnailPreviewUrlRef = useRef<string | null>(null);

  const revokeThumbnailUrl = () => {
    if (thumbnailPreviewUrlRef.current) {
      URL.revokeObjectURL(thumbnailPreviewUrlRef.current);
      thumbnailPreviewUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      revokeThumbnailUrl();
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be under 2MB.');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error('Unsupported file format. Please upload PNG, JPG, JPEG, or WEBP.');
      return;
    }

    revokeThumbnailUrl();
    const objectUrl = URL.createObjectURL(file);
    thumbnailPreviewUrlRef.current = objectUrl;
    setMetadata(prev => ({ ...prev, thumbnail_url: objectUrl }));
    toast.success('Image selected successfully.');
  };

  const handleRemoveImage = () => {
    revokeThumbnailUrl();
    setMetadata(prev => ({ ...prev, thumbnail_url: '' }));
    toast.success('Image removed.');
  };

  useEffect(() => {
    if (activeCourse) {
      setMetadata({
        title: activeCourse.title,
        slug: activeCourse.slug,
        field: activeCourse.field,
        description: activeCourse.description,
        price: activeCourse.price,
        thumbnail_url: activeCourse.thumbnail_url,
        status: activeCourse.status
      });
      setSections(activeCourse.sections || []);
      
      const expand: Record<string, boolean> = {};
      activeCourse.sections.forEach(s => {
        expand[s.id] = true;
      });
      setExpandedSections(expand);
    }
  }, [activeCourse]);

  useEffect(() => {
    if (activeCourse && sections.length > 0 && sections !== activeCourse.sections) {
      updateCourse(activeCourse.id, { sections });
    }
  }, [sections, activeCourse, updateCourse]);

  // Problem creation modal & form states
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [selectedSectionIdForProblem, setSelectedSectionIdForProblem] = useState<string | null>(null);
  const [selectedLessonIdForProblem, setSelectedLessonIdForProblem] = useState<string | null>(null);
  const [problemForm, setProblemForm] = useState({
    title: '',
    slug: '',
    statement: '',
    inputDescription: '',
    outputDescription: '',
    constraints: '',
    difficulty: 'EASY' as 'EASY' | 'MEDIUM' | 'HARD',
    passingScore: 100,
    timeLimitMs: 1000,
    memoryLimitKb: 256000,
    sampleTestcases: [{ input: '', output: '', explanation: '' }],
    tags: ''
  });
  const [problemErrors, setProblemErrors] = useState<Record<string, string>>({});
  const [isSavingProblem, setIsSavingProblem] = useState(false);

  const displayName = user?.fullName || 'Edythe Andrew';
  const avatarUrl = user?.avatarUrl || 'https://placehold.co/96x96';

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
    const tempA = newSections[index];
    const tempB = newSections[targetIdx];
    if (!tempA || !tempB) return;
    newSections[index] = tempB;
    newSections[targetIdx] = tempA;

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
        const tempA = newLessons[lessonIndex];
        const tempB = newLessons[targetIdx];
        if (!tempA || !tempB) return sec;
        newLessons[lessonIndex] = tempB;
        newLessons[targetIdx] = tempA;

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

  // Problem form handlers and validation
  const resetProblemForm = () => {
    setProblemForm({
      title: '',
      slug: '',
      statement: '',
      inputDescription: '',
      outputDescription: '',
      constraints: '',
      difficulty: 'EASY',
      passingScore: 100,
      timeLimitMs: 1000,
      memoryLimitKb: 256000,
      sampleTestcases: [{ input: '', output: '', explanation: '' }],
      tags: ''
    });
    setProblemErrors({});
    setIsSavingProblem(false);
    setSelectedSectionIdForProblem(null);
    setSelectedLessonIdForProblem(null);
  };

  const addSampleTestcase = () => {
    setProblemForm(prev => ({
      ...prev,
      sampleTestcases: [...prev.sampleTestcases, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeSampleTestcase = (index: number) => {
    if (problemForm.sampleTestcases.length <= 1) {
      toast.error('At least one sample test case is required.');
      return;
    }
    setProblemForm(prev => ({
      ...prev,
      sampleTestcases: prev.sampleTestcases.filter((_, idx) => idx !== index)
    }));
  };

  const handleTestcaseChange = (index: number, field: 'input' | 'output' | 'explanation', value: string) => {
    setProblemForm(prev => {
      const newTestcases = [...prev.sampleTestcases];
      const currentTc = newTestcases[index] || { input: '', output: '', explanation: '' };
      newTestcases[index] = {
        input: currentTc.input,
        output: currentTc.output,
        explanation: currentTc.explanation,
        [field]: value
      };
      return { ...prev, sampleTestcases: newTestcases };
    });
  };

  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setProblemForm(prev => ({
      ...prev,
      title: val,
      slug: generatedSlug
    }));
  };

  const validateProblemForm = () => {
    const errors: Record<string, string> = {};

    if (!problemForm.title.trim()) {
      errors.title = 'Problem title is required.';
    }

    if (!problemForm.slug.trim()) {
      errors.slug = 'Slug is required.';
    } else if (!/^[a-z0-9-]+$/.test(problemForm.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens.';
    }

    if (!problemForm.statement.trim()) {
      errors.statement = 'Problem statement/description is required.';
    }

    if (!problemForm.inputDescription.trim()) {
      errors.inputDescription = 'Input format description is required.';
    }

    if (!problemForm.outputDescription.trim()) {
      errors.outputDescription = 'Output format description is required.';
    }

    if (!problemForm.constraints.trim()) {
      errors.constraints = 'Constraints description is required.';
    }

    if (problemForm.passingScore <= 0) {
      errors.passingScore = 'Passing score must be greater than 0.';
    }

    if (problemForm.timeLimitMs <= 0) {
      errors.timeLimitMs = 'Time limit must be greater than 0.';
    }

    if (problemForm.memoryLimitKb <= 0) {
      errors.memoryLimitKb = 'Memory limit must be greater than 0.';
    }

    if (problemForm.sampleTestcases.length === 0) {
      errors.sampleTestcases = 'At least one sample test case is required.';
    } else {
      const hasEmptyCase = problemForm.sampleTestcases.some(tc => !tc.input.trim() || !tc.output.trim());
      if (hasEmptyCase) {
        errors.sampleTestcases = 'All sample test cases must have both input and output.';
      }
    }

    setProblemErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProblemForm()) {
      toast.error('Please fix the validation errors in the form.');
      return;
    }

    setIsSavingProblem(true);

    try {
      // Simulate backend API persistence delay
      // ==========================================
      // FUTURE API INTEGRATION POINT:
      // Replace this timeout block with an actual post request:
      // const response = await problemApi.create({ ...problemForm, courseId });
      // ==========================================
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updated = sections.map(sec => {
        if (sec.id === selectedSectionIdForProblem) {
          const updatedLessons = sec.lessons.map(les => {
            if (les.id === selectedLessonIdForProblem) {
              const newC: LessonContent = {
                id: `C-${Date.now()}`,
                content_type: 'Code Problem',
                title: problemForm.title
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
      toast.success('Problem created and curriculum updated successfully.');
      setIsProblemModalOpen(false);
      resetProblemForm();
    } catch {
      toast.error('Failed to create the problem.');
    } finally {
      setIsSavingProblem(false);
    }
  };

  const addContent = (sectionId: string, lessonId: string) => {
    const targetCourseId = activeCourse?.id || courseId || 'dsa-foundations';
    const typeChoice = prompt('Choose content type: 1 for Reading, 2 for Quiz, 3 for Code Problem');
    if (!typeChoice) return;

    if (typeChoice === '1') {
      navigate(`/teacher/courses/${targetCourseId}/reading-builder/new?sectionId=${sectionId}&lessonId=${lessonId}`);
      return;
    }
    if (typeChoice === '2') {
      navigate(`/teacher/courses/${targetCourseId}/quiz-builder/new?sectionId=${sectionId}&lessonId=${lessonId}`);
      return;
    }
    if (typeChoice === '3') {
      navigate(`/teacher/courses/${targetCourseId}/problem-builder/new?sectionId=${sectionId}&lessonId=${lessonId}`);
      return;
    }
  };

  const handleEditActivity = (sectionId: string, lessonId: string, activityId: string, contentType: 'Reading' | 'Quiz' | 'Code Problem') => {
    const targetCourseId = activeCourse?.id || courseId || 'dsa-foundations';
    if (contentType === 'Reading') {
      navigate(`/teacher/courses/${targetCourseId}/reading-builder/${activityId}/edit?sectionId=${sectionId}&lessonId=${lessonId}`);
    } else if (contentType === 'Quiz') {
      navigate(`/teacher/courses/${targetCourseId}/quiz-builder/${activityId}/edit?sectionId=${sectionId}&lessonId=${lessonId}`);
    } else if (contentType === 'Code Problem') {
      navigate(`/teacher/courses/${targetCourseId}/problem-builder/${activityId}/edit?sectionId=${sectionId}&lessonId=${lessonId}`);
    }
  };

  const handleDeleteActivity = (sectionId: string, lessonId: string, activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        const updatedLessons = sec.lessons.map(les => {
          if (les.id === lessonId) {
            return {
              ...les,
              contents: les.contents.filter(c => c.id !== activityId)
            };
          }
          return les;
        });
        return { ...sec, lessons: updatedLessons };
      }
      return sec;
    });
    setSections(updated);
    toast.success('Activity deleted.');
  };

  const handlePreviewClassroom = () => {
    if (!activeCourse || !sections || sections.length === 0) {
      toast.error('Cannot preview classroom: This course has no modules/sections yet. Please add one first.');
      return;
    }

    const hasLessons = sections.some(sec => sec.lessons && sec.lessons.length > 0);
    if (!hasLessons) {
      toast.error('Cannot preview classroom: This course has no lessons yet. Please add a lesson first.');
      return;
    }

    toast.success(`Opening preview mode for "${metadata.title}"`);
    navigate(`/learn/${metadata.slug}`);
  };

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata.title) {
      toast.error('Course title is required.');
      return;
    }
    const targetCourseId = activeCourse?.id || courseId || 'dsa-foundations';
    setMetadata(prev => ({ ...prev, status: 'DRAFT' }));
    updateCourse(targetCourseId, {
      title: metadata.title,
      slug: metadata.slug,
      field: metadata.field,
      description: metadata.description,
      price: metadata.price,
      thumbnail_url: metadata.thumbnail_url,
      status: 'DRAFT',
      sections
    });
    toast.success('Course draft saved successfully.');
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata.title) {
      toast.error('Course title is required.');
      return;
    }
    const targetCourseId = activeCourse?.id || courseId || 'dsa-foundations';
    setMetadata(prev => ({ ...prev, status: 'PENDING_REVIEW' }));
    updateCourse(targetCourseId, {
      title: metadata.title,
      slug: metadata.slug,
      field: metadata.field,
      description: metadata.description,
      price: metadata.price,
      thumbnail_url: metadata.thumbnail_url,
      status: 'PENDING_REVIEW',
      sections
    });
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">

        {/* Page title banner */}
        <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Course Builder</h1>
          <p className="text-[13px] font-medium text-white/70">Dashboard &rsaquo; Course Curriculum Builder</p>
        </div>

        {/* Profile hero banner */}
        <div className="w-full max-w-[1340px] mx-auto px-4 pt-8">
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
              <button
                onClick={handlePreviewClassroom}
                className="px-5 py-2.5 bg-white text-indigo-900 text-sm font-semibold rounded-full hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
              >
                Preview Classroom
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-white text-indigo-900 text-sm font-semibold rounded-full hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
              >
                Switch to Student
              </button>
            </div>
            <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full -right-24 -top-24 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] bg-white/5 rounded-full left-[40%] -bottom-12 pointer-events-none" />
          </div>
        </div>

        {/* Body content layout */}
        <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <TeacherSidebar activePath="/teacher/course-builder" />

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
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400"
                  />
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-slug" className="text-[13px] font-semibold text-[#374151]">Course Slug</label>
                  <input
                    type="text"
                    id="course-slug"
                    value={metadata.slug}
                    onChange={(e) => setMetadata(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400"
                  />
                </div>

                {/* Field/Category */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-category" className="text-[13px] font-semibold text-[#374151]">Category</label>
                  <select
                    id="course-category"
                    value={metadata.field}
                    onChange={(e) => setMetadata(prev => ({ ...prev, field: e.target.value }))}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white cursor-pointer text-zinc-900"
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
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400"
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
                      className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Thumbnail upload simulation */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-[#374151]">Course Cover Image</span>
                  <input
                    type="file"
                    id="cover-image-upload"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-2 bg-slate-50/50">
                    {metadata.thumbnail_url ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={metadata.thumbnail_url} alt="Cover preview" className="w-48 rounded-xl shadow-sm border border-gray-100" />
                        <div className="flex gap-4">
                          <label
                            htmlFor="cover-image-upload"
                            className="text-[12px] font-bold text-[#392C7D] hover:underline cursor-pointer"
                          >
                            Replace image
                          </label>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="text-[12px] font-bold text-[#FF4667] hover:underline cursor-pointer"
                          >
                            Remove image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="cover-image-upload" className="flex flex-col items-center gap-2 cursor-pointer w-full hover:bg-slate-100/50 rounded-xl py-4 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-[#392C7D]" />
                        </div>
                        <p className="text-[13px] text-[#374151] font-semibold">Click to upload cover image</p>
                        <p className="text-[11px] text-[#6B7280]">Supports PNG, JPG, JPEG, WEBP (Max 2MB)</p>
                      </label>
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
                                    <div key={c.id} className="flex items-center justify-between text-[11px] font-semibold text-[#374151] bg-slate-50 border border-gray-100 rounded-lg px-2 py-1">
                                      <div className="flex items-center gap-1.5 truncate">
                                        {getContentIcon(c.content_type)}
                                        <span className="text-[#6B7280] capitalize font-bold shrink-0">{c.content_type}:</span>
                                        <span className="truncate">{c.title}</span>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => handleEditActivity(section.id, lesson.id, c.id, c.content_type)}
                                          className="p-0.5 rounded text-indigo-600 hover:bg-indigo-50"
                                          title="Edit Activity"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteActivity(section.id, lesson.id, c.id)}
                                          className="p-0.5 rounded text-rose-600 hover:bg-rose-50"
                                          title="Delete Activity"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
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

      <Modal
        isOpen={isProblemModalOpen}
        onClose={() => {
          resetProblemForm();
          setIsProblemModalOpen(false);
        }}
        title="Create Problem"
        description="Define a new coding problem activity for this lesson."
        maxWidth="2xl"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button
              type="button"
              onClick={() => {
                resetProblemForm();
                setIsProblemModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer"
              disabled={isSavingProblem}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSaveProblem}
              className="px-4 py-2 rounded-xl bg-[#FF4667] text-white text-sm font-semibold hover:bg-[#e03d5b] transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
              disabled={isSavingProblem}
            >
              {isSavingProblem ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                'Save/Create Problem'
              )}
            </button>
          </div>
        }
      >
        <div className="max-h-[60vh] overflow-y-auto px-1 pr-2 space-y-4">
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Problem Title</label>
              <input
                type="text"
                placeholder="e.g., Reverse a Linked List"
                value={problemForm.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  problemErrors.title ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.title && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.title}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Problem Slug</label>
              <input
                type="text"
                placeholder="e.g., reverse-linked-list"
                value={problemForm.slug}
                onChange={(e) => setProblemForm(prev => ({ ...prev, slug: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  problemErrors.slug ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.slug && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.slug}</p>}
            </div>
          </div>

          {/* Row 2: Problem Statement */}
          <div className="space-y-1">
            <label className="text-[13px] font-semibold text-[#374151]">Problem Statement / Description</label>
            <textarea
              rows={4}
              placeholder="Describe the problem, input format requirements, examples, etc. Supports Markdown."
              value={problemForm.statement}
              onChange={(e) => setProblemForm(prev => ({ ...prev, statement: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                problemErrors.statement ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
              }`}
            />
            {problemErrors.statement && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.statement}</p>}
          </div>

          {/* Row 3: Input & Output Formats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Input Format Description</label>
              <textarea
                rows={3}
                placeholder="Describe the shape/constraints of the input data."
                value={problemForm.inputDescription}
                onChange={(e) => setProblemForm(prev => ({ ...prev, inputDescription: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  problemErrors.inputDescription ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.inputDescription && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.inputDescription}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Output Format Description</label>
              <textarea
                rows={3}
                placeholder="Describe the expected returned value or stdout format."
                value={problemForm.outputDescription}
                onChange={(e) => setProblemForm(prev => ({ ...prev, outputDescription: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  problemErrors.outputDescription ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.outputDescription && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.outputDescription}</p>}
            </div>
          </div>

          {/* Row 4: Constraints */}
          <div className="space-y-1">
            <label className="text-[13px] font-semibold text-[#374151]">Constraints</label>
            <textarea
              rows={2}
              placeholder="e.g., 1 <= N <= 10^5, Array elements are integers."
              value={problemForm.constraints}
              onChange={(e) => setProblemForm(prev => ({ ...prev, constraints: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                problemErrors.constraints ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
              }`}
            />
            {problemErrors.constraints && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.constraints}</p>}
          </div>

          {/* Row 5: Metadata Grid (Difficulty, Passing Score, limits, tags) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Difficulty</label>
              <select
                value={problemForm.difficulty}
                onChange={(e) => setProblemForm(prev => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white cursor-pointer text-zinc-900"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Passing Score</label>
              <input
                type="number"
                value={problemForm.passingScore}
                onChange={(e) => setProblemForm(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 ${
                  problemErrors.passingScore ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.passingScore && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.passingScore}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Time Limit (ms)</label>
              <input
                type="number"
                value={problemForm.timeLimitMs}
                onChange={(e) => setProblemForm(prev => ({ ...prev, timeLimitMs: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 ${
                  problemErrors.timeLimitMs ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.timeLimitMs && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.timeLimitMs}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#374151]">Memory Limit (KB)</label>
              <input
                type="number"
                value={problemForm.memoryLimitKb}
                onChange={(e) => setProblemForm(prev => ({ ...prev, memoryLimitKb: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 ${
                  problemErrors.memoryLimitKb ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {problemErrors.memoryLimitKb && <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.memoryLimitKb}</p>}
            </div>
          </div>

          {/* Row 6: Tags */}
          <div className="space-y-1">
            <label className="text-[13px] font-semibold text-[#374151]">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., Array, Two Pointers, Dynamic Programming"
              value={problemForm.tags}
              onChange={(e) => setProblemForm(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400"
            />
          </div>

          {/* Row 7: Sample Test cases */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[14px] font-bold text-[#111827]">Sample Test Cases</h4>
              <button
                type="button"
                onClick={addSampleTestcase}
                className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#392C7D] hover:bg-indigo-100 transition-all rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Test Case
              </button>
            </div>
            
            {problemErrors.sampleTestcases && (
              <p className="text-[11px] text-[#FF4667] font-semibold">{problemErrors.sampleTestcases}</p>
            )}

            <div className="space-y-4">
              {problemForm.sampleTestcases.map((testcase, index) => (
                <div key={index} className="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeSampleTestcase(index)}
                    className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Delete Test Case"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  
                  <span className="text-[11px] font-extrabold text-[#392C7D] bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Test Case #{index + 1}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#6B7280]">Input</label>
                      <textarea
                        rows={2}
                        placeholder="e.g., nums = [2,7,11,15], target = 9"
                        value={testcase.input}
                        onChange={(e) => handleTestcaseChange(index, 'input', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#392C7D] text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 resize-none font-mono"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#6B7280]">Output</label>
                      <textarea
                        rows={2}
                        placeholder="e.g., [0,1]"
                        value={testcase.output}
                        onChange={(e) => handleTestcaseChange(index, 'output', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#392C7D] text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 resize-none font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#6B7280]">Explanation (Optional)</label>
                    <textarea
                      rows={1.5}
                      placeholder="Explain why this output is expected."
                      value={testcase.explanation}
                      onChange={(e) => handleTestcaseChange(index, 'explanation', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#392C7D] text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

        </div>

        </div>
  );
};

export default CourseBuilderPage;
