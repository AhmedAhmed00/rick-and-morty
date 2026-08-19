/** Windowed page list, e.g. buildRange(7, 42) -> [1, "gap", 6, 7, 8, "gap", 42]. */
export function buildRange(
  page: number,
  pages: number,
  siblings = 1,
): (number | "gap")[] {
  if (pages <= 1) return [];

  const first = 1;
  const last = pages;
  const start = Math.max(first, page - siblings);
  const end = Math.min(last, page + siblings);

  const range: (number | "gap")[] = [];

  if (start > first) {
    range.push(first);
    if (start > first + 1) range.push("gap");
  }

  for (let i = start; i <= end; i += 1) range.push(i);

  if (end < last) {
    if (end < last - 1) range.push("gap");
    range.push(last);
  }

  return range;
}
