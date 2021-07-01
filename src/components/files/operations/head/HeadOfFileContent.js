import AceEditor from 'react-ace'
import { useContext, useEffect, useState } from 'react'
import { Divider, Form } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'

import { LanguageContext } from '../../../../context/AppContext'
import { API, useWindowSize } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function HeadOfFileContent ({ data }) {
  const { language } = useContext(LanguageContext)

  const { editorWidth } = useWindowSize()

  const [schemaType, setSchemaType] = useState('')
  const [stringValue, setStringValue] = useState('')
  const [charset, setCharset] = useState(API.ENCODE_OPTIONS[0].value)

  useEffect(() => {
    if (data !== undefined) {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder(charset)
      let string = ''

      switch (data.fileFormat) {
        case 'json':
          const encodedJson = data.data.map(line => encoder.encode(line.toString()))
          string = encodedJson.map(line => decoder.decode(line)).join('\n')
          setSchemaType(data.schemaType)

          break
        case 'csv':
          const encodedCsv = data.data.map(line => encoder.encode(atob(line)))
          string = encodedCsv.map(line => decoder.decode(line)).join('\n')
          break

        default:
          const encodedAny = data.data.map(line => encoder.encode(atob(line)))
          string = encodedAny.map(line => decoder.decode(line)).join('\n')
          break
      }

      setStringValue(string)
    }
  }, [charset, data])

  return (
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
      </Form>
      {schemaType !== '' &&
      <>
        <Divider hidden />
        <p><b>{`schemaType `}</b>{schemaType}</p>
      </>
      }
      <Divider hidden />
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
    </>
  )
}

export default HeadOfFileContent
