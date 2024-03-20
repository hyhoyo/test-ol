import Overlay from './overlay.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(Overlay, options)
  Vue.component(Overlay.name, Overlay)
}

export default install

export { install, Overlay }
