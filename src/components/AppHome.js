import ListFiles from './file/ListFiles'

function AppHome () {
  return (
    <>
      <ListFiles apiUrl="SAS" />
      <ListFiles apiUrl="AGENT" />
    </>
  )
}

export default AppHome
