/** Requests stay on this website and use the existing private session cookie. */
export async function standardRequest<T>(path: string, method = "GET", data?: unknown): Promise<T> {
  const response = await fetch(`/api/standard/${path}`, {
    method, credentials: "same-origin", cache: "no-store",
    ...(data === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not complete your request.");
  return result.data as T;
}

