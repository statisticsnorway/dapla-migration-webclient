import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Divider } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import CopyFileStatus from './CopyFileStatus'
import { LanguageContext } from '../../../context/AppContext'
// import { API } from '../../../configurations'

function CopyFile ({ file, fileSize }) {
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

      // TODO: handle auth header for local testing differently
      await executePut({
/*        headers: {
          Authorization: `Bearer ${API.TOKEN}`
        },*/
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
        size="large"
        content="Initiate copy"
        onClick={() => initiateFileCopy()}
        disabled={loading || transactionId !== ''}
      />
      {transactionId !== '' && <CopyFileStatus file={file} fileSize={fileSize} transactionId={transactionId} />}
      <Divider hidden />
      {error && <ErrorMessage error={error} language={language} />}
    </>
  )
}

export default CopyFile
