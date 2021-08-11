import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon, Progress } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../../context/AppContext'
import { API, FILE } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function ArchiveImportStatus ({ file, transactionId, isCompleted = false, isCompleteData }) {
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
          const status = getNestedObject(res, API.STATUS_PATH)

          if (status === API.STATUS.COMPLETED) {
            setReady(true)
            setState(null)
            setStatus(null)
            clearInterval(interval)
          }

          if (status === API.STATUS.IN_PROGRESS) {
            setState(getNestedObject(res, API.STATE_PATH))
            setStatus(getNestedObject(res, API.RESULT_STATUS_PATH))
          }

          if (status === API.STATUS.ERROR) {
            setReady(true)
            setState(null)
            setStatus(null)
            setStatusError(getNestedObject(res, API.ERROR_PATH))
            clearInterval(interval)
          }
        }).catch(() => clearInterval(interval))
      }

      return () => clearInterval(interval)
    } else {
      setReady(true)
      setState(getNestedObject(isCompleteData, API.STATE_PATH.slice(1)))
      setStatus(getNestedObject(isCompleteData, API.RESULT_STATUS_PATH.slice(1)))
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Progress
        progress
        error={!!(error || statusError)}
        success={ready && !error && !statusError}
        indicating={!ready && !error && !statusError}
        percent={ready ? error || statusError ? 0 : 100 : 0}
      >
        {!ready && !error && !statusError && APP_STEPS.OPERATION.IMPORT.IMPORTING[language]}
        {ready && !error && !statusError && APP_STEPS.OPERATION.IMPORT.IMPORT_COMPLETE[language]}
      </Progress>
      {!ready && state !== null && <p>{JSON.stringify(state, null, 2)}</p>}
      {!ready && status !== null && <p>{JSON.stringify(status, null, 2)}</p>}
      {ready && !loading && !error &&
      <>
        {`Start time: ${isCompleted ?
          getNestedObject(isCompleteData, API.START_TIME_PATH.slice(1))
          :
          getNestedObject(data, API.START_TIME_PATH.slice(1))
        }`}
        <br />
        {`Completed: ${isCompleted ?
          getNestedObject(isCompleteData, API.TIMESTAMP_PATH.slice(1))
          :
          getNestedObject(data, API.TIMESTAMP_PATH.slice(1))
        }`}
        <br />
        {`Status: ${isCompleted ?
          getNestedObject(isCompleteData, API.STATUS_PATH.slice(1))
          :
          getNestedObject(data, API.STATUS_PATH.slice(1))
        } `}
        <Icon color="green" name="check" />
        <Divider hidden />
        {JSON.stringify(isCompleted ?
          getNestedObject(isCompleteData, API.RESULT_STATUS_PATH.slice(1))
          :
          getNestedObject(data, API.RESULT_STATUS_PATH.slice(1)),
          null, 2)}
        <Divider hidden />
        {APP_STEPS.OPERATION.IMPORT.FOUND_IN_BUCKET[language]}
        <b>
          {FILE.createBucketString(
            'gs://ssb-rawdata-prod-migration/kilde/migration',
            file,
            isCompleted ?
              getNestedObject(isCompleteData, API.TIMESTAMP_PATH.slice(1))
              :
              getNestedObject(data, API.TIMESTAMP_PATH.slice(1))
          )}
        </b>
      </>
      }
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default ArchiveImportStatus
