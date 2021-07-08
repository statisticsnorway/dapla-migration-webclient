import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Progress } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../../context/AppContext'
import { API, APP } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function ArchiveUnpackStatus ({ file, transactionId, isCompleted = false }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [statusError, setStatusError] = useState(null)

  const [{ loading, error }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}${API.COMMAND}${transactionId}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    if (!isCompleted) {
      const interval = setInterval(() => {
        checkStatus().then()
      }, 5000)

      const checkStatus = async () => {
        await refetch().then(res => {
          if (res.data.state.status === API.STATUS.COMPLETED) {
            setReady(true)
            clearInterval(interval)
          }

          if (res.data.state.status === API.STATUS.ERROR) {
            setReady(true)
            setStatusError(getNestedObject(res, API.ERROR_PATH))
            clearInterval(interval)
          }
        })
      }

      return () => clearInterval(interval)
    } else {
      setReady(true)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Progress
        total={1}
        progress="ratio"
        error={error || statusError}
        success={ready && !error && !statusError}
        indicating={!ready && !error && !statusError}
        value={ready ? error || statusError ? 0 : 1 : 0}
      >
        {!ready && !error && !statusError && APP_STEPS.OPERATION.ARCHIVE.UNPACKING[language]}
        {ready && !error && !statusError && APP_STEPS.OPERATION.ARCHIVE.UNPACK_COMPLETE[language]}
      </Progress>
      {ready && !loading && !error && !statusError &&
      <Link
        to={{
          pathname: `${APP[2].route}/${API.OPERATIONS[3]}`,
          state: {
            file: {
              folder: file.substr(0, file.lastIndexOf('/')),
              filename: file.substr(file.lastIndexOf('/') + 1, file.length)
            }
          }
        }}
      >
        {APP_STEPS.MAGIC.CONTINUE[language]}
      </Link>
      }
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default ArchiveUnpackStatus
