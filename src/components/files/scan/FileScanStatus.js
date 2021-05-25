import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../../context/AppContext'

function FileScanStatus ({ transactionId, ready, setReady }) {
  const { language } = useContext(LanguageContext)

  const [statusError, setStatusError] = useState(null)

  const [{
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
          clearInterval(interval)
        }

        if (res.data.state.status === 'error') {
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
      {ready && !loading && !error && !statusError && <Icon color="green" name="check" />}
      <Divider hidden />
      {error && <ErrorMessage error={error} language={language} />}
      {statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default FileScanStatus
