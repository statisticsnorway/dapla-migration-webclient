export const FILE = {
  createFileDetails: file => {
    let details = {}

    const fileSizeKB = file.size * 0.0009765625
    let fileSize = fileSizeKB

    details.created = new Date(file.created)
    details.modified = new Date(file.modified)
    details.fullFilename = `${file.folder}/${file.filename}`

    if (fileSizeKB < 1) {
      details.size = file.size
      details.unit = 'B'
    } else {
      if (fileSizeKB.toFixed(0).toString().length >= 5) {
        details.size = file.size * 0.00000095367432
        details.unit = 'MB'
      } else {
        details.size = fileSize
        details.unit = 'kB'
      }
    }

    return details
  }
}
