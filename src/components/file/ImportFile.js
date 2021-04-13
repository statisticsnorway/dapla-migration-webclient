import useAxios from 'axios-hooks'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Segment,
  Table
} from 'semantic-ui-react'
import { v4 as uuidv4 } from 'uuid'

import ImportFileStatus from './ImportFileStatus'

const typeOptions = [
  { key: 'String', text: 'String', value: 'String' },
  { key: 'Integer', text: 'Integer', value: 'Integer' },
  { key: 'Float', text: 'Float', value: 'Float' },
  { key: 'Double', text: 'Double', value: 'Double' },
  { key: 'Long', text: 'Long', value: 'Long' }
]

function ImportFile () {
  let location = useLocation()

  const [ready, setReady] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [data] = useState(location.state.result.template)
  const [valuation, setValuation] = useState(data.metadata.valuation)
  const [columns, setColumns] = useState(data.structure.schema.columns)
  const [convertAfterImport, setConvertAfterImport] = useState(false)

  const [{ loading }, executePut] = useAxios(
    { method: 'PUT' },
    { manual: true, useCache: false }
  )

  const initiateFileImport = () => {
    const operationId = uuidv4()
    const importInstructions = {
      'id': operationId,
      'command': {
        'target': 'agent',
        'cmd': 'csv-import',
        'args': {
          'template': {
            'files': data.files,
            'structure': {
              'schema': {
                'delimiter': data.structure.schema.delimiter,
                'charset': data.structure.schema.charset,
                'columns': columns
              },
              'uri': 'inline:csv'
            }
          },
          'metadata': {
            'boundaryType': data.metadata.boundaryType,
            'valuation': valuation
          }
        },
        'convertAfterImport': convertAfterImport
      },
      'state': {}
    }

    setTransactionId(operationId)
    console.log(importInstructions)
    executePut({ data: importInstructions, url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}` })
      .then(() => setReady(true))
  }

  const handleSetColumns = (index, value, property) => {
    setColumns(columns.map((column, i) => {
      if (i === index) {
        const prevColumn = columns[i]

        prevColumn[property] = value

        return prevColumn
      } else {
        return column
      }
    }))
  }

  useEffect(() => {
    console.log(data)
    // eslint-disable-next-line
  }, [])

  return (
    <Segment basic>
      <Header size="large" content={data.files[0]} />
      <Divider hidden />
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Form size="large">
              <Form.Select
                disabled
                value={data.metadata.boundaryType}
                label="boundaryType"
                placeholder="boundaryType"
                options={[{
                  key: 'BOUNDED',
                  text: 'BOUNDED',
                  value: 'BOUNDED'
                }]}
              >
              </Form.Select>
              <Form.Select
                label="valuation"
                value={valuation}
                placeholder="valuation"
                onChange={(e, { value }) => setValuation(value)}
                options={['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE', 'UNRECOGNIZED'].map(valuation => ({
                  key: valuation,
                  text: valuation,
                  value: valuation
                }))}
              >
              </Form.Select>
              <Form.Field>
                <Checkbox
                  label="Convert after import?"
                  checked={convertAfterImport}
                  onClick={() => setConvertAfterImport(!convertAfterImport)}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Label size="large" tag color="blue" style={{ marginRight: '1rem' }}>
              {data.structure.schema.charset}
            </Label>
            <Label size="large" tag color="blue">
              {data.structure.schema.delimiter}
            </Label>
          </Grid.Column>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Grid.Column>
            <Header content="Structure" />
            <Table celled>
              <Table.Header>
                <Table.Row>
                  {data.structure.schema.columns.map((column, index) =>
                    <Table.HeaderCell key={column.name}>
                      <Input value={columns[index].name}
                             onChange={(e, { value }) => handleSetColumns(index, value, 'name')} />
                      <Dropdown
                        inline
                        options={typeOptions}
                        value={columns[index].type}
                        onChange={(e, { value }) => handleSetColumns(index, value, 'type')}
                        style={{ marginLeft: '1rem' }}
                      />
                    </Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  {data.structure.schema.columns.map(column =>
                    <Table.Cell key={column.name}>
                      {` `}
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Button primary onClick={() => initiateFileImport()}>
              <Icon name="cloud upload" />
              Import
            </Button>
          </Grid.Column>
        </Grid.Row>
        {ready && !loading &&
        <Grid.Row>
          <Grid.Column>
            <ImportFileStatus id={transactionId} />
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    </Segment>
  )
}

export default ImportFile
