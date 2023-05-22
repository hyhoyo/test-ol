import Area from './area.vue';

function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  install.installed = true;
  Object.assign(Area, options);
  Vue.component(Area.name, Area);
}

export default install;

export { install, Area };
