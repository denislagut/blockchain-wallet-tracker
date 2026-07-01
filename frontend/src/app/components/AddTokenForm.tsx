"use client";

import { useState } from "react";
import { addToken } from "../../lib/api";
import { useRouter } from "next/navigation";

export const AddTokenForm = () => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!address.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await addToken(address);

      setMessage("Token added");
      setAddress("");
      router.refresh();
    } catch {
      setError("Failed to add token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 lg:max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Token address"
          disabled={isLoading}
          className="min-h-11 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          className="min-h-11 rounded-lg border border-emerald-600 bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add token"}
        </button>
      </div>

      {message && <span className="text-sm text-emerald-300">{message}</span>}
      {error && <span className="text-sm text-red-300">{error}</span>}
    </form>
  );
};
