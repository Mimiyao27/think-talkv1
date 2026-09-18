import React from "react";
import { Mic } from "lucide-react";

interface MicrophoneButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function MicrophoneButton({ onClick, disabled }: MicrophoneButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label="Start recording"
        className="flex items-center justify-center w-24 h-24 bg-[#3baded] text-white rounded-full shadow-lg hover:bg-[#2b9dcd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Mic size={48} strokeWidth={2.5} />
      </button>
      <p className="font-bold text-sm uppercase tracking-wide text-gray-900">
        Click the mic and start to speak
      </p>
    </div>
  );
}
