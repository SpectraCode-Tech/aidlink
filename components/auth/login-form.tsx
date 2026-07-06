"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://aidlink-jhur.onrender.com";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.token) {
        const token = response.data.token;
        localStorage.setItem("auth_token", token);

        try {
          // Decode JWT payload safely inline
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          );

          const decoded = JSON.parse(jsonPayload);
          const role = decoded?.role?.toUpperCase();

          // Dynamic redirection based on verified role payload
          if (role === "ADMIN") {
            router.push("/admin");
          } else if (role === "BENEFICIARY") {
            router.push("/beneficiary");
          } else if (role === "DONOR") {
            router.push("/donor");
          } else if (role === "PARTNER") {
            router.push("/partner");
          } else {
            // Fallback if role string doesn't match standard routing profiles
            router.push("/");
          }
        } catch (decodeError) {
          console.error(
            "Failed to parse token payload structure:",
            decodeError,
          );
          // Fallback redirect if decoding fails but token exists
          router.push("/beneficiary");
        }
      } else {
        throw new Error("Invalid token payload returned from server.");
      }
    } catch (err: any) {
      console.error("Login authorization error:", err);
      const backendMessage = err.response?.data?.message || err.message;
      setApiError(
        backendMessage || "Authentication failed. Check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col justify-center rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:p-10 transition-all duration-300">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Welcome Back
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-400">
          Sign in to your AidLink workspace
        </p>
      </div>

      {apiError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 animate-in fade-in duration-200">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="user@example.com"
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

        <div className="mt-1 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 dark:text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 bg-white/50 accent-primary focus:ring-primary"
            />
            Remember me
          </label>

          <Link
            href="/forgot-password"
            className="text-xs font-bold text-primary transition-colors hover:text-secondary underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl text-base font-bold shadow-md shadow-primary/10 transition-all"
          isLoading={isLoading}
        >
          Sign In
        </Button>

        <div className="flex items-center justify-center mt-4">
          <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-xs font-bold text-primary transition-colors hover:text-secondary ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
