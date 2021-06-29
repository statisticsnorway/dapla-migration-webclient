import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useContext, useEffect, useState } from 'react'
import { Divider, Form, Icon } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'

import CsvDetermineImportStructure from './CsvDetermineImportStructure'
import { LanguageContext } from '../../../../context/AppContext'
import { API, useWindowSize } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function CsvHeadOfFileContent ({ file }) {
  const { language } = useContext(LanguageContext)

  const { editorWidth } = useWindowSize()

  const [ready, setReady] = useState(false)
  const [fileData, setFileData] = useState('')
  const [stringValue, setStringValue] = useState('')
  const [charset, setCharset] = useState(API.ENCODE_OPTIONS[0].value)
  const [delimiter, setDelimiter] = useState(API.DELIMITER_OPTIONS[1].value)

  const [{ data, loading, error }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}${API.HEAD}${file.folder}/${file.filename}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus().then()
    }, 5000)

    const checkStatus = async () => {
      await refetch().then(res => {
        if (res.status === 200) {
          setReady(true)
          clearInterval(interval)
        }
      })
    }

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

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
      {!ready && !loading && !error && <Icon color="blue" size="big" name="sync alternate" loading />}
      {ready && !loading && !error &&
      <>
        <Form size="large">
          <Form.Select
            inline
            value={charset}
            options={API.ENCODE_OPTIONS}
            label={APP_STEPS.HEAD.CHARSET[language]}
            placeholder={APP_STEPS.HEAD.CHARSET[language]}
            onChange={(e, { value }) => {setCharset(value)}}
          />
          <AceEditor
            fontSize={14}
            height="250px"
            theme="github"
            readOnly={true}
            mode="javascript"
            value={stringValue}
            showPrintMargin={false}
            name="UNIQUE_ID_OF_DIV"
            width={`${editorWidth.toString()}px`}
            editorProps={{ $blockScrolling: true }}
          />
          <Divider hidden />
          <Form.Select
            inline
            value={delimiter}
            options={API.DELIMITER_OPTIONS}
            label={APP_STEPS.HEAD.DELIMITER[language]}
            placeholder={APP_STEPS.HEAD.DELIMITER[language]}
            onChange={(e, { value }) => {setDelimiter(value)}}
          />
        </Form>
        <Divider hidden />
        <CsvDetermineImportStructure file={file} fileData={fileData} charset={charset} delimiter={delimiter} />
      </>
      }
    </>
  )
}

export default CsvHeadOfFileContent
