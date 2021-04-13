import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Accordion, Divider, Icon } from 'semantic-ui-react'

import FileContentStatus from './FileContentStatus'

function SetupFileContent ({ file }) {
  const [ready, setReady] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [accordionOpen, setAccordionOpen] = useState(false)

  const [{ loading }, executePut] = useAxios(
    { method: 'PUT' },
    { manual: true, useCache: false }
  )

  const initiateFileContent = () => {
    const operationId = uuidv4()
    const contentInstructions = {
      'id': operationId,
      'command': {
        'target': 'agent',
        'cmd': 'head',
        'args': {
          'file': file,
          'lines': '2',
          'charset': 'UTF-8'
        }
      },
      'state': {}
    }

    setTransactionId(operationId)
    executePut({ data: contentInstructions, url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}` })
      .then(() => setReady(true))
  }

  useEffect(() => {
    setReady(false)
    setTransactionId('')
    setAccordionOpen(false)
  }, [file])

  return (
    <>
      <Accordion fluid styled>
        <Accordion.Title
          active={accordionOpen}
          onClick={() => {
            setAccordionOpen(!accordionOpen)
            if (!accordionOpen) {
              initiateFileContent()
            }
          }}>
          <Icon name="dropdown" />
          Check file contents
        </Accordion.Title>
        <Accordion.Content active={accordionOpen}>
          {ready && transactionId !== '' && !loading && <FileContentStatus file={file} />}
        </Accordion.Content>
      </Accordion>
      <Divider />
    </>
  )
}

export default SetupFileContent
