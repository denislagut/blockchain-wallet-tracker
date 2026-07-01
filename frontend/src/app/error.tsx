"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded border bg-white p-6">
        <h1 className="mb-3 text-2xl font-bold">
          Failed to load dashboard
        </h1>

        <p className="mb-5 text-sm text-gray-600">
          Check that the backend API is running and try again.
        </p>

        <button
          onClick={reset}
          className="rounded border px-4 py-2 text-sm"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
