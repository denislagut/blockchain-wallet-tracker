import { getWalletStats, getWalletTransfers } from "../../../lib/api";
import {
  getSepoliaAddressUrl,
  getSepoliaTxUrl,
  shortenAddress,
} from "../../../lib/format";
import { CopyButton } from "../../components/CopyButton";

export const dynamic = "force-dynamic";

type WalletStat = {
  token_address: string;
  symbol: string;
  sent_count: string;
  received_count: string;
  sent_amount: string;
  received_amount: string;
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

type Props = {
  params: Promise<{
    address: string;
  }>;
};

export default async function WalletPage({ params }: Props) {
  const { address } = await params;

  const [statsData, transfersData] = await Promise.all([
    getWalletStats(address),
    getWalletTransfers(address),
  ]);

  const stats = statsData.stats as WalletStat[];
  const transfers = transfersData.transfers as Transfer[];
  const totalSentTransfers = stats.reduce(
    (sum, stat) => sum + Number(stat.sent_count),
    0,
  );
  const totalReceivedTransfers = stats.reduce(
    (sum, stat) => sum + Number(stat.received_count),
    0,
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-lg border border-emerald-900/50 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
          <a
            href="/"
            className="mb-6 inline-flex min-h-9 items-center rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-200"
          >
            &lt;- Dashboard
          </a>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-emerald-400">
                Wallet details
              </p>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Indexed ERC20 Activity
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Transfers and token totals are grouped from the indexed tracked-token dataset.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={getSepoliaAddressUrl(address)}
                target="_blank"
                rel="noreferrer"
                title={address}
                className="rounded-lg border border-emerald-800/70 bg-emerald-950/30 px-4 py-3 font-mono text-sm text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-900/30"
              >
                {shortenAddress(address)}
              </a>
              <CopyButton value={address} />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
            <p className="text-sm text-slate-400">
              Sent transfers
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {totalSentTransfers}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
            <p className="text-sm text-slate-400">
              Received transfers
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {totalReceivedTransfers}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-5 shadow-xl shadow-emerald-950/20">
            <p className="text-sm text-emerald-300">
              Tokens with activity
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-200">
              {stats.length}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">
              Token Stats
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Amounts stay separated by ERC20 token.
            </p>
          </div>

          {stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => (
                <article
                  key={stat.token_address}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-700/70 hover:bg-emerald-950/10"
                >
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-white">
                      {stat.symbol}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <a
                        href={getSepoliaAddressUrl(stat.token_address)}
                        target="_blank"
                        rel="noreferrer"
                        title={stat.token_address}
                        className="inline-block font-mono text-xs text-emerald-300 hover:text-emerald-200"
                      >
                        {shortenAddress(stat.token_address)}
                      </a>
                      <CopyButton value={stat.token_address} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                      <p className="text-slate-500">
                        Sent
                      </p>
                      <p className="mt-2 font-semibold text-white">
                        {stat.sent_amount}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {stat.sent_count} transfers
                      </p>
                    </div>

                    <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3">
                      <p className="text-emerald-300">
                        Received
                      </p>
                      <p className="mt-2 font-semibold text-emerald-100">
                        {stat.received_amount}
                      </p>
                      <p className="mt-1 text-xs text-emerald-400/80">
                        {stat.received_count} transfers
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-400">
              No indexed token activity for this wallet.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Wallet Transfers
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Found {transfersData.count} transfers for this wallet.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-slate-950">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Tx</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Block</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {transfers.map((transfer) => (
                  <tr
                    key={`${transfer.transaction_hash}-${transfer.log_index}`}
                    className="bg-slate-900/50 transition hover:bg-emerald-950/20"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {transfer.symbol}
                    </td>

                    <td className="px-4 py-3">
                      <a
                        href={getSepoliaTxUrl(transfer.transaction_hash)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-emerald-300 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-200"
                      >
                        View tx
                      </a>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={getSepoliaAddressUrl(transfer.from_address)}
                          target="_blank"
                          rel="noreferrer"
                          title={transfer.from_address}
                          className="font-mono text-xs text-slate-300 hover:text-emerald-300"
                        >
                          {shortenAddress(transfer.from_address)}
                        </a>
                        <CopyButton value={transfer.from_address} />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={getSepoliaAddressUrl(transfer.to_address)}
                          target="_blank"
                          rel="noreferrer"
                          title={transfer.to_address}
                          className="font-mono text-xs text-slate-300 hover:text-emerald-300"
                        >
                          {shortenAddress(transfer.to_address)}
                        </a>
                        <CopyButton value={transfer.to_address} />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-200">
                      {transfer.amount_formatted}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {transfer.block_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transfers.length === 0 && (
              <p className="border-t border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
                No transfers found for this wallet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
