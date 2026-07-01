export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded border bg-white p-6">
        <h1 className="mb-3 text-2xl font-bold">
          Loading dashboard...
        </h1>

        <p className="text-sm text-gray-600">
          Fetching tracked tokens and transfers.
        </p>
      </div>
    </main>
  );
}
