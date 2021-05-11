import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import FileImport from '../import/FileImport'
import { LanguageContext } from '../../../context/AppContext'

function FileStructureDetectStatus ({ fileData, transactionId }) {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
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
      {!ready && !error && !statusError && <Icon color="blue" size="big" name="sync alternate" loading />}
      {ready && !loading && !error && !statusError && <FileImport data={data.result.template} fileData={fileData} />}
      {error && <ErrorMessage error={error} language={language} />}
      {statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default FileStructureDetectStatus
