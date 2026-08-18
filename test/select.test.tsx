import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "@/components/ui/select";

const options = [
  { value: "Alive", label: "Alive" },
  { value: "Dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
];

function setup(value?: string) {
  const onChange = vi.fn();
  render(
    <Select
      label="Status"
      placeholder="Status: Any"
      value={value}
      options={options}
      onChange={onChange}
    />,
  );
  return { onChange, trigger: screen.getByRole("button", { name: /status/i }) };
}

describe("Select", () => {
  it("shows the placeholder until something is chosen", () => {
    setup();
    expect(screen.getByRole("button")).toHaveTextContent("Status: Any");
  });

  it("shows the selected option's label", () => {
    setup("Dead");
    expect(screen.getByRole("button")).toHaveTextContent("Dead");
  });

  it("exposes the expanded state to assistive tech", async () => {
    const user = userEvent.setup();
    const { trigger } = setup();

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("marks only the current value as selected", async () => {
    const user = userEvent.setup();
    const { trigger } = setup("Dead");
    await user.click(trigger);

    const selected = screen
      .getAllByRole("option")
      .filter((option) => option.getAttribute("aria-selected") === "true");

    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent("Dead");
  });

  it("selects an option on click", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = setup();

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Alive" }));

    expect(onChange).toHaveBeenCalledWith("Alive");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("reports the placeholder row as undefined, not an empty string", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = setup("Dead");

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Status: Any" }));

    // The API layer drops undefined filters; "" would be sent as a real value.
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("opens with the keyboard and selects with Enter", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = setup();

    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Placeholder row is index 0, so one step down lands on the first option.
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("Alive");
  });

  it("moves to the last option with End", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = setup();

    trigger.focus();
    await user.keyboard("{Enter}{End}{Enter}");

    expect(onChange).toHaveBeenCalledWith("unknown");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const { trigger } = setup();

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("does not run past the ends of the list", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = setup();

    trigger.focus();
    // Four downs against four rows: the active option should stop at the last.
    await user.keyboard("{Enter}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith("unknown");
  });
});
