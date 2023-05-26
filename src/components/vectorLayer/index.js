import VectorLayer from './vectorLayer.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(VectorLayer, options)
  Vue.component(VectorLayer.name, VectorLayer)
}

export default install

export { install, VectorLayer }
