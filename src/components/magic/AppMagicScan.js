import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useContext, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AppMagicScanStatus from './AppMagicScanStatus'
import { LanguageContext } from '../../context/AppContext'
import { API, API_INSTRUCTIONS } from '../../configurations'

function AppMagicScan ({ fullPath, command }) {
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileScan = async () => {
    try {
      const operationId = uuidv4()
      const path = fullPath.substr(0, fullPath.lastIndexOf('/'))
      const scanInstructions = API_INSTRUCTIONS.SCAN(operationId, path)

      await executePut({
        data: scanInstructions,
        url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`
      })

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    initiateFileScan().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {loading && !error && <Icon size="large" color="blue" name="sync alternate" loading />}
      {!loading && transactionId !== '' && !error &&
      <AppMagicScanStatus transactionId={transactionId} fullPath={fullPath} command={command} />
      }
    </>
  )
}

export default AppMagicScan
