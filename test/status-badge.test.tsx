import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/ui/status-badge";
import messages from "@/messages/en.json";
import { STATUSES, type Status } from "@/lib/types";

function renderBadge(status: Status) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <StatusBadge status={status} />
    </NextIntlClientProvider>,
  );
}

describe("StatusBadge", () => {
  it.each([
    ["Alive", "Alive", "text-alive"],
    ["Dead", "Dead", "text-dead"],
    ["unknown", "Unknown", "text-unknown"],
  ] as const)("styles %s with its own token", (status, label, token) => {
    const { container } = renderBadge(status);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(token);
  });

  it("covers every status in the domain", () => {
    // Guards against a new status being handled by a stray conditional
    // somewhere else instead of the shared variant map.
    for (const status of STATUSES) {
      const { unmount } = renderBadge(status);
      expect(screen.getByText(messages.status[status])).toBeInTheDocument();
      unmount();
    }
  });

  it("conveys status as text, not colour alone", () => {
    const { container } = renderBadge("Dead");
    const dot = container.querySelector("[aria-hidden]");

    expect(dot).toBeInTheDocument();
    expect(screen.getByText("Dead")).toBeVisible();
  });
});
