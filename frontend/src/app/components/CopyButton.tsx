"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
};

export const CopyButton = ({
  value,
  label = "Copy address",
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1200);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-2 text-xs font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
    >
      {isCopied ? "Copied" : "Copy"}
    </button>
  );
};
