import { useEffect, useState } from 'react'

const defaultEditorWidth = 1836
const editorWidthFactor = 0.95625

export function useWindowSize () {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  })
  const [editorWidth, setEditorWidth] = useState(
    windowSize.width !== undefined ? windowSize.width * editorWidthFactor : defaultEditorWidth
  )

  useEffect(() => {
    function handleResize () {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (windowSize.width !== undefined) {
      setEditorWidth(windowSize.width * editorWidthFactor)
    } else {
      setEditorWidth(defaultEditorWidth)
    }
  }, [windowSize.width])

  return { windowSize, editorWidth }
}
