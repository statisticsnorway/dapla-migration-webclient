import { useEffect } from 'react'
import useAxios from 'axios-hooks'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from 'semantic-ui-react'

function CopyFile ({ file }) {
  const [{ data, loading, error }, executePut] = useAxios({ method: 'PUT' }, { manual: true })

  const initiateFileCopy = () => {
    const operationId = uuidv4()
    const copyInstructions = {
      'id': uuidv4(),
      'command': {
        'target': 'sas-agent',
        'cmd': 'copy',
        'args': {
          'path': `${file.folder}/${file.filename}`
        }
      },
      'state': {}
    }

    executePut({ data: copyInstructions, url: `${window.__ENV.REACT_APP_API}/cmd/id/${operationId}` }).then(() => {
      console.log(data)
      console.log('Copy complete')
    })
  }

  useEffect(() => {
    if (error !== undefined && error !== null) {
      console.log(error)
    }
  }, [error])

  return (
    <Icon style={{ marginLeft: '0.5em' }} link name="copy" loading={loading} onClick={() => initiateFileCopy()} />
  )
}

export default CopyFile
