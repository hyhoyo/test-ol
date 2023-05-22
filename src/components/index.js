import Map, { Map as UcenOlMap } from './map';
import Scatter, { Scatter as UcenOlScatter } from './scatter';
import VectorLayer, { VectorLayer as UcenOlVectorLayer } from './vectorLayer';
import Point, { Point as UcenOlPoint } from './point';
import Area, { Area as UcenOlArea } from './area';

export default function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue.use(Map, options);
  Vue.use(Scatter, options);
  Vue.use(VectorLayer, options);
  Vue.use(Point, options);
  Vue.use(Area, options);
}

export { install, UcenOlMap, UcenOlScatter, UcenOlVectorLayer, UcenOlPoint, UcenOlArea };
