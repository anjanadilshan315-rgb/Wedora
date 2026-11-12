export class PremiumRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export async function premiumRequest<T>(path: string, method = "GET", data?: unknown): Promise<T> {
  const response = await fetch(`/api/premium/${path}`, {
    method, credentials: "same-origin", cache: "no-store",
    ...(data === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  });
  const result = await response.json();
  if (!response.ok) throw new PremiumRequestError(result.error || "Please try again.", response.status);
  return result.data as T;
}
