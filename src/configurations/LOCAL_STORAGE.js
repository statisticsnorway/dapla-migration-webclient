export const LOCAL_STORAGE = (statusId, info) => {
  const statuses = localStorage.getItem('statuses')

  if (statuses === null || statuses === undefined) {
    localStorage.setItem('statuses', statusId)
  } else {
    const newStatuses = statuses.split(',')

    newStatuses.push(statusId)

    localStorage.setItem('statuses', newStatuses.join(','))
  }

  localStorage.setItem(statusId, JSON.stringify(info))
}
