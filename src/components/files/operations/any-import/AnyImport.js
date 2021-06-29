import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Container, Divider, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AnyImportStatus from './AnyImportStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function AnyImport ({ file }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileImport = async () => {
    try {
      const operationId = uuidv4()
      const importInstructions = API_INSTRUCTIONS.ANY_IMPORT(operationId, [`${file.folder}/${file.filename}`])

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        importInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container textAlign="center">
      <Button
        primary
        size="huge"
        onClick={() => initiateFileImport()}
        disabled={loading || transactionId !== ''}
      >
        <Icon name="cloud upload" />
        {APP_STEPS.IMPORT.INITIATE_IMPORT[language]}
      </Button>
      <Divider hidden />
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && transactionId !== '' && <AnyImportStatus file={file} transactionId={transactionId} />}
    </Container>
  )
}

export default AnyImport
