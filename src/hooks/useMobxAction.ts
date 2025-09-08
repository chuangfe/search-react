import { useCallback } from 'react';
import { runInAction } from 'mobx';

function useMobxAction<T extends (...args: any[]) => void>(
  fn: T,
  deps: any[] = []
): T {
  return useCallback(
    ((...args: any[]) => {
      runInAction(() => {
        fn(...args);
      });
    }) as T,
    deps
  );
}

export default useMobxAction
