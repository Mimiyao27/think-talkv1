"use client";

import React, { useState, useRef, useEffect } from "react";
import { RecordingState } from "@/types/student";
import { Exercise } from "@/types/exercise";
import { EvaluationResult } from "@/types/evaluation";
import MicrophoneButton from "./MicrophoneButton";
import RecordingControls from "./RecordingControls";
import { evaluateResponse } from "@/lib/ai-evaluation";
import { saveAttemptToDatabase } from "@/app/actions/save-attempt";

interface SpeechPracticeProps {
  exercise: Exercise;
}

export default function SpeechPractice({ exercise }: SpeechPracticeProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Refs for audio streaming resources
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  // Accumulates all final transcript segments during one recording session
  const finalTranscriptRef = useRef<string>("");
  const liveTranscriptRef = useRef<string>("");

  // Cleanup all audio + WebSocket on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      // Send terminate message so AssemblyAI flushes any remaining audio
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "Terminate" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleStartRecording = async () => {
    setError(null);
    setLiveTranscript("");
    setTranscript("");
    finalTranscriptRef.current = "";
    liveTranscriptRef.current = "";

    try {
      // 1. Get a short-lived token from our Next.js server (keeps API key secret)
      const tokenRes = await fetch("/api/assemblyai-token");
      if (!tokenRes.ok) {
        const err = await tokenRes.json().catch(() => ({}));
        throw new Error(err.error || "Could not get transcription token");
      }
      const { token } = await tokenRes.json();

      // 2. Connect to AssemblyAI Streaming v3 WebSocket
      const ws = new WebSocket(
        `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`
      );
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);

          // Streaming v3 Turn event
          if (msg.type === "Turn" || typeof msg.transcript === "string") {
            const turnText = (msg.transcript || "").trim();
            if (msg.end_of_turn) {
              if (turnText) {
                finalTranscriptRef.current = (
                  finalTranscriptRef.current + " " + turnText
                ).trim();
                setTranscript(finalTranscriptRef.current);
              }
              liveTranscriptRef.current = "";
              setLiveTranscript("");
            } else {
              liveTranscriptRef.current = turnText;
              setLiveTranscript(turnText);
            }
          } else if (msg.message_type === "PartialTranscript") {
            // Fallback for legacy messages
            liveTranscriptRef.current = msg.text || "";
            setLiveTranscript(msg.text || "");
          } else if (msg.message_type === "FinalTranscript" && msg.text) {
            finalTranscriptRef.current = (
              finalTranscriptRef.current + " " + msg.text
            ).trim();
            setTranscript(finalTranscriptRef.current);
            liveTranscriptRef.current = "";
            setLiveTranscript("");
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      ws.onerror = () => {
        setError("Real-time transcription connection failed. Please try again.");
        setRecordingState("idle");
        cleanupAudio();
      };

      ws.onclose = () => {
        // If we're still recording when the socket closes unexpectedly, reset
        setRecordingState((prev) => {
          if (prev === "recording") {
            setError("Connection closed unexpectedly. Please try again.");
            return "idle";
          }
          return prev;
        });
      };

      // 3. Wait for WebSocket to open, then start mic
      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve();
        ws.onerror = () => reject(new Error("WebSocket failed to open"));
        // 5s timeout
        setTimeout(() => reject(new Error("WebSocket connection timed out")), 5000);
      });

      // 4. Request microphone & start streaming PCM16 at 16 kHz
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      // ScriptProcessorNode: 4096 samples, 1 input channel, 1 output channel
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        const float32 = e.inputBuffer.getChannelData(0);
        // Convert Float32 → Int16 PCM
        const pcm16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          pcm16[i] = Math.max(-32768, Math.min(32767, float32[i] * 32768));
        }
        wsRef.current.send(pcm16.buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setRecordingState("recording");
    } catch (err: any) {
      console.error("Error starting recording:", err);
      setError(
        err.message ||
          "We couldn't start recording. Please check your microphone and try again."
      );
      cleanupAudio();
    }
  };

  const handleCancelRecording = () => {
    cleanupAudio();
    setLiveTranscript("");
    setTranscript("");
    setEvaluation(null);
    finalTranscriptRef.current = "";
    liveTranscriptRef.current = "";
    setRecordingState("idle");
  };

  const handleSaveRecording = async () => {
    setRecordingState("processing");

    // Stop audio streaming first; AssemblyAI will flush remaining audio
    cleanupAudio();

    // Give AssemblyAI ~800ms to deliver the last transcript before we proceed
    await new Promise((r) => setTimeout(r, 800));

    let finalText = finalTranscriptRef.current.trim();
    if (liveTranscriptRef.current && !finalText.endsWith(liveTranscriptRef.current.trim())) {
      finalText = (finalText + " " + liveTranscriptRef.current).trim();
    }

    if (!finalText) {
      setError("No speech was detected. Please try again.");
      setRecordingState("idle");
      return;
    }

    try {
      const evalResult = await evaluateResponse(exercise, finalText);
      setEvaluation(evalResult);
      setTranscript(finalText);

      await saveAttemptToDatabase(exercise, finalText, evalResult);

      setRecordingState("result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setRecordingState("idle");
    }
  };

  const handleTryAgain = () => {
    setTranscript("");
    setLiveTranscript("");
    setEvaluation(null);
    finalTranscriptRef.current = "";
    liveTranscriptRef.current = "";
    setRecordingState("idle");
  };

  const handleNextExercise = () => {
    window.location.reload();
  };

  const containerBorderClass =
    recordingState === "recording"
      ? "border-4 border-[#8e24aa]"
      : "border-[6px] border-black";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center">

      {/* Exercise Card */}
      <div
        className={`w-full bg-[#efebc4] rounded-2xl p-8 sm:p-12 transition-colors duration-300 ${containerBorderClass}`}
      >
        <p className="text-xl sm:text-2xl font-medium text-gray-900 text-center leading-relaxed whitespace-pre-wrap">
          {exercise.question}
        </p>
      </div>

      {/* Live transcript while recording */}
      {recordingState === "recording" && (
        <div className="w-full mt-4 p-4 bg-white rounded-xl border-2 border-purple-200 min-h-[60px]">
          <p className="text-sm font-bold text-purple-500 uppercase tracking-wider mb-1">
            Live Transcript
          </p>
          <p className="text-gray-700 italic">
            {transcript && <span className="text-gray-900">{transcript} </span>}
            {liveTranscript && (
              <span className="text-purple-400">{liveTranscript}</span>
            )}
            {!transcript && !liveTranscript && (
              <span className="text-gray-400">Start speaking…</span>
            )}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center w-full">
          {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="min-h-[160px] w-full mt-4 flex items-center justify-center">
        {recordingState === "idle" && (
          <MicrophoneButton onClick={handleStartRecording} />
        )}

        {recordingState === "recording" && (
          <RecordingControls
            onCancel={handleCancelRecording}
            onSave={handleSaveRecording}
          />
        )}

        {recordingState === "processing" && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="w-12 h-12 border-4 border-[#3baded] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-700">Evaluating your answer...</p>
            <p className="text-sm text-gray-500">Almost done!</p>
          </div>
        )}

        {recordingState === "result" && evaluation && (
          <div className="flex flex-col items-center gap-6 mt-8 w-full relative animate-in fade-in zoom-in duration-500">
            <div className="w-full bg-[#efebc4] rounded-2xl border-[6px] border-black p-6 sm:p-8 relative">
              <button
                onClick={handleTryAgain}
                aria-label="Close feedback"
                className="absolute -top-4 -right-4 w-10 h-10 bg-[#fc4b4b] rounded-full text-white flex items-center justify-center border-[3px] border-white shadow-md hover:bg-[#eb3a3a] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>

              <div className="mb-6">
                <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">Your Answer</h3>
                <p className="text-xl text-gray-900 italic font-medium">"{transcript}"</p>
              </div>

              <div className="border-t-2 border-black/10 pt-6 mb-6">
                <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4">Feedback</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-bold text-gray-800">Grammar</p>
                      <p className="text-sm text-gray-700 capitalize">{evaluation.grammar.status}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-bold text-gray-800">Meaning</p>
                      <p className="text-sm text-gray-700 capitalize">{evaluation.meaning.status}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-bold text-gray-800">Completeness</p>
                      <p className="text-sm text-gray-700 capitalize">{evaluation.completeness.status}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-bold text-gray-800">Relevance</p>
                      <p className="text-sm text-gray-700 capitalize">{evaluation.relevance.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Score</p>
                <p className="text-3xl font-black text-[#8e24aa] mb-2">{evaluation.score} <span className="text-lg text-gray-400">/ 100</span></p>
                <p className="text-lg text-gray-800 font-medium">{evaluation.feedback}</p>
              </div>
            </div>

            <button
              onClick={handleNextExercise}
              className="mt-2 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm shadow-lg transform hover:scale-105 active:scale-95"
            >
              Try Another Exercise
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
