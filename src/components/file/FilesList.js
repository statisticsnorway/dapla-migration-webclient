import { Checkbox, Header, Icon, Item, List } from 'semantic-ui-react'

function FilesList ({ files, filesToCopy, handleCheckbox }) {
  return files.map(file => {
    const created = new Date(file.created)
    const modified = new Date(file.modified)
    const fullFilename = `${file.folder}/${file.filename}`
    const includes = filesToCopy.includes(fullFilename)

    return <Item key={file.filename} onClick={() => handleCheckbox(includes, fullFilename)}>
      <Item.Content>
        <Item.Header as={Header} size="small">
          {file.filename}
          <Checkbox
            checked={includes}
            style={{ marginLeft: '0.5rem', paddingTop: '0.15rem' }}
          />
        </Item.Header>
        <Item.Meta style={{ marginBottom: 0 }}>
          <Icon name="folder" style={{ marginRight: '0.3rem' }} />
          {file.folder}
        </Item.Meta>
        <Item.Extra style={{ marginTop: 0 }}>
          <List horizontal>
            <List.Item>{`Size: ${file.size} B`}</List.Item>
            <List.Item>{`Created: ${created.toLocaleDateString()}`}</List.Item>
            <List.Item>{`Modified: ${modified.toLocaleDateString()}`}</List.Item>
          </List>
        </Item.Extra>
      </Item.Content>
    </Item>
  })
}

export default FilesList
