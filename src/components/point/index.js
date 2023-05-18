import Point from './point.vue';

function install(Vue, options = {}) {
  if (install.installed) {
    return;
  }
  install.installed = true;
  Object.assign(Point, options);
  Vue.component(Point.name, Point);
}

export default install;

export { install, Point };
