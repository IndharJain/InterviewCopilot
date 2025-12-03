'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export function ScreenWatcher() {
    const { isRecording } = useStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        async function startCapture() {
            if (isRecording && !streamRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getDisplayMedia({
                        video: { width: 1280, height: 720 }, // 720p is enough for AI
                        audio: true, // Capture system audio too!
                    });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                } catch (err) {
                    console.error("Error starting screen capture:", err);
                }
            } else if (!isRecording && streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }

        startCapture();
    }, [isRecording]);

    // Function to capture a frame (to be called by the AI loop)
    // We can expose this via a ref or store, but for now let's just keep it ready.

    return (
        <div className="hidden">
            <video ref={videoRef} muted playsInline />
            <canvas ref={canvasRef} />
        </div>
    );
}
