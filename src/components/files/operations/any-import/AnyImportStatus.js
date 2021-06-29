import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon, Progress } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../../context/AppContext'

function AnyImportStatus ({ file, transactionId }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [statusError, setStatusError] = useState(null)

  const [{ data, loading, error }, refetch] = useAxios(
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
          clearInterval(interval)
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
      <Progress
        total={1}
        progress="ratio"
        error={error || statusError}
        value={ready ? statusError ? 0 : 1 : 0}
        success={ready && !error && !statusError}
        indicating={!ready && !error && !statusError}
      />
      {ready && !loading && !error && !statusError &&
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
        <b>{` gs://ssb-data-prod-kilde-ssb-onprem-copy${file.folder}/${file.filename}`}</b>
      </>
      }
      {error && <ErrorMessage error={error} language={language} />}
      {statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default AnyImportStatus
