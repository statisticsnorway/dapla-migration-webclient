import useAxios from 'axios-hooks'
import AceEditor from 'react-ace'
import { useEffect, useState } from 'react'
import { Divider, Form, Icon } from 'semantic-ui-react'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'

import FileStructureDetect from './FileStructureDetect'

function FileInspectContent ({ file }) {
  const [ready, setReady] = useState(false)
  const [fileData, setFileData] = useState('')
  const [charset, setCharset] = useState('UTF-8')
  const [delimiter, setDelimiter] = useState(',')
  const [stringValue, setStringValue] = useState('')

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/agent/head?file=${file}`,
    { manual: true, useCache: false }
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus().then()
    }, 2000)

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
      const string = data.data.map(line => atob(line)).join('\n')
      const fileData = atob(data.data.pop()).split(delimiter)
      setFileData(fileData)
      setStringValue(string)
    }
  }, [data, delimiter])

  return (
    <>
      {!ready && !error && <Icon color="blue" size="big" name="sync alternate" loading />}
      {ready && !loading && !error &&
      <>
        <Form size="large">
          <Form.Select
            inline
            compact
            value={charset}
            label="Charset"
            placeholder="Charset"
            onChange={(e, { value }) => {setCharset(value)}}
            options={[
              {
                key: 'UTF-8',
                text: 'UTF-8',
                value: 'UTF-8'
              }
            ]}
          />
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
          <Divider hidden />
          <Form.Select
            inline
            compact
            value={delimiter}
            label="Delimiter"
            placeholder="Delimiter"
            onChange={(e, { value }) => {setDelimiter(value)}}
            options={[
              {
                key: ';',
                text: ';',
                value: ';'
              },
              {
                key: ',',
                text: ',',
                value: ','
              }
            ]}
          />
        </Form>
        <Divider hidden />
        <FileStructureDetect file={file} fileData={fileData} charset={charset} delimiter={delimiter} />
      </>
      }
    </>
  )
}

export default FileInspectContent
