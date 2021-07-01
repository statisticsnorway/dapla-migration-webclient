import { useContext, useEffect, useState } from 'react'
import { Confirm, Grid, Icon, List } from 'semantic-ui-react'

import MigrationStatus from './MigrationStatus'
import { LanguageContext } from '../../context/AppContext'
import { APP_STEPS } from '../../enums'

function MyStatuses ({ open }) {
  const { language } = useContext(LanguageContext)

  const [check, setCheck] = useState(false)
  const [statuses, setStatuses] = useState(
    localStorage.getItem('statuses') !== null ? localStorage.getItem('statuses').split(',') : []
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleResetLocalStorage = () => {
    const lsStatuses = localStorage.getItem('statuses').split(',')

    lsStatuses.forEach(status => {
      localStorage.removeItem(status)
    })

    localStorage.removeItem('statuses')

    setStatuses([])
  }

  useEffect(() => {
    if (open) {
      if (localStorage.getItem('statuses') !== null) {
        setStatuses(localStorage.getItem('statuses').split(','))
      } else {
        setStatuses([])
      }
    }
  }, [open])

  useEffect(() => {
    if (localStorage.getItem('statuses') !== null) {
      setStatuses(localStorage.getItem('statuses').split(','))
    } else {
      setStatuses([])
    }
  }, [check])

  return (
    <>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <List>
              {statuses.length !== 0 && statuses.map(statusId =>
                <List.Item key={statusId}>
                  <MigrationStatus statusId={statusId} check={check} setCheck={setCheck} />
                </List.Item>
              )}
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="right">
            {statuses.length !== 0 &&
            <Icon link size="large" name="trash alternate outline" color="red" onClick={() => setConfirmOpen(true)} />
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
