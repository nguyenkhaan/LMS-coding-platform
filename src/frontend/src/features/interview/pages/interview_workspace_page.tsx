import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Clock,
  Send,
  Sparkles,
  Bot,
  Activity,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  senderName: string;
  avatarInitials: string;
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: 'user',
    senderName: 'Minh Tran',
    avatarInitials: 'MT',
    text: 'Fixed windows allow a burst of 2x the limit across the boundary. Token bucket smooths that because refill is continuous.',
    time: '27:45'
  },
  {
    id: 2,
    sender: 'ai',
    senderName: 'AI Interviewer',
    avatarInitials: 'AI',
    text: "Correct. Now let's make it distributed across three regions with 20ms replication lag. How do you keep the limit approximately global?",
    time: '27:14'
  }
];

export function InterviewWorkspacePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  // Media States
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Chat & Session States
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(27 * 60 + 14); // 27:14
  const [showEndModal, setShowEndModal] = useState<boolean>(false);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Real Camera Access Hook
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCamOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          setCameraStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraStream(null);
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCamOn]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      senderName: user?.fullName || 'Candidate',
      avatarInitials: user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'C',
      text: inputText.trim(),
      time: formatTimer(secondsRemaining)
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAiResponding(true);

    setTimeout(() => {
      setIsAiResponding(false);
      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        senderName: 'AI Interviewer',
        avatarInitials: 'AI',
        text: 'Excellent insight on token allocation! Next, if one region suffers a temporary network partition, how would your rate limiter handle local fallbacks without causing split-brain overages?',
        time: formatTimer(secondsRemaining - 2)
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1800);
  };

  const handleConfirmEnd = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setShowEndModal(false);
    toast.success('Interview session concluded! Generating evaluation report...');
    navigate(`/interview/report/${sessionId || 'session-001'}`);
  };

  return (
    <div className="w-full bg-slate-100 flex flex-col justify-start items-start font-['Inter'] antialiased">
      
      {/* 1. HERO BANNER */}
      <div className="self-stretch px-6 lg:px-12 py-4 bg-gradient-to-r from-indigo-900 to-indigo-950 flex justify-between items-center text-white border-b border-indigo-800/60 shadow-xs">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-white text-2xl lg:text-3xl font-bold tracking-tight">AI Mock Interview</h1>
          <div className="opacity-80 text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-2">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/interview" className="hover:underline">AI Interview</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">Live Session</span>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          <span className="text-rose-400 text-xs sm:text-sm font-bold tracking-wide">Live Session</span>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN WORKSPACE */}
      <div className="max-w-[1680px] w-full mx-auto px-6 lg:px-10 pt-6 pb-10 flex flex-col xl:flex-row justify-start items-start gap-8">
        
        {/* LEFT COLUMN: Camera Feed + Directly Attached Control Bar */}
        <div className="flex-[62] w-full flex flex-col items-center gap-5 min-w-0">
          
          {/* CAMERA PREVIEW FRAME */}
          <div className="w-full h-[480px] lg:h-[540px] 2xl:h-[580px] bg-zinc-950 rounded-3xl overflow-hidden relative shadow-xl border border-zinc-800 flex items-center justify-center">
            
            {isCamOn && cameraStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              /* Fallback Candidate Avatar when Camera is Off */
              <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-indigo-900/60 border-2 border-indigo-500/40 flex items-center justify-center text-white text-3xl font-bold font-mono shadow-inner">
                  {user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-200 text-base lg:text-lg font-bold">{user?.fullName || 'Candidate'}</span>
                  <span className="text-zinc-500 text-xs font-medium">Camera preview inactive · Audio channel ready</span>
                </div>
              </div>
            )}

            {/* Candidate Tag & Resolution Overlay (Top Left) */}
            <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2.5 text-xs text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{user?.fullName || 'Candidate'} (Candidate)</span>
              <span className="text-white/30">•</span>
              <span className="text-white/70 font-mono text-[11px]">1080p HD</span>
            </div>

            {/* Audio Wave Visualizer Overlay (Bottom Left) */}
            <div className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2 text-xs text-white shadow-sm">
              <Mic className={`w-3.5 h-3.5 ${isMicOn ? 'text-emerald-400' : 'text-rose-400'}`} />
              <div className="flex items-center gap-0.5 h-3">
                <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${isMicOn ? 'h-3 animate-pulse' : 'h-1 bg-zinc-600'}`} />
                <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${isMicOn ? 'h-2 animate-pulse delay-75' : 'h-1 bg-zinc-600'}`} />
                <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${isMicOn ? 'h-3.5 animate-pulse delay-150' : 'h-1 bg-zinc-600'}`} />
                <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${isMicOn ? 'h-1.5 animate-pulse' : 'h-1 bg-zinc-600'}`} />
              </div>
              <span className="text-[10px] text-white/60 font-mono ml-1">{isMicOn ? 'Live' : 'Muted'}</span>
            </div>

            {/* AI Evaluation Probing Indicator (Top Right) */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-indigo-950/70 backdrop-blur-md rounded-xl border border-indigo-500/30 flex items-center gap-1.5 text-xs text-indigo-200">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="text-[11px] font-medium">AI Analyzing Tone &amp; Clarity</span>
            </div>

          </div>

          {/* 3 CIRCULAR FLOATING MEDIA CONTROLS */}
          <div className="flex items-center justify-center gap-6">
            
            {/* Mic Button */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                isMicOn
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* Camera Button */}
            <button
              onClick={() => setIsCamOn(!isCamOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                isCamOn
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20'
              }`}
              title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            {/* End Call / Submit Button */}
            <button
              onClick={() => setShowEndModal(true)}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 cursor-pointer"
              title="End Interview & Submit"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

          </div>

        </div>

        {/* RIGHT COLUMN: AI Interviewer Chat */}
        <div className="flex-[38] w-full bg-white rounded-3xl border border-neutral-200 shadow-md flex flex-col justify-between overflow-hidden h-[556px] lg:h-[616px] 2xl:h-[656px]">
          
          {/* Card Header: AI Profile + 27:14 Countdown Clock */}
          <div className="px-6 py-4 border-b border-neutral-200 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-indigo-900 shrink-0 shadow-2xs">
                <Bot className="w-5 h-5 text-indigo-900" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-slate-800 text-base font-bold leading-tight">
                  AI Interviewer
                </h3>
                <span className="text-gray-500 text-xs font-normal">
                  Adaptive · System design track
                </span>
              </div>
            </div>

            {/* Clock Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-gray-700 font-semibold font-mono text-xs shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          {/* Messages Transcript Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                      isUser ? 'bg-gray-100 text-slate-800 border border-neutral-200 font-mono' : 'bg-violet-100 text-indigo-900 font-mono'
                    }`}
                  >
                    {msg.avatarInitials}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-900 text-slate-50 rounded-tl-2xl rounded-tr-xs rounded-bl-2xl rounded-br-2xl shadow-sm'
                        : 'bg-slate-100 text-slate-900 rounded-tl-xs rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 block font-mono ${isUser ? 'text-indigo-200 text-right' : 'text-neutral-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {isAiResponding && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-100 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0">
                  AI
                </div>
                <div className="p-4 bg-slate-100 rounded-tl-xs rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-xs text-neutral-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-900 animate-spin" />
                  <span>Evaluating answer and formulating adaptive follow-up…</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 bg-white flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your technical answer here…"
              className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl border border-neutral-200 text-xs sm:text-sm text-zinc-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-900"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiResponding}
              className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-950 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* 3. CUSTOM BLURRED BACKDROP MODAL FOR ENDING INTERVIEW */}
      {showEndModal && (
        <div
          onClick={() => setShowEndModal(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 flex flex-col items-center text-center gap-5 relative animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Close cross icon */}
            <button
              onClick={() => setShowEndModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-zinc-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Header */}
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
              <PhoneOff className="w-7 h-7" />
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-zinc-900">
                End AI Mock Interview?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Do you want to conclude the current session? Your responses will be finalized and sent to AI engine to generate your comprehensive performance scorecard.
              </p>
            </div>

            {/* Session Stats Summary Card */}
            <div className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-medium text-neutral-600">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">Time Left</span>
                <span className="font-mono font-bold text-zinc-900">{formatTimer(secondsRemaining)}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">Responses</span>
                <span className="font-mono font-bold text-indigo-900">{messages.filter(m => m.sender === 'user').length} submitted</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">Track</span>
                <span className="font-bold text-zinc-900">System Design</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-zinc-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Continue Session
              </button>
              <button
                type="button"
                onClick={handleConfirmEnd}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Yes, End &amp; Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
