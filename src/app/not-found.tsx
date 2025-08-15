// /src/app/not-found.tsx
// Cloudflare Pages 静态导出兼容的 404 页面

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
      </div>
    </main>
  );
}

