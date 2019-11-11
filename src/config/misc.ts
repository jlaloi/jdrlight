export const exportJSON = (json: object, fileName: string) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, stringifyReplacer, 1))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', fileName + '.json')
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

export const clone = (obj: object) => JSON.parse(JSON.stringify(obj))

export const stringifyReplacer = (key: string, value: object) => {
  if (key === 'id' || key === '__typename') return undefined
  return value
}
