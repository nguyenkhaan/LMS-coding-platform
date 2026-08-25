import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourseStore } from '@/features/courses/model/useCourseStore';
import { TeacherSidebar } from '../components/teacherSidebar.tsx';
import { toast } from 'sonner';
import {
  Save,
  X,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  questionText: string;
  choices: string[];
  correctAnswerIndex: number;
  points: number;
}

export const QuizBuilderPage: React.FC = () => {
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
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}`,
      questionText: '',
      choices: ['', '', '', ''],
      correctAnswerIndex: 0,
      points: 10
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && activeCourse && sectionId && lessonId) {
      const section = activeCourse.sections.find(s => s.id === sectionId);
      const lesson = section?.lessons.find(l => l.id === lessonId);
      const content = lesson?.contents.find(c => c.id === activityId);
      if (content) {
        setTitle(content.title || '');
        setQuizDescription(content.quizDescription || '');
        if (content.quizQuestions) {
          setQuestions(content.quizQuestions);
        }
      }
    }
  }, [isEditing, activityId, activeCourse, sectionId, lessonId]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        questionText: '',
        choices: ['', '', '', ''],
        correctAnswerIndex: 0,
        points: 10
      }
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) {
      toast.error('Quiz must have at least one question.');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx].questionText = text;
      return updated;
    });
  };

  const handleChoiceChange = (qIdx: number, cIdx: number, val: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].choices[cIdx] = val;
      return updated;
    });
  };

  const handleCorrectAnswerSelect = (qIdx: number, cIdx: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].correctAnswerIndex = cIdx;
      return updated;
    });
  };

  const handlePointsChange = (qIdx: number, val: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].points = val;
      return updated;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Quiz title is required.';
    }
    if (!quizDescription.trim()) {
      newErrors.description = 'Quiz description is required.';
    }

    let hasEmptyQuestion = false;
    let hasEmptyChoice = false;

    questions.forEach((q) => {
      if (!q.questionText.trim()) hasEmptyQuestion = true;
      q.choices.forEach((c) => {
        if (!c.trim()) hasEmptyChoice = true;
      });
    });

    if (hasEmptyQuestion) {
      newErrors.questions = 'All questions must have question text defined.';
    } else if (hasEmptyChoice) {
      newErrors.questions = 'All question choices must have text defined.';
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

    const activityData = {
      content_type: 'Quiz' as const,
      title,
      quizDescription,
      quizQuestions: questions
    };

    try {
      if (isEditing) {
        updateActivity(courseId!, sectionId!, lessonId!, activityId!, activityData);
        toast.success('Quiz activity updated successfully.');
      } else {
        addActivity(courseId!, sectionId!, lessonId!, activityData);
        toast.success('Quiz activity added to curriculum.');
      }
      navigate(`/teacher/courses/${courseId}/edit`);
    } catch {
      toast.error('Failed to save quiz.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-['Inter'] antialiased">
      <div className="w-full bg-gradient-to-r from-[#392C7D] to-purple-600 py-8 flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Quiz Builder</h1>
        <p className="text-[13px] font-medium text-white/70">Course Builder &rsaquo; Quiz Editor</p>
      </div>

      <div className="w-full max-w-[1340px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <TeacherSidebar activePath="/teacher/courses" />

        {/* Workspace */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#111827]">
                {isEditing ? `Edit Quiz: ${title}` : 'Create Quiz Activity'}
              </h3>
              <p className="text-xs text-[#6B7280]">
                Design multiple-choice checkpoint questions to test student knowledge blocks.
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
              <label className="text-[13px] font-semibold text-[#374151]">Quiz Title</label>
              <input
                type="text"
                placeholder="e.g., Module 1 Checkpoint Quiz"
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

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#374151]">Quiz Description</label>
              <textarea
                rows={3}
                placeholder="Describe the topics covered in this checkpoint..."
                value={quizDescription}
                onChange={(e) => {
                  setQuizDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[14px] resize-none bg-white text-zinc-900 placeholder:text-neutral-400 ${
                  errors.description ? 'border-[#FF4667] focus:border-[#FF4667]' : 'border-gray-200'
                }`}
              />
              {errors.description && <p className="text-[11px] text-[#FF4667] font-semibold">{errors.description}</p>}
            </div>

            {/* Questions list */}
            <div className="border-t border-gray-100 pt-5 space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-[#111827]">Questions List</h4>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-[#392C7D] hover:bg-indigo-100 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              {errors.questions && (
                <p className="text-[11px] text-[#FF4667] font-semibold">{errors.questions}</p>
              )}

              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div key={q.id} className="p-5 bg-slate-50 border border-gray-200 rounded-2xl relative flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="absolute top-4 right-4 text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-extrabold text-[#392C7D] bg-indigo-50 px-2.5 py-0.5 rounded-full shrink-0">
                        Q#{qIdx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-[#6B7280]">Points:</label>
                        <input
                          type="number"
                          value={q.points}
                          onChange={(e) => handlePointsChange(qIdx, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold text-center bg-white text-zinc-900"
                        />
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#374151]">Question Text</label>
                      <input
                        type="text"
                        placeholder="e.g., What is the output of print(2 ** 3)?"
                        value={q.questionText}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#392C7D] text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400"
                      />
                    </div>

                    {/* Choices Grid */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-semibold text-[#374151]">Answer Choices (select correct choice)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.choices.map((choice, cIdx) => {
                          const isCorrect = q.correctAnswerIndex === cIdx;
                          return (
                            <div key={cIdx} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCorrectAnswerSelect(qIdx, cIdx)}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                  isCorrect 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'bg-white border-gray-300 text-transparent hover:border-gray-400'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="text"
                                placeholder={`Option ${String.fromCharCode(65 + cIdx)}`}
                                value={choice}
                                onChange={(e) => handleChoiceChange(qIdx, cIdx, e.target.value)}
                                className={`flex-1 px-3 py-1.5 border rounded-xl focus:outline-none focus:border-[#392C7D] text-[13px] bg-white text-zinc-900 placeholder:text-neutral-400 ${
                                  isCorrect ? 'border-emerald-200 ring-2 ring-emerald-500/10' : 'border-gray-200'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
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
                    <Save className="w-4 h-4" /> Save Quiz
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
export default QuizBuilderPage;
