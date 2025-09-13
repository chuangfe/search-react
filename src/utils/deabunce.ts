import { DEABUNCE_MESSAGES, ABORT_MESSAGES } from '@src/constants/messages';

interface Config {
  wait: number
}

function deabunce(
  func: (...args: any[]) => void,
  config: Config = { wait: 400 }
) {
  let timer: number | undefined = undefined;

  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, config.wait);
  };
}

export default deabunce;
