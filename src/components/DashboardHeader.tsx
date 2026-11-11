"use client";

import React, { useState } from "react";
import Link from "next/link";
import RegisterModal from "./RegisterModal";
import { UserPlus, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  userEmail?: string;
  signoutAction: () => Promise<void>;
}

export default function DashboardHeader({
  userEmail,
  signoutAction,
}: DashboardHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center mb-12">
        <Link href="/" className="group flex items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 group-hover:text-rose-600 transition-colors">
            ThinkTalk
          </h1>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sign Up / Register Account Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white text-slate-800 hover:text-black font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl border-2 border-black hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>

          {/* Sign Out Button */}
          <form action={signoutAction}>
            <button
              type="submit"
              className="text-xs sm:text-sm font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer py-2 px-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </header>

      {/* Registration Modal Popup */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode="register"
      />
    </>
  );
}

