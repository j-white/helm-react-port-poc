import { useEffect, useState } from 'react';

type ResultIdleState = {
  state: 'idle';
  data: undefined;
  error: undefined;
};

type ResultLoadingState = {
  state: 'loading';
  data: undefined;
  error: undefined;
};

type ResultSuccessState<Success> = {
  state: 'success';
  data: Success;
  error: undefined;
};

type ResultFailureState<Failure> = {
  state: 'failure';
  data: undefined;
  error: Failure;
};

type Result<Success, Failure> =
  | ResultIdleState
  | ResultLoadingState
  | ResultSuccessState<Success>
  | ResultFailureState<Failure>;

export function useAsync<Success, Failure>(
  callback: () => Promise<Success>,
  deps?: React.DependencyList
): Result<Success, Failure> {
  const [result, setResult] = useState<Result<Success, Failure>>({
    state: 'loading',
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    let cancelled = false;

    let fetch = async () => {
      try {
        const data = await callback();
        if (!cancelled) {
          const success: Result<Success, Failure> = {
            state: 'success',
            data,
            error: undefined,
          };
          setResult(success);
        }
      } catch (error) {
        if (!cancelled) {
          const failure: Result<Success, Failure> = {
            state: 'failure',
            data: undefined,
            error,
          };
          setResult(failure);
        }
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, deps);

  return result;
}
