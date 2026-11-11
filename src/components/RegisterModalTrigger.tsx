"use client";

import React, { useState } from "react";
import RegisterModal from "./RegisterModal";

interface RegisterModalTriggerProps {
  label?: string;
  className?: string;
  initialMode?: "register" | "login";
  children?: React.ReactNode;
}

export default function RegisterModalTrigger({
  label = "Sign up",
  className,
  initialMode = "register",
  children,
}: RegisterModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children || label}
      </button>

      <RegisterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialMode={initialMode}
      />
    </>
  );
}

