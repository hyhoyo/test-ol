import Map from './map.vue';

function install(Vue, options = {}) {
  if (install.install) {
    return;
  }
  install.install = true;
  Object.assign(Map, options);
  Vue.compnent(Map.name, Map);
}

export default install;

export { install, Map };
