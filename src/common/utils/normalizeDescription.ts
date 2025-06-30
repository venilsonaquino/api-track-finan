export function normalizeDescription(description: string): string {
  return description
    .toLowerCase()
    .replace(/\d+/g, '')
    .replace(/[\W_]+/g, ' ')
    .trim();
}
