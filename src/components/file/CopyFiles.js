import useAxios from 'axios-hooks'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Divider, Icon } from 'semantic-ui-react'
import CopyFilesStatus from './CopyFilesStatus'

function CopyFiles ({ files }) {
  const [transactionIds, setTransactionIds] = useState([])

  const [{ loading }, executePut] = useAxios({ method: 'PUT' }, { manual: true, useCache: false })

  const initiateFileCopy = async () => {
    const transactions = []

    for await (let file of files) {
      try {
        const operationId = uuidv4()
        const copyInstructions = {
          'id': operationId,
          'command': {
            'target': 'sas-agent',
            'cmd': 'copy',
            'args': {
              'path': file
            }
          },
          'state': {}
        }

        const response = await executePut({
          data: copyInstructions,
          url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}`
        })

        transactions.push({ file: file, transactionId: operationId, response: response })
      } catch (e) {
        console.log(e)
      }
    }

    setTransactionIds(transactions)
  }

  return (
    <>
      <Button
        primary
        onClick={() => initiateFileCopy()}
        disabled={loading || transactionIds.length !== 0}
      >
        <Icon name="copy" />
        Copy selected to Agent
      </Button>
      <Divider hidden />
      <CopyFilesStatus files={files.length} transactions={transactionIds.length} />
    </>
  )
}

export default CopyFiles
