import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourseStore } from '@/features/courses/model/useCourseStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { toast } from 'sonner';
import {
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

export const ProblemBuilderPage: React.FC = () => {
  const { courseId, activityId } = useParams<{ courseId: string; activityId?: string }>();
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('sectionId');
  const lessonId = searchParams.get('lessonId');

  const navigate = useNavigate();
  const { courses, addActivity, updateActivity } = useCourseStore();

  const isEditing = !!activityId;
  const activeCourse = courses.find(c => c.id === courseId);

  // Form states
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && activeCourse && sectionId && lessonId) {
      const section = activeCourse.sections.find(s => s.id === sectionId);
      const lesson = section?.lessons.find(l => l.id === lessonId);
      const content = lesson?.contents.find(c => c.id === activityId);
      if (content) {
        setProblemForm({
          title: content.title || '',
          slug: content.problemSlug || '',
          statement: content.problemStatement || '',
          inputDescription: content.problemInputDescription || '',
          outputDescription: content.problemOutputDescription || '',
          constraints: content.problemConstraints || '',
          difficulty: content.problemDifficulty || 'EASY',
          passingScore: content.problemPassingScore || 100,
          timeLimitMs: content.problemTimeLimitMs || 1000,
          memoryLimitKb: content.problemMemoryLimitKb || 256000,
          sampleTestcases: content.problemSampleTestcases?.map(tc => ({
            input: tc.input || '',
            output: tc.output || '',
            explanation: tc.explanation || ''
          })) || [{ input: '', output: '', explanation: '' }],
          tags: content.problemTags ? content.problemTags.join(', ') : ''
        });
      }
    }
  }, [isEditing, activityId, activeCourse, sectionId, lessonId]);

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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!problemForm.title.trim()) {
      newErrors.title = 'Problem title is required.';
    }
    if (!problemForm.slug.trim()) {
      newErrors.slug = 'Slug is required.';
    } else if (!/^[a-z0-9-]+$/.test(problemForm.slug)) {
      newErrors.slug = 'Slug must only contain lowercase alphanumeric characters and hyphens.';
    }
    if (!problemForm.statement.trim()) {
      newErrors.statement = 'Problem statement is required.';
    }
    if (!problemForm.inputDescription.trim()) {
      newErrors.inputDescription = 'Input description is required.';
    }
    if (!problemForm.outputDescription.trim()) {
      newErrors.outputDescription = 'Output description is required.';
    }
    if (!problemForm.constraints.trim()) {
      newErrors.constraints = 'Constraints are required.';
    }
    if (problemForm.passingScore <= 0) {
      newErrors.passingScore = 'Passing score must be greater than 0.';
    }
    if (problemForm.timeLimitMs <= 0) {
      newErrors.timeLimitMs = 'Time limit must be greater than 0.';
    }
    if (problemForm.memoryLimitKb <= 0) {
      newErrors.memoryLimitKb = 'Memory limit must be greater than 0.';
    }

    const hasEmptyCase = problemForm.sampleTestcases.some(tc => !tc.input.trim() || !tc.output.trim());
    if (hasEmptyCase) {
      newErrors.sampleTestcases = 'All test cases must have both input and output.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix validation errors.');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const tagsArray = problemForm.tags
      ? problemForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const activityData = {
      content_type: 'Code Problem' as const,
      title: problemForm.title,
      problemSlug: problemForm.slug,
      problemStatement: problemForm.statement,
      problemInputDescription: problemForm.inputDescription,
      problemOutputDescription: problemForm.outputDescription,
      problemConstraints: problemForm.constraints,
      problemDifficulty: problemForm.difficulty,
      problemPassingScore: problemForm.passingScore,
      problemTimeLimitMs: problemForm.timeLimitMs,
      problemMemoryLimitKb: problemForm.memoryLimitKb,
      problemSampleTestcases: problemForm.sampleTestcases,
      problemTags: tagsArray
    };

    try {
      if (isEditing) {
        updateActivity(courseId!, sectionId!, lessonId!, activityId!, activityData);
        toast.success('Problem activity updated successfully.');
      } else {
        addActivity(courseId!, sectionId!, lessonId!, activityData);
        toast.success('Problem activity added to curriculum.');
      }
      navigate(`/teacher/courses/${courseId}/edit`);
    } catch {
      toast.error('Failed to save problem.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      <div className="w-full bg-gradient-to-r from-primary to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Problem Builder</h1>
        <p className="text-[13px] font-medium text-white/70">Course Builder &rsaquo; Problem Editor</p>
      </div>

      <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <TeacherSidebar activePath="/teacher/courses" />

        {/* Workspace */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                {isEditing ? `Edit Problem: ${problemForm.title}` : 'Create Coding Problem Activity'}
              </h3>
              <p className="text-xs text-neutral-500">
                Add details for an online judge coding problem context, test cases, and constraints.
              </p>
            </div>
            <button
              onClick={() => navigate(`/teacher/courses/${courseId}/edit`)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-zinc-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g., Two Sum"
                  value={problemForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400 ${
                    errors.title ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.title && <p className="text-[11px] text-accent font-semibold">{errors.title}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">Problem Slug</label>
                <input
                  type="text"
                  placeholder="e.g., two-sum"
                  value={problemForm.slug}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, slug: e.target.value }))}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400 ${
                    errors.slug ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.slug && <p className="text-[11px] text-accent font-semibold">{errors.slug}</p>}
              </div>
            </div>

            {/* Statement */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-semibold text-zinc-700">Problem Statement / Description</label>
                <span className="text-[11px] font-medium text-neutral-400">{problemForm.statement.length} / 10000</span>
              </div>
              <textarea
                rows={5}
                maxLength={10000}
                placeholder="Detail the algorithm problem description..."
                value={problemForm.statement}
                onChange={(e) => setProblemForm(prev => ({ ...prev, statement: e.target.value }))}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  errors.statement ? 'border-accent focus:border-accent' : 'border-gray-200'
                }`}
              />
              {errors.statement && <p className="text-[11px] text-accent font-semibold">{errors.statement}</p>}
            </div>

            {/* Input & Output formats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[13px] font-semibold text-zinc-700">Input Description</label>
                  <span className="text-[11px] font-medium text-neutral-400">{problemForm.inputDescription.length} / 2000</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder="Describe the function arguments or stdin shape..."
                  value={problemForm.inputDescription}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, inputDescription: e.target.value }))}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                    errors.inputDescription ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.inputDescription && <p className="text-[11px] text-accent font-semibold">{errors.inputDescription}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[13px] font-semibold text-zinc-700">Output Description</label>
                  <span className="text-[11px] font-medium text-neutral-400">{problemForm.outputDescription.length} / 2000</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder="Describe the returned value or stdout shape..."
                  value={problemForm.outputDescription}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, outputDescription: e.target.value }))}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                    errors.outputDescription ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.outputDescription && <p className="text-[11px] text-accent font-semibold">{errors.outputDescription}</p>}
              </div>
            </div>

            {/* Constraints */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-semibold text-zinc-700">Constraints</label>
                <span className="text-[11px] font-medium text-neutral-400">{problemForm.constraints.length} / 2000</span>
              </div>
              <textarea
                rows={2}
                maxLength={2000}
                placeholder="e.g., 2 <= nums.length <= 10^4"
                value={problemForm.constraints}
                onChange={(e) => setProblemForm(prev => ({ ...prev, constraints: e.target.value }))}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  errors.constraints ? 'border-accent focus:border-accent' : 'border-gray-200'
                }`}
              />
              {errors.constraints && <p className="text-[11px] text-accent font-semibold">{errors.constraints}</p>}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">Difficulty</label>
                <select
                  value={problemForm.difficulty}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white cursor-pointer text-zinc-900"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">Passing Score</label>
                <input
                  type="number"
                  value={problemForm.passingScore}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white text-zinc-900 ${
                    errors.passingScore ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.passingScore && <p className="text-[11px] text-accent font-semibold">{errors.passingScore}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">Time Limit (ms)</label>
                <input
                  type="number"
                  value={problemForm.timeLimitMs}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, timeLimitMs: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white text-zinc-900 ${
                    errors.timeLimitMs ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.timeLimitMs && <p className="text-[11px] text-accent font-semibold">{errors.timeLimitMs}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700">Memory Limit (KB)</label>
                <input
                  type="number"
                  value={problemForm.memoryLimitKb}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, memoryLimitKb: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white text-zinc-900 ${
                    errors.memoryLimitKb ? 'border-accent focus:border-accent' : 'border-gray-200'
                  }`}
                />
                {errors.memoryLimitKb && <p className="text-[11px] text-accent font-semibold">{errors.memoryLimitKb}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-zinc-700">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Array, Hash Table, Two Pointers"
                value={problemForm.tags}
                onChange={(e) => setProblemForm(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-[14px] bg-white text-zinc-900 placeholder:text-neutral-400"
              />
            </div>

            {/* Sample Testcases */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-zinc-900">Sample Test Cases</h4>
                <button
                  type="button"
                  onClick={addSampleTestcase}
                  className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-primary hover:bg-indigo-100 transition-all rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Test Case
                </button>
              </div>

              {errors.sampleTestcases && (
                <p className="text-[11px] text-accent font-semibold">{errors.sampleTestcases}</p>
              )}

              <div className="space-y-4">
                {problemForm.sampleTestcases.map((tc, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-gray-200 rounded-xl relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removeSampleTestcase(idx)}
                      className="absolute top-3 right-3 text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] font-extrabold text-primary bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Test Case #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-500">Input</label>
                        <textarea
                          rows={2}
                          value={tc.input}
                          placeholder="Standard Input values..."
                          onChange={(e) => handleTestcaseChange(idx, 'input', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 font-mono resize-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-neutral-500">Expected Output</label>
                        <textarea
                          rows={2}
                          value={tc.output}
                          placeholder="Standard Output values..."
                          onChange={(e) => handleTestcaseChange(idx, 'output', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 font-mono resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-neutral-500">Explanation (Optional)</label>
                      <textarea
                        rows={1}
                        value={tc.explanation}
                        placeholder="Why is this the expected output?"
                        onChange={(e) => handleTestcaseChange(idx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => navigate(`/teacher/courses/${courseId}/edit`)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-zinc-700 hover:bg-slate-50 transition-all cursor-pointer"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Problem
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
export default ProblemBuilderPage;
