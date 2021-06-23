import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import CsvDetermineImportStructureStatus from './CsvDetermineImportStructureStatus'
import { LanguageContext } from '../../../../context/AppContext'
// import { API } from '../../../../configurations'

function CsvDetermineImportStructure ({ file, fileData, delimiter, charset }) {
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')

  const [{ error }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileStructureDetect = async () => {
    try {
      const operationId = uuidv4()
      const inspectInstructions = {
        'id': operationId,
        'command': {
          'target': 'agent',
          'cmd': 'determine-csv-import-structure',
          'args': {
            'template': {
              'files': [`${file.folder}/${file.filename}`],
              'structure': {
                'schema': {
                  'delimiter': delimiter,
                  'charset': charset
                }
              }
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
        data: inspectInstructions,
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
        icon="file code"
        disabled={transactionId !== ''}
        content="Determine file structure"
        onClick={() => initiateFileStructureDetect()}
      />
      {transactionId !== '' &&
      <CsvDetermineImportStructureStatus file={file} fileData={fileData} transactionId={transactionId} />
      }
      {error && <ErrorMessage error={error} language={language} />}
    </>
  )
}

export default CsvDetermineImportStructure
