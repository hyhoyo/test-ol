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

export default { gcj02Tobd09, bd09Togcj02, bd09Towgs84, wgs84Togcj02, wgs84Tobd09, gcj02Towgs84 }
export { gcj02Tobd09, bd09Togcj02, bd09Towgs84, wgs84Togcj02, wgs84Tobd09, gcj02Towgs84 }
