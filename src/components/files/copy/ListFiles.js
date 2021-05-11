import { useRef, useState } from 'react'
import { Checkbox, Divider, Grid, Header, Input, Item, List, Ref, Sticky } from 'semantic-ui-react'

import FilesList from './FilesList'
import FilesListSimple from './FilesListSimple'
import FileDetailed from './FileDetailed'

function ListFiles ({ files }) {
  const [fileToCopy, setFileToCopy] = useState('')
  const [filterFilesBy, setFilterFilesBy] = useState('')
  const [filteredFiles, setFilteredFiles] = useState(files)
  const [simpleView, setSimpleView] = useState(true)

  const appRefArea = useRef()

  const handleCheckbox = filename => setFileToCopy(filename)

  const handleFilterFiles = (e, { value }) => {
    setFilterFilesBy(value)

    if (value.length > 0) {
      if (value.startsWith('/')) {
        setFilteredFiles(files.filter(file => file.folder.toUpperCase().includes(value.toUpperCase())))
      } else {
        setFilteredFiles(files.filter(file => file.filename.toUpperCase().includes(value.toUpperCase())))
      }
    } else {
      setFilteredFiles(files)
    }
  }

  return (
    <Ref innerRef={appRefArea}>
      <Grid columns="equal" divided>
        <Grid.Column>
          <Grid columns="equal">
            <Grid.Column>
              <Header size="large" content="Select file to copy" />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Checkbox
                toggle
                checked={simpleView}
                label="Simple list"
                onChange={() => setSimpleView(!simpleView)}
              />
            </Grid.Column>
          </Grid>
          <Divider hidden />
          <Input
            fluid
            size="large"
            icon="filter"
            placeholder="Filter"
            value={filterFilesBy}
            onChange={handleFilterFiles}
          />
          <Divider hidden />
          {simpleView ?
            <List relaxed verticalAlign="middle">
              <FilesListSimple files={filteredFiles} fileToCopy={fileToCopy} handleCheckbox={handleCheckbox} />
            </List>
            :
            <Item.Group link>
              <FilesList files={filteredFiles} fileToCopy={fileToCopy} handleCheckbox={handleCheckbox} />
            </Item.Group>
          }
        </Grid.Column>
        <Grid.Column>
          {fileToCopy !== '' &&
          <Sticky context={appRefArea} offset={80}>
            <Header size="large" content="Selected file ready to copy" />
            <FileDetailed file={files.filter(file => `${file.folder}/${file.filename}` === fileToCopy)[0]} />
          </Sticky>
          }
        </Grid.Column>
      </Grid>
    </Ref>
  )
}

export default ListFiles
