import { useCallback, useRef } from 'react';
import { useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import type { SearchItem } from '@src/constants/data';
import useMobxAction from '@src/hooks/useMobxAction';
import SearchServes from '@src/services/search';
import deabunce from '@src/utils/deabunce';
import retry from '@src/utils/retry';
import { SERVER_ERROR_MESSAGE } from '@src/constants/messages';

function SearchPageViewModel() {
  const state = useLocalObservable(() => ({
    keyword: '',
    hasMore: false,
    page: 0,
    list: [] as SearchItem[]
  }));

  const apiSignalRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    // 有關鍵字才呼叫 api
    if (state.keyword) {
      const res = await SearchServes.postSearch(
        { keyword: state.keyword },
        apiSignalRef.current?.signal
      );

      runInAction(() => {
        console.log('fetch', '呼叫 api', '成功', state.keyword);

        state.list = res.data;
        state.page = res.page;
        state.hasMore = res.hasMore;
      });
    }
  }, []);

  const tryFetch = useCallback(async () => {
    try {
      await fetch();
    } catch (error: any) {
      console.log('fetch', '失敗', error?.message);

      switch (error?.message) {
        case SERVER_ERROR_MESSAGE.retry: {
          try {
            // 重試機制有可能出現其他錯誤, 所以要再 try catch
            await retry(fetch);
          } catch (retryError: any) {
            console.log('retry', '失敗', retryError?.message);
          }

          break;
        }

        case SERVER_ERROR_MESSAGE.wait: {
          console.log(SERVER_ERROR_MESSAGE.wait);
          break;
        }
      }
    }
  }, []);

  const deabunceFetch = useCallback(deabunce(tryFetch, { wait: 400 }), []);

  const onKeywordChange = useMobxAction(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      state.keyword = e.target.value.trim();;

      // 重置資料
      state.hasMore = false;
      state.page = 0;
      state.list = [];

      // 中斷 api
      apiSignalRef.current?.abort();

      // 建立 api 的 AbortController
      const apiController = new AbortController();
      apiSignalRef.current = apiController;

      // 呼叫 deabunce fetch
      // 這邊不判斷 keyword 是因為要讓 deabunce timer 重置
      deabunceFetch();
    },
    []
  );

  return {
    keyword: state.keyword,
    onKeywordChange,
    list: state.list
  };
}

export default SearchPageViewModel;
