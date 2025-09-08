import { useLocalObservable } from 'mobx-react';
import useMobxAction from '@src/hooks/useMobxAction';

function SearchPageViewModel() {
  const state = useLocalObservable(() => ({
    value: 'SearchPage'
  }));

  const onValueChange = useMobxAction((v: string) => {
    state.value = v;
  });

  return {
    value: state.value,
    onValueChange
  };
}

export default SearchPageViewModel;
