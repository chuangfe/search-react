import { useCallback, useRef } from 'react';
import { useLocalObservable } from 'mobx-react';
import type { SearchItem } from '@src/constants/data';
import useMobxAction from '@src/hooks/useMobxAction';
import SearchServes from '@src/services/search';

function SearchPageViewModel() {
  const state = useLocalObservable(() => ({
    keyword: 'SearchPage',
    hasMore: false,
    page: 0,
    list: [] as SearchItem[]
  }));

  const signalRef = useRef<AbortController | null>(null);

  const onKeywordChange = useMobxAction(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      state.keyword = e.target.value;

      fetchSearch();
    }
  );

  const fetchSearch = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    // 中斷上一次請求
    signalRef.current?.abort();
    signalRef.current = controller;

    SearchServes.postSearch({ keyword: state.keyword }, signal);
  }, [state.keyword]);

  return {
    keyword: state.keyword,
    onKeywordChange,
    list: state.list
  };
}

export default SearchPageViewModel;
