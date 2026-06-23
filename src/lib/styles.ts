export const getRankClass = (rank: number): string =>
  rank >= 1 && rank <= 5 ? `rank-${rank}` : 'bg-surface-2 text-muted';

export const getPointClass = (p: number | null): string =>
  p === null ? '' : p >= 5 ? 'p-top' : p >= 2 ? 'p-mid' : p > 0 ? 'p-low' : 'p-zero';
