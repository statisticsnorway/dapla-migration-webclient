import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useEffect, useState } from 'react'
import { Divider, Form, Icon } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'

const encodeOptions = [
  {
    key: 'UTF-8',
    text: 'Unicode 8',
    value: 'UTF-8'
  },
  {
    key: 'us-ascii',
    text: 'US-ASCII (7-bit)',
    value: 'us-ascii'
  },
  {
    key: 'ISO-8859-1',
    text: 'Windows Latin-1',
    value: 'ISO-8859-1'
  }
]

function HeadOfFileContent ({ file }) {
  const [ready, setReady] = useState(false)
  const [charset, setCharset] = useState('UTF-8')
  const [stringValue, setStringValue] = useState('')

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/agent/head?file=${file.folder}/${file.filename}`,
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

      setStringValue(string)
    }
  }, [charset, data])

  return (
    <>
      {!ready && !error && <Icon color="blue" size="big" name="sync alternate" loading />}
      {ready && !loading && !error &&
      <>
        <Form size="large">
          <Form.Select
            inline
            value={charset}
            label="Charset"
            placeholder="Charset"
            options={encodeOptions}
            onChange={(e, { value }) => {setCharset(value)}}
          />
        </Form>
        <Divider hidden />
        <AceEditor
          fontSize={14}
          width="1836px"
          height="250px"
          theme="github"
          readOnly={true}
          mode="javascript"
          value={stringValue}
          showPrintMargin={false}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </>
      }
    </>
  )
}

export default HeadOfFileContent
