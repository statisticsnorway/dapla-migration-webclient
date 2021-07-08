import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Checkbox, Divider, Dropdown, Form, Grid, Header, Icon, Input, Segment, Table } from 'semantic-ui-react'

import CsvImportEdit from './CsvImportEdit'
import CsvImportStatus from './CsvImportStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, LOCAL_STORAGE } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function CsvImport ({ file, data, fileData }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [quote, setQuote] = useState('')
  const [pseduoRules, setPseudoRules] = useState([])
  const [instructions, setInstructions] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [valuation, setValuation] = useState(data.metadata.valuation)
  const [checkJsonFirst, setCheckJsonFirst] = useState(false)
  const [convertAfterImport, setConvertAfterImport] = useState(false)
  const [converterSkipOnFailure, setConverterSkipOnFailure] = useState(false)
  const [columns, setColumns] = useState(JSON.parse(JSON.stringify(data.structure.schema.columns)))

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
        converterSkipOnFailure,
        pseduoRules,
        quote
      )

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        importInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

      setTransactionId(operationId)
      LOCAL_STORAGE(
        operationId,
        {
          command: API.OPERATIONS[1],
          file: data.files,
          convertAfterImport: convertAfterImport
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  const generateFileImportJson = () => {
    const operationId = uuidv4()

    setInstructions(JSON.stringify(API_INSTRUCTIONS.CSV_IMPORT(
      operationId,
      data.files,
      data.structure.schema.delimiter,
      data.structure.schema.charset,
      columns,
      data.metadata.boundaryType,
      valuation,
      convertAfterImport,
      converterSkipOnFailure,
      pseduoRules,
      quote
    ), null, 2))
    setTransactionId(operationId)
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

  const handlePseudoChange = (checked, name, column) => {
    if (checked) {
      const existsInCurrent = pseduoRules.filter(rule => rule.name === `${name}-rule`)
      const pseudoRule = ({
        name: `${name}-rule`,
        pattern: `**/${column.name}`,
        func: `fpe-${
          [API.AVRO_TYPE_OPTIONS[1].value, API.AVRO_TYPE_OPTIONS[4].value].includes(column.type) ? 'digits' : 'anychar'
        }(migrationsecret1)`
      })

      if (existsInCurrent.length > 0) {
        setPseudoRules(pseduoRules.map(rule => {
          if (rule.name === `${column.name}-rule`) {
            return pseudoRule
          } else {
            return rule
          }
        }))
      } else {
        setPseudoRules(pseduoRules.concat([pseudoRule]))
      }
    } else {
      setPseudoRules(pseduoRules.filter(rule => rule.name !== `${column.name}-rule`))
    }
  }

  return (
    <Segment basic>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Form size="large">
              <Form.Select
                disabled
                options={API.BOUNDARY_OPTIONS}
                value={data.metadata.boundaryType}
                label={APP_STEPS.OPERATION.CSV.BOUNDARY_TYPE[language]}
                placeholder={APP_STEPS.OPERATION.CSV.BOUNDARY_TYPE[language]}
              />
              <Form.Select
                value={valuation}
                options={API.VALUATION_OPTIONS}
                disabled={loading || transactionId !== ''}
                onChange={(e, { value }) => setValuation(value)}
                label={APP_STEPS.OPERATION.CSV.VALUATION[language]}
                placeholder={APP_STEPS.OPERATION.CSV.VALUATION[language]}
              />
              <Form.Input
                value={quote}
                disabled={loading || transactionId !== ''}
                onChange={(e, { value }) => setQuote(value)}
                label={APP_STEPS.OPERATION.CSV.QUOTE[language]}
                placeholder={APP_STEPS.OPERATION.CSV.QUOTE[language]}
              />
              <Form.Field>
                <Checkbox
                  checked={convertAfterImport}
                  disabled={loading || transactionId !== ''}
                  onClick={() => setConvertAfterImport(!convertAfterImport)}
                  label={APP_STEPS.OPERATION.CSV.CONVERT_AFTER_IMPORT[language]}
                />
              </Form.Field>
              {convertAfterImport &&
              <Form.Field>
                <Checkbox
                  checked={converterSkipOnFailure}
                  disabled={loading || transactionId !== ''}
                  onClick={() => setConverterSkipOnFailure(!converterSkipOnFailure)}
                  label={APP_STEPS.OPERATION.CSV.CONVERTER_SKIP_ON_FAILURE[language]}
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
                    <Table.Cell
                      key={data}
                      disabled={transactionId !== ''}
                      style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
                    >
                      {data}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row>
                  {data.structure.schema.columns.map((column, index) =>
                    <Table.Cell key={`${column.name}Pseudo`} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                      <Checkbox
                        toggle
                        disabled={loading || transactionId !== ''}
                        label={APP_STEPS.OPERATION.CSV.PSEDUO[language]}
                        onChange={(e, { checked }) => handlePseudoChange(checked, column.name, columns[index])}
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Checkbox
              label={APP_STEPS.OPERATION.CSV.EDIT_JSON[language]}
              onChange={() => setCheckJsonFirst(!checkJsonFirst)}
              disabled={loading || transactionId !== '' || instructions !== ''}
            />
          </Grid.Column>
          <Grid.Column textAlign="right">
            {checkJsonFirst ?
              <Button
                primary
                size="large"
                disabled={instructions !== ''}
                onClick={() => generateFileImportJson()}
              >
                <Icon name="code" />
                {APP_STEPS.OPERATION.IMPORT.EDIT_JSON[language]}
              </Button>
              :
              <Button
                primary
                size="large"
                onClick={() => initiateFileImport()}
                disabled={loading || transactionId !== ''}
              >
                <Icon name="cloud upload" />
                {APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]}
              </Button>
            }
          </Grid.Column>
        </Grid.Row>
        {!checkJsonFirst && transactionId !== '' && !loading &&
        <Grid.Row>
          <Grid.Column>
            <CsvImportStatus file={file} transactionId={transactionId} convertAfterImport={convertAfterImport} />
          </Grid.Column>
        </Grid.Row>
        }
        {checkJsonFirst && instructions !== '' &&
        <Grid.Row>
          <Grid.Column>
            <CsvImportEdit file={file} instructions={instructions} />
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    </Segment>
  )
}

export default CsvImport
