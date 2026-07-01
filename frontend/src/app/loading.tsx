export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
        <div className="mb-4 h-2 w-24 rounded-full bg-emerald-500" />

        <h1 className="mb-3 text-2xl font-bold text-white">
          Loading dashboard...
        </h1>

        <p className="text-sm text-slate-400">
          Fetching tracked tokens and transfers.
        </p>
      </div>
    </main>
  );
}
