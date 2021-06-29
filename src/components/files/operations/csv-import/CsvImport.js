import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'

import CsvImportStatus from './CsvImportStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function CsvImport ({ file, data, fileData }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [transactionId, setTransactionId] = useState('')
  const [valuation, setValuation] = useState(data.metadata.valuation)
  const [columns, setColumns] = useState(data.structure.schema.columns)
  const [convertAfterImport, setConvertAfterImport] = useState(false)
  const [converterSkipOnFailure, setConverterSkipOnFailure] = useState(false)

  const [{ loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileImport = async () => {
    try {
      const operationId = uuidv4()
      const importInstructions = API_INSTRUCTIONS.CSV_IMPORT(
        operationId,
        data.files,
        data.structure.schema.delimiter,
        data.structure.schema.charset,
        columns,
        data.metadata.boundaryType,
        valuation,
        convertAfterImport,
        converterSkipOnFailure
      )

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        importInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

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
                options={API.BOUNDARY_OPTIONS}
                value={data.metadata.boundaryType}
                label={APP_STEPS.CSV.BOUNDARY_TYPE[language]}
                placeholder={APP_STEPS.CSV.BOUNDARY_TYPE[language]}
              >
              </Form.Select>
              <Form.Select
                value={valuation}
                options={API.VALUATION_OPTIONS}
                label={APP_STEPS.CSV.VALUATION[language]}
                disabled={loading || transactionId !== ''}
                placeholder={APP_STEPS.CSV.VALUATION[language]}
                onChange={(e, { value }) => setValuation(value)}
              >
              </Form.Select>
              <Form.Field>
                <Checkbox
                  checked={convertAfterImport}
                  disabled={loading || transactionId !== ''}
                  label={APP_STEPS.CSV.CONVERT_AFTER_IMPORT[language]}
                  onClick={() => setConvertAfterImport(!convertAfterImport)}
                />
              </Form.Field>
              {convertAfterImport &&
              <Form.Field>
                <Checkbox
                  checked={converterSkipOnFailure}
                  disabled={loading || transactionId !== ''}
                  label={APP_STEPS.CSV.CONVERTER_SKIP_ON_FAILURE[language]}
                  onClick={() => setConverterSkipOnFailure(!converterSkipOnFailure)}
                />
              </Form.Field>
              }
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
                        value={columns[index].type}
                        options={API.AVRO_TYPE_OPTIONS}
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
                      <Checkbox
                        toggle
                        label={APP_STEPS.CSV.PSEDUO[language]}
                        disabled={loading || transactionId !== ''}
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Button
              primary
              size="large"
              onClick={() => initiateFileImport()}
              disabled={loading || transactionId !== ''}
            >
              <Icon name="cloud upload" />
              {APP_STEPS.IMPORT.INITIATE_IMPORT[language]}
            </Button>
          </Grid.Column>
        </Grid.Row>
        {transactionId !== '' && !loading &&
        <Grid.Row>
          <Grid.Column>
            <CsvImportStatus file={file} transactionId={transactionId} />
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    </Segment>
  )
}

export default CsvImport
