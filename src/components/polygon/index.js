import Polygon from './polygon.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(Polygon, options)
  Vue.component(Polygon.name, Polygon)
}

export default install

export { install, Polygon }
