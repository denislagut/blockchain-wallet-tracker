"use client";

import { useEffect, useState } from "react";
import { getTokens, getTransfers } from "../../lib/api";
import {
  getSepoliaAddressUrl,
  getSepoliaTxUrl,
  shortenAddress,
} from "../../lib/format";

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
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Recent Transfers
      </h2>

      <div className="mb-4">
        <select
          value={selectedToken}
          onChange={(event) => {
            setSelectedToken(event.target.value);
            setOffset(0);
          }}
          disabled={isLoading}
          className="border p-2 rounded"
        >
          <option value="">ALL</option>

          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4">
        Transfers count: {transfers.length}
      </p>

      {isLoading && (
        <p className="mb-4 rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
          Loading transfers...
        </p>
      )}

      {error && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border p-2">Token</th>
              <th className="border p-2">Tx</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Block</th>
            </tr>
          </thead>

          <tbody>
            {transfers.map((transfer) => (
              <tr key={`${transfer.transaction_hash}-${transfer.log_index}`}>
                <td className="border p-2">{transfer.symbol}</td>
                <td className="border p-2">
                  <a
                    href={getSepoliaTxUrl(transfer.transaction_hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View tx
                  </a>
                </td>
                <td className="border p-2">
                  <a
                    href={getSepoliaAddressUrl(transfer.from_address)}
                    target="_blank"
                    rel="noreferrer"
                    title={transfer.from_address}
                    className="text-blue-600 underline"
                  >
                    {shortenAddress(transfer.from_address)}
                  </a>
                </td>
                <td className="border p-2">
                  <a
                    href={getSepoliaAddressUrl(transfer.to_address)}
                    target="_blank"
                    rel="noreferrer"
                    title={transfer.to_address}
                    className="text-blue-600 underline"
                  >
                    {shortenAddress(transfer.to_address)}
                  </a>
                </td>
                <td className="border p-2">{transfer.amount_formatted}</td>
                <td className="border p-2">{transfer.block_number}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && transfers.length === 0 && !error && (
          <p className="border-x border-b p-3 text-sm text-gray-500">
            No transfers found.
          </p>
        )}

        <div
          className="mt-6 flex items-center"
          style={{ gap: "16px" }}
        >
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0 || isLoading}
            className="rounded border px-2 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page}. Showing {showingFrom}-{showingTo}
          </span>

          <button
            onClick={() => setOffset(offset + limit)}
            disabled={transfers.length < limit || isLoading}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
