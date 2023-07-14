import MulitiPoint from './mulitiPoint.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(MulitiPoint, options)
  Vue.component(MulitiPoint.name, MulitiPoint)
}

export default install

export { install, MulitiPoint }
