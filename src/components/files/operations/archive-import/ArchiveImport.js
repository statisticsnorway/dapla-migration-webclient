import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Checkbox, Form, Grid, Icon, Segment } from 'semantic-ui-react'

import ArchiveImportEdit from './ArchiveImportEdit'
import ArchiveImportStatus from './ArchiveImportStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, LOCAL_STORAGE } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function ArchiveImport ({ file }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [instructions, setInstructions] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [charset, setCharset] = useState(API.ENCODE_OPTIONS[0].value)
  const [checkJsonFirst, setCheckJsonFirst] = useState(false)
  const [valuation, setValuation] = useState(API.VALUATION_OPTIONS[3].value)
  const [convertAddV1Manifest, setConvertAddV1Manifest] = useState(false)
  const [contentType, setContentType] = useState(API.CONTENT_TYPE_OPTIONS[1].value)

  const [{ loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateArchiveImport = async () => {
    try {
      const operationId = uuidv4()
      const importInstructions = API_INSTRUCTIONS.ARCHIVE_IMPORT(
        operationId,
        `${file.folder}/${file.filename}`,
        API.BOUNDARY_OPTIONS[0].value,
        valuation,
        charset,
        contentType,
        convertAddV1Manifest
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
          command: API.OPERATIONS[3],
          file: `${file.folder}/${file.filename}`
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  const generateArchiveImportJson = () => {
    const operationId = uuidv4()

    setInstructions(JSON.stringify(API_INSTRUCTIONS.ARCHIVE_IMPORT(
      operationId,
      `${file.folder}/${file.filename}`,
      API.BOUNDARY_OPTIONS[0].value,
      valuation,
      charset,
      contentType,
      convertAddV1Manifest
    ), null, 2))
    setTransactionId(operationId)
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
                value={API.BOUNDARY_OPTIONS[0].value}
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
              <Form.Select
                value={charset}
                options={API.ENCODE_OPTIONS}
                label={APP_STEPS.HEAD.CHARSET[language]}
                disabled={loading || transactionId !== ''}
                placeholder={APP_STEPS.HEAD.CHARSET[language]}
                onChange={(e, { value }) => setCharset(value)}
              />
              <Form.Select
                value={contentType}
                options={API.CONTENT_TYPE_OPTIONS}
                label={APP_STEPS.OPERATION.ARCHIVE.CONTENT_TYPE[language]}
                disabled={loading || transactionId !== ''}
                placeholder={APP_STEPS.OPERATION.ARCHIVE.CONTENT_TYPE[language]}
                onChange={(e, { value }) => setContentType(value)}
              />
              <Form.Field>
                <Checkbox
                  checked={convertAddV1Manifest}
                  disabled={loading || transactionId !== ''}
                  label={APP_STEPS.OPERATION.ARCHIVE.ADD_V1_MANIFEST[language]}
                  onClick={() => setConvertAddV1Manifest(!convertAddV1Manifest)}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column />
          <Grid.Column />
          <Grid.Column />
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
                onClick={() => generateArchiveImportJson()}
              >
                <Icon name="code" />
                {APP_STEPS.OPERATION.IMPORT.EDIT_JSON[language]}
              </Button>
              :
              <Button
                primary
                size="large"
                onClick={() => initiateArchiveImport()}
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
            <ArchiveImportStatus file={file} transactionId={transactionId} />
          </Grid.Column>
        </Grid.Row>
        }
        {checkJsonFirst && instructions !== '' &&
        <Grid.Row>
          <Grid.Column>
            <ArchiveImportEdit file={file} instructions={instructions} />
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    </Segment>
  )
}

export default ArchiveImport
