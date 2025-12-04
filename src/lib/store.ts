import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    isRecording: boolean;
    transcript: { role: 'user' | 'interviewer'; text: string; timestamp: number }[];
    suggestions: string;
    resumeText: string;
    manualContext: string;
    triggerAI: number; // Timestamp to force trigger
    isMicOn: boolean;
    userApiKey: string;
    setRecording: (status: boolean) => void;
    setMicOn: (status: boolean) => void;
    setUserApiKey: (key: string) => void;
    addTranscript: (role: 'user' | 'interviewer', text: string) => void;
    setSuggestions: (text: string) => void;
    appendSuggestion: (text: string) => void;
    setResumeText: (text: string) => void;
    setManualContext: (text: string) => void;
    setTriggerAI: () => void;
    aiHistory: { text: string; timestamp: number }[];
    isStreaming: boolean;
    theme: 'light' | 'dark';
    addToHistory: (text: string) => void;
    clearHistory: () => void;
    setIsStreaming: (status: boolean) => void;
    toggleTheme: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            isRecording: false,
            transcript: [],
            suggestions: '',
            resumeText: '',
            manualContext: '',
            triggerAI: 0,
            isMicOn: false,
            userApiKey: '',
            aiHistory: [],
            isStreaming: false,
            theme: 'dark', // Default
            setRecording: (isRecording) => set({ isRecording }),
            setMicOn: (isMicOn) => set({ isMicOn }),
            setUserApiKey: (userApiKey) => set({ userApiKey }),
            addTranscript: (role, text) =>
                set((state) => ({
                    transcript: [...state.transcript, { role, text, timestamp: Date.now() }],
                })),
            setSuggestions: (suggestions) => set({ suggestions }),
            appendSuggestion: (text) => set((state) => ({ suggestions: state.suggestions + text })),
            setResumeText: (text) => set({ resumeText: text }),
            setManualContext: (text) => set({ manualContext: text }),
            setTriggerAI: () => set({ triggerAI: Date.now() }),
            addToHistory: (text) => set((state) => ({ aiHistory: [...state.aiHistory, { text, timestamp: Date.now() }] })),
            clearHistory: () => set({ aiHistory: [] }),
            setIsStreaming: (isStreaming) => set({ isStreaming }),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
        }),
        {
            name: 'interview-copilot-storage',
            partialize: (state) => ({ theme: state.theme, userApiKey: state.userApiKey }),
        }
    )
);
