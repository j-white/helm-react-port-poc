export function invert<T extends string | number | symbol, U extends string | number | symbol>(
  dictionary: Record<T, U>
): Record<U, T> {
  let result: Record<U, T> = {} as Record<U, T>;
  const keys = Object.keys(dictionary);
  for (const key of keys) {
    const value = dictionary[key as T] as U;
    result[value as U] = key as T;
  }
  return result;
}
