import { Link } from 'react-router-dom'
import { Icon, Progress } from 'semantic-ui-react'

import { APP_STEPS } from '../../configurations'

function CopyFilesStatus ({ files, transactions }) {
  return (
    <>
      <Progress value={transactions} total={files} progress="ratio"
                warning={transactions !== files} success={transactions === files} />
      {transactions === files &&
      <Link to={APP_STEPS[1].route}>
        <Icon size="huge" color="blue" name="arrow right" />
      </Link>
      }
    </>
  )
}

export default CopyFilesStatus
