import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Container, Divider, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AnyImportStatus from './AnyImportStatus'
import { LanguageContext } from '../../../../context/AppContext'
// import { API } from '../../../../configurations'

function AnyImport ({ file }) {
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileImport = async () => {
    try {
      const operationId = uuidv4()
      const importInstructions = {
        'id': operationId,
        'command': {
          'target': 'agent',
          'cmd': 'any-import',
          'args': {
            'template': {
              'files': [`${file.folder}/${file.filename}`]
            }
          }
        },
        'state': {}
      }

      // TODO: handle auth header for local testing differently
      await executePut({
/*        headers: {
          Authorization: `Bearer ${API.TOKEN}`
        },*/
        data: importInstructions,
        url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
      })

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container textAlign="center">
      <Button primary size="huge" disabled={transactionId !== ''} onClick={() => initiateFileImport()}>
        <Icon name="cloud upload" />
        Initiate import
      </Button>
      <Divider hidden />
      {error && <ErrorMessage error={error} language={language} />}
      {transactionId !== '' && !loading && <AnyImportStatus file={file} transactionId={transactionId} />}
    </Container>
  )
}

export default AnyImport
