import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Divider, Progress } from 'semantic-ui-react'

import { LanguageContext } from '../../../context/AppContext'
import { APP } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function CopyFileProgress ({ file, readBytes, fileSize }) {
  const { language } = useContext(LanguageContext)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(parseInt(((readBytes / fileSize) * 100).toFixed(0)))
  }, [readBytes, fileSize])

  return (
    <>
      <Progress
        progress
        percent={progress}
        success={progress === 100}
        indicating={progress !== 100}
        style={{ marginTop: '1.5rem' }}
      >
        {progress !== 100 ? APP_STEPS.COPY.COPYING[language] : APP_STEPS.COPY.COPY_COMPLETE[language]}
      </Progress>
      {progress === 100 &&
      <>
        <Divider hidden />
        <Link to={{ pathname: `${APP[1].route}`, state: { file: file } }}>
          {APP_STEPS.COPY.GO_TO_OPERATION[language]}
        </Link>
      </>
      }
    </>
  )
}

export default CopyFileProgress
