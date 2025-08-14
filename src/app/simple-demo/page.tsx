"use client";

import SimpleOnboarding from '../components/feature/SimpleOnboarding';

export default function SimpleDemo() {
  return (
    <div className="min-h-screen bg-gray-100">
      <SimpleOnboarding
        onComplete={(choice) => {
          alert(`Excellent! You chose: ${choice}`);
        }}
        onSkip={() => {
          alert('Maybe next time!');
        }}
      />
    </div>
  );
}