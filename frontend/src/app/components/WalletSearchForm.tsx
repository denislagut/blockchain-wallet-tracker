"use client";

import { useState } from "react";

export const WalletSearchForm = () => {
  const [address, setAddress] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!address.trim()) {
      return;
    }

    window.location.href = `/wallet/${address}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
      <input
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Wallet address"
        className="border p-2 flex-1 rounded"
      />

      <button type="submit" className="border px-4 py-2 rounded p-2">
        Search wallet
      </button>
    </form>
  );
};