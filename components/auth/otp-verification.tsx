"use client";

import React, { useState, useRef, useEffect } from "react";

interface OtpVerificationProps {
  email: string;
  onChange: (otp: string) => void;
}

export function OtpVerification({ email, onChange }: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    // Only permit numeric values
    if (value && isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Snag only the last character if a user types over an existing digit
    const targetValue = value.substring(value.length - 1);
    newOtp[index] = targetValue;

    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move focus forward dynamically
    if (targetValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If empty, wipe previous field and move back
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // If field has content, wipe it out immediately
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (pasteData.length === 0) return;

    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Determine target focus index based on paste length safely
    const focusIndex = pasteData.length < 6 ? pasteData.length : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    console.log("Resending OTP...");
    setOtp(Array(6).fill(""));
    onChange("");
    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex w-full flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <p className="mb-8 text-center text-sm text-slate-600 dark:text-gray-300">
        We've sent a verification code to
        <br />
        <span className="font-bold text-slate-900 dark:text-white">
          {email}
        </span>
      </p>

      <div className="mb-6 flex w-full max-w-sm justify-between gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="h-12 w-12 rounded-xl border border-slate-200 bg-white/50 text-center text-lg font-black text-slate-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary dark:focus:bg-slate-900 sm:h-14 sm:w-14 sm:text-xl"
          />
        ))}
      </div>

      <div className="mb-4 flex flex-col items-center gap-2 text-xs sm:text-sm">
        <span className="font-medium text-slate-500 dark:text-gray-400">
          Time remaining:{" "}
          <span className="font-mono font-bold text-primary">
            {formatTime(timeLeft)}
          </span>
        </span>

        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 0}
          className={`mt-1 rounded-full px-4 py-1.5 text-xs font-bold tracking-tight transition-all duration-200 ${
            timeLeft > 0
              ? "cursor-not-allowed text-slate-400 bg-slate-100/50 dark:text-gray-600 dark:bg-white/5"
              : "cursor-pointer text-primary bg-primary/5 hover:bg-primary/10 hover:text-secondary active:scale-[0.96]"
          }`}
        >
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  );
}
