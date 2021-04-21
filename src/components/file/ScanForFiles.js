import useAxios from 'axios-hooks'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Icon, Input } from 'semantic-ui-react'

function ScanForFiles () {
  const [ready, setReady] = useState(false)
  const [scanPath, setScanPath] = useState('/ssb/stamme01')
  const [transactionId, setTransactionId] = useState('')

  const [{ loading }, executePut] = useAxios(
    { method: 'PUT' },
    { manual: true, useCache: false }
  )

  const initiateFileScan = () => {
    const operationId = uuidv4()
    const contentInstructions = {
      'id': operationId,
      'command': {
        'target': 'sas-agent',
        'cmd': 'scan',
        'args': {
          'path': scanPath,
          'recursive': true
        }
      },
      'state': {}
    }

    setTransactionId(operationId)
    executePut({ data: contentInstructions, url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}` })
      .then(() => setReady(true))
  }

  return (
    <>
      <Input
        value={scanPath}
        loading={loading}
        disabled={loading}
        placeholder="Path (/ssb/stamme01)"
        onChange={(event, { value }) => {
          setReady(false)
          setScanPath(value)
          setTransactionId('')
        }}
      />
      <Icon
        link
        name="play"
        size="large"
        color="blue"
        loading={loading}
        disabled={loading}
        style={{ marginLeft: '0.5rem' }}
        onClick={() => {
          setReady(false)

          if (transactionId === '' && !ready) {
            initiateFileScan()
          }
        }}
      />
      {ready && <Icon name="check" color="green" />}
    </>
  )
}

export default ScanForFiles
