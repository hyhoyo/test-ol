import Scatter from './scatter.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(Scatter, options)
  Vue.component(Scatter.name, Scatter)
}

export default install

export { install, Scatter }
