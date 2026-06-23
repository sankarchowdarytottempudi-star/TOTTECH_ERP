export async function apiJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        payload?.message ||
        `Request failed with ${response.status}`
    );
  }

  return payload as T;
}

export function errorMessage(
  error: unknown,
  fallback = "Something went wrong"
) {
  return error instanceof Error
    ? error.message
    : fallback;
}
