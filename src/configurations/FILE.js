export const FILE = {
  createFileDetails: file => {
    let details = {}

    //const fileSizeKB = file.size * 0.0009765625
    const fileSizeKB = file.size * 0.001
    let fileSize = fileSizeKB

    details.created = new Date(file.created)
    details.modified = new Date(file.modified)
    details.fullFilename = `${file.folder}/${file.filename}`

    if (fileSizeKB < 1) {
      details.size = file.size
      details.unit = 'B'
    } else {
      if (fileSizeKB.toFixed(0).toString().length >= 5) {
        //details.size = file.size * 0.00000095367432
        details.size = file.size * 0.000001
        details.unit = 'MB'
      } else {
        details.size = fileSize
        details.unit = 'kB'
      }
    }

    return details
  },
  createBucketString: (bucket, file, startTime) => {
    const td = new Date(startTime)
    const filenameWithoutExtension = file.filename.split('.').slice(0, -1).join('.')
    const timestamp = `${td.getFullYear()}${('0' + (td.getMonth() + 1)).slice(-2)}${('0' + td.getDate()).slice(-2)}${td.getHours()}${td.getMinutes()}${td.getSeconds()}`

    return ` ${bucket}${file.folder}/${filenameWithoutExtension}/${timestamp}/`
  }
}
