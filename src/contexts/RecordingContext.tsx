"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface RecordingContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  transcription: string;
  interimTranscription: string;
  recordedAudioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export function RecordingProvider({ children }: { children: React.ReactNode }) {
  const { audioLimitMinutes, audioRemainingMinutes } = useAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [interimTranscription, setInterimTranscription] = useState("");
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    let int: any;
    if (isRecording && !isPaused) {
      int = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    }
    return () => clearInterval(int);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    if (audioLimitMinutes !== Infinity && audioRemainingMinutes <= 0) {
      alert(
        `Votre quota de transcription audio est épuisé pour ce mois (${audioLimitMinutes} min). Mettez à niveau votre formule.`
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
          sampleSize: 16,
        },
      });

      const audioContext = new window.AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 3.0; // Amplification x3
      const destination = audioContext.createMediaStreamDestination();
      source.connect(gainNode);
      gainNode.connect(destination);
      const boostedStream = destination.stream;

      const mediaRecorder = new MediaRecorder(boostedStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert(
          "Votre navigateur ne supporte pas la reconnaissance vocale (essayez Chrome ou Safari)."
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "fr-FR";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscription((prev) => prev + finalTranscript);
        setInterimTranscription(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Erreur de reconnaissance vocale", event.error);
      };

      recognition.onend = () => {
        // Relancer si l'utilisateur n'a pas explicitement arrêté ET pas en pause
        if (recognitionRef.current && isRecordingRef.current && !isPausedRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Ignore start errors
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      mediaRecorder.start();

      isRecordingRef.current = true;
      isPausedRef.current = false;
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordedAudioBlob(null);
      setTranscription("");
      setInterimTranscription("");
    } catch (err) {
      console.error("Erreur accès microphone", err);
      alert("Impossible de démarrer l'enregistrement.");
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    isPausedRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    setInterimTranscription("");
  };

  const pauseRecording = () => {
    isPausedRef.current = true;
    setIsPaused(true);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // prevent auto-restart
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
    }
    setInterimTranscription("");
  };

  const resumeRecording = () => {
    isPausedRef.current = false;
    setIsPaused(false);
    // Restart speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        if (recognitionRef.current && isRecordingRef.current && !isPausedRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }
      };
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
    // Resume media recorder if paused
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
    }
  };

  const resetRecording = () => {
    setTranscription("");
    setInterimTranscription("");
    setRecordedAudioBlob(null);
    setRecordingTime(0);
    setIsPaused(false);
    isRecordingRef.current = false;
    isPausedRef.current = false;
  };

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingTime,
        transcription,
        interimTranscription,
        recordedAudioBlob,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        resetRecording,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecording() {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error("useRecording must be used within a RecordingProvider");
  }
  return context;
}
