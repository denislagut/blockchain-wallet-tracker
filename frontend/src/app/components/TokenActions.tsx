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
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={
          isActive
            ? "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-red-500/60 hover:bg-red-950/30 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            : "rounded-lg border border-emerald-700/70 bg-emerald-950/50 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-900/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {isLoading ? "Saving..." : isActive ? "Disable" : "Enable"}
      </button>

      {error && (
        <span className="text-sm text-red-300">
          {error}
        </span>
      )}
    </div>
  );
};
