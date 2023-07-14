<template>
  <div>
    <slot v-if="layer" />
  </div>
</template>
<script>
import { createStyleFn, createVectorLayer } from '@/utils/olFn'
// 矢量图层组件
// @group 基础地图组件
export default {
  name: 'UcenOlVectorLayer',
  data() {
    return {
      layer: undefined
    }
  },
  props: {
    styles: {
      type: Object,
      default: () => undefined
    },
    name: {
      type: String,
      default: () => undefined
    }
  },
  inject: {
    map: {
      from: 'map',
      default: undefined
    }
  },
  provide: function () {
    return {
      vectorLayer: () => this.layer
    }
  },
  computed: {
    baseMap: function () {
      return this.map && this.map()
    }
  },
  watch: {
    styles: {
      handler(newVal) {
        this.setStyles(newVal)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.baseMap) {
        throw '未实例化地图'
      }
      this.createLayer()
    },
    createLayer() {
      if (!this.layer) {
        this.layer = createVectorLayer()
        this.baseMap.addLayer(this.layer)
        if (this.name) {
          this.layer.set('name', this.name)
        }
      }
      this.setStyles(this.styles)
    },
    setStyles(styles) {
      if (styles) {
        const style = createStyleFn(styles)
        this.layer.setStyle(style)
      }
    },
    clear() {
      if (this.layer) {
        this.layer.getSource().clear()
      }
    },
    remove() {
      if (this.layer) {
        this.baseMap.removeLayer(this.layer)
        this.layer = undefined
      }
    }
  }
}
</script>
