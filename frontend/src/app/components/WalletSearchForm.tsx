"use client";

import { useState } from "react";

export const WalletSearchForm = () => {
  const [address, setAddress] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedAddress = address.trim();

    if (!normalizedAddress) {
      return;
    }

    window.location.href = `/wallet/${encodeURIComponent(normalizedAddress)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/40"
    >
      <label className="mb-2 block text-sm font-medium text-slate-300">
        Search wallet
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="0x..."
          className="min-h-11 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />

        <button
          type="submit"
          className="min-h-11 rounded-lg border border-emerald-600 bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          Search
        </button>
      </div>
    </form>
  );
};
