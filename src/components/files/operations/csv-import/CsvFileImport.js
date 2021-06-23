import useAxios from 'axios-hooks'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'

import CsvFileImportStatus from './CsvFileImportStatus'
// import { API } from '../../../../configurations'

const typeOptions = [
  { key: 'String', text: 'String', value: 'String' },
  { key: 'Integer', text: 'Integer', value: 'Integer' },
  { key: 'Float', text: 'Float', value: 'Float' },
  { key: 'Double', text: 'Double', value: 'Double' },
  { key: 'Long', text: 'Long', value: 'Long' }
]

function CsvFileImport ({ file, data, fileData }) {
  const [transactionId, setTransactionId] = useState('')
  const [valuation, setValuation] = useState(data.metadata.valuation)
  const [columns, setColumns] = useState(data.structure.schema.columns)
  const [convertAfterImport, setConvertAfterImport] = useState(false)

  const [{ loading }, executePut] = useAxios(
    { method: 'PUT' },
    { manual: true, useCache: false }
  )

  const initiateFileImport = async () => {
    try {
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

      // TODO: handle auth header for local testing differently
      await executePut({
/*        headers: {
          Authorization: `Bearer ${API.TOKEN}`
        },*/
        data: importInstructions,
        url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
      })

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
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
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Form size="large">
              <Form.Select
                disabled
                label="boundaryType"
                placeholder="boundaryType"
                value={data.metadata.boundaryType}
                options={[{ key: 'BOUNDED', text: 'BOUNDED', value: 'BOUNDED' }]}
              >
              </Form.Select>
              <Form.Select
                label="valuation"
                value={valuation}
                placeholder="valuation"
                disabled={transactionId !== ''}
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
                  disabled={transactionId !== ''}
                  onClick={() => setConvertAfterImport(!convertAfterImport)}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column />
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
                      <Input
                        value={columns[index].name}
                        disabled={transactionId !== ''}
                        onChange={(e, { value }) => handleSetColumns(index, value, 'name')}
                      />
                      <br />
                      <Dropdown
                        options={typeOptions}
                        value={columns[index].type}
                        style={{ marginTop: '0.5rem' }}
                        disabled={transactionId !== ''}
                        onChange={(e, { value }) => handleSetColumns(index, value, 'type')}
                      />
                    </Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  {fileData.map(data =>
                    <Table.Cell key={data} disabled={transactionId !== ''}>
                      {data}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row>
                  {data.structure.schema.columns.map(column =>
                    <Table.Cell key={`${column.name}Pseudo`}>
                      <Checkbox label="Pseudo?" toggle disabled={transactionId !== ''} />
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Button disabled={transactionId !== ''} size="large" primary onClick={() => initiateFileImport()}>
              <Icon name="cloud upload" />
              Initiate import
            </Button>
          </Grid.Column>
        </Grid.Row>
        {transactionId !== '' && !loading &&
        <Grid.Row>
          <Grid.Column>
            <CsvFileImportStatus file={file} transactionId={transactionId} />
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    </Segment>
  )
}

export default CsvFileImport
