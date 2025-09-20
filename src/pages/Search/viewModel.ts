import { useCallback, useEffect, useRef } from 'react';
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
    list: [] as SearchItem[],
    searching: false,
    paging: false,

    get check() {
      return {
        // 鎖住自動載入分頁
        // 沒有關鍵字, 沒有更多資料, 正在搜尋, 且正在載入分頁
        paging: this.keyword && this.hasMore && !this.searching && !this.paging
      };
    }
  }));

  const apiSignalRef = useRef<AbortController | null>(null);
  const pagingSignalRef = useRef<AbortController | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 呼叫 api
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

    runInAction(() => {
      // 搜尋結束
      state.searching = false;
    });
  }, []);

  // 嘗試呼叫 fetch, 失敗會根據錯誤訊息做處理
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
            console.log('tryFetch retry', '失敗', retryError?.message);
          }

          break;
        }

        case SERVER_ERROR_MESSAGE.wait: {
          console.log('tryFetch', SERVER_ERROR_MESSAGE.wait);
          break;
        }
      }
    }
  }, []);

  // 呼叫分頁 api
  const fathPaging = useCallback(async () => {
    console.log('分頁', state.check.paging);

    if (state.check.paging) {
      const res = await SearchServes.postSearch(
        { keyword: state.keyword, page: state.page + 1 },
        pagingSignalRef.current?.signal
      );

      runInAction(() => {
        console.log('fetch', '呼叫 api', '成功', state.keyword);

        state.list = [...state.list, ...res.data];
        state.page = res.page;
        state.hasMore = res.hasMore;
      });
    }
  }, []);

  const tryFathPaging = useCallback(async () => {
    try {
      await fathPaging();
    } catch (error: any) {
      console.log('fathPaging', '失敗', error?.message);

      switch (error?.message) {
        case SERVER_ERROR_MESSAGE.retry: {
          try {
            // 重試機制有可能出現其他錯誤, 所以要再 try catch
            await retry(fathPaging);
          } catch (retryError: any) {
            console.log('tryFathPaging retry', '失敗', retryError?.message);
          }
          break;
        }

        case SERVER_ERROR_MESSAGE.wait: {
          console.log('tryFathPaging', SERVER_ERROR_MESSAGE.wait);
          break;
        }
      }
    }
  }, []);

  // 重置 signal
  const resetSignal = useCallback(() => {
    // 中斷 api
    apiSignalRef.current?.abort();
    pagingSignalRef.current?.abort();

    // 建立 api 的 AbortController
    const apiController = new AbortController();
    apiSignalRef.current = apiController;

    // 建立分頁的 AbortController
    const pagingController = new AbortController();
    pagingSignalRef.current = pagingController;
  }, []);

  const deabunceFetch = useCallback(deabunce(tryFetch, { wait: 400 }), []);

  const onKeywordChange = useMobxAction(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      state.keyword = e.target.value.trim();

      // 開始搜尋
      state.searching = true;

      // 重置資料
      state.hasMore = false;
      state.page = 0;
      state.list = [];

      // 中斷 api
      resetSignal();

      // 呼叫 deabunce fetch
      // 這邊不判斷 keyword 是因為要讓 deabunce timer 重置
      deabunceFetch();
    },
    []
  );

  // 監視 loadMoreRef, 進入畫面就呼叫分頁
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          console.log('loadMoreRef', '進入畫面');
          tryFathPaging();
        }
      },
      {
        root: null, // 預設是 viewport
        rootMargin: '0px',
        threshold: 1.0 // 100% 進入可視區域才觸發
      }
    );

    if (loadMoreRef.current) {
      console.log('loadMoreRef', '開始監視');
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        console.log('loadMoreRef', '停止監視');
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [
    // 如果 list 的 limit 沒有將 loadMoreRef 推出畫面, 需要重新觸發監視
    state.check.paging
  ]);

  return {
    keyword: state.keyword,
    onKeywordChange,
    list: state.list,
    checks: state.check,
    loadMoreRef
  };
}

export default SearchPageViewModel;
