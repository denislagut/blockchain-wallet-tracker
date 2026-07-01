import { getWalletStats, getWalletTransfers } from "../../../lib/api";
import {
  getSepoliaAddressUrl,
  getSepoliaTxUrl,
  shortenAddress,
} from "../../../lib/format";

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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <a href="/" className="mb-6 inline-block text-sm underline">
            &lt;- Back to dashboard
          </a>

          <h1 className="mb-3 text-3xl font-bold">
            Wallet Details
          </h1>

          <p className="text-gray-600">
            ERC20 activity indexed from tracked tokens.
          </p>
        </div>

        <section className="mb-8 rounded border bg-white p-5">
          <h2 className="mb-3 text-xl font-semibold">
            Address
          </h2>

          <a
            href={getSepoliaAddressUrl(address)}
            target="_blank"
            rel="noreferrer"
            title={address}
            className="inline-block rounded bg-gray-100 p-3 text-sm text-blue-600 underline"
          >
            {shortenAddress(address)}
          </a>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Sent transfers
            </p>
            <p className="text-2xl font-bold">
              {totalSentTransfers}
            </p>
          </div>

          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Received transfers
            </p>
            <p className="text-2xl font-bold">
              {totalReceivedTransfers}
            </p>
          </div>

          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Tokens
            </p>
            <p className="text-2xl font-bold">
              {stats.length}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded border bg-white p-5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Token Stats
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Amounts are grouped by token.
            </p>
          </div>

          {stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {stats.map((stat) => (
                <article
                  key={stat.token_address}
                  className="rounded border p-4"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      {stat.symbol}
                    </h3>
                    <a
                      href={getSepoliaAddressUrl(stat.token_address)}
                      target="_blank"
                      rel="noreferrer"
                      title={stat.token_address}
                      className="text-xs text-blue-600 underline"
                    >
                      {shortenAddress(stat.token_address)}
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">
                        Sent
                      </p>
                      <p className="font-semibold">
                        {stat.sent_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.sent_count} transfers
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Received
                      </p>
                      <p className="font-semibold">
                        {stat.received_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.received_count} transfers
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded border p-3 text-sm text-gray-500">
              No indexed token activity for this wallet.
            </p>
          )}
        </section>

        <section className="rounded border bg-white p-5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Wallet Transfers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Found {transfersData.count} transfers for this wallet.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">
                    Token
                  </th>
                  <th className="border p-3 text-left">
                    Tx
                  </th>
                  <th className="border p-3 text-left">
                    From
                  </th>
                  <th className="border p-3 text-left">
                    To
                  </th>
                  <th className="border p-3 text-left">
                    Amount
                  </th>
                  <th className="border p-3 text-left">
                    Block
                  </th>
                </tr>
              </thead>

              <tbody>
                {transfers.map((transfer) => (
                  <tr
                    key={`${transfer.transaction_hash}-${transfer.log_index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="border p-3 font-medium">
                      {transfer.symbol}
                    </td>

                    <td className="border p-3">
                      <a
                        href={getSepoliaTxUrl(transfer.transaction_hash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View tx
                      </a>
                    </td>

                    <td className="border p-3">
                      <a
                        href={getSepoliaAddressUrl(transfer.from_address)}
                        target="_blank"
                        rel="noreferrer"
                        title={transfer.from_address}
                        className="text-blue-600 underline"
                      >
                        {shortenAddress(transfer.from_address)}
                      </a>
                    </td>

                    <td className="border p-3">
                      <a
                        href={getSepoliaAddressUrl(transfer.to_address)}
                        target="_blank"
                        rel="noreferrer"
                        title={transfer.to_address}
                        className="text-blue-600 underline"
                      >
                        {shortenAddress(transfer.to_address)}
                      </a>
                    </td>

                    <td className="border p-3">
                      {transfer.amount_formatted}
                    </td>

                    <td className="border p-3">
                      {transfer.block_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transfers.length === 0 && (
              <p className="border-x border-b p-3 text-sm text-gray-500">
                No transfers found for this wallet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
