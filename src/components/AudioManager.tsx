'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export function AudioManager() {
    const { isRecording, isMicOn, addTranscript } = useStore();
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognitionClass = window.webkitSpeechRecognition;
            const recognition = new SpeechRecognitionClass();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        addTranscript('user', event.results[i][0].transcript);
                    }
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };

            recognitionRef.current = recognition;
        }
    }, [addTranscript]);

    useEffect(() => {
        const shouldRecord = isRecording || isMicOn;
        if (shouldRecord && recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch {
                console.log('Recognition already started');
            }
        } else if (!shouldRecord && recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, [isRecording, isMicOn]);

    return null; // This component is invisible
}
