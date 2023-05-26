const getUuid = () => {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += window.performance.now()
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

const ArrayToObject = (data, key, value) => {
  if (!Array.isArray(data)) {
    return data || {}
  }
  const obj = {}
  data.forEach(item => {
    obj[item[key]] = value ? item[value] : item
  })
  return obj
}

export { getUuid, ArrayToObject }
