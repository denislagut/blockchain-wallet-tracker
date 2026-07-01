import { getWalletStats, getWalletTransfers } from "../../../lib/api";

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
            ← Back to dashboard
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

          <p className="break-all rounded bg-gray-100 p-3 text-sm">
            {address}
          </p>
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

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">
                    Token
                  </th>
                  <th className="border p-3 text-left">
                    Sent transfers
                  </th>
                  <th className="border p-3 text-left">
                    Received transfers
                  </th>
                  <th className="border p-3 text-left">
                    Sent amount
                  </th>
                  <th className="border p-3 text-left">
                    Received amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {stats.map((stat) => (
                  <tr
                    key={stat.token_address}
                    className="hover:bg-gray-50"
                  >
                    <td className="border p-3">
                      <div className="font-medium">
                        {stat.symbol}
                      </div>
                      <div className="break-all text-xs text-gray-500">
                        {stat.token_address}
                      </div>
                    </td>
                    <td className="border p-3">
                      {stat.sent_count}
                    </td>
                    <td className="border p-3">
                      {stat.received_count}
                    </td>
                    <td className="border p-3">
                      {stat.sent_amount}
                    </td>
                    <td className="border p-3">
                      {stat.received_amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {stats.length === 0 && (
              <p className="border-x border-b p-3 text-sm text-gray-500">
                No indexed token activity for this wallet.
              </p>
            )}
          </div>
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

                    <td className="max-w-xs break-all border p-3">
                      {transfer.from_address}
                    </td>

                    <td className="max-w-xs break-all border p-3">
                      {transfer.to_address}
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
          </div>
        </section>
      </div>
    </main>
  );
}
