export const exportJSON = (json: object, fileName: string) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, null, 2))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', fileName + '.json')
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

export const clone = (obj: object) => JSON.parse(JSON.stringify(obj))

export const clearObject = (obj: object) => {
  const newObj = clone(obj)
  for (const attribute in newObj) {
    if (typeof obj[attribute] == 'object') newObj[attribute] = clearObject(newObj[attribute])
    else if (attribute === 'id' || attribute === '__typename') delete newObj[attribute]
  }
  return newObj
}
