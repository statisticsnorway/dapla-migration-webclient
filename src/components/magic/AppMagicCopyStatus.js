import useAxios from 'axios-hooks'
import { Redirect } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import AppMagicCopyProgress from './AppMagicCopyProgress'
import { LanguageContext } from '../../context/AppContext'
import { API, APP } from '../../configurations'
import { APP_STEPS } from '../../enums'

function AppMagicCopyStatus ({ fullPath, fileSize, transactionId, command }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [readBytes, setReadBytes] = useState(0)
  const [statusError, setStatusError] = useState(null)

  const [{ loading, error }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}${API.COMMAND}${transactionId}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus().then()
    }, 5000)

    const checkStatus = async () => {
      await refetch().then(res => {
        if (res.data.state.status === API.STATUS.COMPLETED) {
          setReady(true)
          setReadBytes(getNestedObject(res, API.READ_BYTES_PATH))
          clearInterval(interval)
        }

        if (res.data.state.status === API.STATUS.IN_PROGRESS) {
          setReady(true)
          setReadBytes(getNestedObject(res, API.READ_BYTES_PATH))
        }

        if (res.data.state.status === API.STATUS.ERROR) {
          setReady(true)
          setStatusError(getNestedObject(res, API.ERROR_PATH))
          clearInterval(interval)
        }
      })
    }

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
      {!ready && !error && !statusError && <Icon size="large" color="blue" name="sync alternate" loading />}
      {ready && !error && !statusError && readBytes !== fileSize &&
      APP_STEPS.MAGIC.WAIT_FOR_COPY[language](command, fullPath)
      }
      {ready && !error && !statusError && readBytes !== fileSize &&
      <AppMagicCopyProgress fileSize={fileSize} readBytes={readBytes} />
      }
      {ready && !error && !statusError && readBytes === fileSize &&
      <Redirect
        push
        to={{
          pathname: `${APP[2].route}/${command}`,
          state: {
            file: {
              folder: fullPath.substr(0, fullPath.lastIndexOf('/')),
              filename: fullPath.substr(fullPath.lastIndexOf('/') + 1, fullPath.length)
            }
          }
        }}
      />
      }
    </>
  )
}

export default AppMagicCopyStatus
