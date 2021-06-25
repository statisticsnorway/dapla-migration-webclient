import { useContext } from 'react'
import { Divider, Header, Icon, Item, List } from 'semantic-ui-react'

import CopyFile from '../copy/CopyFile'
import { LanguageContext } from '../../../context/AppContext'
import { FILE } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

function FileDetailed ({ file }) {
  const { language } = useContext(LanguageContext)

  const fileDetails = FILE.createFileDetails(file)

  return (
    <Item.Group>
      <Item>
        <Item.Content>
          <Item.Header as={Header} size="small">
            {file.filename}
          </Item.Header>
          <Item.Meta style={{ marginBottom: 0 }}>
            <Icon name="folder" style={{ marginRight: '0.3rem' }} />
            {file.folder}
          </Item.Meta>
          <Item.Extra style={{ marginTop: 0 }}>
            <List horizontal>
              <List.Item>
                {`${APP_STEPS.LIST.FILE.SIZE[language]}: ${fileDetails.size.toFixed(0)} ${fileDetails.unit}`}
              </List.Item>
              <List.Item>
                {`${APP_STEPS.LIST.FILE.CREATED[language]}: ${fileDetails.created.toLocaleDateString()}`}
              </List.Item>
              <List.Item>
                {`${APP_STEPS.LIST.FILE.MODIFIED[language]}: ${fileDetails.modified.toLocaleDateString()}`}
              </List.Item>
            </List>
            <Divider hidden />
            <CopyFile file={fileDetails.fullFilename} fileSize={file.size} />
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  )

}

export default FileDetailed
