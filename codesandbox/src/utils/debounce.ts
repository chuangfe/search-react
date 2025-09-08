interface Options {
  delay: number;
}

function debounce<T, P>(
  callback: (v: T, p: P) => void,
  options: Options = { delay: 400 }
): (v: T, p: P) => void {
  // 適應 node 與瀏覽器的型別
  let timer: ReturnType<typeof setTimeout>;

  return (v: T, p: P) => {
    console.log("debounce");
    clearTimeout(timer);
    timer = setTimeout(() => callback(v, p), options.delay);
  };
}

export default debounce;
