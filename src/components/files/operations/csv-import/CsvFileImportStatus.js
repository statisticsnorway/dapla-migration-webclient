import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon, Progress } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../../context/AppContext'

function CsvFileImportStatus ({ file, transactionId }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [state, setState] = useState(null)
  const [status, setStatus] = useState(null)
  const [statusError, setStatusError] = useState(null)

  const [{
    data,
    loading,
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
          setState(null)
          setStatus(null)
          clearInterval(interval)
        }

        if (res.data.state.status === 'in-progress') {
          setState(res.data.state)
          setStatus(res.data.result.status)
        }

        if (res.data.state.status === 'error') {
          setReady(true)
          setState(null)
          setStatus(null)
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
      <Progress
        progress
        percent={ready ? 100 : 0}
        error={error || statusError}
        success={ready && !error && !statusError}
        indicating={!ready && !error && !statusError}
      />
      {state !== null && <p>{JSON.stringify(state, null, 2)}</p>}
      {status !== null && <p>{JSON.stringify(status, null, 2)}</p>}
      {ready && !loading && !error &&
      <>
        {`Start time: ${data.state.startTime}`}
        <br />
        {`Completed: ${data.state.timestamp}`}
        <br />
        {`Status: ${data.state.status} `}
        <Icon color="green" name="check" />
        <Divider hidden />
        {JSON.stringify(data.result.status, null, 2)}
        <Divider hidden />
        File can be found in bucket
        <b>{` gs://ssb-data-prod-kilde-migration/kilde/migration${file.folder}/${file.filename}`}</b>
      </>
      }
      {error && <ErrorMessage error={error} language={language} />}
      {statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default CsvFileImportStatus
