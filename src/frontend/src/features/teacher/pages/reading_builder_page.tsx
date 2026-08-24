import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourseStore } from '@/stores/useCourseStore';
import { FigmaHeader } from '../../courses/components/figma_header';
import { FigmaFooter } from '../../courses/components/figma_footer';
import { TeacherSidebar } from '../components/teacher_sidebar';
import { toast } from 'sonner';
import {
  BookOpen,
  Save,
  X,
  FileText
} from 'lucide-react';

export const ReadingBuilderPage: React.FC = () => {
  const { courseId, activityId } = useParams<{ courseId: string; activityId?: string }>();
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('sectionId');
  const lessonId = searchParams.get('lessonId');
  
  const navigate = useNavigate();
  const { courses, addActivity, updateActivity } = useCourseStore();

  const isEditing = !!activityId;
  const activeCourse = courses.find(c => c.id === courseId);

  // Form states
  const [title, setTitle] = useState('');
  const [readingContent, setReadingContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && activeCourse && sectionId && lessonId) {
      const section = activeCourse.sections.find(s => s.id === sectionId);
      const lesson = section?.lessons.find(l => l.id === lessonId);
      const content = lesson?.contents.find(c => c.id === activityId);
      if (content) {
        setTitle(content.title || '');
        setReadingContent(content.readingContent || '');
      }
    }
  }, [isEditing, activityId, activeCourse, sectionId, lessonId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Reading title is required.';
    }
    if (!readingContent.trim()) {
      newErrors.content = 'Reading content body is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the validation errors.');
      return;
    }

    setIsSaving(true);
    // Simulate 800ms saving delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (isEditing) {
        updateActivity(courseId!, sectionId!, lessonId!, activityId!, {
          title,
          readingContent
        });
        toast.success('Reading activity updated successfully.');
      } else {
        addActivity(courseId!, sectionId!, lessonId!, {
          content_type: 'Reading',
          title,
          readingContent
        });
        toast.success('Reading activity added to curriculum.');
      }
      navigate(`/teacher/courses/${courseId}/edit`);
    } catch (err) {
      toast.error('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Reading Builder</h1>
        <p className="text-[13px] font-medium text-white/70">Course Builder &rsaquo; Reading Editor</p>
      </div>

      <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <TeacherSidebar activePath="/teacher/courses" />

        {/* Workspace */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#111827]">
                {isEditing ? `Edit Reading: ${title}` : 'Create Reading Activity'}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Write reading guides or instructional markdown files for your students.
              </p>
            </div>
            <button
              onClick={() => navigate(`/teacher/courses/${courseId}/edit`)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#111827] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#374151]">Reading Title</label>
              <input
                type="text"
                placeholder="e.g., Guide to Hash Map Collisions"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  errors.title ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {errors.title && <p className="text-[11px] text-[#FF4667] font-semibold">{errors.title}</p>}
            </div>

            {/* Reading Content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#374151]">Reading Content (Markdown supported)</label>
              <textarea
                rows={12}
                placeholder="Write your study notes, tutorial steps, or guides..."
                value={readingContent}
                onChange={(e) => {
                  setReadingContent(e.target.value);
                  if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
                }}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] font-mono bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  errors.content ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {errors.content && <p className="text-[11px] text-[#FF4667] font-semibold">{errors.content}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => navigate(`/teacher/courses/${courseId}/edit`)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151] hover:bg-slate-50 transition-all cursor-pointer"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF4667] text-white text-sm font-semibold hover:bg-[#e03d5b] transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Content
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ReadingBuilderPage;
