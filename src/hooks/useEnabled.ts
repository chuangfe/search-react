import { useCallback, useMemo, useState } from 'react'

export default function useEnabled() {
  const [enabled, setEnabled] = useState(false)

  const enable = useCallback(() => setEnabled(true), [])
  const disable = useCallback(() => setEnabled(false), [])

  return useMemo(
    () => [enabled, enable, disable] as [boolean, () => void, () => void],
    [enabled, enable, disable]
  )
}
