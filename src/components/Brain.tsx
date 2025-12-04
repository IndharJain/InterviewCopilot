'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { generateAnswer } from '@/lib/gemini';
import { DEFAULT_GEMINI_API_KEY } from '@/lib/config';

export function Brain() {
    const { isRecording, transcript, suggestions, setSuggestions, appendSuggestion, resumeText, manualContext, triggerAI, userApiKey, addToHistory } = useStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const [lastProcessedIndex, setLastProcessedIndex] = useState(0);
    const [lastAnalyzedText, setLastAnalyzedText] = useState('');

    // 1. Screen Capture Logic
    useEffect(() => {
        async function startCapture() {
            // Check for mobile device (User Agent + Screen Width)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;

            if (isRecording && !streamRef.current) {
                if (isMobile) {
                    console.log("Mobile device detected (UA or Width). Skipping screen capture, using audio only.");
                    return;
                }

                try {
                    const stream = await navigator.mediaDevices.getDisplayMedia({
                        video: { width: 1280, height: 720 },
                        audio: true, // Capture system audio
                    });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }

                    // Start Audio Recording
                    const audioTracks = stream.getAudioTracks();
                    if (audioTracks.length > 0) {
                        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
                        const mediaRecorder = new MediaRecorder(stream, { mimeType });
                        mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0) {
                                audioChunksRef.current.push(event.data);
                            }
                        };
                        try {
                            mediaRecorder.start(1000); // Collect chunks every second
                            mediaRecorderRef.current = mediaRecorder;
                        } catch (e) {
                            console.error("MediaRecorder start failed", e);
                        }
                    } else {
                        console.warn("No system audio detected. Make sure to check 'Share audio' in the browser dialog.");
                    }

                } catch (err) {
                    console.error("Error starting screen capture:", err);
                    // If screen share is cancelled or fails, we should probably stop recording state
                    // But for now, let's just log it.
                }
            } else if (!isRecording && streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
                if (mediaRecorderRef.current) {
                    mediaRecorderRef.current.stop();
                    mediaRecorderRef.current = null;
                }
                audioChunksRef.current = [];
            }
        }
        startCapture();
    }, [isRecording]);

    const isProcessingRef = useRef(false);

    // 2. AI Trigger Logic
    const performAnalysis = useCallback(async () => {
        if (isProcessingRef.current) {
            console.log("Skipping AI analysis - Already processing.");
            return;
        }

        // Use user-provided API key or default fallback
        const effectiveApiKey = userApiKey || DEFAULT_GEMINI_API_KEY;

        // Removed isRecording check to allow manual triggers without screen share

        const currentTranscript = transcript;
        // Optimization: Take only the last 3000 characters to save tokens and avoid rate limits
        const fullText = currentTranscript.map((t: { text: string }) => t.text).join(' ');
        const newText = fullText.slice(-3000);

        // Smart Check: If text hasn't changed and no manual context, skip
        const combinedText = newText + manualContext;
        if (combinedText === lastAnalyzedText && !triggerAI) {
            console.log("Skipping AI analysis - No new context.");
            return;
        }
        setLastAnalyzedText(combinedText);
        isProcessingRef.current = true;

        // Capture Frame
        let imageBase64 = null;
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 640, 360);
                imageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.7);
            }
        }

        const handleAIResponse = async (audioBase64: string | null) => {
            // Move current suggestions to history if exists
            // Prevent adding duplicate error messages to history
            const lastHistoryItem = useStore.getState().aiHistory.slice(-1)[0];
            const isLastError = lastHistoryItem?.text.includes('Rate Limit');

            if (suggestions && suggestions.trim()) {
                // If the current suggestion is an error and the last history item is also an error, don't add it
                if (!(isLastError && suggestions.includes('Rate Limit'))) {
                    addToHistory(suggestions);
                }
            }
            setSuggestions(''); // Clear for new stream
            useStore.getState().setIsStreaming(true);

            await generateAnswer(effectiveApiKey, newText, imageBase64, audioBase64, resumeText, manualContext, (chunk: string) => {
                appendSuggestion(chunk);
            });
            useStore.getState().setIsStreaming(false);
            isProcessingRef.current = false;
        };

        // Capture Audio Blob
        if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            audioChunksRef.current = []; // Clear buffer
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const audioBase64 = reader.result as string;
                console.log("Triggering AI (Audio)...");
                await handleAIResponse(audioBase64);
            };
        } else {
            console.log("Triggering AI (No Audio)...");
            await handleAIResponse(null);
        }
    }, [isRecording, transcript, resumeText, manualContext, suggestions, setSuggestions, appendSuggestion, lastAnalyzedText, triggerAI, userApiKey, addToHistory]);

    // Auto-trigger every 20 seconds
    useEffect(() => {
        if (!isRecording) return;
        const interval = setInterval(performAnalysis, 30000);
        return () => clearInterval(interval);
    }, [isRecording, performAnalysis]);

    // Manual Trigger
    // Manual Trigger
    // Manual Trigger
    const lastTriggerRef = useRef(triggerAI);
    useEffect(() => {
        if (triggerAI > lastTriggerRef.current) {
            lastTriggerRef.current = triggerAI;
            console.log("Manual Trigger Activated!");
            performAnalysis();
        }
    }, [triggerAI, performAnalysis]);

    return (
        <div className="hidden">
            <video ref={videoRef} muted playsInline />
            <canvas ref={canvasRef} width={640} height={360} />
        </div>
    );
}
