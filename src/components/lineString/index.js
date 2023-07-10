import LineString from './lineString.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(LineString, options)
  Vue.component(LineString.name, LineString)
}

export default install

export { install, LineString }
