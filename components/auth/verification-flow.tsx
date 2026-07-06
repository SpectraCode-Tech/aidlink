"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NinVerification } from "./nin-verification";
import { OtpVerification } from "./otp-verification";
import { FaceVerification } from "./face-verification";

export type VerificationStep = "nin" | "otp" | "selfie";

interface VerificationData {
  nin: string;
  otp: string;
  selfieFile: File | null;
}

interface VerificationFlowProps {
  userEmailAddress?: string; // Passed from parent signup context if available
}

export default function VerificationFlow({
  userEmailAddress,
}: VerificationFlowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<VerificationStep>("nin");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<VerificationData>({
    nin: "",
    otp: "",
    selfieFile: null,
  });

  const updateFormData = (fields: Partial<VerificationData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNINSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.nin.length !== 11) {
      setError("Please provide a complete 11-digit National Identity Number.");
      return;
    }
    setCurrentStep("otp");
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.otp.length !== 6) return;
    setCurrentStep("selfie");
  };

  const handleSelfieComplete = async (file: File) => {
    setError("");
    updateFormData({ selfieFile: file });

    startTransition(async () => {
      try {
        const payload = new FormData();
        payload.append("nin", formData.nin);
        payload.append("otp", formData.otp);
        payload.append("selfie", file);

        // API Endpoint execution layer
        const response = await fetch("/api/auth/verify-identity", {
          method: "POST",
          body: payload,
        });

        if (!response.ok) {
          const fallbackData = await response.json().catch(() => ({}));
          throw new Error(fallbackData.message || "KYC validation failed.");
        }

        router.push("/onboarding-success");
      } catch (err: any) {
        console.error("KYC verification transmission breakdown:", err);
        setError(
          err.message ||
            "Something went wrong during submission. Please try again.",
        );
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200/60 bg-white/40 backdrop-blur-xl p-6 md:p-8 shadow-xl dark:border-white/10 dark:bg-slate-900/40">
      {/* Visual Step Progress Indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {(["nin", "otp", "selfie"] as const).map((step, idx) => {
          const steps: Record<VerificationStep, string> = {
            nin: "Personal Info",
            otp: "OTP",
            selfie: "Biometric",
          };
          const isCompleted =
            idx < ["nin", "otp", "selfie"].indexOf(currentStep);
          const isCurrent = step === currentStep;

          return (
            <div
              key={step}
              className="flex items-center flex-1 last:flex-initial"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                        ? "bg-primary-600 text-white ring-4 ring-primary-600/10 dark:bg-primary-500"
                        : "bg-slate-200/60 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isCurrent
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {steps[step]}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`h-0.5 flex-1 mx-4 rounded-full transition-all duration-500 ${
                    idx < ["nin", "otp", "selfie"].indexOf(currentStep)
                      ? "bg-emerald-600"
                      : "bg-slate-200/60 dark:bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Render Context Area */}
      <div className="relative min-h-[340px] flex flex-col justify-between">
        {isPending ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl dark:bg-slate-900/20">
            <div className="h-10 w-10 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin dark:border-primary-500/30 dark:border-t-primary-500" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 animate-pulse text-center px-4">
              Running secure Smile ID verification checks...
            </p>
          </div>
        ) : (
          <>
            <div className="w-full flex-1">
              {currentStep === "nin" && (
                <form
                  onSubmit={handleNINSubmit}
                  className="flex flex-col justify-between min-h-[340px]"
                >
                  <NinVerification
                    value={formData.nin}
                    onChange={(val) => updateFormData({ nin: val })}
                    error={error}
                  />
                  <div className="mt-6">
                    {error && (
                      <p className="text-xs font-semibold text-red-500 mb-3 text-center">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={formData.nin.length !== 11}
                      className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-5 transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 dark:bg-primary-500 dark:hover:bg-primary-600"
                    >
                      Verify and Continue
                    </button>
                  </div>
                </form>
              )}

              {currentStep === "otp" && (
                <form
                  onSubmit={handleOTPSubmit}
                  className="flex flex-col justify-between min-h-[340px]"
                >
                  <OtpVerification
                    email={userEmailAddress || "your registered email"}
                    onChange={(val) => updateFormData({ otp: val })}
                  />
                  <div className="mt-6 flex flex-col gap-3">
                    {error && (
                      <p className="text-xs font-semibold text-red-500 text-center">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={formData.otp.length !== 6}
                      className="w-full rounded-xl bg-primary-600 py-4 font-bold text-white transition-all hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-500 dark:hover:bg-primary-600"
                    >
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setCurrentStep("nin");
                      }}
                      className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer text-center mx-auto"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}

              {currentStep === "selfie" && (
                <div className="flex flex-col justify-between min-h-[340px]">
                  <FaceVerification
                    onComplete={handleSelfieComplete}
                    onBack={() => {
                      setError("");
                      setCurrentStep("otp");
                    }}
                  />
                  {error && (
                    <p className="text-xs font-semibold text-red-500 mt-4 text-center">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
