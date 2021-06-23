import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Accordion, Divider, Form, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import CsvHeadOfFileStatus from './CsvHeadOfFileStatus'
import { LanguageContext } from '../../../../context/AppContext'
// import { API } from '../../../../configurations'

const linesToShowOptions = Array.from({ length: 9 }, (x, i) => {
  const lines = i + 2

  return ({
    key: lines,
    text: lines,
    value: lines
  })
})

function CsvImport ({ file }) {
  const { language } = useContext(LanguageContext)

  const [linesToShow, setLinesToShow] = useState(2)
  const [transactionId, setTransactionId] = useState('')
  const [accordionOpen, setAccordionOpen] = useState(false)

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileInspect = async () => {
    try {
      const operationId = uuidv4()
      const contentInstructions = {
        'id': operationId,
        'command': {
          'target': 'agent',
          'cmd': 'head',
          'args': {
            'file': `${file.folder}/${file.filename}`,
            'lines': linesToShow.toString()
          }
        },
        'state': {}
      }

      // TODO: handle auth header for local testing differently
      await executePut({
/*        headers: {
          Authorization: `Bearer ${API.TOKEN}`
        },*/
        data: contentInstructions,
        url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
      })

      setTransactionId(operationId)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Form size="large">
        <Form.Select
          inline
          compact
          value={linesToShow}
          label="Lines to show"
          placeholder="Lines to show"
          options={linesToShowOptions}
          onChange={(e, { value }) => {setLinesToShow(value)}}
        />
      </Form>
      <Divider hidden />
      <Accordion fluid styled>
        <Accordion.Title
          active={accordionOpen}
          onClick={() => {
            setAccordionOpen(!accordionOpen)
            if (!accordionOpen) {
              initiateFileInspect().then()
            }
          }}>
          <Icon name="dropdown" />
          Check file contents
        </Accordion.Title>
        <Accordion.Content active={accordionOpen}>
          {error && <ErrorMessage error={error} language={language} />}
          {transactionId !== '' && !loading &&
          <CsvHeadOfFileStatus file={file} transactionId={transactionId} />
          }
        </Accordion.Content>
      </Accordion>
    </>
  )
}

export default CsvImport
