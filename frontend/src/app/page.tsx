import { getTokens, getTransfers } from "../lib/api";
import { shortenAddress } from "../lib/format";

//______________________________________________COMPONENTS
import { AddTokenForm } from "./components/AddTokenForm";
import { TokenActions } from "./components/TokenActions";
import { WalletSearchForm } from "./components/WalletSearchForm";


export default async function Home() {
  const data = await getTransfers();
  const transfersData = await getTransfers();
  const tokensData = await getTokens();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Wallet Tracker Dashboard
      </h1>

      <WalletSearchForm />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Tracked Tokens
        </h2>

        <AddTokenForm/>

        <ul className="space-y-2">
          {tokensData.tokens.map((token: any) => (
            <li
              key={token.address}
              className="border p-3 rounded gap-2"
            >
              <div className="font-medium">{token.symbol}</div>
              <div className="text-sm">{token.address}</div>
              <div className="text-sm">
                decimals: {token.decimals} | active:{" "}
                {String(token.is_active)}
              </div>
              <TokenActions
                address={token.address}
                isActive={token.is_active}
              />
            </li>
          ))}
        </ul>
      </section>

    <section>
      <h2 className="text-xl font-semibold mb-4">
          Recent Transfers
        </h2>

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
                <td className="border p-2">{shortenAddress(transfer.from_address)}</td>
                <td className="border p-2">{shortenAddress(transfer.to_address)}</td>
                <td className="border p-2">{transfer.amount_formatted}</td>
                <td className="border p-2">{transfer.block_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
    </main>
  );
}
