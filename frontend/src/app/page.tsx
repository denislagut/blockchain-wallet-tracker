import { getTokens } from "../lib/api";
import { AddTokenForm } from "./components/AddTokenForm";
import { TokenActions } from "./components/TokenActions";
import { WalletSearchForm } from "./components/WalletSearchForm";
import { TransfersTable } from "./components/TransfersTable";
import { CopyButton } from "./components/CopyButton";
import { IndexerListenerToggle } from "./components/IndexerListenerToggle";
import {
  getSepoliaAddressUrl,
  shortenAddress,
} from "../lib/format";

export const dynamic = "force-dynamic";

type Token = {
  address: string;
  symbol: string;
  decimals: number;
  is_active: boolean;
};

export default async function Home() {
  const tokensData = await getTokens();
  const tokens = tokensData.tokens as Token[];
  const activeTokens = tokens.filter((token) => token.is_active).length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-lg border border-emerald-900/50 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-emerald-400">
                Sepolia ERC20 Monitor
              </p>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Wallet Tracker Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Track token activity, inspect indexed transfers, and jump to Etherscan when you need to verify raw on-chain data.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Tokens
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {tokens.length}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-400">
                  Active
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">
                  {activeTokens}
                </p>
              </div>
            </div>
          </div>
        </header>

        <WalletSearchForm />

        <IndexerListenerToggle />

        <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Tracked Tokens
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Manage the ERC20 contracts that the indexer reads.
              </p>
            </div>

            <AddTokenForm />
          </div>

          {tokens.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {tokens.map((token) => (
                <li
                  key={token.address}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-700/70 hover:bg-emerald-950/10"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">
                          {token.symbol}
                        </p>
                        <span
                          className={
                            token.is_active
                              ? "rounded-full border border-emerald-700/60 bg-emerald-950 px-2 py-0.5 text-xs text-emerald-300"
                              : "rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-400"
                          }
                        >
                          {token.is_active ? "active" : "paused"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <a
                          href={getSepoliaAddressUrl(token.address)}
                          target="_blank"
                          rel="noreferrer"
                          title={token.address}
                          className="inline-block text-sm text-emerald-300 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-200"
                        >
                          {shortenAddress(token.address)}
                        </a>
                        <CopyButton value={token.address} />
                      </div>
                    </div>

                    <p className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-400">
                      {token.decimals} decimals
                    </p>
                  </div>

                  <TokenActions
                    address={token.address}
                    isActive={token.is_active}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-400">
              No tracked tokens yet. Add an ERC20 token address to start indexing transfers.
            </div>
          )}
        </section>

        <TransfersTable />
      </div>
    </main>
  );
}
