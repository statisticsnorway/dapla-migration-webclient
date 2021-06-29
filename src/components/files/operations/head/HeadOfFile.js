import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Accordion, Divider, Form, Icon } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import HeadOfFileStatus from './HeadOfFileStatus'
import { ApiContext, LanguageContext } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

function HeadOfFile ({ file, operation }) {
  const { devToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [linesToShow, setLinesToShow] = useState(2)
  const [transactionId, setTransactionId] = useState('')
  const [accordionOpen, setAccordionOpen] = useState(false)

  const [{ error, loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileHead = async () => {
    try {
      const operationId = uuidv4()
      const headInstructions = API_INSTRUCTIONS.HEAD(operationId, `${file.folder}/${file.filename}`, linesToShow.toString())

      await executePut(API.HANDLE_PUT(
        process.env.NODE_ENV,
        headInstructions,
        `${window.__ENV.REACT_APP_API}${API.COMMAND}${operationId}`,
        devToken
      ))

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
          options={API.LINES_TO_SHOW_OPTIONS(9)}
          label={APP_STEPS.HEAD.LINES_TO_SHOW[language]}
          placeholder={APP_STEPS.HEAD.LINES_TO_SHOW[language]}
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
              setTransactionId('')
              initiateFileHead().then()
            }
          }}>
          <Icon name="dropdown" />
          {APP_STEPS.HEAD.HEADER[language]}
        </Accordion.Title>
        <Accordion.Content active={accordionOpen}>
          {!loading && error && <ErrorMessage error={error} language={language} />}
          {!loading && transactionId !== '' &&
          <HeadOfFileStatus file={file} transactionId={transactionId} operation={operation} />
          }
        </Accordion.Content>
      </Accordion>
    </>
  )
}

export default HeadOfFile
