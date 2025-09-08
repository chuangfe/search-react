import { useEffect, useRef } from 'react'

import is from '@src/utils/is'

function useDidMount(callback: () => unknown) {
  const mountRef = useRef(false)
  const callbackRef = useRef(callback)

  callbackRef.current = callback // keep latest

  useEffect(
    () => {
      if (is.func(callbackRef.current) && !mountRef.current) {
        mountRef.current = true
        callbackRef.current()
      }
    },
    []
  )
}

export default useDidMount
