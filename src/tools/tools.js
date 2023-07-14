import { polygon, area, point, distance } from '@turf/turf'
import { fromLonLat, toLonLat } from 'ol/proj'

// 格网
class Grid {
  // 根据数据获取左上角经纬度
  SLon = -180
  SLat = 85
  // 经纬度粒度
  latRes = 2.5
  lonRes = 5
  constructor(latRes, lonRes) {
    if (latRes) this.latRes = latRes
    if (lonRes) this.lonRes = lonRes
  }

  grid_coord(lon, lat) {
    const leftTop = [lon, lat]
    // 左上角起点经纬度 lon, lat
    // 右上角
    const rightTop = [lon + this.lonRes, lat]
    // 左下角
    const leftBottom = [lon, lat - this.latRes]
    // 右下角
    const rightBottom = [lon + this.lonRes, lat - this.latRes]
    return [leftTop, rightTop, rightBottom, leftBottom]
  }

  coord2grid(lon, lat) {
    const row = Math.floor((lat - this.SLat) / this.latRes)
    const col = Math.floor((lon - this.SLon) / this.lonRes)
    return [row, col]
  }

  grid2coord(row, col) {
    const lat = row * this.latRes + this.SLat
    const lon = col * this.lonRes + this.SLon
    return [lon, lat]
  }

  getGrid(lon, lat) {
    const rowCol = this.coord2grid(lon, lat)
    const position = this.grid2coord(rowCol[0], rowCol[1])
    return this.grid_coord(position[0], position[1])
  }
}

class HexGrid {
  size_ = 5000
  constructor(size) {
    if (size) {
      this.size_ = size
    }
  }
  layout_ = [
    Math.sqrt(3),
    Math.sqrt(3) / 2,
    0,
    3 / 2,
    Math.sqrt(3) / 3,
    -1 / 3,
    0,
    2 / 3,
    // corners
    Math.cos((Math.PI / 180) * (60 * 0 + 30)),
    Math.sin((Math.PI / 180) * (60 * 0 + 30)),
    Math.cos((Math.PI / 180) * (60 * 1 + 30)),
    Math.sin((Math.PI / 180) * (60 * 1 + 30)),
    Math.cos((Math.PI / 180) * (60 * 2 + 30)),
    Math.sin((Math.PI / 180) * (60 * 2 + 30)),
    Math.cos((Math.PI / 180) * (60 * 3 + 30)),
    Math.sin((Math.PI / 180) * (60 * 3 + 30)),
    Math.cos((Math.PI / 180) * (60 * 4 + 30)),
    Math.sin((Math.PI / 180) * (60 * 4 + 30)),
    Math.cos((Math.PI / 180) * (60 * 5 + 30)),
    Math.sin((Math.PI / 180) * (60 * 5 + 30))
  ]
  origin_ = [0, 0]
  coord2hex(coord) {
    coord = fromLonLat(coord)
    var c = [(coord[0] - this.origin_[0]) / this.size_, (coord[1] - this.origin_[1]) / this.size_]
    var q = this.layout_[4] * c[0] + this.layout_[5] * c[1]
    var r = this.layout_[6] * c[0] + this.layout_[7] * c[1]
    return this.hex_round([q, r])
  }
  getHexagon(hex) {
    var p = []
    var c = this.hex2coord(hex)
    for (var i = 0; i <= 7; i++) {
      p.push(this.hex_corner(c, this.size_, i, this.layout_[8]))
    }
    p = p.map(item => {
      return toLonLat(item)
    })
    return p
  }
  hex_corner = function (center, size, i) {
    return [center[0] + size * this.layout_[8 + 2 * (i % 6)], center[1] + size * this.layout_[9 + 2 * (i % 6)]]
  }
  hex2coord(hex) {
    return [this.origin_[0] + this.size_ * (this.layout_[0] * hex[0] + this.layout_[1] * hex[1]), this.origin_[1] + this.size_ * (this.layout_[2] * hex[0] + this.layout_[3] * hex[1])]
  }
  hex_round(h) {
    return this.cube2hex(this.cube_round(this.hex2cube(h)))
  }
  cube2hex(c) {
    return [c[0], c[2]]
  }
  cube_round(h) {
    var rx = Math.round(h[0])
    var ry = Math.round(h[1])
    var rz = Math.round(h[2])

    var x_diff = Math.abs(rx - h[0])
    var y_diff = Math.abs(ry - h[1])
    var z_diff = Math.abs(rz - h[2])

    if (x_diff > y_diff && x_diff > z_diff) rx = -ry - rz
    else if (y_diff > z_diff) ry = -rx - rz
    else rz = -rx - ry

    return [rx, ry, rz]
  }
  hex2cube(h) {
    return [h[0], -h[0] - h[1], h[1]]
  }
}

