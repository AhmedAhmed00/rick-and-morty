/**
 * Both the REST and GraphQL endpoints answer a non-numeric id with a 500 rather
 * than a 404, so route params are validated before any request is made.
 */
export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
