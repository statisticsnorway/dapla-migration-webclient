import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useContext, useState } from 'react'
import { Grid, Input } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import ScanFilesStatus from './ScanFilesStatus'
import { LanguageContext } from '../../../context/AppContext'
import { API, API_INSTRUCTIONS } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function ScanFiles ({ path, setPath }) {
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileScan = async () => {
    try {
      const operationId = uuidv4()
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

  return (
    <Grid columns="equal">
      <Grid.Column>
        <Input
          fluid
          size="large"
          value={path}
          disabled={loading || transactionId !== ''}
          onChange={(e, { value }) => setPath(value)}
          placeholder={APP_STEPS.SCAN.PLACEHOLDER[language]}
          onKeyPress={({ key }) => {
            if (key === 'Enter') {
              initiateFileScan().then()
            }
          }}
        />
      </Grid.Column>
      <Grid.Column verticalAlign="middle">
        {transactionId !== '' && !error && !loading && <ScanFilesStatus transactionId={transactionId} />}
        {!loading && error && <ErrorMessage error={error} language={language} />}
      </Grid.Column>
    </Grid>
  )
}

export default ScanFiles
