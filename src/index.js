import { Map } from './components';

export default function install(Vue, options = {}) {
  if (install.install) {
    return;
  }
  install.install = true;

  Vue.use(Map, options);
}

export { install, Map };
