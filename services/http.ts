import { ApiError } from "@/services/api-error";

const BASE =
  process.env.NEXT_PUBLIC_REST_API_URL ?? "https://rickandmortyapi.com/api";

export async function get<T>(
  path: string,
  params: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<T | null> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && String(value) !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.size > 0 ? `?${search}` : "";
  const res = await fetch(`${BASE}${path}${query}`, {
    signal,
    next: { revalidate: 300 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, `Request to ${path} failed`);

  return (await res.json()) as T;
}
