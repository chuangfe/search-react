import { useLocalObservable } from 'mobx-react';
import useMobxAction from '@src/hooks/useMobxAction';

function {{name}}PageViewModel() {
  const state = useLocalObservable(() => ({
    value: '{{name}}Page'
  }));

  const onValueChange = useMobxAction((v: string) => {
    state.value = v;
  });

  return {
    value: state.value,
    onValueChange
  };
}

export default {{name}}PageViewModel;
