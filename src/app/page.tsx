'use client';

import { useState, useRef, useEffect } from 'react';
import { AudioManager } from '@/components/AudioManager';
import { Brain } from '@/components/Brain';
import { useStore } from '@/lib/store';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { Tooltip } from '@/components/Tooltip';
import { Mic, MicOff, Play, Square, Cpu, Sparkles, MessageSquareText, Bot, Settings, Menu, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { UserButton, useUser } from "@clerk/nextjs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Custom Code Block Renderer
// Custom Code Block Renderer
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-300 transition-colors"
          title="Copy code"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="rounded-lg !bg-black/50 !p-4 !m-0"
        {...props}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={clsx("bg-neutral-800/50 rounded px-1 py-0.5 text-cyan-300 font-mono text-sm", className)} {...props}>
      {children}
    </code>
  );
};

export default function Home() {
  const { user } = useUser();
  const { isRecording, setRecording, isMicOn, setMicOn, transcript, addTranscript, suggestions, resumeText, setResumeText, manualContext, setManualContext, aiHistory, isStreaming } = useStore();
  const [activeTab, setActiveTab] = useState<'transcript' | 'ai'>('transcript');
  const aiContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of AI suggestions
  useEffect(() => {
    if (aiContainerRef.current) {
      aiContainerRef.current.scrollTop = aiContainerRef.current.scrollHeight;
    }
  }, [aiHistory, suggestions]);

  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of Transcript
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let text = '';
      if (file.type === 'application/pdf') {
        try {
          text = await extractTextFromPDF(file);
        } catch (err) {
          console.error("PDF Parse Error", err);
          alert("Could not parse PDF. Please try a text file.");
        }
      } else {
        text = await file.text();
      }
      if (text) setResumeText(text);
    }
  };







  return (
    <main className="h-[100dvh] overflow-hidden text-neutral-200 font-sans flex flex-col pt-20 lg:pt-24 px-4 lg:px-6 pb-24 lg:pb-6 gap-4 lg:gap-8 selection:bg-cyan-500/30">
      {/* Header */}
      {/* Premium Glass Header */}
      <header className="fixed top-0 left-0 right-0 h-16 lg:h-20 z-50 flex items-center justify-between px-4 lg:px-10 bg-black/40 backdrop-blur-xl border-b border-white/5 transition-all duration-300">

        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <Cpu className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white leading-none">
              Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Copilot</span>
            </h1>
            <span className="text-[10px] font-medium text-neutral-500 tracking-widest uppercase mt-0.5">AI Assistant</span>
          </div>
        </div>

        {/* Mobile Status Indicator */}
        <div className="flex lg:hidden items-center gap-2 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-white/5">
          <div className={clsx("w-1.5 h-1.5 rounded-full", (isRecording || isMicOn) ? "bg-green-500 animate-pulse" : "bg-neutral-600")} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{(isRecording || isMicOn) ? "Live" : "Ready"}</span>
        </div>

        {/* Center Actions (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-4 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          {/* Status Pill */}
          <Tooltip content="Current System Status" position="bottom">
            <div className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
              (isRecording || isMicOn) ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-neutral-800/50 border-white/5 text-neutral-500"
            )}>
              <div className={clsx("w-1.5 h-1.5 rounded-full", (isRecording || isMicOn) ? "bg-green-500 animate-pulse" : "bg-neutral-600")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{(isRecording || isMicOn) ? "Live" : "Ready"}</span>
            </div>
          </Tooltip>

          <div className="w-[1px] h-6 bg-white/10" />

          {/* Resume Upload */}
          <Tooltip content="Upload your resume for tailored answers" position="bottom">
            <label className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/50 border border-white/5 hover:bg-neutral-800 hover:border-white/10 transition-all cursor-pointer">
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
              <div className={clsx("w-2 h-2 rounded-full", resumeText ? "bg-cyan-500" : "bg-neutral-600")} />
              <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">Resume</span>
            </label>
          </Tooltip>

          <div className="w-[1px] h-6 bg-white/10" />

          {/* Ask AI Button */}
          <Tooltip content="Manually trigger AI analysis" position="bottom">
            <button
              onClick={() => {
                if (!isRecording && !isMicOn) setMicOn(true);
                useStore.getState().setTriggerAI();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-purple-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Ask AI</span>
            </button>
          </Tooltip>

          {/* Start/Stop Button */}
          <Tooltip content={isRecording ? "Stop Session" : "Start Session"} position="bottom">
            <button
              onClick={() => {
                if (isRecording) {
                  setRecording(false);
                  setMicOn(false);
                } else {
                  setRecording(true);
                }
              }}
              className={clsx(
                "flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                  : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20"
              )}
            >
              {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRecording ? "Stop" : "Start"}</span>
            </button>
          </Tooltip>
        </div>

        {/* Right: Account & Upgrade */}
        <div className="hidden lg:flex items-center gap-4">
          {/* API Key Input (For Non-Admins) */}
          {user?.primaryEmailAddress?.emailAddress !== 'indharjain@gmail.com' && (
            <div className="hidden md:flex items-center gap-2">
              <input
                type="password"
                placeholder="Enter Gemini API Key"
                className="bg-neutral-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 w-40"
                onChange={(e) => useStore.getState().setUserApiKey(e.target.value)}
              />
            </div>
          )}

          {/* Upgrade Button */}
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/50 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 group">
            <span className="text-xs font-bold text-amber-500 tracking-wide uppercase group-hover:text-amber-400 transition-colors">Upgrade to Pro</span>
          </button>

          {/* User Profile */}
          <div className="pl-2 border-l border-white/10">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-white/10 hover:border-cyan-500/50 transition-colors"
              }
            }} />
          </div>
        </div>
      </header>

      {/* Mobile Tabs Removed - Using Bottom Nav */}

      {/* Main Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-8 flex-1 min-h-0 relative pb-24 lg:pb-0">

        {/* Left: Transcript */}
        <div className={clsx(
          "flex-col gap-4 bg-black/20 rounded-3xl p-4 lg:p-6 border border-white/5 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden shadow-2xl shadow-black/50",
          activeTab === 'transcript' ? "flex flex-1" : "hidden lg:flex"
        )}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Live Transcript</h2>
            <div className="flex items-center gap-2">
              <span className={clsx("w-2 h-2 rounded-full", (isRecording || isMicOn) ? "bg-green-500 animate-pulse" : "bg-neutral-700")} />
              <span className="text-xs text-neutral-500">{(isRecording || isMicOn) ? "Listening..." : "Idle"}</span>
            </div>
          </div>

          <div
            ref={transcriptContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          >
            {transcript.length === 0 && (
              <div className="text-neutral-600 text-center mt-20 italic">
                Start the session and speak to see the transcript here...
              </div>
            )}
            {transcript.map((t, i) => (
              <div key={i} className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-xs font-bold text-neutral-500 uppercase">{t.role}</span>
                <p className="text-neutral-300 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>

          {/* Manual Context Input */}
          <div className="mt-auto pt-4 border-t border-neutral-800">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">
              Manual Context / Specific Question
            </label>
            <div className="relative group">
              <textarea
                placeholder="Type a question..."
                className="w-full bg-neutral-950/50 text-neutral-300 text-sm p-3 pr-12 rounded-xl border border-neutral-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none resize-none h-12 lg:h-24 transition-all placeholder:text-neutral-600"
                value={manualContext}
                onChange={(e) => setManualContext(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (manualContext.trim()) {
                      addTranscript('user', manualContext);
                      useStore.getState().setTriggerAI();
                      setManualContext(''); // Clear input
                      setActiveTab('ai');
                    }
                  }
                }}
              />
              <div className="absolute bottom-1.5 right-1.5 flex gap-2">
                <button
                  onClick={() => {
                    if (manualContext.trim()) {
                      addTranscript('user', manualContext);
                      useStore.getState().setTriggerAI();
                      setManualContext(''); // Clear input
                      setActiveTab('ai');
                    }
                  }}
                  disabled={!manualContext.trim()}
                  className="bg-cyan-500 text-black p-2 rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Brain */}
        <div className={clsx(
          "flex-col gap-4 bg-black/20 rounded-3xl p-4 lg:p-6 border border-white/5 backdrop-blur-2xl relative overflow-hidden transition-all duration-300 shadow-2xl shadow-black/50",
          activeTab === 'ai' ? "flex flex-1" : "hidden lg:flex"
        )}>
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              AI Suggestions
            </h2>
          </div>

          <div
            ref={aiContainerRef}
            className="flex-1 overflow-y-auto relative z-10 pr-2 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent space-y-4"
          >


            {/* History Items */}
            {aiHistory.map((item, index) => (
              <div key={index} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-lg group hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Answered at {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                      // Visual feedback could be added here if needed, but simple copy is often enough
                    }}
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy full answer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-neutral-300 prose-headings:text-neutral-200 prose-code:text-cyan-300 prose-pre:bg-black/50">
                  <ReactMarkdown components={{ code: CodeBlock }}>{item.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Current Streaming Response */}
            {suggestions && (
              <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-xl p-4 shadow-[0_0_15px_rgba(6,182,212,0.1)] animate-in fade-in slide-in-from-bottom-2 duration-300 group">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-cyan-500/10">
                  <div className="flex items-center gap-2">
                    {isStreaming ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          Thinking / Typing...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          AI Answer
                        </span>
                      </>
                    )}
                  </div>
                  {!isStreaming && (
                    <button
                      onClick={() => navigator.clipboard.writeText(suggestions)}
                      className="p-1.5 rounded-lg hover:bg-cyan-900/30 text-cyan-500/70 hover:text-cyan-400 transition-colors"
                      title="Copy full answer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-cyan-100/90 prose-headings:text-cyan-300 prose-code:text-cyan-300 prose-pre:bg-black/50">
                  <ReactMarkdown components={{ code: CodeBlock }}>{suggestions}</ReactMarkdown>
                </div>
              </div>
            )}

            {!suggestions && aiHistory.length === 0 && (
              <div className="text-neutral-600 text-center mt-20 italic">
                AI is waiting for context...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Controls */}
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 lg:hidden z-50 flex items-center justify-around px-6 pb-2">

        {/* Transcript Tab */}
        <button
          onClick={() => setActiveTab('transcript')}
          className={clsx("flex flex-col items-center gap-1 transition-colors", activeTab === 'transcript' ? "text-cyan-400" : "text-neutral-500")}
        >
          <MessageSquareText className="w-6 h-6" />
          <span className="text-[10px] font-medium">Transcript</span>
        </button>

        {/* FAB - Start/Stop */}
        <button
          onClick={() => {
            if (isRecording || isMicOn) {
              setRecording(false);
              setMicOn(false);
              // Trigger AI when stopping
              useStore.getState().setTriggerAI();
              setActiveTab('ai');
            } else {
              setRecording(true);
              setActiveTab('transcript');
            }
          }}
          className={clsx(
            "relative -top-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 border-4 border-neutral-950",
            (isRecording || isMicOn) ? "bg-red-500 text-white shadow-red-500/40" : "bg-cyan-500 text-black shadow-cyan-500/40"
          )}
        >
          {(isRecording || isMicOn) ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        {/* AI Tab */}
        <button
          onClick={() => setActiveTab('ai')}
          className={clsx("flex flex-col items-center gap-1 transition-colors", activeTab === 'ai' ? "text-purple-400" : "text-neutral-500")}
        >
          <Bot className="w-6 h-6" />
          <span className="text-[10px] font-medium">AI Copilot</span>
        </button>
      </div>

      {/* Hidden Components */}
      <AudioManager />
      <Brain />
    </main >
  );
}

