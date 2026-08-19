
export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function idFromUrl(url: string): number | null {
  const id = Number(url.split("/").pop());
  return Number.isInteger(id) ? id : null;
}
