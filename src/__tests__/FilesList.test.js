import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import FilesList from '../components/files/list/FilesList'
import { AppContextProvider } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'

const { testFileObjects, testFile } = TEST_CONFIGURATIONS
const handleCheckbox = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <FilesList files={testFileObjects} selectedFile={testFile.file} handleCheckbox={handleCheckbox} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  testFileObjects.forEach(file => {
    expect(getByText(file.folder)).toBeInTheDocument()
    expect(getByText(file.filename)).toBeInTheDocument()
  })

  userEvent.click(getByText(testFileObjects[1].filename))

  expect(handleCheckbox).toHaveBeenCalledWith(`${testFileObjects[1].folder}/${testFileObjects[1].filename}`)
})
