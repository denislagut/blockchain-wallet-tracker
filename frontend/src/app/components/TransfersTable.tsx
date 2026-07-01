"use client";

import { useEffect, useState } from "react";
import { getTokens, getTransfers } from "../../lib/api";
import {
  getSepoliaAddressUrl,
  getSepoliaTxUrl,
  shortenAddress,
} from "../../lib/format";
import { CopyButton } from "./CopyButton";

type Token = {
  address: string;
  symbol: string;
};

type Transfer = {
  transaction_hash: string;
  log_index: number;
  symbol: string;
  from_address: string;
  to_address: string;
  amount_formatted: string;
  block_number: number;
};

export const TransfersTable = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const limit = 50;

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const data = await getTokens();

        setTokens(data.tokens);
      } catch {
        setError("Failed to load tokens");
      }
    };

    loadTokens();
  }, []);

  useEffect(() => {
    const loadTransfers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getTransfers(
          selectedToken || undefined,
          limit,
          offset,
        );

        setTransfers(data.transfers);
      } catch {
        setTransfers([]);
        setError("Failed to load transfers");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransfers();
  }, [selectedToken, offset]);

  const page = Math.floor(offset / limit) + 1;
  const showingFrom = transfers.length === 0 ? 0 : offset + 1;
  const showingTo = offset + transfers.length;

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Transfers
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Browse indexed ERC20 transfer logs from tracked tokens.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-56">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Token filter
          </label>
          <select
            value={selectedToken}
            onChange={(event) => {
              setSelectedToken(event.target.value);
              setOffset(0);
            }}
            disabled={isLoading}
            className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All tokens</option>

            {tokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Transfers on this page:{" "}
          <span className="font-semibold text-slate-200">
            {transfers.length}
          </span>
        </p>

        <p className="text-sm text-slate-500">
          Page {page}. Showing {showingFrom}-{showingTo}
        </p>
      </div>

      {isLoading && (
        <p className="mb-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
          Loading transfers...
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-900/70 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-slate-950">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Tx</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Block</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {transfers.map((transfer) => (
              <tr
                key={`${transfer.transaction_hash}-${transfer.log_index}`}
                className="bg-slate-900/50 transition hover:bg-emerald-950/20"
              >
                <td className="px-4 py-3 font-semibold text-white">
                  {transfer.symbol}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={getSepoliaTxUrl(transfer.transaction_hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-300 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-200"
                  >
                    View tx
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={getSepoliaAddressUrl(transfer.from_address)}
                      target="_blank"
                      rel="noreferrer"
                      title={transfer.from_address}
                      className="font-mono text-xs text-slate-300 hover:text-emerald-300"
                    >
                      {shortenAddress(transfer.from_address)}
                    </a>
                    <CopyButton value={transfer.from_address} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={getSepoliaAddressUrl(transfer.to_address)}
                      target="_blank"
                      rel="noreferrer"
                      title={transfer.to_address}
                      className="font-mono text-xs text-slate-300 hover:text-emerald-300"
                    >
                      {shortenAddress(transfer.to_address)}
                    </a>
                    <CopyButton value={transfer.to_address} />
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {transfer.amount_formatted}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {transfer.block_number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && transfers.length === 0 && !error && (
          <p className="border-t border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
            No transfers found for the selected filter.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0 || isLoading}
          className="min-h-10 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-600 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-center text-sm text-slate-500">
          Showing {showingFrom}-{showingTo}
        </span>

        <button
          onClick={() => setOffset(offset + limit)}
          disabled={transfers.length < limit || isLoading}
          className="min-h-10 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-600 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
};
