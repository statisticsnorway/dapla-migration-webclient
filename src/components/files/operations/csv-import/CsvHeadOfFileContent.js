import AceEditor from 'react-ace'
import { useContext, useEffect, useState } from 'react'
import { Divider, Form } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-xcode'

import CsvDetermineImportStructure from './CsvDetermineImportStructure'
import { LanguageContext } from '../../../../context/AppContext'
import { API, useWindowSize } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function CsvHeadOfFileContent ({ file, data }) {
  const { language } = useContext(LanguageContext)

  const { editorWidth } = useWindowSize()

  const [fileData, setFileData] = useState('')
  const [initiated, setInitiated] = useState(false)
  const [stringValue, setStringValue] = useState('')
  const [charset, setCharset] = useState(API.ENCODE_OPTIONS[0].value)
  const [delimiter, setDelimiter] = useState(API.DELIMITER_OPTIONS[1].value)

  useEffect(() => {
    if (data !== undefined) {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder(charset)
      const encoded = data.data.map(line => encoder.encode(atob(line)))
      const string = encoded.map(line => decoder.decode(line)).join('\n')
      const fileData = decoder.decode(encoded.slice(-1)[0]).split(delimiter)

      setFileData(fileData)
      setStringValue(string)
    }
  }, [charset, data, delimiter])

  return (
    <>
      <Form size="large">
        <Form.Select
          inline
          value={charset}
          disabled={initiated}
          options={API.ENCODE_OPTIONS}
          label={APP_STEPS.HEAD.CHARSET[language]}
          placeholder={APP_STEPS.HEAD.CHARSET[language]}
          onChange={(e, { value }) => setCharset(value)}
        />
        <AceEditor
          mode="json"
          theme="xcode"
          fontSize={14}
          height="250px"
          readOnly={true}
          value={stringValue}
          showPrintMargin={false}
          name="UNIQUE_ID_OF_DIV_CSV_HEAD"
          width={`${editorWidth.toString()}px`}
          editorProps={{ $blockScrolling: true }}
        />
        <Divider hidden />
        <Form.Select
          inline
          value={delimiter}
          disabled={initiated}
          options={API.DELIMITER_OPTIONS}
          label={APP_STEPS.HEAD.DELIMITER[language]}
          placeholder={APP_STEPS.HEAD.DELIMITER[language]}
          onChange={(e, { value }) => setDelimiter(value)}
        />
      </Form>
      <Divider hidden />
      <CsvDetermineImportStructure
        file={file}
        charset={charset}
        fileData={fileData}
        delimiter={delimiter}
        setInitiated={setInitiated}
      />
    </>
  )
}

export default CsvHeadOfFileContent
