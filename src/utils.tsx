export function isValidNumberInput (value: string | null): boolean {
  return value?.match(/^\d+$/) !== null
}
