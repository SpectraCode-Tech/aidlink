"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";

// Hoisted outside component to prevent reference re-creation on every state change
const SLIDES: string[] = [
  "Turning Donations Into Guaranteed Impact.",
  "Track Your Contributions From Wallet to Beneficiary.",
  "Empowering Communities Through Transparent Aid.",
];

const AUTOPLAY_INTERVAL_MS = 4000;

export default function Page() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Clean Auto-play handler
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-r from-white via-[#f0f4f8] to-primary lg:flex-row">
      {/* Absolute Logo at Top Left */}
      <div className="absolute left-8 top-8 z-50 lg:left-12 lg:top-12">
        <Logo />
      </div>

      {/* Liquid Glass Background Blobs */}
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[5%] h-[600px] w-[600px] rounded-full bg-secondary/20 blur-[150px]" />

      {/* Left Section - Hero Text & Controls */}
      <section className="relative z-10 flex w-full flex-col justify-center px-8 pt-36 pb-12 sm:px-16 lg:w-1/2 lg:min-h-screen lg:px-24 lg:pt-0 lg:pb-0">
        {/* Wrapper to pause auto-play on hover */}
        <div
          className="flex w-full max-w-xl flex-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Container */}
          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {SLIDES.map((text, index) => (
                <div key={index} className="w-full shrink-0 pr-4 select-none">
                  <p className="text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.75rem]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls (Indicators + Button) */}
          <div className="mt-12 flex flex-col items-start gap-8 sm:gap-10">
            {/* Dynamic Indicators */}
            <div className="flex items-center gap-3">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 outline-none ${
                    index === activeIndex
                      ? "w-12 bg-primary shadow-md shadow-primary/30"
                      : "w-3 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              className="h-14 w-48 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
              variant="primary"
            >
              {activeIndex === SLIDES.length - 1 ? "Start Over" : "Next"}
            </Button>
          </div>
        </div>
      </section>

      {/* Right Section - Login Form */}
      <section className="relative z-10 flex w-full items-center justify-center p-6 pb-16 sm:p-12 lg:w-1/2 lg:min-h-screen lg:p-24">
          <LoginForm />
      </section>
    </div>
  );
}
