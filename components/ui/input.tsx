import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-text-heading/80 px-1">
          {label}
        </label>
      )}
      
      <div className="relative w-full">
        <input 
          className={`w-full rounded-xl bg-white/40 dark:bg-black/10 backdrop-blur-md border border-white/60 dark:border-white/10 px-5 py-3.5 text-text-heading dark:text-white placeholder:text-text-muted/60 outline-none transition-all duration-200 focus:border-primary-500/80 focus:ring-2 focus:ring-primary-500/10 shadow-sm ${
            error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10' : ''
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <span className="text-xs font-semibold text-danger-600 px-1 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}