import Map, { Map as UcenOlMap } from './components/map'
import Scatter, { Scatter as UcenOlScatter } from './components/scatter'
import VectorLayer, { VectorLayer as UcenOlVectorLayer } from './components/vectorLayer'
import Point, { Point as UcenOlPoint } from './components/point'
import Points, { Points as UcenOlPoints } from './components/points'
import Area, { Area as UcenOlArea } from './components/area'

export default function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true

  Vue.use(Map, options)
  Vue.use(Scatter, options)
  Vue.use(VectorLayer, options)
  Vue.use(Point, options)
  Vue.use(Points, options)
  Vue.use(Area, options)
}

export { install, UcenOlMap, UcenOlScatter, UcenOlVectorLayer, UcenOlPoint, UcenOlPoints, UcenOlArea }
