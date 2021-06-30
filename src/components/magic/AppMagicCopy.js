import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { useContext, useEffect, useState } from 'react'
import { Divider, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import AppMagicCopyStatus from './AppMagicCopyStatus'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { API, API_INSTRUCTIONS, LOCAL_STORAGE } from '../../configurations'

function AppMagicCopy ({ fullPath, fileSize, command }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileCopy = async () => {
    try {
      const operationId = uuidv4()
      const copyInstructions = API_INSTRUCTIONS.COPY(operationId, fullPath)

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
          file: fullPath,
          fileSize: fileSize
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    initiateFileCopy().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {loading && !error && <Icon size="large" color="blue" name="sync alternate" loading />}
      {!loading && transactionId !== '' &&
      <AppMagicCopyStatus fullPath={fullPath} fileSize={fileSize} transactionId={transactionId} command={command} />
      }
      <Divider hidden />
    </>
  )
}

export default AppMagicCopy
