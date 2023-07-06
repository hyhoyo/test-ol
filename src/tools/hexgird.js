import { fromLonLat, toLonLat } from 'ol/proj'

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

export default HexGrid
