import { useContext, useState } from 'react'
import { Confirm, Grid, Icon, List } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { APP_STEPS } from '../../enums'

function MyStatuses () {
  const { language } = useContext(LanguageContext)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleResetLocalStorage = () => {
    const statuses = localStorage.getItem('statuses').split(',')

    statuses.forEach(status => {
      localStorage.removeItem(status)
    })

    localStorage.removeItem('statuses')
  }

  return (
    <>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <List>
              {localStorage.getItem('statuses') !== null &&
              localStorage.getItem('statuses').split(',').map(status =>
                <List.Item key={status}>{status} - {localStorage.getItem(status)}</List.Item>
              )
              }
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="right">
            {localStorage.getItem('statuses') !== null &&
            <Icon link name="trash alternate outline" color="red" onClick={() => setConfirmOpen(true)} />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Confirm
        content=""
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        header={APP_STEPS.STATUS.CLEAR_STORAGE.TEXT[language]}
        confirmButton={APP_STEPS.STATUS.CLEAR_STORAGE.CONFIRM[language]}
        cancelButton={{
          content: APP_STEPS.STATUS.CLEAR_STORAGE.CANCEL[language],
          color: 'red'
        }}
        onConfirm={() => {
          handleResetLocalStorage()
          setConfirmOpen(false)
        }}
      />
    </>
  )
}

export default MyStatuses
