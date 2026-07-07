"use client";

import React from 'react';
import Input from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 mx-auto animate-in fade-in zoom-in-95 duration-500">
      
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-heading dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-text-body dark:text-gray-400">
          Update your profile, security preferences, and organizational details.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        
        {/* Profile Details Section */}
        <div className="flex flex-col rounded-3xl border border-white/50 bg-white/40 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
          <h2 className="text-xl font-bold text-text-heading dark:text-white mb-6">Personal Information</h2>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white shadow-inner">
              JD
            </div>
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" type="text" defaultValue="John Doe" />
            <Input label="Username" type="text" defaultValue="John_Doe" />
            <Input label="Email Address" type="email" defaultValue="johndoe@example.com" disabled />
            <Input label="Phone Number" type="tel" defaultValue="+234 800 000 0000" />
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <Button type="button" className="w-full md:w-auto px-8">Save Changes</Button>
            </div>
          </form>
        </div>

        {/* Security Section */}
        <div className="flex flex-col rounded-3xl border border-white/50 bg-white/40 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
          <h2 className="text-xl font-bold text-text-heading dark:text-white mb-6">Security & Authentication</h2>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <div className="hidden md:block"></div> {/* Spacer */}
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <Button type="button" className="w-full md:w-auto px-8">Update Password</Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}