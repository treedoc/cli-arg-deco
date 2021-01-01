export type AnyFunction = (...args: any[]) => any;  // Add just to avoid JS Lint complain
export function doIfNotNull<T>(obj: T | undefined, action: (obj: T) => void) { if (obj !== undefined)  action(obj); }
export function doIf(condition: boolean, action: () => void) { if (condition) action(); }

