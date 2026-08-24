import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { Modal } from '@/components/ui/modal';
import {
  Mic,
  Video,
  Info,
  Sparkles,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';

const TOPICS = [
  { id: 'javascript', label: 'JavaScript & TypeScript', desc: 'ES6+, Async/Await, Event Loop, Closures, Types' },
  { id: 'react', label: 'React & Frontend Architecture', desc: 'Hooks, State Management, Rendering Optimizations, SSR' },
  { id: 'algorithms', label: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Graphs, Dynamic Programming, Complexity' },
  { id: 'backend', label: 'Backend & Node.js / Python', desc: 'REST APIs, Databases, Concurrency, Caching & Redis' },
  { id: 'system_design', label: 'System Design & Distributed Systems', desc: 'Scalability, Load Balancing, Microservices, Sharding' }
];

const LEVELS = ['Intern', 'Fresher', 'Junior', 'Senior', 'Lead'];

export function InterviewSetupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedTopic, setSelectedTopic] = useState('javascript');
  const [selectedLevel, setSelectedLevel] = useState('Junior');
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(false);

  const handleStart = () => {
    navigate('/interview/session-001');
  };

  return (
    <div className="w-full flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="self-stretch px-6 lg:px-20 py-14 bg-gradient-to-br from-indigo-900 to-indigo-500 flex flex-col justify-center items-center gap-3 text-center border-b border-neutral-200/60">
        <h1 className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">AI Mock Interview Setup</h1>
        <div className="opacity-80 text-white text-xs sm:text-sm font-medium flex items-center gap-2">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <span>&gt;</span>
          <span>AI Interview</span>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN SETUP SECTION */}
      <div className="self-stretch max-w-5xl mx-auto w-full px-6 pt-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Card: Topic & Level Selection */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <div>
              <h2 className="text-zinc-900 text-xl font-bold tracking-tight">Choose Interview Topic</h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">Select the primary domain for AI technical probing.</p>
            </div>

            {/* Topic Radio Options */}
            <div className="flex flex-col gap-3">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <label
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-900 ring-1 ring-indigo-900 shadow-2xs'
                        : 'bg-white border-neutral-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-900 bg-indigo-900' : 'border-neutral-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-950' : 'text-zinc-900'}`}>
                        {topic.label}
                      </span>
                      <span className="text-xs text-neutral-500 mt-0.5">{topic.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Target Level */}
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
              <label className="text-zinc-900 text-sm font-semibold">Target Seniority Level</label>
              <div className="grid grid-cols-5 gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-indigo-900 text-white border-indigo-900 shadow-2xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
            >
              <span>Begin AI Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Card: Session Protocol & Permissions */}
          <div className="flex flex-col gap-6">
            
            {/* Rules Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-5">
              <div>
                <h3 className="text-zinc-900 text-base font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-900" />
                  Interview Rules &amp; Protocols
                </h3>
                <p className="text-neutral-500 text-xs mt-1">Conducted by SkillBoost AI Evaluation Engine.</p>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-700 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-900 shrink-0 mt-0.5" />
                  <div>
                    <strong>Maximum 12 Questions:</strong> AI adapts question difficulty based on response depth and accuracy.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Realtime Feedback:</strong> Generates multi-axis score report upon completion (Technical, Communication, Problem Solving).
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Privacy First:</strong> Text messages are archived for your review; camera and microphone streams are not saved.
                  </div>
                </div>
              </div>
            </div>

            {/* Media Permissions Card */}
            <div className="bg-slate-100/80 rounded-2xl border border-neutral-200 p-6 flex flex-col gap-4">
              <div>
                <h4 className="text-zinc-900 text-sm font-semibold">Media Device Access (Optional)</h4>
                <p className="text-neutral-500 text-xs mt-0.5">You can speak your answers or type them in text chat.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    micEnabled ? 'bg-white border-green-500 text-green-700 shadow-2xs' : 'bg-white border-neutral-300 text-neutral-500'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{micEnabled ? 'Microphone: Ready' : 'Enable Mic'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCamEnabled(!camEnabled)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    camEnabled ? 'bg-white border-green-500 text-green-700 shadow-2xs' : 'bg-white border-neutral-300 text-neutral-500'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>{camEnabled ? 'Camera: Ready' : 'Enable Cam'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Guest Lock Modal */}
      <Modal
        isOpen={!isAuthenticated}
        onClose={() => navigate('/')}
        title="🔒 AI Interview Locked"
        footer={
          <>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl border border-gray-250 text-sm font-semibold text-text-secondary hover:bg-slate-50 transition-all cursor-pointer"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Sign In
            </button>
          </>
        }
      >
        <p className="text-sm text-neutral-600 leading-relaxed font-medium">
          Vui lòng đăng nhập tài khoản để trải nghiệm tính năng Phỏng vấn thử với AI.
        </p>
      </Modal>

    </div>
  );
}
