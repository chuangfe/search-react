import { SERVER_ERROR_MESSAGE } from '@src/constants/messages';
import delay from '@src/utils/delay';

interface Config {
  count?: number
  maxRetries?: number
}

async function retry(func: (...args: any[]) => Promise<any>, config?: Config) {
  const count = config?.count || 1;
  const maxRetries = config?.maxRetries || 3;
  const wait = count * 1000;

  if (count <= maxRetries) {
    console.log(`第 ${count} 次重試`, `等待 ${wait} ms`);

    try {
      await delay(wait);
      await func();
    } catch (error: any) {
      console.log('retry', '錯誤', error?.message);

      if (error.message === SERVER_ERROR_MESSAGE.retry) {
        await retry(func, { count: count + 1, maxRetries });
      } else {
        throw error;
      }
    }
  } else {
    throw new Error(SERVER_ERROR_MESSAGE.wait);
  }
}

export default retry;
