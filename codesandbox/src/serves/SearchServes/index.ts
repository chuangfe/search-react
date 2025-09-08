import GetSearchItem, { GetSearchItemProps } from "./models/GetSearchItem";
import fakeSearchItems from "../../Fakes/searchItems";

interface GetSearchProps {
  keyword: string;
  page: number;
  limit: number;
  delay: number;
}

interface GetSearchRes {
  data: GetSearchItem[];
  page: number;
  hasMore: boolean;
}

class SearchServes {
  static getSearch(
    props: GetSearchProps,
    signal: AbortSignal | null = null
  ): Promise<GetSearchRes> {
    const limit = 4;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // 隨機錯誤
        if (Math.random() > 0.9) {
          reject(new Error("Server error"));
          return;
        }

        const filterFake = fakeSearchItems.filter((item) =>
          item.name.toLowerCase().includes(props.keyword)
        );

        const startIndex = props.page * props.limit;
        const endIndex = startIndex + props.limit;

        const res = filterFake.slice(startIndex, endIndex);

        const data = res.map((item) => new GetSearchItem(item));

        const hasMore = endIndex < filterFake.length;

        console.log("");
        console.log("");
        console.log("page", props.page);
        console.log("hasMore", hasMore);
        console.log("startIndex", startIndex);
        console.log("endIndex", endIndex);
        console.log("filterFake", filterFake);
        console.log(data, data);
        console.log("");
        console.log("");

        resolve({
          data: data,
          page: props.page,
          hasMore: hasMore,
        });
      }, props.delay);

      const onAbort = () => {
        console.log("中斷 API", "abort");

        clearTimeout(timeout);

        reject(new DOMException("Aborted", "AbortError"));
      };

      // 支援 abort 中斷
      signal?.addEventListener("abort", onAbort);
    });
  }
}

export default SearchServes;
