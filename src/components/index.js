import Map, { Map as UcenOlMap } from './map';
import Scatter, { Scatter as UcenOlScatter } from './scatter';

export default function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue.use(Map, options);
  Vue.use(Scatter, options);
}

export { install, UcenOlMap, UcenOlScatter };
