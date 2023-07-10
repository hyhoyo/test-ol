<template>
  <UcenOlVectorLayer :styles="styles" :name="'customPoints-' + id">
    <UcenOlPoint v-for="(item, index) in positions" :key="`points-${index}-${Math.random()}`" :position="item.position" :extends="item.extends" :styles="setStyles(item.styles)" />
  </UcenOlVectorLayer>
</template>
<script>
import { getUuid } from '@/utils'
import UcenOlPoint from '../point/point.vue'
import UcenOlVectorLayer from '../vectorLayer/vectorLayer.vue'
import { createVectorLayer, layerByName, mergaPointStyleFn } from '@/utils/olFn'
import { getVectorContext } from 'ol/render'
import { linear } from 'ol/easing'
import { Stroke, Style, Circle as CircleStyle } from 'ol/style'
import { hexToRgba } from '@/utils/color'
import { unByKey } from 'ol/Observable'
export default {
  name: 'UcenOlPoints',
  components: {
    UcenOlVectorLayer,
    UcenOlPoint
  },
  inject: {
    map: {
      from: 'map',
      default: undefined,
      renderLayer: undefined
    }
  },
  computed: {
    baseMap: function () {
      return this.map && this.map()
    }
  },
  data() {
    return {
      id: getUuid(),
      eventLayer: undefined
    }
  },
  props: {
    positions: {
      type: Array,
      default: () => []
    },
    styles: {
      type: Object,
      default: () => undefined
    },
    isRender: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    isRender: {
      handler() {
        this.useRender()
      },
      deep: true
    }
  },
  mounted() {
    this.useRender()
  },
  methods: {
    useRender() {
      if (this.isRender) {
        if (!this.renderLayer) {
          this.renderLayer = createVectorLayer()
          this.renderLayer.setZIndex(99)
          this.baseMap.addLayer(this.renderLayer)
        }
        this.render()
      } else {
        if (this.renderLayer) {
          this.baseMap.removeLayer(this.renderLayer)
          this.renderLayer = undefined
        }
        this.unRender()
      }
    },
    setStyles(styles) {
      let style
      if (styles && Object.keys(styles).length > 0) {
        style = mergaPointStyleFn(styles, this.styles)
      }
      return style
    },
    render() {
      const pointLayer = layerByName(this.baseMap, `customPoints-${this.id}`)
      if (!pointLayer) return
      const poiList = pointLayer.getSource().getFeatures()
      this.renderLayer.getSource().addFeatures(poiList)
      var duration = 3000
      var n = 3
      var flashGeom = new Array(5 * n)
      if (!this.eventLayer) {
        this.eventLayer = pointLayer.on('postrender', evt => {
          var vc = getVectorContext(evt)
          var frameState = evt.frameState
          for (var i = 0, len = poiList.length; i < len; i++) {
            for (var j = 0; j < n; j++) {
              if (flashGeom[j + i * n] == undefined) flashGeom[j + i * n] = poiList[i].clone()
              if (flashGeom[j + i * n].get('start') == undefined) flashGeom[j + i * n].set('start', new Date().getTime() + (duration / 3) * j)
              var elapsed = frameState.time - flashGeom[j + i * n].get('start')
              if (elapsed >= duration) {
                flashGeom[j + i * n].set('start', flashGeom[j + i * n].get('start') + duration)
                elapsed = 0
              }
              var elapsedRatio = elapsed / duration
              elapsedRatio = elapsedRatio > 0 ? elapsedRatio : 0
              elapsedRatio = elapsedRatio > 1 ? elapsedRatio - 1 : elapsedRatio
              var radius = linear(elapsedRatio) * (this.styles.circle ? (this.styles.circle.radius || 10) * 2 : 20)
              radius = radius > 0 ? radius : 0
              var opacity = linear(1 - elapsedRatio * 0.8)
              let color = this.styles.circle ? this.styles.circle.fill : '#319FD3'
              let color2 = flashGeom[j + i * n].get('color')
              if (color2) {
                color = color2
              }
              var style = new Style({
                image: new CircleStyle({
                  radius: radius,
                  stroke: new Stroke({
                    color: hexToRgba(color, opacity),
                    width: 1 + opacity
                  })
                })
              })
              vc.drawFeature(flashGeom[j + i * n], style)
            }
          }
          this.baseMap.render()
        })
      }
      pointLayer.changed()
    },
    unRender() {
      if (this.eventLayer) {
        unByKey(this.eventLayer)
        this.eventLayer = undefined
      }
    }
  },
  beforeDestroy() {
    this.baseMap.getLayers().forEach(item => {
      if (item && item.get('name') === `customPoints-${this.id}`) {
        item.getSource().clear()
        this.baseMap.removeLayer(item)
      }
    })
    this.unRender()
  }
}
</script>
