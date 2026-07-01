const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const getTransfers = async (
  tokenAddress?: string,
  limit = 50,
  offset = 0,
) => {
  const searchParams = new URLSearchParams();

  if (tokenAddress) {
    searchParams.set("token", tokenAddress);
  }

  searchParams.set("limit", String(limit));
  searchParams.set("offset", String(offset));

  const response = await fetch(`${API_URL}/transfers?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch transfers");
  }

  return response.json();
};

export const getTokens = async () => {
  const response = await fetch(`${API_URL}/tokens`);

  if (!response.ok) {
    throw new Error("Failed to fetch tokens");
  }

  return response.json();
};

export const addToken = async (address: string) => {
  const response = await fetch(`${API_URL}/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    throw new Error("Failed to add token");
  }

  return response.json();
};

export const setTokenActive = async (
  address: string,
  active: boolean,
) => {
  const action = active ? "enable" : "disable";

  const response = await fetch(`${API_URL}/tokens/${address}/${action}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  if (!response.ok) {
    throw new Error("Failed to update token");
  }

  return response.json();
};

export const getWalletTransfers = async (
  address: string,
) => {
  const encodedAddress = encodeURIComponent(address.trim());

  const response = await fetch(
    `${API_URL}/wallet/${encodedAddress}/transfers`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch wallet transfers",
    );
  }

  return response.json();
};

export const getWalletStats = async (
  address: string,
) => {
  const encodedAddress = encodeURIComponent(address.trim());

  const response = await fetch(
    `${API_URL}/wallet/${encodedAddress}/stats`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch wallet stats",
    );
  }

  return response.json();
};

export const getIndexerListenerStatus = async () => {
  const response = await fetch(`${API_URL}/indexer/erc20/listener`);

  if (!response.ok) {
    throw new Error("Failed to fetch indexer listener status");
  }

  return response.json();
};

export const setIndexerListenerEnabled = async (enabled: boolean) => {
  const action = enabled ? "start" : "stop";

  const response = await fetch(
    `${API_URL}/indexer/erc20/listener/${action}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update indexer listener");
  }

  return response.json();
};
