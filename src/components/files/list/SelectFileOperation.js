import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import { API, APP } from '../../../configurations'

function SelectFileOperation ({ file }) {
  const [fileExtension, setFileExtension] = useState(file.filename.split('.').pop())
  const [commands, setCommands] = useState(API.ASSIGN_COMMANDS(fileExtension))

  useEffect(() => {
    const fileExtension = file.filename.split('.').pop()

    setFileExtension(fileExtension)
    setCommands(API.ASSIGN_COMMANDS(fileExtension))
  }, [file])

  return (
    <>
      <p>{`${file.folder}/`}<b>{file.filename}</b></p>
      {commands !== undefined &&
      <Button.Group width={commands.length} color="blue">
        {commands.map(command => {
          if (!API.OPERATIONS.slice(0, 2).includes(command)) {
            return <Button key={command} disabled content={command} />
          } else {
            return (
              <Button
                as={Link}
                key={command}
                content={command}
                to={{
                  pathname: `${APP[2].route}/${command}`,
                  state: {
                    file: file,
                    command: command
                  }
                }}
              />
            )
          }
        })}
      </Button.Group>
      }
    </>
  )
}

export default SelectFileOperation