"use client";

import { Container } from "@/components/layout/container";
import { ErrorState } from "@/components/ui/states";

// Next 16.3 renamed this boundary's `reset` prop to `retry`.
export default function Error({ retry }: { error: Error; retry: () => void }) {
  return (
    <Container className="py-section">
      <ErrorState onRetry={retry} />
    </Container>
  );
}
