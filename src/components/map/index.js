import Map from './map.vue';

function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  install.installed = true;
  Object.assign(Map, options);
  Vue.component(Map.name, Map);
}

export default install;

export { install, Map };
