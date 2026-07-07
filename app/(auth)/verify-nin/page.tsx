// app/(auth)/verify-nin/page.tsx

import React from "react";

export default function VerifyNinPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Verify National Identification Number
      </h1>
      <p className="text-sm text-gray-500">
        Please enter your 11-digit NIN to proceed.
      </p>
    </div>
  );
}
