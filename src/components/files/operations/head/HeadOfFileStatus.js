import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage, getNestedObject } from '@statisticsnorway/dapla-js-utilities'

import HeadOfFileContent from './HeadOfFileContent'
import CsvHeadOfFileContent from '../csv-import/CsvHeadOfFileContent'
import { LanguageContext } from '../../../../context/AppContext'
import { API } from '../../../../configurations'

function HeadOfFileStatus ({ file, transactionId, operation }) {
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
        if (res.data.state.status === API.STATUS.COMPLETE) {
          setReady(true)
          clearInterval(interval)
        }

        if (res.data.state.status === API.STATUS.ERROR) {
          setReady(true)
          setStatusError(getNestedObject(res, API.ERROR_PATH))
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
      {ready && !error && !statusError && operation === API.OPERATIONS[1] ?
        <CsvHeadOfFileContent file={file} />
        :
        <HeadOfFileContent file={file} />
      }
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && statusError && <ErrorMessage error={statusError} language={language} />}
    </>
  )
}

export default HeadOfFileStatus
