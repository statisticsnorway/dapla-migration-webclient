import { Link } from 'react-router-dom'
import { Button, Divider, Grid, Header, Icon, Statistic, Table } from 'semantic-ui-react'

import { APP_STEPS } from '../../configurations'

function FileInspect ({ data }) {
  return (
    <Grid columns="equal">
      <Grid.Row>
        <Grid.Column>
          <Divider />
          <Statistic.Group size="small" widths={2}>
            <Statistic color="teal">
              <Statistic.Value>{data.result.template.metadata.boundaryType}</Statistic.Value>
              <Statistic.Label>boundaryType</Statistic.Label>
            </Statistic>
            <Statistic color="teal">
              <Statistic.Value>{data.result.template.metadata.valuation}</Statistic.Value>
              <Statistic.Label>valuation</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Header content="Structure" />
          <Table celled>
            <Table.Header>
              <Table.Row>
                {data.result.template.structure.schema.columns.map(column =>
                  <Table.HeaderCell key={column.name}>
                    {`${column.name} (${column.type})`}
                  </Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                {data.result.template.structure.schema.columns.map(column =>
                  <Table.Cell key={column.name}>
                    {` `}
                  </Table.Cell>
                )}
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign="right">
          <Link
            to={{
              pathname: APP_STEPS[2].route,
              state: data
            }}
          >
            <Button primary>
              <Icon name="file code" />
              Change structure and import
            </Button>
          </Link>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default FileInspect
