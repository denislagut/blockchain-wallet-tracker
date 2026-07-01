"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setTokenActive } from "../../lib/api";

type TokenActionsProps = {
  address: string;
  isActive: boolean;
};

export const TokenActions = ({
  address,
  isActive,
}: TokenActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setIsLoading(true);
    setError("");

    try {
      await setTokenActive(address, !isActive);
      router.refresh();
    } catch {
      setError("Failed to update token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="border px-3 py-1 rounded p-2 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : isActive ? "Disable" : "Enable"}
      </button>

      {error && (
        <span className="text-sm text-red-700">
          {error}
        </span>
      )}
    </div>
  );
};
