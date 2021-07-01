import { useContext, useEffect, useState } from 'react'
import { Button, Divider, Grid, Header, Input } from 'semantic-ui-react'

import AppMagicInit from '../magic/AppMagicInit'
import { LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'
import { APP_STEPS } from '../../enums'

function AppMagicMode () {
  const { language } = useContext(LanguageContext)

  const [ready, setReady] = useState(false)
  const [command, setCommand] = useState('')
  const [fullPath, setFullPath] = useState('')
  const [fileExtension, setFileExtension] = useState('')
  const [commands, setCommands] = useState(API.ASSIGN_COMMANDS(''))

  useEffect(() => {
    if (fileExtension !== '') {
      setCommands(API.ASSIGN_COMMANDS(fileExtension))
    }
  }, [fileExtension])

  const handlePathChange = value => {
    setReady(false)
    setFullPath(value)

    const possibleFileExtension = value.split('.')

    if (possibleFileExtension.length > 1) {
      setFileExtension(possibleFileExtension.pop())
    } else {
      setFileExtension('')
    }
  }

  return (
    <>
      <Header size="large" content={APP_STEPS.MAGIC.HEADER[language]} />
      <Grid columns="equal">
        <Grid.Column>
          <Input
            fluid
            size="large"
            value={fullPath}
            disabled={ready}
            placeholder={APP_STEPS.MAGIC.PLACEHOLDER[language]}
            onChange={(e, { value }) => handlePathChange(value)}
          />
          <Divider hidden />
          {commands !== undefined &&
          <Button.Group width={commands.length} color="blue">
            {commands.map(command => {
              if (!API.OPERATIONS.slice(0, 2).includes(command)) {
                return <Button key={command} disabled content={command} />
              } else {
                return (
                  <Button
                    key={command}
                    content={command}
                    disabled={fileExtension === ''}
                    onClick={() => {
                      setCommand(command)
                      setReady(true)
                    }}
                  />
                )
              }
            })}
          </Button.Group>
          }
        </Grid.Column>
        <Grid.Column verticalAlign="middle">
          {ready && <AppMagicInit fullPath={fullPath} command={command} />}
        </Grid.Column>
      </Grid>
    </>
  )
}

export default AppMagicMode
