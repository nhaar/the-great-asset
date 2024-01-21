export function isValidNumberInput (value: string | null): boolean {
  return value?.match(/^\d+$/) !== null
}

export function getNewProfitQuota (randomValue: number, timesFulfilled: number, previousQuota: number): number {
  if (timesFulfilled < 0) {
    return 130
  }

  // the result is truncated in the end in-game
  return Math.floor(previousQuota + 100 * (1 + Math.pow(timesFulfilled + 1, 2) / 16) * (randomValue + 1))
}
