import useAxios from 'axios-hooks'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
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
  Placeholder,
  Segment,
  Table
} from 'semantic-ui-react'
import FileImportStatus from './FileImportStatus'
import { API } from '../../../configurations'

const typeOptions = [
  { key: 'String', text: 'String', value: 'String' },
  { key: 'Integer', text: 'Integer', value: 'Integer' },
  { key: 'Float', text: 'Float', value: 'Float' },
  { key: 'Double', text: 'Double', value: 'Double' },
  { key: 'Long', text: 'Long', value: 'Long' }
]

function FileImport ({ data, fileData }) {
  const [ready, setReady] = useState(false)
  const [transactionId, setTransactionId] = useState('')
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
            },
            'metadata': {
              'boundaryType': data.metadata.boundaryType,
              'valuation': valuation
            }
          },
          'convertAfterImport': convertAfterImport
        }
      },
      'state': {}
    }

    setTransactionId(operationId)
    executePut({
      headers: {
        Authorization: `Bearer ${API.TOKEN}`
      },
      data: importInstructions,
      url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
    })
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
            <Label size="large" tag color="teal" style={{ marginRight: '1rem' }}>
              {data.structure.schema.charset}
            </Label>
            <Label size="large" tag color="teal">
              {data.structure.schema.delimiter}
            </Label>
          </Grid.Column>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Grid.Column style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
            <Header size="large" content="Structure" />
            <Table compact="very" collapsing celled>
              <Table.Header>
                <Table.Row>
                  {data.structure.schema.columns.map((column, index) =>
                    <Table.HeaderCell key={column.name}>
                      <Input value={columns[index].name}
                             onChange={(e, { value }) => handleSetColumns(index, value, 'name')} />
                      <Dropdown
                        options={typeOptions}
                        value={columns[index].type}
                        onChange={(e, { value }) => handleSetColumns(index, value, 'type')}
                        style={{ marginTop: '0.5rem' }}
                      />
                    </Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  {fileData.map(data =>
                    <Table.Cell key={data}>
                      {data}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row>
                  {data.structure.schema.columns.map(column =>
                    <Table.Cell key={column.name}>
                      <Placeholder>
                        {Array.from({ length: 8 }, (x, i) =>
                          <Placeholder.Line key={i} />
                        )}
                      </Placeholder>
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row>
                  {data.structure.schema.columns.map(column =>
                    <Table.Cell key={`${column.name}Pseudo`}>
                      <Checkbox label="Pseudo?" toggle />
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Button size="large" primary onClick={() => initiateFileImport()}>
              <Icon name="cloud upload" />
              Import
            </Button>
          </Grid.Column>
        </Grid.Row>
        {ready && !loading &&
        <Grid.Row>
          <Grid.Column>
            <FileImportStatus transactionId={transactionId} />
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    </Segment>
  )
}

export default FileImport
