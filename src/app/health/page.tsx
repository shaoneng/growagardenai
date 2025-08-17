"use client";

import React from 'react';

export default function HealthPage() {
  const [status, setStatus] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [testResult, setTestResult] = React.useState<any>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      setStatus(json);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  const runTest = async () => {
    setTestResult(null);
    try {
      const res = await fetch('/api/test-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: true })
      });
      const json = await res.json();
      setTestResult({ ok: res.ok, json });
    } catch (e: any) {
      setTestResult({ ok: false, error: e?.message || 'Request failed' });
    }
  };

  React.useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-4">System Health</h1>
      <div className="space-y-4">
        <div className="p-4 rounded border bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">AI Service Status</h2>
            <button
              className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
              onClick={fetchStatus}
              disabled={loading}
            >{loading ? 'Refreshing...' : 'Refresh'}</button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {status && (
            <pre className="mt-2 text-sm bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(status, null, 2)}</pre>
          )}
        </div>

        <div className="p-4 rounded border bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Test /api/test-analyze</h2>
            <button
              className="px-3 py-1 text-sm rounded bg-green-600 text-white"
              onClick={runTest}
            >Run Test</button>
          </div>
          {testResult && (
            <pre className="mt-2 text-sm bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

