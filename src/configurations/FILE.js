export const FILE = {
  createFileDetails: file => {
    const details = {}

    const fileSizeKB = file.size * 0.001
    const fileSize = fileSizeKB

    details.created = new Date(file.created)
    details.modified = new Date(file.modified)
    details.fullFilename = `${file.folder}/${file.filename}`

    if (fileSizeKB < 1) {
      details.size = file.size
      details.unit = 'B'
    } else {
      if (fileSizeKB.toFixed(0).toString().length >= 5) {
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
    const timestamp = `${td.getUTCFullYear()}${('0' + (td.getUTCMonth() + 1)).slice(-2)}${('0' + td.getUTCDate()).slice(-2)}${td.getUTCHours()}${td.getUTCMinutes()}${td.getUTCSeconds()}`

    return ` ${bucket}${file.folder}/${filenameWithoutExtension}/${timestamp}/`
  }
}
