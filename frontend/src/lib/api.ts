const API_URL = "http://localhost:3000";

export const getTransfers = async () => {
  const response = await fetch(`${API_URL}/transfers`);

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
  const response = await fetch(
    `${API_URL}/wallet/${address}/transfers`,
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
  const response = await fetch(
    `${API_URL}/wallet/${address}/stats`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch wallet stats",
    );
  }

  return response.json();
};