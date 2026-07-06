"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NinVerification } from "./nin-verification";
import { OtpVerification } from "./otp-verification";
import { FaceVerification } from "./face-verification";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://aidlink-jhur.onrender.com";

export function SignupForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);

  // Keep track of the JWT token across steps after Step 1 registration completes
  const [token, setToken] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    nin: "",
    selfie: null as File | null,
  });

  const [isFaceVerified, setIsFaceVerified] = useState(false);

  const steps = [
    { id: 1, label: "Personal Info" },
    { id: 2, label: "OTP" },
    { id: 3, label: "NIN" },
    { id: 4, label: "Biometric" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);

    try {
      // --- STEP 1: REST API USER REGISTRATION ---
      if (currentStep === 1) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        await axios.post(`${API_BASE_URL}/auth/register`, {
          email: formData.email,
          password: formData.password,
          role: "BENEFICIARY",
        });

        // Authenticate immediately via /auth/login to get the persistent 24h Bearer token
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        setToken(loginResponse.data.token);
        setCurrentStep(2);
      }

      // --- STEP 2: LOCAL OR EXTERNAL OTP ---
      else if (currentStep === 2) {
        setCurrentStep(3);
      }

      // --- STEP 3: SMILE ID NIMC REGISTRY VERIFICATION ---
      else if (currentStep === 3) {
        await axios.post(
          `${API_BASE_URL}/verification/verify-nin`,
          { nin: formData.nin },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setCurrentStep(4);
      }

      // --- STEP 4: MOCK BIOMETRIC FACE MATCH ---
      else if (currentStep === 4) {
        if (!formData.selfie) {
          throw new Error("Please capture your selfie snapshot first.");
        }

        // Directly call your Render mock verification endpoint
        await axios.post(
          `${API_BASE_URL}/verification/verify-face`,
          {
            selfieUrl: "https://res.cloudinary.com/mock-id-doc.jpg",
            documentImageUrl: "https://res.cloudinary.com/mock-id-doc.jpg",
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Success! Route them directly into the authenticated workspace dashboard
        router.push("/beneficiary");
      }
    } catch (err: any) {
      console.error(`Onboarding Error (Step ${currentStep}):`, err);
      const backendMessage = err.response?.data?.message || err.message;
      setApiError(
        backendMessage || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-lg flex-col justify-center rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:p-10 transition-all duration-300">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Account Setup
        </h2>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-text-body/60 dark:text-gray-400">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* Step Tracker Progress Bar */}
      <div className="relative mb-12 flex w-full items-center justify-between px-2">
        <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`h-4 w-4 rounded-full transition-all duration-500 ${
                  isActive || isCompleted
                    ? "bg-linear-to-r from-primary to-secondary shadow-[0_0_14px_rgba(0,119,182,0.5)] scale-110"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              />
              <span
                className={`absolute top-6 w-20 text-center text-[10px] sm:text-xs tracking-tight transition-all duration-300 ${
                  isActive
                    ? "font-extrabold text-slate-900 dark:text-white scale-105"
                    : isCompleted
                      ? "font-bold text-primary dark:text-primary/90"
                      : "font-medium text-text-body/40 dark:text-gray-500"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Shared Error Response Interface Banner */}
      {apiError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 animate-in fade-in duration-200">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Step 1: Core Profile Payload */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="johndoe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="*************"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="*************"
              required
            />

            <div className="mt-2 flex items-start">
              <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-normal text-text-body/80 dark:text-gray-300">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 bg-white/50 accent-primary focus:ring-primary"
                />
                <span>
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-bold text-primary transition-colors hover:text-secondary underline underline-offset-2"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: SMS / SMTP One-Time Password */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <OtpVerification
              email={formData.email || "johndoe@example.com"}
              onChange={(val) => setFormData((p) => ({ ...p, otp: val }))}
            />
          </div>
        )}

        {/* Step 3: National Identity Number Validation */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <NinVerification
              value={formData.nin}
              onChange={(val) => {
                if (apiError) setApiError(null);
                setFormData((p) => ({ ...p, nin: val }));
              }}
            />
          </div>
        )}

        {/* Step 4: Biometric Integration Interface */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FaceVerification
              onComplete={(file) => {
                if (apiError) setApiError(null);
                setIsFaceVerified(true);
                setFormData((prev) => ({ ...prev, selfie: file }));
              }}
              onBack={() => {
                setIsFaceVerified(false);
                setFormData((prev) => ({ ...prev, selfie: null }));
                setCurrentStep(3);
              }}
            />
          </div>
        )}

        {/* Navigation Actions Panel */}
        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              className="w-1/3 h-12 rounded-xl text-base font-bold border-slate-200 hover:bg-slate-50 transition-all dark:border-white/10 dark:hover:bg-white/5"
              onClick={() => {
                setApiError(null);
                setCurrentStep((prev) => prev - 1);
              }}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-12 rounded-xl text-base font-bold shadow-md shadow-primary/10 transition-all"
            isLoading={isLoading}
            disabled={
              (currentStep === 2 && formData.otp.length < 6) ||
              (currentStep === 3 && formData.nin.length < 11) ||
              (currentStep === 4 && !isFaceVerified)
            }
          >
            {currentStep === 4 ? "Complete Setup" : "Continue"}
          </Button>
        </div>

        {currentStep === 1 && (
          <div className="mt-4 text-center">
            <p className="text-xs font-medium text-text-body/70 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-xs font-bold text-primary transition-colors hover:text-secondary ml-1"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
