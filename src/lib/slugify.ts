// /src/lib/slugify.ts
// Shared slugify helper to ensure single definition when bundling for Edge

export function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

