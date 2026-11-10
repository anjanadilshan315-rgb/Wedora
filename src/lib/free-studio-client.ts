/** Same-origin requests use the HttpOnly Free Studio session cookie. */
export async function studioRequest<T>(path: string, method = "GET", data?: unknown): Promise<T> {
  const response = await fetch(`/api/free/${path}`, {
    method, credentials: "same-origin", cache: "no-store",
    ...(data === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not complete the request. Please try again.");
  return result.data as T;
}
