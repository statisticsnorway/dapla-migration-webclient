import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Divider } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import ArchiveUnpackStatus from './ArchiveUnpackStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, LOCAL_STORAGE } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function ArchiveUnpack ({ file, trigger }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateArchiveUnpack = async () => {
    try {
      const operationId = uuidv4()
      const unpackInstructions = API_INSTRUCTIONS.ARCHIVE_UNPACK(operationId, `${file.folder}/${file.filename}`)

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        unpackInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

      setTransactionId(operationId)
      LOCAL_STORAGE(
        operationId,
        {
          command: API.ARCHIVE_UNPACK,
          file: `${file.folder}/${file.filename}`
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (trigger) {
      initiateArchiveUnpack().then()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Divider hidden />
      <Button
        primary
        onClick={() => initiateArchiveUnpack()}
        disabled={loading || transactionId !== ''}
        content={APP_STEPS.OPERATION.ARCHIVE.TRIGGER_UNPACK[language]}
      />
      {!loading && !error && transactionId !== '' &&
      <>
        <Divider hidden />
        {APP_STEPS.OPERATION.ARCHIVE.WAIT_FOR_UNPACK[language]}
      </>
      }
      <Divider hidden />
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && transactionId !== '' &&
      <ArchiveUnpackStatus file={`${file.folder}/${file.filename}`} transactionId={transactionId} />
      }
    </>
  )
}

export default ArchiveUnpack
