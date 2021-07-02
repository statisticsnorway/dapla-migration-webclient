import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon, Progress } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../../context/AppContext'
import { API, FILE } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function AnyImportStatus ({ file, transactionId, isCompleted = false, isCompleteData }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [state, setState] = useState(null)
  const [status, setStatus] = useState(null)
  const [statusError, setStatusError] = useState(null)

  const [{ data, loading, error }, refetch] = useAxios(
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
            setState(null)
            setStatus(null)
            clearInterval(interval)
          }

          if (res.data.state.status === API.STATUS.IN_PROGRESS) {
            setState(res.data.state)
            setStatus(res.data.result.status)
          }

          if (res.data.state.status === API.STATUS.ERROR) {
            setReady(true)
            setState(null)
            setStatus(null)
            setStatusError(getNestedObject(res, API.ERROR_PATH))
            clearInterval(interval)
          }
        })
      }

      return () => clearInterval(interval)
    } else {
      setReady(true)
      setState(isCompleteData.state)
      setStatus(isCompleteData.result.status)
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
        {!ready && !error && !statusError && APP_STEPS.OPERATION.IMPORT.IMPORTING[language]}
        {ready && !error && !statusError && APP_STEPS.OPERATION.IMPORT.IMPORT_COMPLETE[language]}
      </Progress>
      {!ready && state !== null && <p>{JSON.stringify(state, null, 2)}</p>}
      {!ready && status !== null && <p>{JSON.stringify(status, null, 2)}</p>}
      {ready && !loading && !error && !statusError &&
      <>
        {`Start time: ${isCompleted ? isCompleteData.state.startTime : data.state.startTime}`}
        <br />
        {`Completed: ${isCompleted ? isCompleteData.state.timestamp : data.state.timestamp}`}
        <br />
        {`Status: ${isCompleted ? isCompleteData.state.status : data.state.status} `}
        <Icon color="green" name="check" />
        <Divider hidden />
        {JSON.stringify(isCompleted ? isCompleteData.result.status : data.result.status, null, 2)}
        <Divider hidden />
        {APP_STEPS.OPERATION.IMPORT.FOUND_IN_BUCKET[language]}
        <b>
          {FILE.createBucketString(
            'gs://ssb-data-prod-kilde-ssb-onprem-copy/user/< username >',
            file,
            isCompleted ? isCompleteData.state.timestamp : data.state.timestamp
          )}
        </b>
      </>
      }
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default AnyImportStatus
