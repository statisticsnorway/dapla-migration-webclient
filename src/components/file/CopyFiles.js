import useAxios from 'axios-hooks'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Button, Divider, Icon } from 'semantic-ui-react'

import { APP_STEPS } from '../../configurations'

function CopyFiles ({ files }) {
  const [done, setDone] = useState(false)
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
    setDone(true)
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
      {done &&
      <Link to={APP_STEPS[1].route}>
        <Icon size="huge" color="blue" name="arrow right" />
      </Link>
      }
    </>
  )
}

export default CopyFiles
