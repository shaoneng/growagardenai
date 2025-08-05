// /src/app/report/page.tsx (Cleaned up)
import AnalysisReport from "../components/AnalysisReport";

// The AppProvider is not needed here because the root layout provides it.

export default function ReportPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4 sm:p-8 md:p-12">
      <AnalysisReport />
    </main>
  );
}