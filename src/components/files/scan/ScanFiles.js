import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Grid, Input } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import ScanFilesStatus from './ScanFilesStatus'
import { LanguageContext } from '../../../context/AppContext'

function ScanFiles () {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [path, setPath] = useState('/ssb/stamme01')
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
            'recursive': true
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

  return (
    <Grid columns="equal">
      <Grid.Column>
        <Input
          fluid
          size="large"
          value={path}
          icon="search"
          placeholder="/ssb/stamme01"
          disabled={loading || transactionId !== ''}
          onChange={(e, { value }) => {
            setPath(value)
            setReady(false)
            setTransactionId('')
          }}
          onKeyPress={({ key }) => {
            if (key === 'Enter') {
              initiateFileScan()
            }
          }}
        />
      </Grid.Column>
      <Grid.Column verticalAlign="middle">
        {transactionId !== '' && <ScanFilesStatus ready={ready} setReady={setReady} transactionId={transactionId} />}
        {error && <ErrorMessage error={error} language={language} />}
      </Grid.Column>
    </Grid>
  )
}

export default ScanFiles
