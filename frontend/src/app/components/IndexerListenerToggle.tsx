"use client";

import { useEffect, useState } from "react";
import {
  getIndexerListenerStatus,
  setIndexerListenerEnabled,
} from "../../lib/api";

type ListenerStatus = {
  isListening: boolean;
  isIndexing: boolean;
  lastBlockNumber: number | null;
};

export const IndexerListenerToggle = () => {
  const [listener, setListener] = useState<ListenerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getIndexerListenerStatus();

      setListener(data.listener);
    } catch {
      setError("Failed to load listener status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleToggle = async () => {
    if (!listener || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await setIndexerListenerEnabled(!listener.isListening);

      setListener(data.listener);
    } catch {
      setError("Failed to update listener");
    } finally {
      setIsLoading(false);
    }
  };

  const isListening = listener?.isListening ?? false;

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Blockchain Listener
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Toggle live block listening for automatic ERC20 indexing.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span
              className={
                isListening
                  ? "rounded-full border border-emerald-700/60 bg-emerald-950 px-2 py-1 text-emerald-300"
                  : "rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-slate-400"
              }
            >
              {isListening ? "listening" : "stopped"}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-slate-400">
              {listener?.isIndexing ? "indexing now" : "idle"}
            </span>
            {listener?.lastBlockNumber !== null &&
              listener?.lastBlockNumber !== undefined && (
                <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-slate-400">
                  last block: {listener.lastBlockNumber}
                </span>
              )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={loadStatus}
            disabled={isLoading}
            className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-600 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={handleToggle}
            disabled={!listener || isLoading}
            className={
              isListening
                ? "min-h-11 rounded-lg border border-red-600/70 bg-red-950/50 px-5 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                : "min-h-11 rounded-lg border border-emerald-600 bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            {isLoading
              ? "Loading..."
              : isListening
                ? "Stop listener"
                : "Start listener"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-900/70 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </section>
  );
};