// 计算面积
const getArea = coordinates => {
  const polygons = polygon(coordinates)
  return area(polygons)
}
// 计算周长-公里
const getPerimeter = coordinates => {
  let perimeter = 0
  coordinates.forEach((item, index) => {
    if (index > 0) {
      const from = coordinates[index - 1]
      const to = item
      perimeter += getDistance(from, to)
    }
  })
  return perimeter
}

// 计算距离-公里
const getDistance = (from, to, units = 'kilometers') => {
  from = point(from)
  to = point(to)
  const options = { units }
  return distance(from, to, options)
}

/**
 *@description 火星坐标 (GCJ-02)转百度坐标(BD-09 )，返回转换后的坐标点数组
 *@param {number[]} gcjCoord 火星坐标 (GCJ-02)值数组
 *@return {number[]} 返回转换后的坐标点数组,保留小数点后8位
 **/
const pi = Math.PI
const x_pi = (pi * 3000) / 180
const _ee = 0.00669342162296594323 // 椭球的偏心率
const _a = 6378245.0 // 卫星椭球坐标投影到平面地图坐标系的投影因子。

const gcj02Tobd09 = gcjCoord => {
  var x = gcjCoord[0],
    y = gcjCoord[1]
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  const bdLon = z * Math.cos(theta) + 0.0065
  const bdLat = z * Math.sin(theta) + 0.006
  return [bdLon, bdLat]
}

/**
 *@description 百度坐标(BD-09 )转火星坐标 (GCJ-02)，返回转换后的坐标点数组
 *@param {number[]} bdCoord 百度坐标 (BD-09)值数组
 *@return {number[]} 返回转换后的坐标点数组,保留小数点后8位
 **/
const bd09Togcj02 = bdCoord => {
  var x = bdCoord[0] - 0.0065,
    y = bdCoord[1] - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  var gcjLon = z * Math.cos(theta)
  var gcjLat = z * Math.sin(theta)
  return [gcjLon, gcjLat]
}

/**
 *@description 火星坐标 (GCJ-02)转地球坐标(WGS-84)，返回转换后的坐标点数组
 *@param {number[]} gcjCoord 火星坐标 (GCJ-02)值数组
 *@return {number[]} 返回转换后的坐标点数组,保留小数点后8位
 **/
const gcj02Towgs84 = gcjCoord => {
  if (_outOfChina(gcjCoord[0], gcjCoord[1])) {
    return gcjCoord
  }
  const obj = _transform(gcjCoord[0], gcjCoord[1])
  var x = gcjCoord[0] - obj.dLon
  var y = gcjCoord[1] - obj.dLat
  return [parseFloat(x.toFixed(8)), parseFloat(y.toFixed(8))]
}

/**
 *@description 地球坐标(WGS-84)转百度坐标(BD-09 )，返回转换后的坐标点数组
 *@param {number[]} wgsCoord 地球坐标(WGS-84)值数组
 *@return {number[]} 返回转换后的坐标点数组,保留小数点后8位
 **/
