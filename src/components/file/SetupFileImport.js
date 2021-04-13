import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Divider, Form, Header, Icon } from 'semantic-ui-react'

import FileInspectStatus from './FileInspectStatus'

function SetupFileImport ({ file }) {
  const [ready, setReady] = useState(false)
  const [charset, setCharset] = useState('UTF-8')
  const [delimiter, setDelimiter] = useState(',')
  const [transactionId, setTransactionId] = useState('')

  const [{ loading }, executePut] = useAxios(
    { method: 'PUT' },
    { manual: true, useCache: false }
  )

  const initiateFileInspect = () => {
    const operationId = uuidv4()
    const inspectInstructions = {
      'id': operationId,
      'command': {
        'target': 'agent',
        'cmd': 'determine-csv-import-structure',
        'args': {
          'template': {
            'files': [`${file}`],
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

    setTransactionId(operationId)
    executePut({ data: inspectInstructions, url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}` })
      .then(() => setReady(true))
  }

  useEffect(() => {
    setReady(false)
    setDelimiter(',')
    setTransactionId('')
  }, [file])

  return (
    <>
      <Header content="Select inspect options for" subheader={file} />
      <Form size="large">
        <Form.Select
          inline
          compact
          value={delimiter}
          label="Delimiter"
          disabled={loading}
          placeholder="Delimiter"
          onChange={(e, { value }) => {
            setTransactionId('')
            setDelimiter(value)
          }}
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
        <Form.Select
          inline
          compact
          value={charset}
          label="Charset"
          disabled={loading}
          placeholder="Charset"
          onChange={(e, { value }) => {
            setTransactionId('')
            setCharset(value)
          }}
          options={[
            {
              key: 'UTF-8',
              text: 'UTF-8',
              value: 'UTF-8'
            }
          ]}
        />
      </Form>
      <Divider hidden />
      <Button primary onClick={() => initiateFileInspect()} disabled={loading || transactionId !== ''}>
        <Icon name="file text" />
        Initiate file inspect
      </Button>
      {ready && transactionId !== '' && <FileInspectStatus id={transactionId} />}
    </>
  )
}

export default SetupFileImport
