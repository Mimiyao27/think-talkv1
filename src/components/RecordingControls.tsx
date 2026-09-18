import React from "react";
import { X, Check } from "lucide-react";

interface RecordingControlsProps {
  onCancel: () => void;
  onSave: () => void;
}

export default function RecordingControls({ onCancel, onSave }: RecordingControlsProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-12 mt-8">
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onCancel}
          aria-label="Cancel recording"
          className="flex items-center justify-center w-20 h-20 bg-[#fc4b4b] text-white rounded-full shadow-lg hover:bg-[#eb3a3a] transition-colors"
        >
          <X size={48} strokeWidth={3} />
        </button>
        <p className="font-bold text-sm uppercase tracking-wide text-gray-900">Cancel</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-20 h-20 bg-[#3baded] text-white rounded-full shadow-lg animate-pulse">
           {/* Custom simple soundwave icon built with div bars to resemble the user's design */}
           <div className="flex items-center gap-1">
             <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
             <div className="w-1 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
             <div className="w-1 h-14 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
             <div className="w-1 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "450ms" }}></div>
             <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
           </div>
        </div>
        <p className="font-bold text-sm uppercase tracking-wide text-gray-900">Recording...</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onSave}
          aria-label="Save recording"
          className="flex items-center justify-center w-20 h-20 bg-[#83d65b] text-white rounded-full shadow-lg hover:bg-[#72c54a] transition-colors"
        >
          <Check size={48} strokeWidth={3} />
        </button>
        <p className="font-bold text-sm uppercase tracking-wide text-gray-900">Save</p>
      </div>
    </div>
  );
}
