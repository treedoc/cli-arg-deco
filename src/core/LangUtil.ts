export type Constructor = (...args: any[]) => any;  // Add just to avoid JS Lint complain
export function doIfNotNull<T>(obj: T | undefined, action: (obj: T) => void) { if (obj !== undefined && obj !== null)  action(obj); }
export function doIf(condition: boolean, action: () => void) { if (condition) action(); }

// TS_SPECIFIC
export function EnumValues(enumType: any) {
  return Object.keys(enumType).filter(key => !isNaN(Number(enumType[key])));
}

export function EnumsValueOf(enumType: any, value: number|string) {
  return enumType[value];
}

