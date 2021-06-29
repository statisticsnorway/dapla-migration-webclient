import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import CsvDetermineImportStructureStatus from './CsvDetermineImportStructureStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function CsvDetermineImportStructure ({ file, fileData, delimiter, charset }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileStructureDetect = async () => {
    try {
      const operationId = uuidv4()
      const inspectInstructions = API_INSTRUCTIONS.CSV_INSPECT(
        operationId,
        [`${file.folder}/${file.filename}`],
        delimiter,
        charset
      )

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        inspectInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

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
        icon="file code"
        disabled={loading || transactionId !== ''}
        onClick={() => initiateFileStructureDetect()}
        content={APP_STEPS.CSV.DETERMINE_STRUCTURE[language]}
      />
      {!loading && transactionId !== '' &&
      <CsvDetermineImportStructureStatus file={file} fileData={fileData} transactionId={transactionId} />
      }
      {!loading && error && <ErrorMessage error={error} language={language} />}
    </>
  )
}

export default CsvDetermineImportStructure
