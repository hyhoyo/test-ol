import { Map } from './components';

const install = (Vue, options = {}) => {
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue.use(Map, options);
};

export default { install, Map };
