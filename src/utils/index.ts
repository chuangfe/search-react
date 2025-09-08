export const delay = (ms: number) => new Promise((r) => { setTimeout(r, ms) })

export const some = (value: string, patterns: (RegExp | string)[] = []) => {
  return patterns.some((p) => {
    const reg = Object.prototype.toString.call(value) === '[object String]' ? new RegExp(p) : p as RegExp
    return reg.test(value)
  })
}

/**
 * array 1D to 2D
 * @param {any[]} arr
 * @param {number} size group size
 * @returns
 */
export const group = <T extends []>(arr: T, size: number) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (_, idx) => arr.slice(idx * size, (idx + 1) * size)
)


export const uuidv4 = () => '10000000-1000-4000-8000-100000000000'.replace(
  /[018]/g,
  (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
)
