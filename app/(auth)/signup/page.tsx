"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/ui/logo";

export default function Page() {
  const slides = [
    "Turning Donations Into Guaranteed Impact.",
    "Track Your Contributions From Wallet to Beneficiary.",
    "Empowering Communities Through Transparent Aid.",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Global Brand Logo Header */}
      <div className="absolute left-6 top-6 z-50 sm:left-8 lg:left-12 lg:top-5">
        <Logo />
      </div>

      {/* Premium Visual Ambient Glow Effects */}
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[5%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[150px]" />

      {/* Left Column - Hero Sliders (Locked & Perfectly Centered on Desktop Viewports) */}
      <section className="relative z-10 flex w-full flex-col justify-center px-6 pt-32 pb-12 sm:px-12 md:px-16 lg:h-full lg:w-1/2 lg:px-20 xl:px-24 lg:py-0 lg:pt-20">
        <div
          className="flex w-full max-w-xl flex-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Typography Slider Framework */}
          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((text, index) => (
                <div key={index} className="w-full shrink-0 pr-6">
                  <h1 className="text-3xl font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl">
                    {text}
                  </h1>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Navigation Control Systems */}
          <div className="mt-10 flex flex-col items-start gap-8">
            {/* Smooth Indicator Trackers */}
            <div className="flex items-center gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === activeIndex
                      ? "w-10 bg-primary shadow-sm shadow-primary/30"
                      : "w-2 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            {/* Slider Action Trigger Button */}
            <Button
              onClick={handleNext}
              className="h-12 w-40 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/10 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
              variant="primary"
            >
              {activeIndex === slides.length - 1 ? "Start Over" : "Next Slide"}
            </Button>
          </div>
        </div>
      </section>

      {/* Right Column - Safe Viewport Form Scroller */}
      <section className="relative z-10 flex w-full justify-center px-4 pb-16 sm:px-12 lg:h-full lg:w-1/2 lg:overflow-y-auto lg:px-16 xl:px-20">
        {/* my-auto self-centers whenever form is short; lg:py-24 ensures comfortable vertical padding margins during overflow */}
        <div className="w-full max-w-md my-auto pt-6 pb-12 lg:py-24">
          <SignupForm />
        </div>
      </section>
    </div>
  );
}
