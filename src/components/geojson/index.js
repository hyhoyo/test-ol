import Geojson from './geojson.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(Geojson, options)
  Vue.component(Geojson.name, Geojson)
}

export default install

export { install, Geojson }
