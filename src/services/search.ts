import { FAKE_SEARCH_DATA } from '@src/constants/data';
import { SearchItem } from '@src/constants/data';

interface PostSearchParams {
  keyword: string
  page?: number
  limit?: number
  delay?: number
}

interface PostSearchResult {
  data: SearchItem[]
  page: number
  hasMore: boolean
}

class SearchServes {
  static postSearch(
    props: PostSearchParams,
    signal: AbortSignal | null = null
  ): Promise<PostSearchResult> {
    const { keyword, page = 0, limit = 5, delay = 500 } = props;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {

        // 隨機錯誤
        if (Math.random() > 0.9) {
          reject(new Error('Server error'));
          return;
        }

        const filterFake = FAKE_SEARCH_DATA.filter((item) =>
          item.name.toLowerCase().includes(keyword)
        );

        const startIndex = page * limit;
        const endIndex = startIndex + limit;

        const res = filterFake.slice(startIndex, endIndex);

        const hasMore = endIndex < filterFake.length;

        console.log('');
        console.log('');
        console.log('page', props.page);
        console.log('hasMore', hasMore);
        console.log('startIndex', startIndex);
        console.log('endIndex', endIndex);
        console.log('filterFake', filterFake);
        console.log('');
        console.log('');

        resolve({
          data: res,
          page: page,
          hasMore: hasMore
        });
      }, delay);

      const onAbort = () => {
        console.log('中斷 API', 'abort');

        clearTimeout(timeout);

        reject(new DOMException('Aborted', 'AbortError'));
      };

      // 支援 abort 中斷
      signal?.addEventListener('abort', onAbort);
    });
  }
}

export default SearchServes;
