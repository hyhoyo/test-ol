import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Fill, Circle, Stroke, Icon, Text } from 'ol/style'
import cloneDeep from 'lodash/cloneDeep'
import { defaultStyleConfig } from '@/assets/config/mapConfig'

// 需要创建的参数
const useCreate = ['fill', 'stroke', 'backgroundFill']

const isString = data => {
  return typeof data === 'string'
}

const filterFn = type => {
  switch (type) {
    case 'fill':
    case 'backgroundFill':
      return createFillFn
    case 'stroke':
      return createStrokeFn
  }
}

const useFilter = style => {
  for (let key in style) {
    if (useCreate.includes(key)) {
      const fn = filterFn(key)
      if (typeof fn === 'function') {
        style[key] = fn(style[key])
      }
    }
  }
  return style
}

const createFill = style => {
  if (isString(style)) {
    style = {
      color: style
    }
  }
  style = useFilter(style)
  return {
    fill: new Fill({
      ...style
    })
  }
}

const createFillFn = style => {
  if (isString(style)) {
    return new Fill({
      color: style
    })
  }
  return style
}

const createStroke = style => {
  if (isString(style)) {
    style = {
      color: style
    }
  }
  style = useFilter(style)
  return {
    stroke: new Stroke({
      ...style
    })
  }
}

const createStrokeFn = style => {
  if (isString(style)) {
    return new Stroke({
      color: style
    })
  }
  return style
}

const createCircle = style => {
  style = useFilter(style)
  return {
    image: new Circle({
      ...style
    })
  }
}

const createText = style => {
  style = useFilter(style)
  return {
    text: new Text({
      ...style
    })
  }
}

const createImage = style => {
  style = useFilter(style)
  return {
    image: new Icon({
      ...style
    })
  }
}

const createStyleFn = style => {
  const _style = cloneDeep(style)
  let rebuildStyle = {}
  for (let key in _style) {
    const data = _style[key]
    switch (key) {
      case 'text':
        var text = createText(data)
        Object.assign(rebuildStyle, text)
        break
      case 'circle':
        var circle = createCircle(data)
        Object.assign(rebuildStyle, circle)
        break
      case 'icon':
        var icon = createImage(data)
        Object.assign(rebuildStyle, icon)
        break
      case 'fill':
        var fill = createFill(data)
        Object.assign(rebuildStyle, fill)
        break
      case 'stroke':
        var stroke = createStroke(data)
        Object.assign(rebuildStyle, stroke)
        break
    }
  }
  return new Style(rebuildStyle)
}

const getStyleFn = Style => {
  const obj = {}
  const text = Style.getText()
  if (text) {
    obj.text = text
  }
  const fill = Style.getFill()
  if (fill) {
    obj.text = fill
  }
  const stroke = Style.getStroke()
  if (stroke) {
    obj.stroke = stroke
  }
  const image = Style.getImage()
  if (image) {
    obj.image = image
  }
  return obj
}

const assignStyleFn = (Style1, Style2) => {
  const s1 = getStyleFn(Style1)
  const s2 = getStyleFn(Style2)
  const newStyle = Object.assign({}, s1, s2)
  return new Style(newStyle)
}

const createVectorLayer = () => {
  return new VectorLayer({
    source: new VectorSource()
  })
}

function compareArray(arr1, arr2) {
  const ArrayToJSON = arr => {
    let json = {}
    arr.map((item, index) => {
      if (!json[item]) {
        json[item] = index + 1
      }
    })
    return json
  }

  var leftJSON = ArrayToJSON(arr1)
  var rightJSON = ArrayToJSON(arr2)

  for (var key in leftJSON) {
    if (rightJSON[key]) {
      delete rightJSON[key]
      delete leftJSON[key]
    }
  }
  return {
    arr1: Object.keys(leftJSON),
    arr2: Object.keys(rightJSON)
  }
}

const mergaStyleFn = (styles, defaultStyle) => {
  let styleObj = cloneDeep(styles)
  if (Object.keys(defaultStyle).length > 0) {
    styleObj = recusionStyleFn({}, styles, defaultStyle)
  }
  styleObj = recusionStyleFn({}, defaultStyleConfig, styleObj)
  return styleObj
}

const mergaDefaultStyleFn = styles => {
  return recusionStyleFn({}, defaultStyleConfig, styles)
}

const recusionStyleFn = (callback, styles, defaultStyle) => {
  defaultStyle = cloneDeep(defaultStyle) || {}
  styles = cloneDeep(styles) || {}
  const key1 = Object.keys(defaultStyle)
  const key2 = Object.keys(styles)
  const compareObj = compareArray(key1, key2)

  compareObj.arr1.forEach(item => {
    callback[item] = defaultStyle[item]
  })

  compareObj.arr2.forEach(item => {
    callback[item] = styles[item]
  })

  for (let key in styles) {
    const item = styles[key]
    const defaultItem = defaultStyle ? defaultStyle[key] : {}
    if (typeof item === 'object') {
      callback[key] = {}
      recusionStyleFn(callback[key], defaultItem, item)
    } else {
      callback[key] = item
    }
  }
  return callback
}

export { createStyleFn, createVectorLayer, getStyleFn, assignStyleFn, mergaStyleFn, recusionStyleFn }
