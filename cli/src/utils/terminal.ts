/** Get terminal width, capped with a reasonable minimum. */
export function termWidth(): number {
  return Math.max(process.stdout.columns ?? 80, 40)
}
