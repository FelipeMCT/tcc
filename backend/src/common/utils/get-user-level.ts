export function getUserLevel(points: number): string {
  if (points >= 500) return 'Diamante';
  if (points >= 250) return 'Ouro';
  if (points >= 100) return 'Prata';
  return 'Bronze';
}
