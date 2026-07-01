"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleRetry = () => {
    reset();
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-red-900/60 bg-slate-900/80 p-6 shadow-xl shadow-red-950/20">
        <h1 className="mb-3 text-2xl font-bold text-white">
          Failed to load dashboard
        </h1>

        <p className="mb-5 text-sm text-slate-400">
          Check that the backend API is running and try again.
        </p>

        <button
          onClick={handleRetry}
          className="rounded-lg border border-emerald-600 bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
