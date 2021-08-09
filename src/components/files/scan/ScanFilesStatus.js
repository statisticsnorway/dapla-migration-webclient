import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../context/AppContext'
import { API } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function ScanFilesStatus ({ transactionId }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
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
        const status = getNestedObject(res, API.STATUS_PATH)

        if (status === API.STATUS.COMPLETED) {
          setReady(true)
          clearInterval(interval)
        }

        if (status === API.STATUS.IN_PROGRESS) {
          setReady(false)
        }

        if (status === API.STATUS.ERROR) {
          setStatusError(getNestedObject(res, API.ERROR_PATH))
          setReady(true)
          clearInterval(interval)
        }
      }).catch(() => clearInterval(interval))
    }

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {!ready && !error && !statusError &&
      <>
        <Icon style={{ marginRight: '1rem' }} size="large" color="blue" name="sync alternate" loading />
        {APP_STEPS.SCAN.SCANNING[language]}
      </>
      }
      {ready && !error && !statusError && !loading &&
      <>
        <Icon style={{ marginRight: '1rem' }} size="large" color="green" name="check" />
        {APP_STEPS.SCAN.COMPLETE[language]}
      </>
      }
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default ScanFilesStatus
