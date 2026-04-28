export const ACCENT_CYCLE = ["green", "red", "blue", "purple", "orange"] as const;
export type Accent = typeof ACCENT_CYCLE[number];

export function stableAccent(name: string): Accent {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return ACCENT_CYCLE[hash % ACCENT_CYCLE.length];
}
