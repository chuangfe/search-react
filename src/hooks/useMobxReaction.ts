import { useEffect } from 'react';
import { reaction, IReactionOptions } from 'mobx';

/**
 * 封裝 MobX reaction 的 Hook
 * @param expression - 被觀察的 observable 表達式
 * @param effect - observable 變化時執行的副作用
 * @param options - reaction 的選項，可選
 */
export default function useMobxReaction<T>(
  expression: () => T,
  effect: (value: T, prev: T | undefined) => void,
  options: IReactionOptions<T, boolean> = { fireImmediately: false },
  deps: any[] = []
) {
  useEffect(() => {
    const disposer = reaction(expression, effect, options);
    return () => disposer();
  }, deps);
}
