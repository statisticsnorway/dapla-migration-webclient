import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useContext, useState } from 'react'
import { Button, Container, Divider, Icon } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-xcode'

import CsvImportStatus from './CsvImportStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, LOCAL_STORAGE, useWindowSize } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function CsvImportEdit ({ file, instructions }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const { editorWidth } = useWindowSize()

  const [transactionId, setTransactionId] = useState('')
  const [editedImportInstructions, setEditedImportInstructions] = useState(instructions)

  const [{ loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileImport = async () => {
    try {
      const importInstructions = JSON.parse(editedImportInstructions)

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        importInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${importInstructions.id}`,
        devToken
      ))

      setTransactionId(importInstructions.id)
      LOCAL_STORAGE(
        importInstructions.id,
        {
          command: API.OPERATIONS[1],
          file: importInstructions.command.args.template.files,
          convertAfterImport: importInstructions.command.args.convertAfterImport
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <AceEditor
        mode="json"
        theme="xcode"
        fontSize={14}
        height="500px"
        showPrintMargin={false}
        value={editedImportInstructions}
        width={`${editorWidth.toString()}px`}
        editorProps={{ $blockScrolling: true }}
        name="UNIQUE_ID_OF_DIV_CSV_IMPORT_EDIT"
        readOnly={loading || transactionId !== ''}
        onChange={(value) => setEditedImportInstructions(value)}
      />
      <Divider hidden />
      <Container fluid textAlign="right">
        <Button
          primary
          size="large"
          onClick={() => initiateFileImport()}
          disabled={loading || transactionId !== ''}
        >
          <Icon name="cloud upload" />
          {APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]}
        </Button>
      </Container>
      <Divider hidden />
      {transactionId !== '' && !loading &&
      <CsvImportStatus
        file={file}
        transactionId={transactionId}
        convertAfterImport={JSON.parse(editedImportInstructions).command.args.convertAfterImport}
      />
      }
    </>
  )
}

export default CsvImportEdit
