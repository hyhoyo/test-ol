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

export default Grid
