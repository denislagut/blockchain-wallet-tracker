import { getTransfers } from "../lib/api";

export default async function Home() {
  const data = await getTransfers();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Wallet Tracker Dashboard
      </h1>

      <p className="mb-4">
        Transfers count: {data.count}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Token</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Block</th>
            </tr>
          </thead>

          <tbody>
            {data.transfers.map((transfer: any) => (
              <tr key={`${transfer.transaction_hash}-${transfer.log_index}`}>
                <td className="border p-2">{transfer.symbol}</td>
                <td className="border p-2">{transfer.from_address}</td>
                <td className="border p-2">{transfer.to_address}</td>
                <td className="border p-2">{transfer.amount_formatted}</td>
                <td className="border p-2">{transfer.block_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}