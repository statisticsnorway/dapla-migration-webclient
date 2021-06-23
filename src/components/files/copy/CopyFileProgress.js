import { useEffect, useState } from 'react'
import { Progress } from 'semantic-ui-react'

function CopyFileProgress ({ readBytes, fileSize }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(parseInt(((readBytes / fileSize) * 100).toFixed(0)))
  }, [readBytes, fileSize])

  return (
    <Progress
      progress
      percent={progress}
      success={progress === 100}
      indicating={progress !== 100}
      style={{ marginTop: '1.5rem' }}
    >
      {progress !== 100 ? `Copying file ...` : `Copy complete!`}
    </Progress>
  )
}

export default CopyFileProgress
