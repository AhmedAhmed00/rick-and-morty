import { QueryClient, environmentManager } from "@tanstack/react-query";
import { ApiError } from "@/services/api";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        // A 4xx won't succeed on a retry.
        retry: (failureCount, error) =>
          error instanceof ApiError && error.status < 500
            ? false
            : failureCount < 2,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // A fresh client per server request; a single shared one in the browser.
  if (environmentManager.isServer()) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
