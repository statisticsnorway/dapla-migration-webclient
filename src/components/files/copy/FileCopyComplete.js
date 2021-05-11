import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

import { APP_STEPS } from '../../../configurations'

function FileCopyComplete ({ file }) {
  return (
    <>
      <p>File was succesfully copied, click forward to proceed</p>
      <Link
        to={{
          pathname: APP_STEPS[1].route,
          state: file
        }}
      >
        <Icon size="huge" link name="forward" color="blue" />
      </Link>
    </>
  )
}

export default FileCopyComplete
