import useAxios from 'axios-hooks'
import { useContext, useState } from 'react'
import { Divider, Grid, GridColumn, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import FileScan from './files/scan/FileScan'
import ListFiles from './files/copy/ListFiles'
import { LanguageContext } from '../context/AppContext'

function AppHome () {
  const { language } = useContext(LanguageContext)

  const [path, setPath] = useState('/ssb/stamme01')
  const [ready, setReady] = useState(false)

  const [{
    data,
    loading,
    error
  }, refetch] = useAxios(
    `${window.__ENV.REACT_APP_API}/sas/files?folder=${path}`,
    { manual: true, useCache: false }
  )

  return (
    <>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <FileScan path={path} setPath={setPath} ready={ready} setReady={setReady} />
          </Grid.Column>
          <GridColumn textAlign="right">
            <Icon
              link
              size="large"
              color="blue"
              loading={loading}
              disabled={!ready}
              name="sync alternate"
              onClick={() => {
                if (ready) {
                  refetch()
                }
              }}
              data-testid="test-refetch"
              style={{ marginLeft: '0.5rem' }}
            />
          </GridColumn>
        </Grid.Row>
      </Grid>
      <Divider />
      <Segment basic loading={loading}>
        {error && <ErrorMessage error={error} language={language} />}
        {data !== undefined && !loading && !error && <ListFiles files={data.files} />}
      </Segment>
    </>
  )
}

export default AppHome
