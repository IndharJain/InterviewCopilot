'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AudioManager } from '@/components/AudioManager';
import { Brain } from '@/components/Brain';
import { useStore } from '@/lib/store';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { Tooltip } from '@/components/Tooltip';
import { Play, Square, Cpu, Sparkles, MessageSquareText, Bot, Copy, Check, Sun, Moon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Custom Code Block Renderer
// Custom Code Block Renderer
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const [isCopied, setIsCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, '');
  const { theme } = useStore();

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
          className="p-1.5 rounded-lg bg-card-bg hover:bg-glass-highlight text-muted hover:text-foreground transition-colors"
          title="Copy code"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <SyntaxHighlighter
        style={theme === 'dark' ? vscDarkPlus : vs}
        language={match[1]}
        PreTag="div"
        className="rounded-lg !bg-card-bg !p-4 !m-0"
        {...props}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={clsx("bg-input-bg rounded px-1 py-0.5 text-accent-primary font-mono text-sm", className)} {...props}>
      {children}
    </code>
  );
};

export default function Home() {
  const { isRecording, setRecording, isMicOn, setMicOn, transcript, addTranscript, suggestions, resumeText, setResumeText, manualContext, setManualContext, aiHistory, isStreaming, theme, toggleTheme } = useStore();
  const [activeTab, setActiveTab] = useState<'transcript' | 'ai'>('transcript');
  const aiContainerRef = useRef<HTMLDivElement>(null);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

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
    <main className="h-[100dvh] overflow-hidden text-foreground font-sans flex flex-col pt-20 lg:pt-24 px-4 lg:px-6 pb-24 lg:pb-6 gap-4 lg:gap-8 selection:bg-accent-primary/30">
      {/* Header */}
      {/* Premium Glass Header */}
      <header className="fixed top-0 left-0 right-0 h-16 lg:h-20 z-50 flex items-center justify-between px-4 lg:px-10 glass-panel border-b-0 rounded-b-2xl lg:rounded-b-none lg:border-b lg:border-glass-border transition-all duration-300">

        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-xl overflow-hidden shadow-lg shadow-accent-primary/20 group-hover:shadow-accent-primary/40 transition-all duration-300">
            <Image
              src="/ICB.jpg"
              alt="Interview Copilot Logo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-glass-highlight rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-foreground leading-none">
              Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Copilot</span>
            </h1>
            <span className="text-[10px] font-medium text-muted tracking-widest uppercase mt-0.5">AI Assistant</span>
          </div>
        </div>

        {/* Mobile Status Indicator */}
        <div className="flex lg:hidden items-center gap-2 bg-glass-bg px-3 py-1.5 rounded-full border border-glass-border">
          <div className={clsx("w-1.5 h-1.5 rounded-full", (isRecording || isMicOn) ? "bg-green-500 animate-pulse" : "bg-muted")} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{(isRecording || isMicOn) ? "Live" : "Ready"}</span>
        </div>

        {/* Center Actions (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-4 bg-glass-bg px-2 py-1.5 rounded-full border border-glass-border backdrop-blur-md">
          {/* Status Pill */}
          <Tooltip content="Current System Status" position="bottom">
            <div className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
              (isRecording || isMicOn) ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-glass-highlight border-glass-border text-muted"
            )}>
              <div className={clsx("w-1.5 h-1.5 rounded-full", (isRecording || isMicOn) ? "bg-green-500 animate-pulse" : "bg-muted")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{(isRecording || isMicOn) ? "Live" : "Ready"}</span>
            </div>
          </Tooltip>

          <div className="w-[1px] h-6 bg-glass-border" />

          {/* Resume Upload */}
          <Tooltip content="Upload your resume for tailored answers" position="bottom">
            <label className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-bg border border-glass-border hover:bg-glass-highlight hover:border-glass-border transition-all cursor-pointer">
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
              <div className={clsx("w-2 h-2 rounded-full", resumeText ? "bg-accent-primary" : "bg-muted")} />
              <span className="text-xs font-medium text-muted group-hover:text-foreground transition-colors">Resume</span>
            </label>
          </Tooltip>

          <div className="w-[1px] h-6 bg-glass-border" />

          {/* Ask AI Button */}
          <Tooltip content="Manually trigger AI analysis" position="bottom">
            <button
              onClick={() => {
                if (!isRecording && !isMicOn) setMicOn(true);
                useStore.getState().setTriggerAI();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-accent-secondary hover:text-foreground hover:bg-accent-secondary/10 transition-all duration-300"
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
                  : "bg-accent-primary hover:bg-accent-primary/80 text-white shadow-accent-primary/20"
              )}
            >
              {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRecording ? "Stop" : "Start"}</span>
            </button>
          </Tooltip>
        </div>

        {/* Right: Account & Upgrade & Theme */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-glass-highlight text-muted hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* API Key Input */}
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Enter Gemini API Key"
              className="bg-input-bg border border-input-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-cyan-500 w-40 placeholder:text-muted"
              onChange={(e) => useStore.getState().setUserApiKey(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Tabs Removed - Using Bottom Nav */}

      {/* Main Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-8 flex-1 min-h-0 relative pb-24 lg:pb-0">

        {/* Left: Transcript */}
        <div className={clsx(
          "flex-col gap-4 glass-panel rounded-3xl p-4 lg:p-6 transition-all duration-300 relative overflow-hidden",
          activeTab === 'transcript' ? "flex flex-1" : "hidden lg:flex"
        )}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Live Transcript</h2>
            <div className="flex items-center gap-2">
              <span className={clsx("w-2 h-2 rounded-full", (isRecording || isMicOn) ? "bg-green-500 animate-pulse" : "bg-muted")} />
              <span className="text-xs text-muted">{(isRecording || isMicOn) ? "Listening..." : "Idle"}</span>
            </div>
          </div>

          <div
            ref={transcriptContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          >
            {transcript.length === 0 && (
              <div className="text-muted text-center mt-20 italic">
                Start the session and speak to see the transcript here...
              </div>
            )}
            {transcript.map((t, i) => (
              <div key={i} className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-xs font-bold text-muted uppercase">{t.role}</span>
                <p className="text-foreground leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>

          {/* Manual Context Input */}
          <div className="mt-auto pt-4 border-t border-glass-border">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3 block pl-1">
              Manual Context / Specific Question
            </label>
            <div className="relative group">
              <textarea
                placeholder="Type a question or paste context..."
                className="w-full bg-input-bg text-foreground text-sm p-4 pr-14 rounded-2xl border border-input-border focus:border-cyan-500/50 focus:bg-input-bg focus:outline-none resize-none h-24 transition-all placeholder:text-muted backdrop-blur-md shadow-inner"
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
              <div className="absolute bottom-3 right-3 flex gap-2">
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
                  className="bg-accent-primary/10 hover:bg-accent-primary text-accent-primary hover:text-white border border-accent-primary/20 hover:border-accent-primary p-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-md"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Brain */}
        <div className={clsx(
          "flex-col gap-4 glass-panel rounded-3xl p-4 lg:p-6 relative overflow-hidden transition-all duration-300",
          activeTab === 'ai' ? "flex flex-1" : "hidden lg:flex"
        )}>
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-sm font-semibold text-accent-primary uppercase tracking-wider flex items-center gap-2">
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
              <div key={index} className="bg-card-bg border border-glass-border rounded-2xl p-5 shadow-sm group hover:bg-glass-highlight transition-colors">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-glass-border">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    Answered at {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                      // Visual feedback could be added here if needed, but simple copy is often enough
                    }}
                    className="p-1.5 rounded-lg hover:bg-glass-highlight text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy full answer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="prose prose-sm max-w-none prose-p:text-foreground prose-headings:text-foreground prose-code:text-accent-primary prose-pre:bg-card-bg prose-pre:text-foreground">
                  <ReactMarkdown components={{ code: CodeBlock }}>{item.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Current Streaming Response */}
            {suggestions && (
              <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-4 shadow-[0_0_15px_rgba(59,130,246,0.1)] animate-in fade-in slide-in-from-bottom-2 duration-300 group">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-accent-primary/10">
                  <div className="flex items-center gap-2">
                    {isStreaming ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                        </span>
                        <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">
                          Thinking / Typing...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-accent-primary" />
                        <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">
                          AI Answer
                        </span>
                      </>
                    )}
                  </div>
                  {!isStreaming && (
                    <button
                      onClick={() => navigator.clipboard.writeText(suggestions)}
                      className="p-1.5 rounded-lg hover:bg-accent-primary/10 text-accent-primary/70 hover:text-accent-primary transition-colors"
                      title="Copy full answer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="prose prose-sm max-w-none prose-p:text-foreground prose-headings:text-accent-primary prose-code:text-accent-primary prose-pre:bg-card-bg prose-pre:text-foreground">
                  <ReactMarkdown components={{ code: CodeBlock }}>{suggestions}</ReactMarkdown>
                </div>
              </div>
            )}

            {!suggestions && aiHistory.length === 0 && (
              <div className="text-muted text-center mt-20 italic">
                AI is waiting for context...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Controls */}
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-glass-border lg:hidden z-50 flex items-center justify-around px-6 pb-2 rounded-t-3xl border-x-0 border-b-0">

        {/* Transcript Tab */}
        <button
          onClick={() => setActiveTab('transcript')}
          className={clsx("flex flex-col items-center gap-1 transition-colors", activeTab === 'transcript' ? "text-accent-primary" : "text-muted")}
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
            "relative -top-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 border-4 border-background",
            (isRecording || isMicOn) ? "bg-red-500 text-white shadow-red-500/40" : "bg-accent-primary text-white shadow-accent-primary/40"
          )}
        >
          {(isRecording || isMicOn) ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        {/* AI Tab */}
        <button
          onClick={() => setActiveTab('ai')}
          className={clsx("flex flex-col items-center gap-1 transition-colors", activeTab === 'ai' ? "text-accent-secondary" : "text-muted")}
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

