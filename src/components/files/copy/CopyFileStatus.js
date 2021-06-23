import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import CopyFileProgress from './CopyFileProgress'
import { LanguageContext } from '../../../context/AppContext'

function CopyFileStatus ({ fileSize, transactionId }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [readBytes, setReadBytes] = useState(0)
  const [statusError, setStatusError] = useState(null)

  const [{
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/cmd/id/${transactionId}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus().then()
    }, 5000)

    const checkStatus = async () => {
      await refetch().then(res => {
        if (res.data.state.status === 'completed') {
          setReady(true)
          setReadBytes(res.data.result.status['read-bytes'])
          clearInterval(interval)
        }

        if (res.data.state.status === 'in-progress') {
          setReady(true)
          setReadBytes(res.data.result.status['read-bytes'])
        }

        if (res.data.state.status === 'error') {
          setReady(true)
          setStatusError(res.data.state.errorCause)
          clearInterval(interval)
        }
      })
    }

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {!ready && !error && !statusError && <Icon color="blue" name="sync alternate" loading />}
      {ready && !error && !statusError && `File copy initiated ...`}
      {ready && !statusError && <CopyFileProgress readBytes={readBytes} fileSize={fileSize} />}
      <Divider hidden />
      {error && <ErrorMessage error={error} language={language} />}
      {statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default CopyFileStatus
