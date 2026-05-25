import { getWalletStats, getWalletTransfers } from "../../../lib/api";

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

  const stats = statsData.stats;
  const transfers = transfersData.transfers;

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

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Sent transfers
            </p>
            <p className="text-2xl font-bold">
              {stats.sent_count}
            </p>
          </div>

          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Received transfers
            </p>
            <p className="text-2xl font-bold">
              {stats.received_count}
            </p>
          </div>

          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Sent amount
            </p>
            <p className="text-2xl font-bold">
              {stats.sent_amount}
            </p>
          </div>

          <div className="rounded border bg-white p-5">
            <p className="mb-2 text-sm text-gray-500">
              Received amount
            </p>
            <p className="text-2xl font-bold">
              {stats.received_amount}
            </p>
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
                {transfers.map((transfer: any) => (
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