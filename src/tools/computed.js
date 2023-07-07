import { polygon, area, point, distance } from '@turf/turf'
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
    return perimeter
  })
}

// 计算距离-公里
const getDistance = (from, to, units = 'kilometers') => {
  from = point(from)
  to = point(to)
  const options = { units }
  return distance(from, to, options)
}

export default { getArea, getDistance, getPerimeter }

export { getArea, getDistance, getPerimeter }
