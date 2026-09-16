"use client";

import React, { useState, useRef, useEffect } from "react";
import { RecordingState } from "@/types/student";
import { Exercise } from "@/types/exercise";
import { EvaluationResult } from "@/types/evaluation";
import MicrophoneButton from "./MicrophoneButton";
import RecordingControls from "./RecordingControls";
import { convertSpeechToText } from "@/lib/speech";
import { evaluateResponse } from "@/lib/ai-evaluation";
import { saveAttemptToDatabase } from "@/app/actions/save-attempt";

interface SpeechPracticeProps {
  exercise: Exercise;
}

export default function SpeechPractice({ exercise }: SpeechPracticeProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  const stopMicrophone = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleStartRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Blob creation happens when stopping the recorder.
        // The save handler will process it.
      };

      mediaRecorder.start();
      setRecordingState("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("We couldn't access your microphone. Please allow microphone permission and try again.");
    }
  };

  const handleCancelRecording = () => {
    stopMicrophone();
    audioChunksRef.current = [];
    setTranscript("");
    setEvaluation(null);
    setRecordingState("idle");
  };

  const handleSaveRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      setRecordingState("processing");
      
      // Wait for the onstop event to finish pushing the last chunk
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        processAudio(audioBlob);
      };
      
      stopMicrophone();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const text = await convertSpeechToText(audioBlob);
      setTranscript(text);
      
      const evalResult = await evaluateResponse(exercise, text);
      setEvaluation(evalResult);
      
      // Stage 5: Save to Supabase (this runs securely on the server)
      await saveAttemptToDatabase(exercise, text, evalResult);

      setRecordingState("result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setRecordingState("idle");
    }
  };

  const handleTryAgain = () => {
    setTranscript("");
    setEvaluation(null);
    setRecordingState("idle");
  };

  const handleNextExercise = () => {
    // Simply reload the page to get a new random exercise from the server
    window.location.reload();
  };

  // Border styling logic based on the user's design images
  const containerBorderClass = 
    recordingState === "recording" 
      ? "border-4 border-[#8e24aa]" // Purple border for recording
      : "border-[6px] border-black"; // Thick black border for idle/other states

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
            <p className="text-lg font-medium text-gray-700">Processing your answer...</p>
            <p className="text-sm text-gray-500">Converting your speech to text.</p>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
