export function isIn<T>(match: T, ...values: T[]) {
  if (values != null)
    for (const l of values) {
      if (match == null) {
        if (l == null)
          return true;
        continue;
      }
      if (match === l)
        return true;
    }
  return false;
}