const wgs84Tobd09 = wgsCoord => {
  var coord = wgs84Togcj02(wgsCoord)
  coord = gcj02Tobd09(coord)
  return coord
}

/**
 *@description 地球坐标(WGS-84)转火星坐标 (GCJ-02)，返回转换后的坐标点数组
 *@param {number[]} wgsCoord 地球坐标(WGS-84)值数组
 *@return {number[]} 返回转换后的坐标点数组,保留小数点后8位
 **/
const wgs84Togcj02 = wgsCoord => {
  if (_outOfChina(wgsCoord[0], wgsCoord[1])) {
    return wgsCoord
  }
  var obj = _transform(wgsCoord[0], wgsCoord[1])
  var x = wgsCoord[0] + obj.dLon
  var y = wgsCoord[1] + obj.dLat
  return [parseFloat(x.toFixed(8)), parseFloat(y.toFixed(8))]
}

/**
 *@description 百度坐标(BD-09 )转地球坐标(WGS-84)，返回转换后的坐标点数组
 *@param {number[]} bdCoord 百度坐标 (BD-09)值数组
 *@return {number[]} 返回转换后的坐标点数组,保留小数点后8位
 **/
const bd09Towgs84 = bdCoord => {
  var coord = bd09Togcj02(bdCoord)
  coord = gcj02Towgs84(coord)
  return coord
}

const _outOfChina = (lonX, latY) => {
  if (lonX < 72.004 || lonX > 137.8347) return true
  if (latY < 0.8293 || latY > 55.8271) return true
  return false
}

//火星坐标和经纬度之间的转换
const _transform = (wgLon, wgLat) => {
  var dLon, dLat
  dLat = _transformLat(wgLon - 105.0, wgLat - 35.0)
  dLon = _transformLon(wgLon - 105.0, wgLat - 35.0)
  var radLat = (wgLat / 180.0) * Math.PI
  var magic = Math.sin(radLat)
  magic = 1 - _ee * magic * magic
  var sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / (((_a * (1 - _ee)) / (magic * sqrtMagic)) * Math.PI)
  dLon = (dLon * 180.0) / ((_a / sqrtMagic) * Math.cos(radLat) * Math.PI)
  var obj = {
    dLat: dLat,
    dLon: dLon
  }
  return obj
}
const _transformLat = (x, y) => {
  var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0
  return ret
}
const _transformLon = (x, y) => {
  var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0
  return ret
}

import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'

const renderXYZ = (map, xyzConfig) => {
  map.getLayers().forEach(item => {
    if (item.get('name') === 'renderXYZ') {
      map.remoeLayer(item)
    }
  })
  const config = JSON.parse(JSON.stringify(xyzConfig))

  let url = ''
  if (config.mapProxyUrl) {
    url += `${config.mapProxyUrl}?`
    delete config.mapProxyUrl
  }
  if (config.url) {
    url += `url=${config.url}/{z}/{x}/{y}.${config.suffix || 'png'}`
    delete config.url
  }
  if (config.render) {
    const render = {
      render: config.render,
      renderopt: config.renderopt
    }
    url += `&render=${encodeURIComponent(JSON.stringify(render))}`
    delete config.render
    delete config.renderopt
  }

  if (config.param) {
    url += `${encodeURI(config.param)}`
    delete config.param
  }
  const layer = new TileLayer({
    source: new XYZ({
      url: url
    }),
    ...config
  })
  layer.set('name', 'renderXYZ')
  map.addLayer(layer)
}

export default { Grid, HexGrid, renderXYZ, getArea, getDistance, getPerimeter, gcj02Tobd09, bd09Togcj02, bd09Towgs84, wgs84Togcj02, wgs84Tobd09, gcj02Towgs84 }
export { Grid, HexGrid, renderXYZ, getArea, getDistance, getPerimeter, gcj02Tobd09, bd09Togcj02, bd09Towgs84, wgs84Togcj02, wgs84Tobd09, gcj02Towgs84 }
