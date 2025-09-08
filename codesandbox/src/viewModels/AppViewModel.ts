import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchServes from "../serves/SearchServes";
import GetSearchItem from "../Serves/SearchServes/models/GetSearchItem";
import debounce from "../utils/debounce";

function AppViewModel() {
  const [keyword, setKeyword] = useState("");
  const [commodities, setCommodities] = useState<GetSearchItem[]>([]);

  // 搜尋中
  const [isSearching, setSearching] = useState(false);

  // 可以自動載下一頁
  const [nextPage, setNextPage] = useState(0);
  const [hasMore, setMore] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const more = useMemo(() => !isSearching && hasMore, [isSearching, hasMore]);

  const fetchSearch = useCallback(
    debounce(
      async (v: string, p: number) => {
        // 如果本來有請求就停止
        if (abortRef.current) {
          abortRef.current.abort();
        }

        // 新建 AbortController, 用於 catch fetch
        const controller = new AbortController();
        abortRef.current = controller;

        try {
          const res = await SearchServes.getSearch(
            {
              keyword: v,
              page: p,
              limit: 4,
              delay: 2000,
            },
            controller.signal
          );
          const nextPage = p + 1;

          setCommodities((pre) => [...pre, ...res.data]);
          setSearching(false);
          setNextPage(nextPage);
          setMore(res.hasMore);
        } catch (e) {
          console.log("catch", e);
        }
      },
      { delay: 400 }
    ),
    []
  );

  const onKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      const nextPage = 0;

      setKeyword(value);
      setCommodities([]);
      setSearching(true);
      setNextPage(nextPage);

      if (value) {
        fetchSearch(value, nextPage);
      }
    },
    []
  );

  const autoMore = useCallback(() => {
    fetchSearch(keyword, nextPage);
  }, [more]);

  useEffect(() => {
    if (more) {
      fetchSearch(keyword, nextPage);
    }
  }, [more]);

  return {
    keyword,
    onKeywordChange,
    commodities,
    more,
    autoMore,
  };
}

export default AppViewModel;
