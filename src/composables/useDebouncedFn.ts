export function useDebouncedFn<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
