"use client";

import React from "react";

export default function LoadingSpinner({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-[#23262e] border-t-[#bef264]`}
      />
      {text && <p className="text-xs font-medium text-neutral-400">{text}</p>}
    </div>
  );
}
