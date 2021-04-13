import { useState } from 'react'
import { Divider, Grid, Header, Item, List } from 'semantic-ui-react'

import FilesList from './FilesList'
import FilesListSimple from './FilesListSimple'
import CopyFiles from './CopyFiles'

function ListFiles ({ files, simpleView }) {
  const [filesToCopy, setFilesToCopy] = useState([])

  const handleCheckbox = (includes, filename) => {
    if (includes) {
      setFilesToCopy(filesToCopy.filter(file => file !== filename))
    } else {
      setFilesToCopy(filesToCopy.concat([filename]))
    }
  }

  return (
    <Grid columns="equal">
      <Grid.Column>
        {simpleView ?
          <List relaxed verticalAlign="middle">
            <FilesListSimple files={files} filesToCopy={filesToCopy} handleCheckbox={handleCheckbox} />
          </List>
          :
          <Item.Group link>
            <FilesList files={files} filesToCopy={filesToCopy} handleCheckbox={handleCheckbox} />
          </Item.Group>
        }
      </Grid.Column>
      <Grid.Column>
        {filesToCopy.length !== 0 &&
        <>
          <Header size="huge" content="Files to copy" />
          <List>
            {filesToCopy.map(file => <List.Item key={file}>{file}</List.Item>)}
          </List>
          <Divider hidden />
          <CopyFiles files={filesToCopy} />
        </>
        }
      </Grid.Column>
    </Grid>
  )
}

export default ListFiles
