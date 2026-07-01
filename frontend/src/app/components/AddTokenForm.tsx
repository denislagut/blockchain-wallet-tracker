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
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Token address"
        disabled={isLoading}
        className="border p-2 flex-1"
      />

      <button
        className="border px-4 py-2 p-2 disabled:opacity-50"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add token"}
      </button>

      {message && <span className="p-2 text-green-700">{message}</span>}
      {error && <span className="p-2 text-red-700">{error}</span>}
    </form>
  );
};
