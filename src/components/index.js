import Map from './map'
import Scatter from './scatter'
import VectorLayer from './vectorLayer'
import Point from './point'
import Area from './area'
import Points from './points'

export default function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true

  Vue.use(Map, options)
  Vue.use(Scatter, options)
  Vue.use(VectorLayer, options)
  Vue.use(Point, options)
  Vue.use(Area, options)
  Vue.use(Points, options)
}

export { install, Map as UcenOlMap, Scatter as UcenOlScatter, VectorLayer as UcenOlVectorLayer, Point as UcenOlPoint, Points as UcenOlPoints, Area as UcenOlArea }
