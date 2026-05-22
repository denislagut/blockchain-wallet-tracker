const API_URL = "http://localhost:3000";

export const getTransfers = async () => {
  const response = await fetch(`${API_URL}/transfers`);

  if (!response.ok) {
    throw new Error("Failed to fetch transfers");
  }

  return response.json();
};