import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useContext, useEffect, useState } from 'react'
import { Button, Divider } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import CopyFileStatus from './CopyFileStatus'
import { ApiContext, LanguageContext } from '../../../context/AppContext'
import { API, API_INSTRUCTIONS, LOCAL_STORAGE } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function CopyFile ({ file, fileSize }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileCopy = async () => {
    try {
      const operationId = uuidv4()
      const copyInstructions = API_INSTRUCTIONS.COPY(operationId, file)

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        copyInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

      setTransactionId(operationId)
      LOCAL_STORAGE(
        operationId,
        {
          command: 'copy',
          file: file,
          fileSize: fileSize
        }
      )
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
        onClick={() => initiateFileCopy()}
        disabled={loading || transactionId !== ''}
        content={APP_STEPS.COPY.INITIATE_COPY[language]}
      />
      {!loading && transactionId !== '' &&
      <CopyFileStatus file={file} fileSize={fileSize} transactionId={transactionId} />
      }
      <Divider hidden />
      {!loading && error && <ErrorMessage error={error} language={language} />}
    </>
  )
}

export default CopyFile
