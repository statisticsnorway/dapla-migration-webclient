import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Divider } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import FileCopyStatus from './FileCopyStatus'
import { LanguageContext } from '../../../context/AppContext'

function FileCopy ({ file }) {
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileCopy = async () => {
    try {
      const operationId = uuidv4()
      const copyInstructions = {
        'id': operationId,
        'command': {
          'target': 'sas-agent',
          'cmd': 'copy',
          'args': {
            'path': file
          }
        },
        'state': {}
      }

      await executePut({
        data: copyInstructions,
        url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
      })

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setTransactionId('')
  }, [file])

  return (
    <>
      <Button
        primary
        icon="copy"
        size="large"
        content="Copy"
        loading={loading}
        onClick={() => initiateFileCopy()}
        disabled={loading || error !== null}
      />
      {transactionId !== '' && <FileCopyStatus file={file} transactionId={transactionId} />}
      <Divider hidden />
      {error && <ErrorMessage error={error} language={language} />}
    </>
  )
}

export default FileCopy
