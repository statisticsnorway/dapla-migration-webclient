import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import { APP } from '../../../configurations'

const availableCommands = ['any-import', 'csv-import', 'json-import', 'archive-import']

const assignCommands = fileExtension => {
  let commands = ['any-import']

  switch (fileExtension) {
    case 'csv':
      commands.push(availableCommands[1])
      break

    case 'json':
      commands.push(availableCommands[2])
      break

    case 'zip':
      commands.push(availableCommands[3])
      break

    default:
  }

  return commands
}

function SelectFileOperation ({ file }) {
  const [fileExtension, setFileExtension] = useState(file.filename.split('.').pop())
  const [commands, setCommands] = useState(assignCommands(fileExtension))

  useEffect(() => {
    const fileExtension = file.filename.split('.').pop()

    setFileExtension(fileExtension)
    setCommands(assignCommands(fileExtension))
  }, [file])

  return (
    <>
      <p>{`${file.folder}/`}<b>{file.filename}</b></p>
      {commands !== undefined &&
      <Button.Group width={commands.length} color="blue">
        {commands.map(command => {
          if (!['any-import', 'csv-import'].includes(command)) {
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
