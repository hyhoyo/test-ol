const hexToRgba = (hex, alpha) => {
  const colorObj = parseColorString(hex, alpha)
  return toRgbaString(colorObj)
}

const toRgbaString = (colorObj, n = 10000) => {
  const { r, g, b, a = 1 } = colorObj
  return `rgba(${r},${g},${b},${Math.floor(a * n) / n})`
}

const parseColorString = (color, alpha) => {
  if (typeof color !== 'string') return color
  if (color.startsWith('#')) {
    return parseHexColor(color, alpha)
  } else if (color.startsWith('rgb')) {
    return parseRgbaColor(color, alpha)
  } else if (color === 'transparent') {
    return parseHexColor('#00000000')
  }
  throw new Error(`color string error: ${color}`)
}

const parseRgbaColor = (color, alpha) => {
  const arr = color.match(/(\d(\.\d+)?)+/g) || []
  const res = arr.map(s => parseInt(s, 10))
  return {
    r: res[0],
    g: res[1],
    b: res[2],
    a: alpha ? alpha : parseFloat(arr[3])
  }
}

const parseHexColor = (color, alpha) => {
  let hex = color.slice(1)
  let a = 1
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  if (hex.length === 8) {
    a = parseInt(hex.slice(6), 16) / 255
    hex = hex.slice(0, 6)
  }
  if (alpha) {
    a = alpha
  }
  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
    a
  }
}

export { hexToRgba }
