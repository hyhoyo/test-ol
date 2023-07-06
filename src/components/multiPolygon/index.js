import MultiPolygon from './multiPolygon.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(MultiPolygon, options)
  Vue.component(MultiPolygon.name, MultiPolygon)
}

export default install

export { install, MultiPolygon }
