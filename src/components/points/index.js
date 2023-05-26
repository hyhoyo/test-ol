import Points from './points.vue'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }
  install.installed = true
  Object.assign(Points, options)
  Vue.component(Points.name, Points)
}

export default install

export { install, Points }
