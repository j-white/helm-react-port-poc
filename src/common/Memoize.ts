function argsDiffer(previousArgs: any[], args: any[]): boolean {
  if (previousArgs.length !== args.length) {
    return true;
  }
  return args.some((arg, index) => arg !== previousArgs[index]);
}

export function memoizePrevious<T extends (...args: any[]) => ReturnType<T>>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  let previousArgs: Parameters<T>;
  let previousResult: ReturnType<T>;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    if (previousArgs && !argsDiffer(previousArgs, args)) {
      return previousResult;
    }
    previousArgs = args;
    return (previousResult = fn.apply(this, args));
  };
}
