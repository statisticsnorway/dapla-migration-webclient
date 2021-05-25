import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Divider, Input } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import FileScanStatus from './FileScanStatus'
import { LanguageContext } from '../../../context/AppContext'

function FileScan ({ path, setPath, ready, setReady }) {
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileScan = async () => {
    try {
      const operationId = uuidv4()
      const scanInstructions = {
        'id': operationId,
        'command': {
          'target': 'sas-agent',
          'cmd': 'scan',
          'args': {
            'path': path,
            'recursive' : true
          }
        },
        'state': {}
      }

      await executePut({
        data: scanInstructions,
        url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
      })

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setTransactionId('')
  }, [path])

  return (
    <>
      <Input
        fluid
        size='large'
        value={path}
        icon='search'
        disabled={loading}
        placeholder='/ssb/stamme01'
        onChange={(e, { value}) => setPath(value)}
        onKeyPress={({ key }) => key === 'Enter' && initiateFileScan()}
      />
      {transactionId !== '' && <FileScanStatus ready={ready} setReady={setReady} transactionId={transactionId} />}
      <Divider hidden />
      {error && <ErrorMessage error={error} language={language} />}
    </>
  )
}

export default FileScan
