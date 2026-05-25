"use client";

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

  const handleClick = async () => {
    await setTokenActive(address, !isActive);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="border px-3 py-1 rounded p-2"
    >
      {isActive ? "Disable" : "Enable"}
    </button>
  );
};