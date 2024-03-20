<template>
  <div></div>
</template>
<script>
import { fromLonLat } from 'ol/proj'
import { getUuid } from '@/utils'
import { Overlay } from 'ol'
export default {
  name: 'UcenOlOverlay',
  props: {
    position: {
      type: Array,
      default: () => undefined
    },
    dom: {
      type: HTMLElement,
      default: () => undefined
    },
    options: {
      type: Object,
      default: () => undefined
    },
    extends: {
      type: [Array, Number, Object, String],
      default: () => undefined
    }
  },
  inject: {
    vectorLayer: {
      from: 'vectorLayer',
      default: undefined
    },
    map: {
      from: 'map',
      default: undefined
    }
  },
  watch: {
    position: {
      handler(newVal) {
        const overlay = this.getOverlay(this.id)
        if (overlay) {
          if (newVal && newVal.length > 0) {
            overlay.setPosition(fromLonLat(newVal))
          } else {
            overlay.setPosition(undefined)
          }
        }
      }
    },
    dom: {
      handler(newVal) {
        if (newVal) {
          const overlay = this.getOverlay(this.id)
          if (overlay) {
            overlay.setElement(newVal)
          }
        }
      }
    }
  },
  computed: {
    baseMap: function () {
      return this.map && this.map()
    },
    opts: function () {
      if (this.dom) {
        if (this.options) {
          return Object.assign(this.options, { id: this.id, element: this.dom })
        } else {
          return { element: this.dom, id: this.id }
        }
      } else {
        return {}
      }
    }
  },
  data() {
    return {
      id: `Overlay-${getUuid()}`
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
      this.load()
    },
    load() {
      this.drawOverlay()
    },
    drawOverlay() {
      const overlay = new Overlay(this.opts)
      overlay.set('extends', this.extends)
      const position = this.position && this.position.length > 0 ? fromLonLat(this.position) : undefined
      overlay.setPosition(position)
      this.baseMap.addOverlay(overlay)
    },
    getOverlay() {
      return this.baseMap.getOverlayById(this.id)
    },
    removeOverlay() {
      const overlay = this.getOverlay()
      if (overlay) {
        this.baseMap.removeOverlay(overlay)
      }
    }
  },
  beforeDestroy() {
    this.removeOverlay()
  }
}
</script>
