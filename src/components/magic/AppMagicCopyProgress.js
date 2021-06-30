import { useContext, useEffect, useState } from 'react'
import { Progress } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { APP_STEPS } from '../../enums'

function AppMagicCopyProgress ({ readBytes, fileSize }) {
  const { language } = useContext(LanguageContext)

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
      {progress !== 100 ? APP_STEPS.COPY.COPYING[language] : APP_STEPS.COPY.COPY_COMPLETE[language]}
    </Progress>
  )
}

export default AppMagicCopyProgress
