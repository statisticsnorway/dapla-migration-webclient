import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import AppMagicInit from './AppMagicInit'
import { LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'

function AppMagicScanStatus ({ transactionId, fullPath, command }) {
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
    }, 2000)

    const checkStatus = async () => {
      await refetch().then(res => {
        if (res.data.state.status === API.STATUS.COMPLETED) {
          setReady(true)
          clearInterval(interval)
        }

        if (res.data.state.status === API.STATUS.IN_PROGRESS) {
          setReady(false)
        }

        if (res.data.state.status === API.STATUS.ERROR) {
          setStatusError(getNestedObject(res, API.ERROR_PATH))
          setReady(true)
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
      {ready && !error && !statusError && <AppMagicInit fullPath={fullPath} command={command} />}
    </>
  )
}

export default AppMagicScanStatus
