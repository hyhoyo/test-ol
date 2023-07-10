import MultiLineString from './multiLineString.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(MultiLineString, options)
  Vue.component(MultiLineString.name, MultiLineString)
}

export default install

export { install, MultiLineString }
