/**
  * Calcula a curva de XP necessária para cada nível.
  * Nível 1: 0 a 100 XP
  * Nível 2: 100 a 250 XP (+150)
  * Nível 3: 250 a 450 XP (+200)
  * Nível N: XP progressivo
  */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel <= 1) return 100;
  return Math.floor(100 * Math.pow(currentLevel, 1.4));
}

export function calculateLevelFromXP(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number; progressPercent: number } {
  let level = 1;
  let accumulatedXP = 0;

  while (totalXP >= getXPForNextLevel(level)) {
    accumulatedXP = getXPForNextLevel(level);
    level++;
  }

  const nextLevelXP = getXPForNextLevel(level);
  const xpInCurrentLevel = totalXP - accumulatedXP;
  const xpNeededForNext = nextLevelXP - accumulatedXP;

  const progressPercent = Math.min(100, Math.max(0, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100)));

  return {
    level,
    currentLevelXP: xpInCurrentLevel,
    nextLevelXP: xpNeededForNext,
    progressPercent
  };
}

