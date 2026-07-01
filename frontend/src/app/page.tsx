import { getTokens } from "../lib/api";
import { AddTokenForm } from "./components/AddTokenForm";
import { TokenActions } from "./components/TokenActions";
import { WalletSearchForm } from "./components/WalletSearchForm";
import { TransfersTable } from "./components/TransfersTable";
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

        <AddTokenForm />

        <ul className="space-y-2">
          {(tokensData.tokens as Token[]).map((token) => (
            <li key={token.address} className="border p-3 rounded">
              <div className="font-medium">{token.symbol}</div>
              <a
                href={getSepoliaAddressUrl(token.address)}
                target="_blank"
                rel="noreferrer"
                title={token.address}
                className="text-sm text-blue-600 underline"
              >
                {shortenAddress(token.address)}
              </a>
              <div className="text-sm mb-2">
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

      <TransfersTable />
    </main>
  );
}
