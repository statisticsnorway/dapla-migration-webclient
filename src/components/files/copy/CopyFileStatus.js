import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import CopyFileProgress from './CopyFileProgress'
import { LanguageContext } from '../../../context/AppContext'
import { API } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function CopyFileStatus ({ file, fileSize, transactionId, nextCommand, isCompleted = false }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [readBytes, setReadBytes] = useState(0)
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
    } else {
      setReady(true)
      setReadBytes(fileSize)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {!ready && !error && !statusError && <Icon color="blue" name="sync alternate" loading />}
      {ready && !error && !statusError && readBytes !== fileSize && APP_STEPS.COPY.COPY_INITIATED[language]}
      {ready && !error && !statusError &&
      <CopyFileProgress file={file} readBytes={readBytes} fileSize={fileSize} nextCommand={nextCommand} />
      }
      <Divider hidden />
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default CopyFileStatus
