import { Checkbox, List } from 'semantic-ui-react'

function FilesListSimple ({ files, selectedFile, handleCheckbox }) {
  return files.map(file => {
    const fullFilename = `${file.folder}/${file.filename}`
    const checked = selectedFile === fullFilename

    return (
      <List.Item
        key={fullFilename}
        onClick={() => handleCheckbox(fullFilename)}
        style={{ backgroundColor: checked ? '#00b5ad' : '#fff' }}
      >
        {fullFilename}
        <Checkbox
          checked={checked}
          style={{ marginLeft: '0.5rem', paddingTop: '0.15rem' }}
        />
      </List.Item>
    )
  })
}

export default FilesListSimple
