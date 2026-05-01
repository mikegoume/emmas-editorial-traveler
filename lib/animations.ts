export const DURATION = {
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
} as const;

export const EASE = {
  out: [0, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
};
