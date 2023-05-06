import { UcenOlMap } from './components';

export default function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue.use(UcenOlMap, options);
}

export { install, UcenOlMap };
