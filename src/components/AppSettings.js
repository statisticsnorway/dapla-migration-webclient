import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup, InfoText, SimpleFooter } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { API } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

function AppSettings ({ open, setOpen }) {
  const { api, setApi, setDevToken } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [apiUrl, setApiUrl] = useState(api)
  const [settingsEdited, setSettingsEdited] = useState(false)

  const [{ error, loading }, execute] = useAxios(`${apiUrl}${API.GET_HEALTH}`, { manual: true, useCache: false })

  const applySettings = () => {
    setApi(apiUrl)
    setSettingsEdited(false)

    if (!settingsEdited) {
      execute()
    }
  }

  const changeSettings = (value) => {
    setApiUrl(value)
    setSettingsEdited(true)
  }

  const setDefaults = () => {
    setSettingsEdited(true)
    setApi(window.__ENV.REACT_APP_API)
    setApiUrl(window.__ENV.REACT_APP_API)
  }

  useEffect(() => {
    if (open && !settingsEdited) {
      execute()
    }
  }, [execute, open, settingsEdited])

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Header size="large">
        <Icon name="cog" color="blue" />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic>
        <Form size="large">
          <Form.Input
            value={apiUrl}
            loading={loading}
            label={SETTINGS.API[language]}
            error={!!error && !settingsEdited}
            placeholder={SETTINGS.API[language]}
            onChange={(e, { value }) => changeSettings(value)}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            icon={!loading && !settingsEdited && !error ?
              <Icon name="check" color="green" /> : null
            }
          />
          {['development', 'test'].includes(process.env.NODE_ENV) &&
          <Form.TextArea
            rows={6}
            placeholder="Just paste token and close settings"
            onChange={(e, { value }) => {
              setDevToken(value)
              localStorage.setItem('devToken', value)
            }}
            label="dev-token (./bin/generate-test-jwt.sh -u test@junit)"
          />
          }
        </Form>
        {!loading && !settingsEdited && error && <ErrorMessage error={error} language={language} />}
        {!loading && settingsEdited &&
        <Container style={{ marginTop: '0.5rem' }}>
          <InfoText text={SETTINGS.EDITED_VALUES[language]} />
        </Container>
        }
        <Container style={{ marginTop: '1rem' }}>
          <Divider hidden />
          <Grid columns="equal">
            <Grid.Column>
              <Button
                primary
                size="large"
                disabled={loading}
                onClick={() => applySettings()}
                content={SETTINGS.APPLY[language]}
              />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <InfoPopup
                position="left center"
                text={SETTINGS.RESET_VALUES[language]}
                trigger={
                  <Icon
                    link
                    fitted
                    name="undo"
                    size="large"
                    color="blue"
                    onClick={() => setDefaults()}
                    data-testid={TEST_IDS.DEFAULT_SETTINGS_VALUES_BUTTON}
                  />
                }
              />
            </Grid.Column>
          </Grid>
        </Container>
      </Modal.Content>
      <SimpleFooter
        language={language}
        showScrollToTop={false}
        appVersion={process.env.REACT_APP_VERSION}
        sourceUrl={process.env.REACT_APP_SOURCE_URL}
      />
    </Modal>
  )
}

export default AppSettings
