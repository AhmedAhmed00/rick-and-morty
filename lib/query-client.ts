import { QueryClient, environmentManager } from "@tanstack/react-query";
import { cache } from "react";
import { ApiError } from "@/utils/api-error";

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

// One client per server request, shared by generateMetadata and the page body.
// Without this each caller got its own, so a record fetched for the title was
// fetched again for the page — and Next only memoises fetch for GET, not the
// POSTs GraphQL sends.
const getServerQueryClient = cache(makeQueryClient);

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // One per request on the server; a single shared one in the browser.
  if (environmentManager.isServer()) return getServerQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
