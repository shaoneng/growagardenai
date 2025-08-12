// src/app/components/LoadingSpinner.jsx
"use client";
import { LoaderCircle } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <LoaderCircle className="h-12 w-12 animate-spin text-blue-600" />
      <p className="text-lg text-gray-700">Our AI is analyzing your strategy...</p>
    </div>
  );
}