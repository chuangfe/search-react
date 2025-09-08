import { useLocalObservable } from 'mobx-react';
import useMobxAction from '@src/hooks/useMobxAction';

function {{name}}ViewModel() {
  const state = useLocalObservable(() => ({
    value: '{{name}}'
  }));

  const onValueChange = useMobxAction((v: string) => {
    state.value = v;
  });

  return {
    value: state.value,
    onValueChange
  };
}

export default {{name}}ViewModel;
