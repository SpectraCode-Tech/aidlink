"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface FaceVerificationProps {
  onComplete: (file: File) => void;
  onBack: () => void;
}

export function FaceVerification({
  onComplete,
  onBack,
}: FaceVerificationProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const handleCaptureClick = () => {
    setIsScanning(true);

    // Simulate camera snapshot processing delay
    setTimeout(() => {
      setIsScanning(false);

      const mockFile = new File(["mock-image-data"], "selfie.jpg", {
        type: "image/jpeg",
      });

      setCapturedFile(mockFile);
      // Immediately notify the parent wizard that the file is ready
      onComplete(mockFile);
    }, 2000);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Dynamic Context Header Layout */}
      <div className="text-center px-2">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-300">
          {capturedFile
            ? "Photo captured successfully! Review your placement or proceed to complete verification."
            : "Please position your face clearly within the circular frame to match against official registries."}
        </p>
      </div>

      {/* Camera Scanning Viewport Frame Container */}
      <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-primary-600/50 bg-black/10 shadow-inner backdrop-blur-sm sm:h-72 sm:w-72 dark:border-white/20">
        {!capturedFile ? (
          <>
            {/* Viewfinder Vignette Overlay Shading */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

            {/* Scanning Laser Tracker Line Animation */}
            <div
              className={`absolute left-0 top-0 h-1 w-full bg-primary-600 shadow-[0_0_15px_#2563eb] transition-all duration-1000 ${
                isScanning ? "translate-y-[288px]" : "-translate-y-4"
              }`}
            />

            {/* Target Alignment Guide Marks */}
            <div className="absolute h-full w-full opacity-30">
              <div className="absolute left-10 top-10 h-10 w-10 border-l-4 border-t-4 border-white" />
              <div className="absolute right-10 top-10 h-10 w-10 border-r-4 border-t-4 border-white" />
              <div className="absolute bottom-10 left-10 h-10 w-10 border-b-4 border-l-4 border-white" />
              <div className="absolute bottom-10 right-10 h-10 w-10 border-b-4 border-r-4 border-white" />
            </div>

            {isScanning && (
              <span className="relative z-10 font-sans text-xs font-bold uppercase tracking-wider text-white drop-shadow-md animate-pulse">
                Hold still...
              </span>
            )}
          </>
        ) : (
          /* Biometric Ready Context Mask */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-600/20 backdrop-blur-md dark:bg-emerald-500/10">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:bg-slate-900">
              <svg
                className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                fill="none"
                view="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Ready
            </span>
          </div>
        )}
      </div>

      {/* Action Controls System - Only shows when waiting for a capture */}
      <div className="flex w-full max-w-xs flex-col items-center gap-4 mt-2">
        {!capturedFile && (
          <>
            <Button
              type="button"
              onClick={handleCaptureClick}
              disabled={isScanning}
              className="w-full rounded-xl py-6 font-semibold shadow-lg bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
            >
              {isScanning ? "Processing..." : "Take Photo"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
