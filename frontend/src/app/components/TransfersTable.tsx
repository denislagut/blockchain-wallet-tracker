"use client";

import { useEffect, useState } from "react";
import { getTokens, getTransfers } from "../../lib/api";

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
  const limit = 50;

  useEffect(() => {
    const loadTokens = async () => {
      const data = await getTokens();

      setTokens(data.tokens);
    };

    loadTokens();
  }, []);

  useEffect(() => {
    const loadTransfers = async () => {
      const data = await getTransfers(
        selectedToken || undefined,
        limit,
        offset,
      );

      setTransfers(data.transfers);
    };

    loadTransfers();
  }, [selectedToken, offset]);

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

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border p-2">Token</th>
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
                <td className="border p-2 break-all">{transfer.from_address}</td>
                <td className="border p-2 break-all">{transfer.to_address}</td>
                <td className="border p-2">{transfer.amount_formatted}</td>
                <td className="border p-2">{transfer.block_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="mt-6 flex items-center"
          style={{ gap: "16px" }}
        >
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="rounded border px-2 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {Math.floor(offset / limit) + 1}
          </span>

          <button
            onClick={() => setOffset(offset + limit)}
            disabled={transfers.length < limit}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};