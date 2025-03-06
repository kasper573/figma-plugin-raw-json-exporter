export async function attempt<T>(
  fn: () => Promise<T>
): Promise<AttemptResult<T>> {
  const previousConsoleWarn = console.warn;
  try {
    const warnings: string[] = [];
    console.warn = (...args: unknown[]) => warnings.push(args.join(" "));
    const data = await fn();
    if (warnings.length > 0) {
      return { type: "success-with-warnings", data, warnings };
    }
    return { type: "success", data };
  } catch (e) {
    return { type: "error", message: String(e) };
  } finally {
    console.warn = previousConsoleWarn;
  }
}

export type AttemptResult<T> =
  | { type: "success"; data: T }
  | { type: "success-with-warnings"; data: T; warnings: string[] }
  | { type: "error"; message: string };
