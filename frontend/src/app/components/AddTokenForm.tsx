"use client";

import { useState } from "react";
import { addToken } from "../../lib/api";
import { useRouter } from "next/navigation";

export const AddTokenForm = () => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await addToken(address);

      setMessage("Token added");
      setAddress("");
      router.refresh();
    } catch {
      setMessage("Failed to add token");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Token address"
        className="border p-2 flex-1"
      />

      <button className="border px-4 py-2 p-2" type="submit">
        Add token
      </button>

      {message && <span className="p-2">{message}</span>}
    </form>
  );
};