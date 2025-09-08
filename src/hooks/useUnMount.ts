import { useEffect, useRef } from 'react'

import is from '@src/utils/is'

function useUnMount(callback: () => unknown) {
  const unmountRef = useRef(false)
  const callbackRef = useRef(callback)

  callbackRef.current = callback // keep latest

  useEffect(
    () => {
      return () => {
        if (is.func(callbackRef.current) && !unmountRef.current) {
          unmountRef.current = true
          callbackRef.current()
        }
      }
    },
    []
  )
}

export default useUnMount
