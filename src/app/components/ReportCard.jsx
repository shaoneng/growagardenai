// /src/app/components/ReportCard.jsx
"use client";
import { useState } from 'react';
// FIX: Import HelpCircle directly
import { icons, ChevronDown, HelpCircle } from 'lucide-react';

export default function ReportCard({ icon, title, summary, points, initialExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Use the icon from the props if it exists in the 'icons' object
  let LucideIcon = icon ? icons[icon] : null;

  // If the icon is not found, use the directly imported HelpCircle as a fallback
  if (!LucideIcon) {
    console.warn(`Icon "${icon}" not found. Falling back to HelpCircle.`);
    LucideIcon = HelpCircle;
  }

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div 
        className="flex cursor-pointer items-center justify-between gap-3 p-6"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <LucideIcon className="h-8 w-8 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <ChevronDown 
          className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
        />
      </div>
      {isExpanded && (
        <div className="animate-fade-in-down px-6 pb-6">
          <p className="mb-4 text-gray-600">{summary}</p>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            {points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}